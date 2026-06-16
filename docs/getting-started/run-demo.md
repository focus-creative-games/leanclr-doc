# 运行 Demo

LeanCLR 的独立体验示例已迁移至专用仓库 **[leanclr-demo](https://github.com/focus-creative-games/leanclr-demo)**，主仓库 `src/samples` 下保留的是面向开发者的集成示例（如 startup、lean-wasm）。

## leanclr-demo 仓库

```bash
git clone https://github.com/focus-creative-games/leanclr-demo.git
cd leanclr-demo
```

| 示例 | 平台 | 说明 |
|------|------|------|
| **win64** | Windows x64 | 预编译或本地构建后运行 |
| **h5** | WebAssembly 浏览器 | 通过 HTTP 服务器访问 `index.html` |

## Windows x64 示例

```bat
cd win64
run.bat
```

按仓库 README 说明配置依赖路径。该示例演示在原生 Win64 宿主中加载并执行 .NET 程序集。

## WebAssembly 浏览器示例

```bat
cd h5
# 使用任意静态 HTTP 服务器，例如：
python -m http.server 8080
```

浏览器访问 `http://localhost:8080`（或对应端口）打开 `index.html`。

:::tip
浏览器直接打开本地 `file://` 路径可能因 WASM 加载策略失败，请始终通过 HTTP 服务访问。
:::

## 与主仓库的关系

| 位置 | 内容 |
|------|------|
| [leanclr-demo](https://github.com/focus-creative-games/leanclr-demo) | 面向最终用户的快速体验 |
| `leanclr/src/samples/startup` | 最小 CMake 嵌入示例（见 [startup 示例](../samples/startup)） |
| `leanclr/src/samples/lean-wasm` | WASM 构建参考（见 [WebAssembly 构建](../integration/wasm)） |
| [leanclr-unity-demo](https://github.com/focus-creative-games/leanclr-unity-demo) | Unity 插件集成示例 |

Unity 用户请直接参考 [LeanCLR for Unity](../ecosystem/unity/)。
