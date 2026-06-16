# 前置要求

## 通用工具

| 工具 | 最低版本 | 用途 |
|------|----------|------|
| **Git** | — | 获取源码 |
| **CMake** | 3.15+ | 构建系统 |
| **C++ 编译器** | 支持 C++11 | 编译 LeanCLR 运行时 |
| **.NET SDK** | 8.0+ | 构建 LeanAOT、pgo2aot、托管测试 |

验证安装：

```bash
cmake --version
dotnet --version
```

## Windows 环境

推荐使用 **Visual Studio 2022**（v17），并安装工作负载：

- **使用 C++ 的桌面开发**

LeanCLR 仓库内提供了 `scripts\build.bat` 等脚本，可在「x64 Native Tools Command Prompt」或普通 PowerShell 中调用（需已将 CMake 加入 PATH）。

## Linux / macOS 环境

- 编译器：**GCC** 或 **Clang**，支持 C++11
- 构建入口：`./scripts/build.sh`、`./scripts/ci.sh`

```bash
./scripts/build.sh runtime Release
```

## WebAssembly 环境

构建浏览器端示例或 WASM 版运行时时需要：

| 工具 | 说明 |
|------|------|
| **Emscripten SDK** | 将 C++ 编译为 WASM |
| **Ninja** | 推荐，加快 Emscripten 构建 |

详细步骤见 [WebAssembly 构建](../integration/wasm)。

## .NET 工具链说明

以下组件依赖 .NET 8（或更高，带 `RollForward`）：

- **LeanAOT** — AOT 编译器
- **pgo2aot** — Profile 规则生成
- **托管测试程序集** — `src/tests/managed/`

Unity 集成用户若仅使用 [leanclr-unity](../ecosystem/unity/install) 插件，**无需**自行安装上述工具——插件包内已附带构建所需工具链。
