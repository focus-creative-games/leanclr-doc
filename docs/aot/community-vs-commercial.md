# 社区版与商业版

LeanAOT 提供 **社区版（Community Edition）** 与 **商业版（Commercial Edition）**，面向不同生产需求。

## 功能对比

| 能力 | 社区版 | 商业版 |
|------|--------|--------|
| 普通方法 AOT | ✅ | ✅ |
| **泛型方法** AOT | ❌ | ✅ |
| **含 try/catch/finally** 的方法 AOT | ❌ | ✅ |
| **`extern` 方法** AOT | ❌ | ✅ |
| intrinsic 优化、泛型共享等深度优化 | 基础 | ✅ 更激进 |
| **DHE**（Differential Hybrid Execution） | ❌ | ✅ |

社区版中不支持 AOT 的语言结构仍可由 **解释器** 执行，功能不受影响，但热点路径可能较慢、生成代码体积策略不同。

## 商业版额外能力

### 代码生成优化

商业版包含更多优化 pass，例如：

- intrinsic 函数优化
- 泛型共享（generic sharing）优化

在中大型项目中通常可改善运行时性能并减小生成代码体积。

### DHE（差分混合执行）

商业版支持 HybridCLR 生态中的 **DHE（Differential Hybrid Execution）** 模型，适用于依赖差分混合执行 / 热更新管线的项目。

DHE 的详细用法与授权属于商业支持范围，公开文档仅作能力说明。

## 如何获取商业版

商业版**无公开价格**，请邮件联系：

**leanclr@code-philosophy.com**

说明项目平台、预估包体规模与所需特性（如泛型 AOT、DHE 等），以便评估授权方案。

## 社区版是否够用

对多数 **Unity WebGL / 小游戏** 发布场景：

- 若热点代码以非泛型、少异常的方法为主，社区版 + [`aot.xml`](./rule-file) + [`pgo-aot.xml`](./pgo) 往往已足够
- 若大量依赖泛型热点、复杂异常路径或 DHE 管线，需评估商业版

不确定时可通过 PGO 与 profiling 先量化「无法 AOT 的热点占比」，再决定是否升级。

## 相关链接

- [LeanAOT 工具](./leanaot-tool)
- [社区与支持](../reference/community)
- [HybridCLR](https://github.com/focus-creative-games/hybridclr) — 全平台热更新方案（与 LeanCLR 定位互补）
