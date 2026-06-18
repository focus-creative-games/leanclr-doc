# 兼容性说明

## ECMA-335 支持范围

LeanCLR 在设计上以 ECMA-335 为主要兼容基准。当前已完成的核心模块包括：

| 模块 | 状态 |
|------|------|
| 元数据解析（PE/COFF、CLI 表） | ✅ |
| 类型系统（类、接口、泛型、数组、值类型） | ✅ |
| IR 解释器 | ✅ |
| 异常处理 | ✅ |
| 反射 | ✅ |
| 委托 | ✅ |
| 内部调用（icall） | ✅ |
| P/Invoke | ✅ |
| 垃圾回收 | ✅ |
| AOT 编译器（LeanAOT） | ✅ |
| 多线程 | 📋 规划中 |

## Standard 版与 BCL 分支

Standard 版按 BCL 基线分为 **mono**、**unity**、**coreclr** 三个分支（见 [Core 与 Standard](./editions)）。**当前三个分支均仅支持单线程**，且**许多平台相关 icall 尚未实现**。

| 分支 | 验证与生产状态（摘要） |
|------|------------------------|
| **unity** | 与 Unity 2019.4.x – 6000.3.x LTS IL2CPP BCL **高度兼容**，数千测试用例；WebGL / 小游戏**较稳定** |
| **mono** | 与 Mono 4.8 BCL **99.95% 兼容**（历史数据）；WebGL / 小游戏**较稳定** |
| **coreclr** | 🚧 **开发中**，勿按生产就绪假设 |

### 平台

Standard 版支持 **Windows、Linux、macOS、Android、iOS、鸿蒙（HarmonyOS / OpenHarmony）、WebAssembly** 等主流目标（依 BCL 分支与集成方式验证）。

- **WebAssembly / 小游戏**：mono、unity 分支较稳定
- **原生桌面与移动**：可构建运行；大量平台相关 icall 仍在完善，发布前请充分测试

## 验证过的 BCL 范围（unity / mono 分支为主）

已验证的类库主要为：

- **.NET Framework 4.x** 核心库（mscorlib、System、System.Core 等）
- **Unity IL2CPP 裁剪 BCL**（unity 分支）
- **.NET Standard 2.x** 范围内的核心类型

使用 **coreclr** 分支、其他版本 BCL 或大量第三方 NuGet 包时，请自行验证。

## 已知限制

| 限制 | 说明 |
|------|------|
| **单线程** | Standard 三分支与 Core 版当前均仅单线程 |
| **平台 icall** | Standard 版大量平台相关 icall 未实现或仍在完善 |
| **coreclr 分支** | 仍在开发，不适合作为默认生产选型 |
| **非开发期运行时** | 不适合替代桌面 .NET 进行日常开发调试 |
| **社区版 LeanAOT** | 不支持泛型方法、含异常处理区域的方法、`extern` 方法的 AOT（见 [社区版与商业版](../aot/community-vs-commercial)） |
| **嵌入 API** | C++ 嵌入接口尚在演进（见 [嵌入 LeanCLR](../integration/embed-leanclr)） |
| **Core 版 GC** | 须手动禁用 / 触发 GC，见 [Core 与 Standard](./editions) |
