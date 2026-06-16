# Win64 平台注意事项

## 支持级别

Win64 为**部分支持**的实验性目标，主要验证路径仍在 **WebGL / 小游戏**。在 Win64 上使用 LeanCLR 需自行充分测试。

## Unity 6000 Win64 已知问题

发布 Win64 时，若生成的 `Il2CppOutputProject.vcxproj` 中包含 il2cpp 命令行参数：

```text
--static-lib-il2-cpp
```

可能导致启动时报错 **`il2cpp init failed`**。

**Workaround：** 在该 vcxproj 中移除此参数后重新编译原生工程。

:::note
此问题与 Unity 生成工程方式有关，后续 leanclr-unity 版本可能自动处理。请以最新插件 Release 说明为准。
:::

## 单线程限制

Win64 桌面环境常有多线程 UI 与后台任务。当前 LeanCLR **仅支持单线程**：

- 避免从多个线程同时进入托管代码
- `System.Threading` 相关 API 可能表现异常或崩溃

## 何时选择 Win64 + LeanCLR

仅在需要验证桌面包体或与 WebGL 共用同一 LeanCLR 后端时考虑。一般桌面分发仍可使用 Unity 默认 IL2CPP / Mono，WebGL / 小游戏使用 LeanCLR 收益最大。
