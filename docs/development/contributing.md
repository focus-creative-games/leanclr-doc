# 贡献指南

感谢参与 LeanCLR 与文档建设。

## 参与方式

| 仓库 | 内容 |
|------|------|
| [leanclr](https://github.com/focus-creative-games/leanclr) | 运行时、LeanAOT、测试 |
| [leanclr-doc](https://github.com/focus-creative-games/leanclr-doc) | 文档站（https://doc.leanclr.com） |
| [leanclr-unity](https://github.com/focus-creative-games/leanclr-unity) | Unity 插件 |

问题讨论：[Discord](https://discord.gg/esAYcM6RDQ) / QQ 群 1047250380

## 代码风格

### C++（runtime）

- 遵循仓库根目录 `.clang-format`
- Windows 格式化：`scripts\dev\format-cpp-files.bat`
- 运行时最低 **C++11**（`src/runtime/CMakeLists.txt`）

### C#

- 与现有测试项目风格一致
- 新测试类使用 `TC_` 前缀，见 [测试框架](./test-framework)

## Pull Request 流程

1. Fork 目标仓库，从 `main` 拉分支
2. 小步提交，附带清晰说明
3. **运行时改动**：在本地跑通测试  
   ```bat
   scripts\test\build-all.bat Release
   scripts\test\run.bat Release
   ```
4. **文档改动**：在 `leanclr-doc` 目录 `npm run build` 确保无断链
5. 提交 PR，描述动机、测试方式、关联 Issue（如有）

## 本地开发环境（IDE）

### Cursor / VS Code + clangd

1. 用仓库**根目录**打开工作区（不要只开 `src/runtime`）
2. 编译标志：`src/runtime/compile_flags.txt`（`-I.` 为 runtime 根）
3. 启用 clangd，禁用与 cpptools 冲突的 IntelliSense
4. 修改 CMake 宏（如 GC 选项）后，同步更新 `compile_flags.txt` 中对应 `-D`

### Visual Studio

```bat
scripts\build.bat runtime sln
```

在 `out/cmake/runtime/vs-sln-x64/` 打开 `leanclr.sln`。

## 文档贡献

- **不要**再往 `leanclr` 仓库 `docs/` 添加内容（已废弃）
- 在 [leanclr-doc](https://github.com/focus-creative-games/leanclr-doc) 编辑 `docs/` 下 Markdown
- 中文为主；英文 locale 后续单独添加

## 许可证

贡献代码即表示同意以仓库 [MIT License](https://github.com/focus-creative-games/leanclr/blob/main/LICENSE) 发布。
