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
