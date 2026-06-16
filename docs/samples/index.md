# 示例概览

LeanCLR 示例分布在**主仓库 `src/samples`** 与**独立 Demo 仓库**中，用于验证嵌入、AOT、P/Invoke 等能力。

## 如何选择

| 目标 | 推荐示例 |
|------|----------|
| 最快体验（无需编译） | [leanclr-demo](https://github.com/focus-creative-games/leanclr-demo) |
| 最小 C++ 嵌入 | [startup](./startup) |
| 浏览器 WASM | [WebAssembly 构建](../integration/wasm)（`lean-wasm`） |
| AOT 全流程 | `src/samples/simple-aot` |
| 自定义 P/Invoke | `src/samples/custom-pinvoke-x64` |
| Unity 发布 | [leanclr-unity-demo](https://github.com/focus-creative-games/leanclr-unity-demo) |

## 仓库内示例（src/samples）

| 项目 | 说明 |
|------|------|
| **startup** | Win64 最小嵌入，`set_file_loader` + `get_corlib` |
| **lean-wasm** | Emscripten 构建，浏览器加载程序集 |
| **simple-aot** | LeanAOT 生成 C++ 并注册 `g_aot_modules_data` |
| **custom-pinvoke-x64** | 手动注册 P/Invoke |

构建前需先 [构建运行时](../getting-started/build-runtime)。

## 外部 Demo 仓库

详见 [外部 Demo](./external-demos)。

## 相关文档

- [第一个嵌入示例](../getting-started/first-embed)
- [嵌入 LeanCLR](../integration/embed-leanclr)
- [AOT 工作流](../aot/workflow)
- [Unity 集成](../ecosystem/unity/)
