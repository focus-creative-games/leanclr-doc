# 路线图与模块进度

## 已完成模块

| 模块 | 说明 |
|------|------|
| 元数据解析 | PE/COFF、CLI 元数据表 |
| 类型系统 | 类、接口、泛型、数组、值类型 |
| IR 解释器 | 热点路径优化执行 |
| 异常处理 | try / catch / finally、嵌套异常 |
| 反射 | Type、MethodInfo、FieldInfo 等 |
| 委托 | 单播 / 多播、泛型委托 |
| 内部调用 | icall 实现 |
| P/Invoke | 手动注册 + LeanAOT 自动生成 |
| 垃圾回收 | 准确式 Mark-Sweep（Standard 自动 / Core 手动） |
| AOT 编译器 | IL → C++（LeanAOT） |
| **Core 版** | 纯 C++11、全平台、手动 GC |

## 引擎与平台集成

| 引擎 / 平台 | 状态 | 说明 |
|-------------|------|------|
| **Unity / 团结 WebGL、小游戏** | ✅ 已完成 | [leanclr-unity](https://github.com/focus-creative-games/leanclr-unity)，Standard **unity** 分支 |
| **鸿蒙（HarmonyOS）** | ✅ Standard 已支持 | 与所选 BCL 分支一并验证 |
| **Godot** | 🚧 开发中 | [leanclr-godot](https://github.com/focus-creative-games/leanclr-godot) |
| **Unreal Engine** | 🚧 开发中 | [leanclr-unreal](https://github.com/focus-creative-games/leanclr-unreal) |
| **Cocos Engine** | 🚧 开发中 | [leanclr-cocos](https://github.com/focus-creative-games/leanclr-cocos) |

## Standard 版演进

### BCL 分支

| 分支 | 状态 |
|------|------|
| **mono** | WASM / 小游戏较稳定；单线程 |
| **unity** | WASM / 小游戏较稳定（Unity 集成默认）；单线程 |
| **coreclr** | 🚧 开发中 |

### 进行中

- **完整多线程**（同步原语、线程 API 等）
- **平台相关 icall** 补全（当前大量未实现）
- **coreclr 分支** 生产可用度提升

## 规划中

| 项目 | 说明 |
|------|------|
| **文档版本化** | 首个稳定 release 后，文档站将支持多版本切换 |
| **英文文档** | 中文文档稳定后补充 `en` 语言 |

## 文档与版本

当前 LeanCLR 处于高速迭代期，文档站**暂不区分版本**，始终反映 `main` 分支最新状态。首个正式发布版本（tag）出现后，将启用 Docusaurus 多版本文档。
