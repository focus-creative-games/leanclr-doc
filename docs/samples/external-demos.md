# 外部 Demo

面向最终用户的独立仓库，无需克隆完整 LeanCLR 源码即可体验。

## leanclr-demo

仓库：[github.com/focus-creative-games/leanclr-demo](https://github.com/focus-creative-games/leanclr-demo)

```bash
git clone https://github.com/focus-creative-games/leanclr-demo.git
cd leanclr-demo
```

| 目录 | 平台 | 使用方式 |
|------|------|----------|
| **win64** | Windows x64 | `cd win64` → `run.bat` |
| **h5** | WebAssembly 浏览器 | 启动 HTTP 服务，打开 `index.html` |

详见 [运行 Demo](../getting-started/run-demo)。

## leanclr-unity-demo

仓库：[github.com/focus-creative-games/leanclr-unity-demo](https://github.com/focus-creative-games/leanclr-unity-demo)

已配置 **leanclr-unity** 的 Unity 工程，演示 WebGL / 小游戏 / Win64 等目标下用 LeanCLR 替换 IL2CPP。

1. 用 Unity 打开工程
2. 按 [Unity 安装](../ecosystem/unity/install) 确认已安装 `com.code-philosophy.leanclr`
3. 切换目标平台并 Development Build 验证

Unity 文档：[LeanCLR for Unity](../ecosystem/unity/)

## 与 src/samples 的区别

| | 外部 Demo | `src/samples` |
|--|-----------|---------------|
| 受众 | 快速试用 | 开发者参考源码 |
| 维护 | 独立发版 | 随 leanclr 主仓库 |
| 构建 | 预构建或简易脚本 | CMake / Emscripten 完整流程 |
