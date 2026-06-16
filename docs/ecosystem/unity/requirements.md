# Unity 支持与限制

## 支持的 Unity 版本

- **Unity 2021 – 6000** 全系列（含 LTS 与非 LTS）
- **团结引擎**全版本

## 支持的 Editor 平台

- Windows
- macOS

## 支持的目标平台

| 平台 | 支持级别 |
|------|----------|
| **WebGL** | ✅ 主要目标平台 |
| **MiniGame / 小游戏** | ✅ 微信小游戏、抖音小游戏等 Unity 支持的小游戏平台 |
| **Win64** | ⚠️ 部分支持（见 [Win64 注意事项](./win64-notes)） |

团结引擎的 WebGL / 小游戏目标与 Unity 同等对待。

## 已知限制

### 单线程

当前 LeanCLR Standard 版为**单线程**。请勿在发布产物中依赖 `System.Threading` 多线程并发调用 LeanCLR 托管代码。多线程环境下可能产生未定义行为。

未来将随 Standard 版演进提供完整多线程支持。

### 非开发期运行时

LeanCLR 用于**发布管线**，不能替代 Editor 内 Mono / IL2CPP 进行日常 Play Mode 开发调试的全部场景。开发阶段仍使用 Unity 默认脚本后端；**仅在 Player 构建**时由 leanclr-unity 替换后端。

### Win64 与其他平台

Win64 等平台为实验性支持，可能需要手动调整生成工程。详见 [Win64 注意事项](./win64-notes)。

## 兼容性数据

LeanCLR 与 Unity 2019.4.x – 6000.3.x LTS IL2CPP 所用 BCL **完全兼容**，已通过数千个测试用例。详见 [兼容性说明](../../intro/compatibility)。
