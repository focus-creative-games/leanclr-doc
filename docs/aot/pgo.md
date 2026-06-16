# Profile Guided AOT

**Profile Guided AOT（PGO）** 根据运行时采集的调用统计，将热点方法写入 **`pgo-aot.xml`**，在后续 LeanAOT 构建中**追加** AOT 编译。

与手工编写的 [`aot.xml`](./rule-file) 配合：常用策略是对大程序集默认 `aot="0"`，再由 PGO 精确打开热点方法。

Unity 侧操作见 [Unity 中的 PGO](../ecosystem/unity/pgo)。

## 端到端工作流

```text
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────┐
│ LeanAOT 构建时开启   │     │ 运行应用 / 游戏   │     │ pgo2aot         │     │ LeanAOT  │
│ pgo-profile 桩      │ ──► │ 导出 Profile JSON │ ──► │ → pgo-aot.xml   │ ──► │ 带 PGO   │
│                     │     │                  │     │                 │     │ 重新构建 │
└─────────────────────┘     └──────────────────┘     └─────────────────┘     └──────────┘
```

1. **插桩构建** — `--leanaot-enable-pgo-profile` 生成带统计桩的代码
2. **采集** — 在代表性负载下运行，导出 JSON
3. **生成规则** — `pgo2aot` 选出热点，输出 **`pgo-aot.xml`**
4. **正式构建** — `--leanaot-pgo-rule-file`，**关闭** profile 桩

## Profile JSON 格式

`pgo2aot` 读取一个或多个 JSON 文件，每个文件为**对象数组**：

```json
[
  {
    "assembly": "mscorlib",
    "signature": "System.Boolean System.Char::IsWhiteSpace(System.Char)",
    "calls": 12034,
    "cost": 482910
  }
]
```

| 字段 | 说明 |
|------|------|
| `assembly` | 程序集短名（无 `.dll`） |
| `signature` | 完整托管方法签名（与 LeanAOT / dnlib `MethodDef.FullName` 一致） |
| `calls` | 调用次数 |
| `cost` | 加权开销（越高越热） |

### 从运行时导出

托管 API（`LeanCLR.Profile`）：

| API | 说明 |
|-----|------|
| `GetGlobalStatsJson()` / `ExportGlobalStatsJson(path)` | 启动以来累计统计 |
| `GetPeriodStatsJson()` / `ExportPeriodStatsJson(path)` | 当前周期统计 |
| `ResetGlobalStats()` / `ResetPeriodStats()` / `EndPeriodStats()` | 重置 |

须先使用带 `--leanaot-enable-pgo-profile` 的构建。

### 合并多个 JSON

多次 `--input` 时，按 `(assembly, signature)` 合并，取 `calls` 与 `cost` 的**最大值**。

:::caution global.json 命名
勿将 profile 文件命名为 `global.json` 并放在 `pgo2aot` 的 `.csproj` 同级——.NET SDK 会将其当作 SDK 版本 pin 文件。示例数据放在 `src/tools/pgo2aot/samples/global.json`。
:::

## 构建 pgo2aot

```bat
scripts\build.bat leanaot Release
dotnet build src\tools\pgo2aot\Pgo2Aot.csproj -c Release
```

产物：`out/dotnet/Pgo2Aot/Release/net8.0/pgo2aot.dll`（需 .NET 8+）

## pgo2aot 命令行

```text
pgo2aot --input <profile.json> [--input <more.json> ...]
        --output <pgo-aot.xml>
        --strategy threshold | top | pareto
        [策略相关选项]
        [--sort-by cost | calls]
```

| 选项 | 默认 | 说明 |
|------|------|------|
| `-i` / `--input` | — | Profile JSON，可重复 |
| `-o` / `--output` | — | 输出 **`pgo-aot.xml`** |
| `--strategy` | — | `threshold` / `top` / `pareto` |
| `--min-calls` | `1` | threshold：最小调用次数 |
| `--min-cost` | `0` | threshold：最小 cost |
| `--top-n` | — | top：保留前 N 个 |
| `--top-percent` | — | top：保留前 N% |
| `--pareto-ratio` | `0.8` | pareto：累计指标比例 |
| `--sort-by` | `cost` | top / pareto 的排序依据 |

