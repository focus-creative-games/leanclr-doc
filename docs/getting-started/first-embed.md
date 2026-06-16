# 第一个嵌入示例

本页给出**最简**嵌入路径，API 与仓库内 [`startup`](https://github.com/focus-creative-games/leanclr/tree/main/src/samples/startup) 示例一致。完整说明见 [嵌入 LeanCLR](../integration/embed-leanclr)。

## 目标

1. 用 CMake 将 `leanclr` 静态库链接到你的 C++ 工程
2. 注册程序集文件加载器并初始化运行时
3. 验证能加载 mscorlib（`get_corlib`）

最快上手方式：直接构建官方 **startup** 示例（见文末）。

## 前提

- 已按 [构建运行时](./build-runtime) 成功编译 `leanclr` 静态库
- 宿主工程使用 **C++11** 或更高标准（LeanCLR 运行时最低要求为 **C++11**）
- 运行目录下可访问 BCL，例如 `libraries/dotnetframework4.x/mscorlib.dll`（路径因部署方式而异）

## 三步集成

### 1. CMake 引入 LeanCLR

与 `src/samples/startup/CMakeLists.txt` 相同结构：

```cmake
cmake_minimum_required(VERSION 3.15)
project(my_app CXX)

add_subdirectory(path/to/leanclr/src/runtime runtime_build)

add_executable(my_app main.cpp)
target_link_libraries(my_app PRIVATE leanclr)

set_target_properties(my_app PROPERTIES
    CXX_STANDARD 11
    CXX_STANDARD_REQUIRED ON
)
```

### 2. 注册文件加载器并初始化

LeanCLR 通过 **`vm::Settings::set_file_loader`** 加载程序集（不再使用已废弃的 `set_assembly_loader`）。加载器签名为：

```cpp
bool loader(const char* assembly_name, const char* extension, vm::FileData& file_data);
```

`FileData` 字段：`data`（字节指针）、`length`、`shared`（是否由运行时释放；自行 `malloc` 时设为 `false`）。

精简示例（摘自 startup，仅搜索当前目录下的 `name.dll`）：

```cpp
#include <fstream>

#include "alloc/general_allocation.h"
#include "vm/assembly.h"
#include "vm/runtime.h"
#include "vm/settings.h"

using namespace leanclr;

static bool assembly_file_loader(const char* assembly_name, const char* extension,
                                 vm::FileData& file_data)
{
    std::string file_path = std::string(assembly_name) + "." + extension;
    std::ifstream file(file_path, std::ios::binary | std::ios::ate);
    if (!file.is_open())
    {
        return false;
    }

    std::streamsize file_size = file.tellg();
    file.seekg(0, std::ios::beg);

    auto* data = static_cast<uint8_t*>(alloc::GeneralAllocation::malloc(file_size));
    if (!data)
    {
        return false;
    }

    if (!file.read(reinterpret_cast<char*>(data), file_size))
    {
        alloc::GeneralAllocation::free(data);
        return false;
    }

    file_data.data = data;
    file_data.length = static_cast<size_t>(file_size);
    file_data.shared = false;
    return true;
}

int main()
{
    vm::Settings::set_file_loader(assembly_file_loader);

    auto result = vm::Runtime::initialize();
    if (result.is_err())
    {
        return -1;
    }

    auto* corlib = vm::Assembly::get_corlib();
    if (!corlib)
    {
        return -1;
    }

    return 0;
}
```

将 `mscorlib.dll` 放在可执行文件工作目录，或扩展加载器搜索多个目录（startup 中 `g_lib_dirs` 的做法）。

### 3. 加载业务程序集并调用

在 `initialize` 成功后，可使用 `vm::Assembly::load_by_name("YourAssembly")` 加载应用 DLL，再按元数据 API 查找类型与方法。完整调用示例见 [嵌入 LeanCLR](../integration/embed-leanclr) 与 startup 后续扩展。

:::warning API 稳定性
嵌入 API 尚在演进。请以仓库内 **`src/samples/startup`** 源码为权威参考。
:::

## 直接构建 startup 示例

```bat
cd leanclr\src\samples\startup
build.bat
```

Linux / macOS：

```bash
cd leanclr/src/samples/startup
./build.sh
```

成功后运行 `build/bin/startup`（Windows 下路径可能为 `build\Debug\startup.exe` 等，取决于生成器与配置）。

## 完整文档与示例

| 资源 | 说明 |
|------|------|
| [嵌入 LeanCLR](../integration/embed-leanclr) | 完整集成、AOT 注册、WASM |
| [startup 示例](../samples/startup) | 仓库内 Win64 最小示例 |
| [leanclr-demo](https://github.com/focus-creative-games/leanclr-demo) | 独立 Win64 / H5 体验包 |

若目标是 **Unity 发布**，请使用 [leanclr-unity](../ecosystem/unity/install)，无需手写 C++ 嵌入。
