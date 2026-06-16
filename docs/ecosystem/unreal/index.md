# Unreal Engine 集成

## 当前状态

LeanCLR 的 Unreal Engine 插件**正在开发中**，发布时间待定。

官方仓库：[focus-creative-games/leanclr-unreal](https://github.com/focus-creative-games/leanclr-unreal)

:::note
该仓库目前已创建，插件代码尚未公开。
:::

## 规划方向

在 UE 项目的打包管线中嵌入 LeanCLR，使 C# / 托管游戏逻辑能以 LeanCLR 作为发布期运行时，目标包括：

- 减小特定平台（含 WASM / 移动端）包体
- 与现有 C++ 游戏引擎模块共存
- 复用 LeanAOT、`aot.xml` 与 `pgo-aot.xml` 工具链

## 关注进展

- [leanclr-unreal](https://github.com/focus-creative-games/leanclr-unreal)
- [路线图](../../intro/roadmap)
- [Discord](https://discord.gg/esAYcM6RDQ) / QQ 群 1047250380
