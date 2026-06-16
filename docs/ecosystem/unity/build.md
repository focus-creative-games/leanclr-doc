# Unity 构建

## 自动替换 IL2CPP

启用 LeanCLR（**Settings → Enable**）后，**无需额外操作**：Unity 发布 Player 时，leanclr-unity 会自动：

1. 在构建管线中用 LeanCLR 替换 IL2CPP 原生后端
2. 调用 LeanAOT 将裁剪后的托管程序集转为 C++ 并参与链接
3. 生成 `global-metadata.dat` 等数据文件

对游戏业务代码透明——仍使用 Unity 惯用的 C# 开发与 IL2CPP 发布流程，仅底层运行时不同。

## 构建产物

### 裁剪后的托管程序集

构建过程中，leanclr-unity 会将 AOT 相关 DLL 复制到：

```text
Library/LeanCLR/ManagedStripped/{buildTarget}/
```

该目录下的 DLL 用于：

- **延迟加载**（`lazyLoadedAssemblyNames` 配置的程序集）— 运行时须加载与其中文件**字节一致**的 DLL
- 排查构建期与运行期程序集不一致问题

**热更新**程序集（`hotUpdateAssemblyNames`）在构建前即被过滤，**不会**出现在此目录，也不会参与 LeanAOT。见 [代码热更新](./hot-update)。

### 编译托管 DLL（Editor 菜单） {#compile-dll}

菜单 **LeanCLR → CompileDllActiveTarget** 调用 Unity 的 `PlayerBuildInterface.CompilePlayerScripts`，按当前 **Active Build Target** 编译工程中的托管程序集（含热更新程序集），**不**发布完整 Player。

输出目录（`Settings.GetCompileDllOutputPath`）：

```text
Library/LeanCLR/CompileDlls/{buildTarget}/
```

| 项目 | 说明 |
|------|------|
| 构建目标 | `EditorUserBuildSettings.activeBuildTarget` |
| Development | 跟随 `EditorUserBuildSettings.development`（影响 `ScriptCompilationOptions.DevelopmentBuild`） |
| 典型用途 | 为 [热更新](./hot-update) 程序集生成可下发 DLL |
| **不适用** | [延迟加载](./lazy-load) — lazy load 须使用上节 `ManagedStripped` 中与 Player 构建一致的裁剪 DLL |

编译完成后 Editor 控制台会输出 `[LeanCLR] Compile DLL finished` 及目录路径。可在 CI 中调用同名 API `LeanCLR.Commands.CompileDllCommand.CompileDll`（传入目标平台与输出目录）。

### 两个目录对比

| 目录 | 产生时机 | 裁剪 / 与 Player 一致 | 主要用途 |
|------|----------|------------------------|----------|
| `ManagedStripped/{target}/` | **发布 Player** 构建 | 与 LeanAOT 使用的裁剪 DLL **一致** | 延迟加载运行时 `Assembly.Load` |
| `CompileDlls/{target}/` | **CompileDllActiveTarget** 菜单 | 仅脚本编译，**未经** Player 裁剪管线 | 热更新 DLL 编译与打包 |

:::warning 勿混用目录
延迟加载**禁止**使用 `CompileDlls` 下的 DLL。热更新**应**使用 `CompileDlls`（或在此基础上接入你们自己的裁剪 / 打包流程），**不要**误用 `ManagedStripped` 作为热更下发物（该目录对应首包构建快照）。
:::

### 与标准 IL2CPP 构建的差异（概念）

| 阶段 | IL2CPP | LeanCLR |
|------|--------|---------|
| 托管裁剪 | Unity Managed Stripping | 相同 |
| 转 C++ | `il2cpp.exe --convert-to-cpp` | LeanAOT（经 wrapper 重定向） |
| 原生运行时 | libil2cpp | LeanCLR 运行时 |
| wasm 体积 / 内存 | 较大 | 通常显著减小 |

实现细节见 [集成原理（进阶）](./internals)。

## 首次构建检查清单

- [ ] 已安装 [leanclr-unity](./install)
- [ ] **Enable** 已开启
- [ ] 构建目标为 WebGL 或目标小游戏平台
- [ ] 若使用 `ruleFiles`，确认 `aot.xml` 路径正确且文件存在
- [ ] PGO profiling 构建：`enablePgoProfile` 开启；正式包：关闭并配置 `pgoRuleFiles`

## 示例工程

[leanclr-unity-demo](https://github.com/focus-creative-games/leanclr-unity-demo) 演示完整 WebGL / 小游戏发布流程。
