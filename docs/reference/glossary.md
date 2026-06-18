# 术语表

## 运行时

| 术语 | 说明 |
|------|------|
| **CLR** | Common Language Runtime，Common 语言运行时 |
| **ECMA-335** | C# / .NET 中间语言与元数据标准 |
| **Standard 版** | 面向引擎集成；含 **mono / unity / coreclr** BCL 分支（当前均单线程） |
| **Core 版** | 已实现；纯 C++11、全平台；准确式 Mark-Sweep **手动 GC** |
| **unity 分支** | Standard 分支，Unity IL2CPP BCL；leanclr-unity 默认 |
| **mono 分支** | Standard 分支，Mono BCL 基线 |
| **coreclr 分支** | Standard 分支，CoreCLR 方向；开发中 |
| **解释器** | 对未 AOT 的 IL 进行 IR 解释执行 |
| **icall** | internal call，BCL 中由原生实现的内部调用 |
| **AOT 模块** | LeanAOT 生成的 C++ 及 `g_aot_modules_data` 注册块 |

## AOT

| 术语 | 说明 |
|------|------|
| **LeanAOT** | IL → C++ 的 AOT 编译器 |
| **aot.xml** | 手工 AOT 包含/排除规则文件 |
| **pgo-aot.xml** | PGO 生成的热点方法追加规则（文件名统一使用此名） |
| **pgo2aot** | Profile JSON → `pgo-aot.xml` 的工具 |
| **MethodMap.tsv** | 托管方法名与生成 C++ 符号的映射表（Unity 构建产物） |
| **global-metadata.dat** | 打包裁剪程序集元数据的 bundle（Unity 构建产物） |
| **COPH** | `global-metadata.dat` 使用的 bundle 签名标识 |

## Unity 集成

| 术语 | 说明 |
|------|------|
| **leanclr-unity** | Unity 包 `com.code-philosophy.leanclr` |
| **ManagedStripped** | Player 构建后 LeanAOT 复制的裁剪托管 DLL 目录：`Library/LeanCLR/ManagedStripped/{target}/` |
| **CompileDlls** | 菜单 **CompileDllActiveTarget** 输出目录：`Library/LeanCLR/CompileDlls/{target}/` |
| **CompileDllActiveTarget** | LeanCLR 菜单项，调用 `PlayerBuildInterface.CompilePlayerScripts` 编译当前 Active Target 的托管 DLL |
| **il2cpp-wrapper** | 将 `convert-to-cpp` 转发给 LeanAOT 的工具 |
| **Lazy Load** | 构建时不写入 metadata、运行时 `Assembly.Load` 的程序集 |
| **LEANAOT_EXTRA_ARGS** | 向 LeanAOT 追加命令行 token 的环境变量 |

## 与 link.xml 区分

| 文件 | 用途 |
|------|------|
| **link.xml** | Unity 托管代码裁剪 |
| **aot.xml** | LeanAOT 方法级 AOT 开关 |

二者互不替代。
