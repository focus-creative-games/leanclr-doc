# 延迟加载程序集

:::info 与热更新程序集不同
**延迟加载（lazy loaded）** 与 **热更新（hot update）** 是两种不同机制。延迟加载的程序集**仍参与完整构建与 LeanAOT**，运行时加载的 DLL 必须与构建期裁剪结果**完全一致、不得改动**。热更新程序集在构建前即被过滤，**不参与构建**，见 [代码热更新](./hot-update)。
:::

:::info 与 AOT 配置独立
延迟加载只影响程序集是否写入 **`global-metadata.dat`**。程序集内的代码**仍可由 LeanAOT 生成 AOT 原生代码**（除非在 `aot.xml` 中另行排除）。请先阅读 [概念辨析](./concepts)。
:::

## 机制说明

在 **LeanCLR Settings → Lean AOT → lazyLoadedAssemblyNames** 中列出的程序集：

- 构建时**不会**写入 `Metadata/global-metadata.dat`（减小元数据体积）
- **仍参与** Unity 构建管线与 **LeanAOT** 编译（可按 `aot.xml` / PGO 生成 AOT 代码）
- 运行时由你自行 **`Assembly.Load`**（或等价 API）加载；加载的字节须来自构建产物

适用场景：启动时不必常驻内存的大型模块、希望减小 `global-metadata.dat` 的按需加载等。**逻辑热更新**请使用 [热更新程序集](./hot-update)，不要误配为 lazy loaded。

## 配置方式

在 `lazyLoadedAssemblyNames` 中添加程序集**短名**（无 `.dll` 后缀），例如：

```text
MyOptionalModule
LargeFeature
```

保存设置后重新发布 Player。

:::warning 不可与热更新重复配置
同一程序集**不能**同时出现在 `lazyLoadedAssemblyNames` 与 `hotUpdateSettings.hotUpdateAssemblyNames` 中，否则构建失败。
:::

## 裁剪后 DLL：必须与构建结果完全一致

:::danger 不允许改动
延迟加载的程序集在运行时加载的 DLL，必须与构建时 LeanAOT 使用的**裁剪后程序集字节完全一致**，**不允许**在构建后修改 IL、重新编译或替换为其他版本。

不能直接使用 `CompileDll` 产出、开发期 `Library/ScriptAssemblies` 或未参与本次 Player 构建的 DLL。若程序集中有方法已被 AOT，DLL 与包内原生代码、元数据必须一一对应，任何字节差异都可能导致严重运行时错误。
:::

leanclr-unity 在构建时将裁剪后的 DLL 复制到：

```text
Library/LeanCLR/ManagedStripped/{buildTarget}/
```

运行时 `Assembly.Load` **必须**加载该目录下与本次构建对应的文件（或你按**相同字节**分发到分包 / CDN 的路径）。这是**同一版本**的按需加载，不是热更新。

## 与 aot.xml 的配合

延迟加载**不自动**禁用 AOT。若希望某 lazy-load 程序集全部由解释器执行，须在 `aot.xml` 中对该程序集设 `aot="0"`；若部分方法被 AOT，则加载的 DLL 更须与构建期裁剪版本严格一致。

建议对 lazy-load 模块在 `aot.xml` 中明确包含 / 排除策略，并在发布流程中校验 `ManagedStripped` 目录下 DLL 哈希。

## 脚本序列化与 AssetBundle

延迟加载程序集中的 **`MonoBehaviour`**、**`ScriptableObject`** 等脚本，可以挂到 **Prefab、Scene** 等资源上，并随 **AssetBundle** 构建。

从 AssetBundle **实例化**资源时，Unity 序列化可**正确还原**这些组件。构建时运行时会为 placeholder 程序集预留类型槽位（与热更新程序集相同机制），实例化前须已 `Assembly.Load` 对应 DLL。

典型流程：

1. 将 lazy-load 程序集内的脚本挂到 Prefab / Scene；
2. 打 AssetBundle；
3. 运行时**先** `Assembly.Load` **构建期** `ManagedStripped` 中的 DLL；
4. 再加载 AssetBundle 并实例化。

:::tip 加载顺序
实例化引用该程序集脚本的资源之前，对应程序集必须**已加载**，否则可能出现 `Missing Script`。
:::

## 注意事项

- 首次需要该模块前完成加载逻辑；lazy load 是**固定版本**按需加载，不是热更
- WebGL / 小游戏注意异步加载与内存峰值
- 当前 LeanCLR 为**单线程**，加载过程避免与其他线程并发调用 CLR API

## 相关文档

- [概念辨析 — 延迟加载与热更新对比](./concepts#lazy-vs-hot-update)
- [代码热更新](./hot-update)
- [项目设置](./settings)
