# 脚本参考

本页为**常用命令速查**。贡献者用全量脚本索引见 [开发脚本](../development/dev-scripts)。

所有脚本从仓库根目录调用。输出默认写入 `out/`（见 [输出目录结构](./output-layout)）。

## 快速命令表

| 任务 | Windows | Linux / macOS |
|------|---------|---------------|
| 构建运行时 | `scripts\build.bat runtime Release` | `./scripts/build.sh runtime Release` |
| 构建并运行全部测试 | `scripts\test\build-all.bat Release`<br/>`scripts\test\run.bat Release` | `./scripts/ci.sh Release` |
| 仅构建测试 | `scripts\build.bat test build Release` | `./scripts/build.sh test build Release` |
| 仅运行测试 | `scripts\build.bat test run Release` | `./scripts/build.sh test run Release` |
| 构建 LeanAOT | `scripts\build.bat leanaot Release` | `./scripts/build.sh leanaot Release` |
| AOT 测试：生成 C++ | `scripts\build.bat aot-tester gen-cpp` | `./scripts/build.sh aot-tester gen-cpp` |
| AOT 测试：运行 | `scripts\build.bat aot-tester run Release` | `./scripts/build.sh aot-tester run Release` |
| 清理 out/ | `scripts\dev\clean-out.bat` | `./scripts/dev/clean-out.sh` |

## 构建运行时

```bat
scripts\build.bat runtime [Debug|Release] [x86|x64]
```

也可使用转发脚本 `src\runtime\build.bat`（内部调用 `scripts/runtime/`）。

## 测试

一键构建 runner + 托管 DLL 并部署到 `dlls/`：

```bat
scripts\test\build-all.bat Debug x64
scripts\test\run.bat Debug x64
```

## LeanAOT

```bat
scripts\build.bat leanaot Release
```

产物：`out/dotnet/LeanAOT/Release/net8.0/LeanAOT.dll`

## aot-tester

```bat
scripts\build.bat aot-tester gen-cpp
scripts\build.bat aot-tester run Release x64
scripts\build.bat aot-tester build-wasm Release
```

## 样本项目

样本目录下的 `build.bat` / `build.sh` 可独立构建，例如：

```bat
cd src\samples\startup
build.bat
```

```bat
cd src\samples\lean-wasm
build-wasm.bat
```

## 转发脚本

以下路径为兼容性别名，实际逻辑在 `scripts/`：

- `src/runtime/build.*` → `scripts/runtime/`
- `src/tests/basic-tester/build.*` → `scripts/test/basic-tester/`
- `src/tools/lean/build.*` → lean 工具构建
