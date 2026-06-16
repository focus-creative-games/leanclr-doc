# LeanAOT 工具

## 工具功能

LeanAOT 将 CIL 字节码翻译为 C++，支持：

- 类、接口、虚方法派发
- 委托（社区版 / 商业版范围不同）
- 与 .NET Framework 4.x 程序集配合使用

生成物通常包括：

- `AssemblyName.method_body_partN.cpp` — 方法体
- `AssemblyName.module_registration.cpp` / `.h` — 模块注册
- `modules_registration.cpp` — 全局模块表

## 构建 LeanAOT

仓库根目录：

```bat
scripts\build.bat leanaot Release
```

```bash
./scripts/build.sh leanaot Release
```

产物路径：

```text
out/dotnet/LeanAOT/Release/net8.0/LeanAOT.dll
```

Unity 插件包内已附带发布版二进制（`LeanCLR~/leanaot/`），Unity 用户通常无需自行构建。

## 基本命令行

LeanAOT 支持两种命令风格：

### 短格式（独立使用）

```bat
dotnet LeanAOT.dll ^
  -d libraries\dotnetframework4.x ^
  -d path\to\app\bin ^
  -a mscorlib ^
  -a MyApp ^
  -o output\cpp
```

| 选项 | 说明 |
|------|------|
| `-d <dir>` | DLL 搜索目录，可重复 |
| `-a <name>` / `--assembly <path>` | 程序集短名（配合 `-d`）或 `.dll` 完整路径，可重复 |
| `-o <dir>` / `--generatedcppdir <dir>` | C++ 输出目录 |

### IL2CPP 兼容格式（Unity 构建）

Unity 传入的长命令行，例如：

```text
--convert-to-cpp --assembly=.../mscorlib.dll --generatedcppdir=... --data-folder=... --symbols-folder=...
```

leanclr-unity 通过 **il2cpp-wrapper** 将 `convert-to-cpp` 转发给 LeanAOT，其余子命令仍走原始 il2cpp。

## 可选：规则文件与 PGO

```text
--leanaot-aot-rule-file path\to\aot.xml
--leanaot-pgo-rule-file path\to\pgo-aot.xml
--leanaot-enable-pgo-profile
```

详见 [AOT 规则文件](./rule-file)、[PGO](./pgo)、[CLI 参考](./cli-reference)。

## 社区版能力边界

社区版 **不支持** 以下方法的 AOT：

- 泛型方法（generic methods）
- 含异常处理区域（`try` / `catch` / `finally`）的方法
- `extern` 方法

这些方法仍可由解释器执行。商业版解除上述限制并提供更多优化，见 [社区版与商业版](./community-vs-commercial)。

## 下一步

- [AOT 工作流](./workflow) — 将生成 C++ 纳入工程并注册模块
- [CLI 参考](./cli-reference) — 完整开关列表
