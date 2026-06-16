# 代码热更新

leanclr-unity 提供 **热更新程序集（hot update assembly）** 工作流：在 Player 构建前将指定程序集从构建列表中**过滤掉**，使其**完全不参与** LeanAOT 与主包编译，运行时通过 `Assembly.Load` 加载**新版本** DLL。

LeanCLR 的**主要目标**仍是发布期替换 IL2CPP、缩小包体与降低内存，热更能力轻量于 [HybridCLR](https://github.com/focus-creative-games/hybridclr) 的差分混合执行等完整方案；下载、版本校验与资源管线仍需**自行实现**。

:::warning 与延迟加载完全不同
**热更新程序集** ≠ **延迟加载程序集**。二者不要混用同一程序集，也不要把热更程序集配进 `lazyLoadedAssemblyNames`。对比见 [概念辨析](./concepts#lazy-vs-hot-update) 与下表。
:::

## 与延迟加载的对比

| | **热更新程序集** | **延迟加载程序集** |
|--|------------------|-------------------|
| 配置 | `hotUpdateSettings.hotUpdateAssemblyNames` | `leanAOTSettings.lazyLoadedAssemblyNames` |
| 构建参与 | **构建前过滤**，不参与 LeanAOT / 主包编译 | **完整参与**构建与 LeanAOT |
| AOT | **不可能**（未进入构建，无 AOT 代码） | **可以**（由 `aot.xml` / PGO 决定） |
| 运行时 DLL | 可加载**新版本**（热更下发） | 必须与构建期 `ManagedStripped` **字节完全一致**，**不得改动** |
| 典型用途 | 逻辑热更新 | 同版本按需加载、减小 metadata |

### 相同点

- 构建时**都不会**写入 `global-metadata.dat`
- 运行时均可通过 **`Assembly.Load`** 加载
- 程序集中的 **`MonoBehaviour`、`ScriptableObject`** 等可挂到 Prefab / Scene，打入 **AssetBundle** 后，在加载 AssetBundle 并实例化时可**正确还原**（须先 `Assembly.Load` 对应程序集）

## 项目设置

配置位于 **LeanCLR Settings → Hot Update**（`hotUpdateSettings`，类 **`HotUpdateSettings`**）：

| 字段 | 说明 |
|------|------|
| **`hotUpdateAssemblyNames`** | 热更新程序集短名列表（无 `.dll` 后缀） |

示例：

```text
HotUpdate
HotUpdateLogic
```

保存 `ProjectSettings/LeanCLR.asset` 后重新发布 Player。

构建时 **`FilterHotUpdateAssembly`**（`IFilterBuildAssemblies`）会在管线早期将上述程序集从待构建列表中移除，因此：

- **不会**进入 LeanAOT，**无需**在 `aot.xml` 中写 `aot="0"`；
- **不会**产生包内 AOT 原生代码，热更后不存在 IL 与 AOT 不匹配问题；
- 与 `lazyLoadedAssemblyNames` **互斥**：同一程序集不能出现在两个列表中，否则构建报错。

## 推荐配置清单

- [ ] 热更程序集仅列在 **`hotUpdateAssemblyNames`**，未列入 `lazyLoadedAssemblyNames`
- [ ] 主包代码在热更 DLL 加载前**不直接引用**热更程序集类型（避免链接期强依赖）
- [ ] 已实现下载、`Assembly.Load`、失败重试与版本校验
- [ ] 热更 DLL 与主包 **Unity 版本、裁剪基线**兼容（按发布管线编译）
- [ ] WebGL / 小游戏已评估异步加载与内存（当前 LeanCLR **单线程**）

## 编码约束

### 避免在热更程序集中使用 `extern`

主包构建阶段不包含热更程序集，热更 DLL 内若声明 `extern` / `[DllImport]` 等，行为与主包 P/Invoke 桥接策略可能不一致。若需原生交互，请将 P/Invoke 放在**主包程序集**，热更代码通过已有 API 调用。

## 运行时加载（示意）

```csharp
byte[] dllBytes = await DownloadHotUpdateDllAsync("HotUpdate.dll");
var asm = System.Reflection.Assembly.Load(dllBytes);
var entry = asm.GetType("HotUpdate.Entry");
entry.GetMethod("Start")?.Invoke(null, null);
```

热更 DLL 可放在小游戏分包、CDN 或 HTTP 下载；加载成功后 placeholder 程序集槽位会被实际模块替换。

## 脚本与 AssetBundle

热更新程序集中的 `MonoBehaviour` / `ScriptableObject` 可挂到资源并打入 AssetBundle。加载 AssetBundle 前须 **`Assembly.Load` 当前版本**热更 DLL，实例化后即可正确还原序列化字段。流程与 [延迟加载](./lazy-load#脚本序列化与-assetbundle) 相同，但 DLL 来源为**热更下发的新版本**，而非 `ManagedStripped` 固定副本。

## 与 HybridCLR 的对比

| | LeanCLR 热更（本页） | HybridCLR |
|--|----------------------|-------------|
| 定位 | 发布后端替换 + 热更程序集过滤 | 全平台原生 C# 热更新 |
| 工作流 | `hotUpdateAssemblyNames` + 自研下载 / `Assembly.Load` | 差分元数据、DHE 等内建管线 |
| AOT | 热更程序集不参与构建，天然无 AOT | 差分混合执行等专用模型 |

见 [相关项目](../../reference/related-projects)。

## 相关文档

- [概念辨析](./concepts)
- [项目设置](./settings)
- [延迟加载程序集](./lazy-load)
