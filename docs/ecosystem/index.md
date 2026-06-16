# 引擎生态

## 支持状态总览

| 引擎 | 状态 | 插件仓库 | 文档 |
|------|------|----------|------|
| **Unity / 团结引擎** | ✅ 已完成 | [leanclr-unity](https://github.com/focus-creative-games/leanclr-unity) | [Unity 集成](./unity/) |
| **Godot** | 🚧 开发中（预计 2026-10 预览） | [leanclr-godot](https://github.com/focus-creative-games/leanclr-godot) | [Godot](./godot/) |
| **Unreal Engine** | 🚧 开发中 | [leanclr-unreal](https://github.com/focus-creative-games/leanclr-unreal) | [Unreal](./unreal/) |
| **Cocos Engine** | 🚧 开发中 | [leanclr-cocos](https://github.com/focus-creative-games/leanclr-cocos) | [Cocos](./cocos/) |

## 分工说明

```text
leanclr          → 运行时核心 + LeanAOT + pgo2aot（C++ / .NET 工具链）
leanclr-unity    → Unity Editor 集成、构建管线 Hook、项目设置
leanclr-godot    → Godot 扩展（开发中，仓库占位）
leanclr-unreal   → Unreal 插件（开发中，仓库占位）
leanclr-cocos    → Cocos 插件（开发中，仓库占位）
```

引擎插件负责在**各引擎的发布管线**中替换或对接原生后端；底层 CLR 行为、AOT 规则、PGO 等概念在各引擎间共用，详见 [AOT 概述](../aot/overview)。

## Unity

当前最成熟的集成路径。发布 WebGL / 小游戏时自动用 LeanCLR 替换 IL2CPP，显著减小 wasm 体积并降低元数据与托管内存占用。

→ [开始使用 LeanCLR for Unity](./unity/)

## Godot

官方仓库 [leanclr-godot](https://github.com/focus-creative-games/leanclr-godot) 已创建，插件实现进行中。

→ [Godot 集成状态](./godot/)

## Unreal Engine

官方仓库 [leanclr-unreal](https://github.com/focus-creative-games/leanclr-unreal) 已创建，实现进行中。

→ [Unreal 集成状态](./unreal/)

## Cocos Engine

官方仓库 [leanclr-cocos](https://github.com/focus-creative-games/leanclr-cocos) 已创建，实现进行中。

→ [Cocos 集成状态](./cocos/)
