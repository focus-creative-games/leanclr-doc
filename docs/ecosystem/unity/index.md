# LeanCLR for Unity

## 概述

**[leanclr-unity](https://github.com/focus-creative-games/leanclr-unity)** 是 LeanCLR 的 Unity 集成包（包名 `com.code-philosophy.leanclr`）。

它负责：

- Unity Editor 侧项目设置与构建 Hook
- 发布时用 LeanCLR **自动替换 IL2CPP**
- 将 LeanAOT、pgo2aot 等工具链接入 Unity 构建管线

**LeanCLR 运行时本体**在独立仓库 [leanclr](https://github.com/focus-creative-games/leanclr)；插件包内附带同步的运行时与工具二进制。

## 为什么使用 LeanCLR for Unity

Unity 发布到 **WebGL** 与**小游戏**平台时，IL2CPP 常带来 wasm 过大、虚拟机与托管内存偏高等问题。使用 LeanCLR 替换 IL2CPP backend 后，在保持与 Unity 裁剪后 BCL 高兼容的同时，典型收益如下（相对 IL2CPP 全量 AOT 方案，配合 `aot.xml` / PGO 等**选择性 AOT**策略）：

| 维度 | 相对 IL2CPP 的优势 |
|------|-------------------|
| **AOT 代码体积** | 仅对热点或必要方法生成 AOT 时，托管代码编译产生的 **AOT 原生代码可减少约 70%–90%**，包体优化极其显著；非 AOT 部分由解释器执行，整体性能影响可控 |
| **内存** | **虚拟机内存约减少 20%–35%**，托管堆占用亦有少量下降 |
| **大型项目与包体策略** | 支持 [延迟加载](./lazy-load) 与 [代码热更新](./hot-update)：在符合小游戏首包与分包要求的前提下，可承载**数十 MB 级**托管逻辑的大型项目 |
| **垃圾回收** | 采用**准确式 Mark-Sweep GC**，回收效率更高，** GC 停顿更短、更快** |

实现 selective AOT、延迟加载与热更的配置见 [概念辨析](./concepts)、[项目设置](./settings)。背景与 ECMA-335 能力见 [为什么需要 LeanCLR](../../intro/why-leanclr)。

## 相关仓库

| 仓库 | 说明 |
|------|------|
| [leanclr](https://github.com/focus-creative-games/leanclr) | 运行时与 AOT 工具链源码 |
| [leanclr-unity](https://github.com/focus-creative-games/leanclr-unity) | Unity 包（本集成） |
| [leanclr-unity-demo](https://github.com/focus-creative-games/leanclr-unity-demo) | 示例 Unity 工程 |
| [hybridclr](https://github.com/focus-creative-games/hybridclr) | Unity 全平台原生 C# 热更新（与 LeanCLR 定位互补） |

## 快速导航

| 步骤 | 文档 |
|------|------|
| 确认版本与平台 | [支持与限制](./requirements) |
| 安装包 | [安装](./install) |
| **分清 LeanAOT / AOT / PGO / 延迟加载 / 热更新** | [**概念辨析**](./concepts) |
| 配置构建与热更 | [项目设置](./settings) |
| 发布构建 | [构建](./build)（含 **CompileDllActiveTarget**） |
| 同版本按需加载 | [延迟加载](./lazy-load) |
| 逻辑热更新 | [代码热更新](./hot-update) |
| 优化 AOT 包体 | [PGO](./pgo)、[AOT 规则文件](../../aot/rule-file) |
