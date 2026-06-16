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
| 多线程 | 📋 规划中（Standard 未来版本） |

## BCL 兼容性

当前 Standard 版在 BCL 兼容性上已有大量验证：

- 与 **Unity 2019.4.x – 6000.3.x LTS IL2CPP** 所用 BCL **完全兼容**，通过全部（数千个）测试用例
- 与 **Mono 4.8** BCL **99.95% 兼容**，仅一个测试用例失败

:::note 未来方向
LeanCLR 计划逐步支持 **Mono / Unity BCL** 与 **CoreCLR .NET 8+ BCL**，届时 Standard 版将覆盖更广泛的类库生态。当前请以 Unity / .NET Framework 4.x 裁剪程序集为主要验证对象。
:::

## 验证过的 BCL 范围

已验证的类库主要为：

- **.NET Framework 4.x** 核心库（mscorlib、System、System.Core 等）
- **.NET Standard 2.x** 范围内的核心类型

使用其他版本或大量第三方 NuGet 包时，请自行验证并在发布前做充分测试。

## 已知限制

| 限制 | 说明 |
|------|------|
| **单线程** | 当前 Standard 版仅支持单线程；多线程调用可能导致未定义行为 |
| **非开发期运行时** | 不适合替代桌面 .NET 进行日常开发调试 |
| **社区版 LeanAOT** | 不支持泛型方法、含异常处理区域的方法、`extern` 方法的 AOT（见 [社区版与商业版](../aot/community-vs-commercial)） |
| **嵌入 API** | C++ 嵌入接口尚在演进，可能在未来版本中调整（见 [嵌入 LeanCLR](../integration/embed-leanclr)） |
| **跨平台 icalls** | Standard 版的部分平台相关 icall 仍在完善 |
