# 嵌入 LeanCLR

:::warning API 稳定性
LeanCLR **尚未提供稳定的公开嵌入 SDK**。本文描述的 C++ API 可能在小版本中调整。请以仓库内 **`src/samples/startup`** 源码为权威参考。
:::

## 集成方式概览

| 方式 | 适用场景 |
|------|----------|
| **CMake add_subdirectory**（推荐） | 与 LeanCLR 同仓库或 submodule，自动处理依赖 |
| **链接预编译静态库** | 已单独构建好 `leanclr.lib` / `libleanclr.a` |

前提：

- 已成功 [构建运行时](../getting-started/build-runtime)
- C++ **11** 或更高
- CMake 3.15+（推荐）

## CMake add_subdirectory

### 工程布局

```text
your_project/
├── CMakeLists.txt
├── main.cpp
└── leanclr/              # clone 或 submodule
    └── src/runtime/
```

### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.15)
project(your_app CXX)

add_subdirectory(leanclr/src/runtime runtime_build)

add_executable(your_app main.cpp)
target_link_libraries(your_app PRIVATE leanclr)

set_target_properties(your_app PROPERTIES
    CXX_STANDARD 11
    CXX_STANDARD_REQUIRED ON
)
```

## 预编译库集成

```cmake
set(LEANCLR_ROOT "/path/to/leanclr")
set(LEANCLR_INCLUDE_DIR "${LEANCLR_ROOT}/src/runtime")
set(LEANCLR_LIBRARY "${LEANCLR_ROOT}/out/cmake/runtime/Release-x64/runtime_build/Release/leanclr.lib")

add_executable(your_app main.cpp)
target_include_directories(your_app PRIVATE ${LEANCLR_INCLUDE_DIR})
target_link_libraries(your_app PRIVATE ${LEANCLR_LIBRARY})
```

Linux / macOS 将 `.lib` 换为 `libleanclr.a`，路径见 [输出目录结构](./output-layout)。

## 初始化与生命周期

### 1. 注册文件加载器

LeanCLR 通过 **`vm::Settings::set_file_loader`** 加载程序集。加载器类型：

```cpp
typedef bool (*FileLoader)(const char* assembly_name, const char* extension, FileData& file_data);
```

`FileData` 字段：

| 字段 | 说明 |
|------|------|
| `data` | 程序集字节指针 |
| `length` | 字节长度 |
| `shared` | 是否由运行时负责释放；自行 `malloc` 时设为 `false` |

完整实现见 [第一个嵌入示例](../getting-started/first-embed) 与 `src/samples/startup/main.cpp`。

### 2. 初始化运行时

```cpp
vm::Settings::set_file_loader(assembly_file_loader);
auto result = vm::Runtime::initialize();
if (result.is_err()) {
    // 处理错误
}
```

初始化前必须设置 `file_loader`，且需能加载 **mscorlib**（通过 `get_corlib()` 验证）。

### 3. 加载程序集

```cpp
auto* corlib = vm::Assembly::get_corlib();
auto ass_result = vm::Assembly::load_by_name("MyAssembly");
```

`load_by_name` 使用短名（无 `.dll`），内部通过 `file_loader` 尝试 `name.dll`、`name.pdb` 等。

## 调用托管方法

```cpp
#include "vm/method.h"
#include "vm/class.h"

void invoke_static(metadata::RtModuleDef* mod,
                   const char* class_name,
                   const char* method_name)
{
    auto class_result = mod->get_class_by_nested_full_name(class_name, false, true);
    if (class_result.is_err()) return;

    auto* klass = class_result.unwrap();
    vm::Class::initialize_all(klass);

    auto* method = vm::Method::find_matched_method_in_class_by_name(klass, method_name);
    if (!method) return;

    auto result = vm::Runtime::invoke_array_arguments_with_run_cctor(method, nullptr, nullptr);
    if (result.is_err()) {
        // 处理调用错误
    }
}
```

注意：调用前需 `Class::initialize_all`；参数与重载匹配需与元数据一致。

## AOT 模块注册

若使用 LeanAOT 预生成 C++，在 `initialize` **之前**注册 AOT 模块：

```cpp
extern leanclr::metadata::RtAotModulesData g_aot_modules_data;

vm::Settings::set_file_loader(assembly_file_loader);
vm::Settings::set_aot_modules_data(&g_aot_modules_data);
vm::Runtime::initialize();
```

详见 [AOT 工作流](../aot/workflow)。

## WebAssembly 要点

WASM 宿主需额外导出 C 函数供 JavaScript 调用，并配置 Emscripten 链接选项。完整说明见 [WebAssembly 构建](./wasm)，不要在本页重复。

## 最佳实践

### 内存

- 托管对象与元数据由 LeanCLR GC / 分配器管理
- `file_loader` 返回的非 `shared` 缓冲区由运行时读取后按约定释放
- 使用 `alloc::GeneralAllocation` 分配加载器缓冲区

### 错误处理

多数 API 返回 `RtResult<T>`，调用 `is_err()` 后再 `unwrap()`。

### 线程（Standard / Core 当前版本）

Standard 三 BCL 分支与 Core 版**当前均仅支持单线程**。不要在多线程中并发调用 LeanCLR API。

### Core 版 GC 手动管理 {#core-版-gc-手动管理}

使用 **Core 版**嵌入时，GC 为准确式 Mark-Sweep，但**不由运行时自动触发**：

1. **进入托管代码前**：禁用 GC（例如 `vm::GC::disable()`，或 il2cpp 兼容层 `il2cpp_gc_disable()`）
2. **执行**托管方法 / 解释器 / AOT 代码
3. **返回原生代码后**：恢复 GC 并按策略**主动**调用全量回收（例如 `vm::GC::collect()`）

在 GC 禁用期间分配的托管对象会累积，须在合适边界（帧末、关卡切换、原生主循环迭代等）主动 `collect`，否则堆会持续增长。Standard 版由运行时自动管理 GC，**无需**上述手动流程。

详见 [Core 与 Standard](../intro/editions#core-版本)。

## 故障排除

| 问题 | 排查 |
|------|------|
| 链接 undefined symbol | 确认链接 `leanclr` 且 include 根为 `src/runtime` |
| `initialize` 失败 | `file_loader` 能否找到 `mscorlib.dll` |
| `load_by_name` 失败 | 搜索路径、程序集短名、DLL 字节是否完整 |
| 方法调用失败 | 类是否已 `initialize_all`、方法是否为 static、签名是否匹配 |

## 示例项目

| 示例 | 说明 |
|------|------|
| [startup](../samples/startup) | Win64 最小嵌入 |
| [lean-wasm](./wasm) | 浏览器 WASM |
| [lean](../getting-started/lean-cli) | 命令行工具 |
| [first-embed](../getting-started/first-embed) | 快速上手 |
