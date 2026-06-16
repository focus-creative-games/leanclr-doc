# 延迟加载程序集

## 机制说明

在 **LeanCLR Settings → Lean AOT → lazyLoadAssemblyNames** 中列出的程序集：

- 构建时**不会**打包进 `Metadata/global-metadata.dat`
- 运行时需你自行调用 `Assembly.Load`（或等价 API）加载
- 这些程序集**仍会参与 LeanAOT 编译**（生成对应 C++）

适用场景：热更新 DLL、按需加载的大型模块、希望减小初始 metadata 体积的包体策略等。

## 配置方式

在 `lazyLoadAssemblyNames` 中添加程序集**短名**（无 `.dll` 后缀），例如：

```text
HotUpdate
MyOptionalModule
```

保存设置后重新发布 Player。

## 裁剪后 DLL 的获取

:::danger 必须使用构建期裁剪 DLL
延迟加载的程序集必须与构建时 LeanAOT 使用的**裁剪后程序集字节完全一致**。不能直接使用 `CompileDll`、开发期 `Library/ScriptAssemblies` 或未裁剪的 DLL。
:::

leanclr-unity 在构建时将裁剪后的 AOT DLL 复制到：

```text
Library/LeanCLR/ManagedStripped/{buildTarget}/
```

运行时 `Assembly.Load` 应加载该目录下对应文件（或你按相同字节分发到 CDN / 包内路径）。

## 与 aot.xml 的配合

若某 lazy-load 程序集**部分方法**仍被 `aot.xml` 纳入 AOT（未对整个程序集 `aot="0"`），则：

- 加载的 DLL 必须与构建期裁剪版本**逐字节一致**
- 方法体、元数据与 AOT 生成代码必须匹配，否则可能出现运行时错误

建议对纯延迟加载模块在 `aot.xml` 中对整个程序集使用一致的包含 / 排除策略，并在发布流程中自动化校验 DLL 哈希。

## 注意事项

- 首次进入游戏前需完成下载与加载逻辑，自行处理失败重试与版本校验
- WebGL / 小游戏平台注意异步加载与内存峰值
- 当前 LeanCLR 为**单线程**，加载过程避免与其他线程并发调用 CLR API
