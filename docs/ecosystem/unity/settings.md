# LeanCLR 项目设置

:::tip 配置前请先阅读
[LeanAOT 与包体优化概念](./concepts) 说明了 **LeanAOT、`aot.xml`、PGO、延迟加载** 的区别。其中 **延迟加载与 AOT 完全独立**，分别减小 `global-metadata.dat` 与 AOT 原生代码体积，请勿混为一谈。
:::

通过 **LeanCLR → Settings...** 或 **Edit → Project Settings → LeanCLR** 打开。配置保存在 `ProjectSettings/LeanCLR.asset`，离开设置页时自动保存。

## 主开关

| 选项 | 说明 |
|------|------|
| **Enable** | 是否启用 LeanCLR。关闭后，打包不会走 LeanCLR / LeanAOT 替换流程，行为与未安装插件时一致 |

## Lean AOT 设置

展开 **Lean AOT**（`leanAOTSettings`）可配置打包阶段 LeanAOT 行为。未展开时使用内置默认值：布局校验关闭，规则文件与延迟加载列表为空。

### layoutValidation

是否开启**托管类型布局校验**，便于在开发期发现与原生布局不一致的问题。

- 默认：**关闭**
- 建议：仅在排查布局问题时开启

对应 LeanAOT 开关 `--leanaot-enable-layout-validation`（亦可通过 `LEANAOT_EXTRA_ARGS` 传入，见 [CLI 参考](../../aot/cli-reference)）。

### ruleFiles

**AOT 规则文件**（`aot.xml`）路径列表，可配置多个。用于控制 **哪些托管代码被 LeanAOT 译为原生代码**（减小 AOT 体积），**不**影响 `global-metadata.dat`。概念说明见 [概念辨析 — AOT 规则文件](./concepts#aot-rule-file)。

- 路径可为相对 **Unity 工程根目录**（与 `Assets` 同级）的相对路径，或本机绝对路径
- 打包前校验文件存在，不存在则**构建失败**
- 留空表示不使用外部规则文件

规则文件语法见 [AOT 规则文件](../../aot/rule-file)。与 Unity `link.xml` **无关**。

### lazyLoadAssemblyNames

列表中的程序集在构建时**不会**写入 `global-metadata.dat`（减小**元数据**体积），运行时需自行 `Assembly.Load` 等方式加载。与 AOT 是否生成**无关**；这些程序集**仍会参与 AOT 编译**。概念说明见 [概念辨析 — 延迟加载](./concepts#lazy-load)。
- 加载时必须使用构建产物中的裁剪后 DLL，见 [延迟加载](./lazy-load)

### enablePgoProfile

启用 **PGO Profile 采集**：构建时向 LeanAOT / 运行时注入统计桩，用于采集热路径数据。

- 用于生成 `pgo-aot.xml` 的 profiling 构建应**开启**
- **正式发包构建应关闭**

详见 [Unity 中的 PGO](./pgo)。

### pgoRuleFiles

**PGO 规则文件**路径列表。输出文件名建议为 **`pgo-aot.xml`**，格式与 `aot.xml` **不同**。由 profile JSON 经 pgo2aot 生成，供 LeanAOT **追加** AOT 热点。概念说明见 [概念辨析 — PGO](./concepts#pgo)。

打包时传给 LeanAOT 的 `--leanaot-pgo-rule-file`。技术说明见 [Profile Guided AOT](../../aot/pgo)。

## 环境变量（高级）

部分 LeanAOT 专有参数可通过环境变量 **`LEANAOT_EXTRA_ARGS`** 在启动 Unity / Bee 之前注入，无需修改 Unity 命令行。完整列表见 [CLI 参考](../../aot/cli-reference)。
