# 测试指南

本文描述 LeanCLR `src/tests/` 的构建、运行方式与测试体系概览。编写用例与目录约定见 [测试框架](./test-framework)。

脚本索引见 [开发脚本](./dev-scripts) 或 [脚本参考](../integration/scripts-reference)。

## 测试体系概览

```text
src/tests/
├── basic-tester/     # C++ runner — CI 主路径（解释器 + BCL + ILTests）
├── aot-tester/       # AOT 正确性 runner
└── managed/          # C# 测试程序集（CoreTests、CorlibTests、AotTests、ILTests…）
```

| Runner | 加载程序集 | 用途 |
|--------|------------|------|
| **basic-tester** | CoreTests, CorlibTests, ILTests, … | **CI 默认** |
| **RunTests.exe** | 含 AotTests 等 | 本地一次性跑多套 managed 测试 |
| **aot-tester** | AotTests | AOT 流水线验证 |

## 构建与运行

### 一键（推荐）

```bat
scripts\test\build-all.bat Debug x64
scripts\test\run.bat Debug x64
```

Linux / macOS：

```bash
./scripts/ci.sh Release
```

### 分步

```bat
scripts\test\basic-tester\build.bat Debug x64
dotnet build src\tests\managed\managed.sln -c Debug
scripts\test\run.bat Debug x64
```

`build-all` 会将 `Common.dll`、`CoreTests.dll`、`CorlibTests.dll`、`ILTests.dll`、`ILTests.Native.dll` 等复制到 runner 旁 `dlls/` 目录。

### AOT 测试

```bat
scripts\build.bat aot-tester gen-cpp
scripts\build.bat aot-tester run Release x64
```

### 本地调试（含 AotTests）

```bat
dotnet build src\tests\managed\managed.sln -c Debug
out\dotnet\RunTests\Debug\RunTests.exe
```

## 输出路径

- C++ runner：`out/cmake/tests/basic-tester/<Config>-<Arch>/bin/...`
- Managed DLL：`out/dotnet/<ProjectName>/<Config>/`

见 [输出目录结构](../integration/output-layout)。

## 命名规范

| 类别 | 规范 | 示例 |
|------|------|------|
| 测试类 | `TC_{主题}` | `TC_conv_i4` |
| 回归 | `Issue_{yyyyMMdd}_{desc}` | `Issue_20220617_ArrayCustomArg` |
| Fixture | 无 `TC_` 前缀 | `TypeStaticFields` |

新用例请遵循上述约定，避免 `Test*` 与 `TC_*` 混用。

## 常见问题

**报错 "Test runner not found"**  
先构建 basic-tester：`scripts\test\basic-tester\build.bat Debug x64`

**能否只跑单个测试？**  
当前 runner **不支持过滤**，所有带 `[UnitTest]` 的方法都会执行。

**ILTests 如何添加？**  
见 [测试框架 — ILTests](./test-framework#iltests)。

**Assert 维护位置**  
仅在 `managed/Common/Assert.cs` 维护一份。

## 相关文档

- [测试框架](./test-framework) — 项目职责、Assert API、放置指南
- [贡献指南](./contributing)
