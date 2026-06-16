# AOT 规则文件（aot.xml）

**AOT 规则文件**（常命名为 `aot.xml`，文件名可任意）用于控制 LeanAOT **哪些托管方法**生成 AOT 原生代码。仅由 LeanAOT 消费，与 Unity **`link.xml`** 无关。

端到端流程见 [AOT 工作流](./workflow)。PGO 追加规则见 [Profile Guided AOT](./pgo)（输出 **`pgo-aot.xml`**，格式不同）。

## 规则文件是什么

- 一个或多个 XML，根元素为 **`<aot>`**
- 层次：**assembly → type → method**，用 `aot="1"`（包含）或 `aot="0"`（排除）
- 可在程序集 / 类型级设**默认**，再用方法级规则做例外

**当前限制：** 仅普通 **`MethodDef`**；泛型实例化等不在规则层配置。勿使用元数据 **token**（重建 DLL 后会变）。

## 命令行指定

```text
LeanAOT ... --leanaot-aot-rule-file path\to\base.xml --leanaot-aot-rule-file path\to\game.xml
```

- 路径可为绝对路径或相对当前工作目录
- **可重复**指定多个文件

Unity 可通过项目设置 `ruleFiles` 或环境变量 `LEANAOT_EXTRA_ARGS` 传入（见 [CLI 参考](./cli-reference)）。

## 根结构与编码

- 推荐 **UTF-8**
- 根元素必须为 **`<aot>`**

```xml
<?xml version="1.0" encoding="utf-8"?>
<aot>
  <!-- 一个或多个 <assembly> -->
</aot>
```

## aot 属性：仅 0 和 1

在 **`<assembly>`**、**`<type>`**、**`<method>`** 上，`aot` 只能是字面量 **`1`** 或 **`0`**：

| 值 | 含义 |
|----|------|
| `1` | 纳入 AOT；作为默认时，表示该范围内未更具体匹配的方法默认 AOT |
| `0` | 排除 AOT；作为默认时，表示该范围内未更具体匹配的方法默认不 AOT |

非法值导致 LeanAOT **失败**，不会静默忽略。

## 三层结构

### assembly

```xml
<assembly fullname="MyGame" aot="0">
```

- **`fullname`**（必填）：程序集标识，与 `-a` / `--assembly` 传参一致
- **`aot`**（可选）：程序集级默认

### type

```xml
<type fullname="MyGame.Core.*" aot="1">
```

- **`fullname`**（必填）：类型全名，支持通配符
- **`aot`**（可选）：类型级默认；省略则继承 assembly 的 `aot`

### method

```xml
<method name="Tick" signature="System.Void MyGame.Loop::Tick()" aot="0" />
```

- **`name`**（必填）：短方法名，支持通配符
- **`signature`**（可选）：区分重载；省略则匹配该短名下所有重载
- **`aot`**（必填）：`1` 或 `0`

## 通配符

在 `type/@fullname`、`method/@name`、`method/@signature` 中：

| 符号 | 含义 |
|------|------|
| `*` | 任意长度子串（含空） |
| `?` | 恰好一个字符 |

## 默认如何继承

1. 若 **assembly** 有 `aot`：未单独设 `aot` 的 **type** 继承程序集默认
2. 若 **type** 有 `aot`：未匹配到 **method** 规则的方法继承类型默认
3. 仅 **assembly** 无子 **type** 时：未匹配 **method** 的方法使用程序集默认

**关键默认（规则层）：** 若某方法在规则层**没有任何** `1`/`0` 裁决（含继承），则**默认纳入 AOT**。

因此要「只 AOT 少数方法」，须先对程序集 / 类型设 **`aot="0"`**，再对少数方法设 `aot="1"`。

## 规则无法覆盖的情况

以下情况**不读 XML** 或 **XML 无法关闭**：

| 条件 | 行为 |
|------|------|
| **`[AotMethod]` 特性** | 特性优先，规则文件不能覆盖 |
| **P/Invoke、`extern`、internal call 等强制 AOT 类** | 必须 AOT；规则 `aot="0"` 无效（可能警告） |

