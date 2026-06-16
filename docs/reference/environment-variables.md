# 环境变量

## LEANCLR_OUT_ROOT

覆盖构建输出根目录，默认为仓库根目录下的 `out/`。

```bat
set LEANCLR_OUT_ROOT=D:\build\leanclr-out
scripts\build.bat runtime Release
```

详见 [输出目录结构](../integration/output-layout)。

## LEANAOT_EXTRA_ARGS

在 **Unity / Bee 启动前**设置，向 LeanAOT **追加**命令行参数（与 Unity 传入 `il2cpp` 的参数合并解析）。

```bat
set LEANAOT_EXTRA_ARGS=--leanaot-aot-rule-file=C:\proj\aot.xml --leanaot-pgo-rule-file=C:\proj\pgo-aot.xml
```

注意变量名拼写：**`LEANAOT`**（勿漏写 `A`）。

常用 token：

| 开关 | 说明 |
|------|------|
| `--leanaot-aot-rule-file=<path>` | `aot.xml` |
| `--leanaot-pgo-rule-file=<path>` | `pgo-aot.xml` |
| `--leanaot-enable-pgo-profile` | PGO 插桩（profiling 构建） |
| `--leanaot-enable-layout-validation` | 类型布局校验 |

完整列表见 [CLI 参考](../aot/cli-reference)。Unity 说明见 [集成原理](../ecosystem/unity/internals)。

## UNITY_IL2CPP_PATH

Unity 用于定位 IL2CPP / LeanCLR 运行时源码树的环境变量。使用 **leanclr-unity** 时通常由插件自动配置，手动集成 Unity 构建时才需关心。

## 文档贡献

修改文档请编辑 [leanclr-doc](https://github.com/focus-creative-games/leanclr-doc) 仓库，而非主仓库 `docs/`（已移除）。
