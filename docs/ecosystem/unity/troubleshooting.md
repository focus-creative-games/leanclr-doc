# Unity 常见问题

## 构建失败

### ruleFiles 指向的文件不存在

**现象：** 构建报错，提示找不到 `aot.xml`。

**处理：** 确认 **Lean AOT → ruleFiles** 中的路径相对工程根目录正确；打包前文件必须存在。可先留空 ruleFiles 验证基础构建。

### LeanAOT / il2cpp 相关错误

**现象：** 转换 C++ 阶段失败，日志中出现 LeanAOT 或 `convert-to-cpp`。

**处理：**

1. 确认 **Enable** 已开启且目标平台为 WebGL / 小游戏
2. 检查 `LEANAOT_EXTRA_ARGS` 是否拼写错误（须为 `L-E-A-N-A-O-T`）
3. 查看 Editor 日志中完整命令行，对照 [CLI 参考](../../aot/cli-reference)

### aot.xml 规则冲突

**现象：** LeanAOT 报错同一方法在多个规则文件中被赋 `1` 与 `0`。

**处理：** 检查多份 `aot.xml` 是否对同一方法给出相反策略。见 [AOT 规则文件](../../aot/rule-file)。

## 运行时错误

### il2cpp init failed（Win64）

见 [Win64 注意事项](./win64-notes)。

### 延迟加载程序集崩溃或类型缺失

**常见原因：** 运行时加载的 DLL 与 `Library/LeanCLR/ManagedStripped/{buildTarget}/` 中构建期 DLL **不一致**。

**处理：** 仅使用 `Library/LeanCLR/ManagedStripped/{buildTarget}/` 中与本次 Player 构建一致的裁剪 DLL。**不要**使用 `Library/LeanCLR/CompileDlls/`（该目录供 [热更新](./hot-update) 编译 DLL，与 lazy load 无关）。

### 多线程相关崩溃

当前版本为单线程。检查是否有 `Task.Run`、线程池或原生插件并发回调进入托管代码。

## 性能与包体

### wasm 仍然偏大

1. 编写 `aot.xml`，对大程序集设 `aot="0"` 默认排除
2. 使用 [PGO](./pgo) 仅对热点方法生成 `pgo-aot.xml` 追加 AOT
3. 评估 `lazyLoadedAssemblyNames` 延迟加载非首包程序集

### 性能不如预期

- 确认热点路径是否已 AOT（查看 `MethodMap.tsv` 或开启 profiling）
- 社区版 LeanAOT 对泛型方法、含 EH 的方法不 AOT，见 [社区版与商业版](../../aot/community-vs-commercial)

## 获取帮助

- [Discord](https://discord.gg/esAYcM6RDQ)
- QQ 群：1047250380
- 邮箱：leanclr@code-philosophy.com
- [GitHub Issues — leanclr-unity](https://github.com/focus-creative-games/leanclr-unity/issues)

报告问题时请附上 Unity 版本、目标平台、LeanCLR 包版本（或 git commit）、完整构建日志与最小复现步骤。
