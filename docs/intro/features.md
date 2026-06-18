# 核心特性

## 跨平台能力

LeanCLR 使用 **AOT + 解释器** 混合架构，不支持 JIT。运行时以 C++ 实现。

- **Standard 版**：含 **mono / unity / coreclr** 三个 BCL 分支；**mono、unity** 在 WebGL、小游戏上较稳定；**鸿蒙**已支持；当前均单线程。
- **Core 版**：**已实现**，纯 C++11、全平台、准确式 Mark-Sweep **手动 GC**，适合极致裁剪嵌入。

未来将完善 Standard 多线程与 **coreclr** 分支、补全平台 icall。

## 易于集成

- 构建产物为**静态库**，通过 CMake `add_subdirectory` 或链接预编译库即可集成
- 集成步骤与嵌入 Lua 等脚本引擎类似，无需拉起完整 .NET 运行时
- 提供 Unity 插件 [leanclr-unity](https://github.com/focus-creative-games/leanclr-unity)，发布时自动替换 IL2CPP，无需改游戏业务代码

## ECMA-335 兼容性

LeanCLR 几乎完整支持 ECMA-335 及 CoreCLR 主要扩展，包括但不限于：

- 泛型、继承、接口与虚派发
- 异常（try / catch / finally）
- 反射（Type、MethodInfo、FieldInfo 等）
- 单播 / 多播委托与泛型委托
- 值类型、引用类型、数组与多维数组

## 体积与性能

- 单线程版本在 **x64 / WebAssembly** 上运行时体积可至 **600 KB** 以内，裁剪后约 **300 KB**
- AOT 将热点方法编译为原生代码，其余路径由 IR 解释器执行
- 配合 **Profile Guided AOT（PGO）** 可在包体与性能之间做精细权衡

详见 [架构概览](./architecture) 与 [AOT 概述](../aot/overview)。
