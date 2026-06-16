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
| 垃圾回收 | 准确式 mark-sweep 全量 GC |
| AOT 编译器 | IL → C++（LeanAOT） |

## 开发中

### 引擎集成

| 引擎 | 状态 | 仓库 |
|------|------|------|
| **Unity / 团结引擎** | ✅ 已完成 | [leanclr-unity](https://github.com/focus-creative-games/leanclr-unity) |
| **Godot** | 🚧 开发中，预计 2026-10 预览 | [leanclr-godot](https://github.com/focus-creative-games/leanclr-godot) |
| **Unreal Engine** | 🚧 开发中 | [leanclr-unreal](https://github.com/focus-creative-games/leanclr-unreal) |
| **Cocos Engine** | 🚧 开发中 | [leanclr-cocos](https://github.com/focus-creative-games/leanclr-cocos) |

### Standard 版演进

- **完整多线程**支持（同步原语、线程 API 等）
- **全平台** icall 与 OS 抽象完善
- **BCL 扩展**：Mono / Unity 与 CoreCLR .NET 8+ 类库兼容

## 规划中

| 项目 | 说明 |
|------|------|
| **Core 版** | 从 Standard 裁剪，纯 C++11、无平台依赖、极致体积 |
| **文档版本化** | 首个稳定 release 后，文档站将支持多版本切换 |
| **英文文档** | 中文文档稳定后补充 `en` 语言 |

## 文档与版本

当前 LeanCLR 处于高速迭代期，文档站**暂不区分版本**，始终反映 `main` 分支最新状态。首个正式发布版本（tag）出现后，将启用 Docusaurus 多版本文档。
