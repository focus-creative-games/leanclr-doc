# 开发脚本

仓库级脚本的**完整索引**。日常常用命令见 [脚本参考](../integration/scripts-reference)。

输出根目录：`out/`（可用 `LEANCLR_OUT_ROOT` 覆盖）。

## 目录布局

```text
scripts/
├── build.sh / build.bat     # 总入口
├── ci.sh                    # Linux CI：构建 + 测试
├── test/                    # 测试 runner 与 managed 构建
├── runtime/                 # leanclr 静态库
├── leanaot/                 # LeanAOT
├── generator/               # opcode / icall 代码生成
├── dev/                     # clean-out、format-cpp
└── lib/                     # 路径辅助
```

## 脚本索引

| 脚本 | 说明 |
|------|------|
| `ci.sh` | `test/build-all` + `test/run` |
| `test/build-all.*` | 构建 runner + managed DLL → `dlls/` |
| `test/basic-tester/build.*` | 构建 `test.exe` |
| `test/run.*` | 运行 basic-tester |
| `runtime/build.*` | 构建 `leanclr` → `out/cmake/runtime/...` |
| `test/aot-tester/build.*` | 构建 aot-tester |
| `test/aot-tester/gen_cpp.*` | LeanAOT 生成 `src/tests/aot-tester/cpp/` |
| `test/aot-tester/gen_cpp_posix.*` | POSIX BCL 变体 cpp |
| `test/aot-tester/run.*` | 构建并运行 aot-tester |
| `test/aot-tester/build-wasm.*` | WASM 版 aot-tester |
| `leanaot/build.*` | 构建 LeanAOT → `out/dotnet/LeanAOT/...` |
| `publish_leanaot.bat` | 发布 LeanAOT 到同级 `leanclr-unity` 包目录 |
| `publish_pgo2aot.bat` | 发布 pgo2aot 到 unity 包 |
| `publish_runtime.bat` | 同步 runtime 到 unity 包 |
| `publish_csharp.bat` | 同步 Profile.cs、pgo2aot 工具到 unity |
| `generator/gen_*.bat` | 再生 opcode 头文件、icall JSON |
| `dev/format-cpp-files.bat` | clang-format `src/runtime` |
| `dev/clean-out.*` | 删除整个 `out/` |

## 转发脚本

以下目录的 `build.*` 转发到 `scripts/`，产物仍在 `out/`：

- `src/runtime/build.*`
- `src/samples/*/build.*`
- `src/tests/basic-tester/build.*`
- `src/tools/leanrun/build.*`

## 与 Unity 包同步

`publish_*.bat` 假设 `leanclr-unity` 与 `leanclr` 为**同级目录**：

```text
workspace/
├── leanclr/
└── leanclr-unity/    # 或 leanclr4unity 本地克隆名
```

同步目标为 `leanclr-unity/LeanCLR~/` 下各子目录。仅维护 Unity 包的同学通常直接安装 git 包，无需运行 publish 脚本。

## 相关文档

- [脚本参考](../integration/scripts-reference)
- [测试指南](./testing)
- [输出目录结构](../integration/output-layout)
