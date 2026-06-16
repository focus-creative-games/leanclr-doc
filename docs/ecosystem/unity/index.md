# LeanCLR for Unity

## 概述

**[leanclr-unity](https://github.com/focus-creative-games/leanclr-unity)** 是 LeanCLR 的 Unity 集成包（包名 `com.code-philosophy.leanclr`）。

它负责：

- Unity Editor 侧项目设置与构建 Hook
- 发布时用 LeanCLR **自动替换 IL2CPP**
- 将 LeanAOT、pgo2aot 等工具链接入 Unity 构建管线

**LeanCLR 运行时本体**在独立仓库 [leanclr](https://github.com/focus-creative-games/leanclr)；插件包内附带同步的运行时与工具二进制。

## 为什么使用 LeanCLR for Unity

Unity 发布到 **WebGL** 与**小游戏**平台时，常见痛点包括：

- **wasm 文件过大**，首包与下载成本高
- **元数据与托管内存占用高**，在内存受限设备上压力大

使用 LeanCLR 替换 IL2CPP  backend 后，可显著减小构建产物体积，并降低运行时内存开销，同时保持与 Unity 裁剪后 BCL 的高兼容性。

背景对比与 ECMA-335 能力见 [为什么需要 LeanCLR](../../intro/why-leanclr)。

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
| 配置 AOT / PGO | [项目设置](./settings) |
| 发布构建 | [构建](./build) |
| 优化包体 | [PGO](./pgo)、[AOT 规则文件](../../aot/rule-file) |