仅普通方法走规则文件评估。

### 规则层结果速查

| 情况 | 是否 AOT（在上述强制规则不适用时） |
|------|-------------------------------------|
| 规则得出 `1` | 是 |
| 规则得出 `0` | 否 |
| **无任何规则匹配** | **是（默认 AOT）** |

## 单文件内多规则：后者覆盖前者

同一 XML 内，若多条规则作用于同一方法，按**文档顺序**，**后面的覆盖前面的**。

可先写宽规则，再在下方写窄例外。

## 多文件合并与冲突

- 按命令行顺序加载
- 若**同一方法**在不同文件中最终裁决分别为 `1` 和 `0` → LeanAOT **报错退出**
- 所有给出裁决的文件一致则通过

「基础 + 补丁」工作流中，补丁文件只写增量，避免对同一方法赋相反值。

## 完整示例

```xml
<?xml version="1.0" encoding="utf-8"?>
<aot>
  <assembly fullname="Game" aot="0">
    <type fullname="Game.Core.*" aot="1">
      <method name="Tick" aot="0" />
      <method name="Init*" signature="void Init*(System.Int32)" aot="1" />
    </type>
  </assembly>
</aot>
```

- 程序集 `Game` 默认**不** AOT
- `Game.Core.*` 类型默认 **AOT**
- `Tick` 强制关闭
- 匹配 `Init*` 签名的方法强制开启

## 常见问题

**能用 metadata token 吗？**  
不能。用程序集 + 类型全名 + 方法名，必要时加 `signature`。

**`signature` 格式？**  
须与 LeanAOT 内部 `MethodDef` 显示签名一致；不匹配时查 `MethodMap.tsv` 或开 debug 日志。

**与 link.xml 一起维护吗？**  
无关。link.xml 管 Unity 裁剪；`aot.xml` 管 LeanAOT。

**不传任何规则文件？**  
无规则层裁决的方法 → **默认 AOT**（仍受 `[AotMethod]` / icall 等约束）。

---

## 实现参考（进阶）

以下为 LeanAOT 实现语义摘要，供贡献者与深度用户查阅。

### 目标与范围

- 仅 **`MethodDef`**
- 独立于 `link.xml`
- 配置中禁止 metadata token

### 单文件合并算法

对同一 `MethodDef`，单文件内所有产生明确 `1`/`0` 的规则（含 assembly/type 默认隐含）按**文档顺序**应用，**最后一次**写入的值为该文件对此方法的裁决。

### 多文件冲突算法

1. 按 CLI 顺序加载各文件，每文件内部先做单文件合并
2. 对每个 `MethodDef`，记录每个文件是否产生明确 XML 裁决
3. 若至少两个文件的裁决**不同**（`1` vs `0`）→ **硬失败**，错误信息应含程序集、类型、方法、冲突路径
4. 若一致或仅一个文件有裁决 → 采用该值
5. 已在步骤 8.1 / 8.2（特性、强制 AOT 类）决定的方法不参与跨文件冲突检测

### 与方法是否 AOT 的判定顺序（Manifest）

自上而下，**先命中先生效**：

| 步骤 | 条件 | 结果 |
|------|------|------|
| 8.1 | `[AotMethod]` 特性 | 特性决定，规则不覆盖 |
| 8.2 | P/Invoke、InternalCall 等强制 AOT | 必须 AOT，规则 `0` 无效 |
| 8.3 | 否则评估 `aot.xml`（单文件 §6 + 多文件 §7 + 继承 §5） | 得出 `1` 或 `0` |
| 8.4 | 8.3 仍无 XML 裁决 | **纳入 AOT** |

### CLI 集成

- 选项：`--leanaot-aot-rule-file <path>`，可重复
- 内部集合：`AotMethodRuleFiles`，顺序与命令行一致

### 签名匹配

`method/@signature` 的 glob 针对实现定义的 **`MethodDef` → string** 映射；实现须在代码或测试中固定该格式。
