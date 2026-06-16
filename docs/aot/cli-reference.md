# LeanAOT CLI 参考

LeanAOT 同时支持 **短格式**（`-d` / `-a` / `-o`）与 **IL2CPP 兼容长格式**（Unity 构建）。以 `dotnet LeanAOT.dll --help` 为准；本文列出常用与 Lean 专有开关。

## 基本选项（短格式）

| 选项 | 必填 | 说明 |
|------|------|------|
| `-d <dir>` | 视情况 | DLL 搜索目录，可重复。若每个 `--assembly` 均为完整 `.dll` 路径则可省略 |
| `-a` / `--assembly <name\|path>` | 是 | 程序集短名或 `.dll` 完整路径，可重复 |
| `-o` / `--generatedcppdir <dir>` | 是 | 生成 C++ 输出目录（`-o` 与 `--generatedcppdir` 等价） |

示例：

```bat
dotnet LeanAOT.dll -d libs\dotnetframework4.x -a mscorlib -a MyApp -o out\cpp
```

## IL2CPP 兼容选项（Unity 常用）

Unity / Bee 传入的部分参数由 LeanAOT **识别并处理**或**保留兼容**：

| 选项 | 说明 |
|------|------|
| `--convert-to-cpp` | 兼容标志，表示执行转 C++ |
| `--assembly=<path>` | 同 `-a`，IL2CPP 风格 |
| `--generatedcppdir=<dir>` | C++ 输出目录 |
| `--data-folder=<dir>` | 生成 `global-metadata.dat` 等 |
| `--symbols-folder=<dir>` | 生成 `MethodMap.tsv` 等 |
| `--directory=<dir>` | 托管程序集目录（可自动发现） |
| `--dotnetprofile=<name>` | 如 `unityaot-linux`（保留） |
| `--print-command-line` | 打印有效命令行 |

大量 `--emit-*`、`--profiler-*`、`--enable-analytics` 等为 IL2CPP 兼容占位，LeanAOT 可能忽略具体语义。

## Lean 专有开关

| 选项 | 说明 |
|------|------|
| `--leanaot-aot-rule-file=<path>` | `aot.xml` 规则文件，**可重复** |
| `--leanaot-pgo-rule-file=<path>` | **`pgo-aot.xml`** PGO 规则，**可重复** |
| `--leanaot-enable-pgo-profile` | 生成 profile 采集桩（profiling 构建） |
| `--leanaot-exclude-assembly-from-global-metadata=<shortName>` | 从 `global-metadata.dat` 排除程序集（仍参与 AOT）；短名须在 `-a` 列表中，**可重复** |
| `--leanaot-enable-layout-validation` | 开启托管类型布局校验（**默认关闭**） |
| `--leanaot-may-throw-exception-in-icall` | icall 可能抛异常（默认关闭） |
| `--leanaot-unity-version=<ver>` | Unity 版本字符串，如 `6000.0.4f1` |
| `--leanaot-managed-stripped-duplicate-path=<dir>` | 将 `-a` 程序集按文件名扁平复制到目录（Unity ManagedStripped 等） |

规则语义见 [AOT 规则文件](./rule-file)、[PGO](./pgo)。

## 环境变量 LEANAOT_EXTRA_ARGS

Unity 无法扩展传给 `il2cpp.exe` 的参数时，在启动 Unity / Bee **之前**设置：

```text
LEANAOT_EXTRA_ARGS=--leanaot-aot-rule-file=C:\proj\aot.xml --leanaot-pgo-rule-file=C:\proj\pgo-aot.xml
```

- 名称须为 **`LEANAOT`**（`L-E-A-N-A-O-T`），勿漏写 `A`
- 值为与 rsp 相同的空白分词串；双引号可包住含空格的片段
- token **追加**在 Unity 解析出的参数之后，合并为 `effectiveArgs` 再一次性解析

Unity 集成说明见 [集成原理](../ecosystem/unity/internals)。

## pgo2aot 命令行（摘要）

完整说明见 [Profile Guided AOT](./pgo)。

```text
pgo2aot -i profile.json -o pgo-aot.xml --strategy pareto --pareto-ratio 0.8
```

| 选项 | 说明 |
|------|------|
| `-i` / `--input` | Profile JSON，可重复 |
| `-o` / `--output` | 输出 **`pgo-aot.xml`** |
| `--strategy` | `threshold` / `top` / `pareto` |
| `--sort-by` | `cost` 或 `calls` |

## 版本差异

CLI 开关随 LeanAOT 版本演进。升级后请运行：

```bat
dotnet LeanAOT.dll --help
```

并以构建日志中的 `--print-command-line` 输出核对 Unity 实际参数。