成功时输出类似：

```text
Selected 90 method(s) from 1580 profile record(s) -> path\to\pgo-aot.xml
```

## 选择策略

### threshold

保留同时满足 `calls >= --min-calls` 且 `cost >= --min-cost` 的记录。适合「足够热」的过滤。

```bat
dotnet pgo2aot.dll --input profile.json --output pgo-aot.xml ^
  --strategy threshold --min-calls 100 --min-cost 10000
```

### top

排序后取前 N 个或前 N%。适合固定 AOT 代码量预算。

```bat
dotnet pgo2aot.dll --input profile.json --output pgo-aot.xml ^
  --strategy top --top-n 50 --sort-by cost
```

### pareto

按 `--sort-by` 排序后累加指标，直到达到总量 × `--pareto-ratio`（默认 80%）。适合 80/20 式热点覆盖。

```bat
dotnet pgo2aot.dll --input profile.json --output pgo-aot.xml ^
  --strategy pareto --pareto-ratio 0.8 --sort-by cost
```

## pgo-aot.xml 与 aot.xml

PGO 输出使用**机器向** schema，与 `aot.xml` **不同**：

```xml
<?xml version="1.0" encoding="utf-8"?>
<aot>
  <assembly name="mscorlib">
    <method signature="System.Boolean System.Char::IsWhiteSpace(System.Char)" />
  </assembly>
</aot>
```

| | `aot.xml` | `pgo-aot.xml` |
|--|-----------|---------------|
| 程序集属性 | `fullname`，可选 `aot` 默认 | `name`（短名） |
| 方法 | `name`、可选 `signature`、`aot="0\|1"` | 仅 `signature`（隐含 include） |
| 通配符 | 支持 | **不支持**，仅精确签名 |
| 语义 | 包含 / 排除策略 | **仅追加 include** |

**追加语义：** PGO 可将某方法从「规则层排除」改为 AOT；**不能**取消 `aot.xml` 已强制包含的方法，也不能覆盖 `[AotMethod]`、P/Invoke、icall 等硬性规则。

:::important 不能只用 pgo-aot.xml
PGO 文件只**添加** AOT 候选，不提供程序集级默认排除。典型组合：`aot.xml` 大范围 `aot="0"` + `pgo-aot.xml` 热点列表。
:::

## 在 LeanAOT 中使用

```text
LeanAOT ... --leanaot-pgo-rule-file path\to\pgo-aot.xml
```

可重复指定，多文件取方法并集。

Unity：在 **Lean AOT → pgoRuleFiles** 配置，或通过 `LEANAOT_EXTRA_ARGS` 传入（见 [CLI 参考](./cli-reference)）。

插桩开关（profiling 构建）：

```text
--leanaot-enable-pgo-profile
```

## 推荐生产循环

1. 编写 `aot.xml`，对大程序集设 `aot="0"`
2. 开启 profile 桩，发布 profiling 包
3. 跑代表性会话，导出 JSON（可合并多会话）
4. `pgo2aot` 生成 `pgo-aot.xml`，检查方法数量与签名
5. 关闭 profile 桩，附加 `--leanaot-pgo-rule-file` 发正式包
6. 重大玩法 / 代码变更后重复 2–5

## 常见问题

**`signature` 必须与 C# 源码一致吗？**

必须与 LeanAOT 内部签名串一致（dnlib 风格），含嵌套类型、泛型 arity 等。匹配失败时查看构建产物的 `MethodMap.tsv` 或开启详细日志。

**签名里的 `*` 是什么？**

指针类型如 `System.UInt32*` 中的 `*` 是类型名一部分，**不是**通配符。

**不传 PGO 文件会怎样？**

仅按 `aot.xml` 与默认策略行为，PGO 无影响。

## 示例数据

`src/tools/pgo2aot/samples/` 含 `global.json` 及多种策略输出样例。
