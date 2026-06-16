# Unity 集成原理（进阶）

:::info 读者对象
本文面向需要理解 Unity 构建管线与 LeanCLR 对接方式的开发者。普通用户只需 [安装](./install) → [设置](./settings) → [构建](./build)。
:::

## Unity WebGL 构建流程（IL2CPP 视角）

标准 IL2CPP WebGL 构建大致为：

1. 生成裁剪后托管程序集（`Library/Bee/artifacts/WebGL/ManagedStripped`）
2. 编译 libil2cpp 源码
3. 调用 `il2cpp.exe --convert-to-cpp ...` 生成 C++、符号与 `global-metadata.dat`
4. 编译生成的 C++ 并链接为 wasm

LeanCLR 需要 Hook 上述流程：替换原生运行时、用 LeanAOT 承担 `convert-to-cpp` 职责，并生成兼容的数据与符号文件。

## leanclr-unity 做了什么

插件在 Editor 构建期自动完成（**无需手动复制 deploy 目录**）：

| 步骤 | 行为 |
|------|------|
| 替换 libil2cpp 源码 | 通过 `UNITY_IL2CPP_PATH` 等机制指向 LeanCLR 运行时 |
| 重定向 `il2cpp.exe` | `il2cpp-wrapper` 拦截 `convert-to-cpp`，转发给 `LeanAOT.exe` |
| 生成 C++ | LeanAOT 输出至 `--generatedcppdir` |
| 生成 data | `--data-folder` 下 `Metadata/global-metadata.dat` 等 |
| 生成 symbols | `--symbols-folder` 下 `MethodMap.tsv` 等 |

Unity 2022+ 可能还需 Mono Hook 使 `GetIl2CppFolder` 走 development 路径，插件已内置处理。

## il2cpp-wrapper

`il2cpp-wrapper` 行为：

- 命令为 **`convert-to-cpp`**（或 rsp 文件中包含等价参数）→ 调用 **`LeanAOT.exe`**
- 其余 il2cpp 子命令 → 转发给 **`il2cpp-origin.exe`**

Unity 命令行可能极长，或通过 `il2cpp.exe @{rsp}` 传递参数；wrapper 与 LeanAOT 解析合并后的 `effectiveArgs`。

## LeanAOT 额外参数

Unity 无法随意扩展传给 `il2cpp.exe` 的参数时，可在启动 Unity / Bee 前设置环境变量 **`LEANAOT_EXTRA_ARGS`**，其 token 会**追加**到 Unity 解析出的参数之后，一并交给 LeanAOT。

常用开关：

| 开关 | 说明 |
|------|------|
| `--leanaot-aot-rule-file=<path>` | `aot.xml` 规则文件 |
| `--leanaot-pgo-rule-file=<path>` | `pgo-aot.xml` PGO 规则 |
| `--leanaot-enable-pgo-profile` | 插入 profile 桩 |
| `--leanaot-exclude-assembly-from-global-metadata=<shortName>` | 从 global-metadata 排除程序集（仍 AOT） |
| `--leanaot-enable-layout-validation` | 类型布局校验 |

完整列表见 [CLI 参考](../../aot/cli-reference)。

## 数据与符号产物（摘要）

LeanAOT 在 Unity 构建中还需生成与 IL2CPP 兼容的：

- **`global-metadata.dat`** — 打包裁剪后程序集元数据的 bundle（签名 `COPH`）
- **`MethodMap.tsv`** — 托管方法签名到生成 C++ 函数名的映射；未 AOT 的方法对应 `NULL`

`--leanaot-exclude-assembly-from-global-metadata` 与 [延迟加载](./lazy-load) 配合，可将指定程序集排除在 metadata 打包之外。

:::note
本文 intentionally 不展开二进制格式细节。实现变更时以 LeanAOT 源码与构建日志为准。
:::

## 手动集成（不推荐）

在 leanclr-unity 出现之前，曾需手动设置 `UNITY_IL2CPP_PATH`、复制 deploy 目录、替换 `il2cpp.exe`。**当前请始终使用 leanclr-unity 插件**；手动步骤仅作历史参考，易与 Unity 版本脱节。
