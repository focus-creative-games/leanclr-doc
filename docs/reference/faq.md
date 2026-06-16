# 常见问题

## 通用

### LeanCLR 与 HybridCLR 是什么关系？

- **LeanCLR**：面向**发布期**的嵌入式 CLR，替换 IL2CPP 等后端，缩小包体与内存（尤其 WebGL / 小游戏）
- **HybridCLR**：Unity **全平台原生 C# 热更新**，与 LeanCLR 定位互补，可并存于不同需求

二者由同一团队维护，解决不同问题。

### LeanCLR 能替代桌面 .NET 做日常开发吗？

不能。LeanCLR **仅用于发布管线**，不适合作为本机 `dotnet run` 的开发期运行时。开发仍用 Unity / .NET SDK，发布时切换到 LeanCLR。

### 当前版本支持多线程吗？

对外 **Standard 版现为单线程**。多线程将在后续 Standard 演进中提供。请勿在发布产物中依赖多线程调用 CLR API。

## 构建与集成

### 构建产物在哪里？

统一在仓库根目录 `out/` 下，见 [输出目录结构](../integration/output-layout)。

### 嵌入 API 稳定吗？

尚未稳定。以 `src/samples/startup` 为准，关注版本更新说明。

### 最低 C++ 标准？

LeanCLR 运行时要求 **C++11**。

## AOT 相关

### 不传 aot.xml 时哪些方法会 AOT？

规则层**未匹配**的普通方法 **默认 AOT**。若只想 AOT 少量方法，须先对程序集设 `aot="0"` 再例外开启。见 [AOT 规则文件](../aot/rule-file)。

### aot.xml 与 pgo-aot.xml 区别？

- `aot.xml` — 手工包含/排除，支持通配符
- `pgo-aot.xml` — 机器生成，仅追加热点，**仅精确签名**

见 [Profile Guided AOT](../aot/pgo)。

### 社区版 LeanAOT 有哪些限制？

不支持泛型方法、含 EH 的方法、`extern` 方法的 AOT。见 [社区版与商业版](../aot/community-vs-commercial)。

## Unity 相关

### 安装后构建无变化？

确认 **LeanCLR Settings → Enable** 已开启，且目标为 WebGL / 小游戏等支持平台。

### PGO 输出文件叫什么？

统一命名为 **`pgo-aot.xml`**（Settings 中 `pgoRuleFiles` 指向该文件）。

### Win64 报 il2cpp init failed？

见 [Win64 注意事项](../ecosystem/unity/win64-notes)。

更多 Unity 问题：[Unity 常见问题](../ecosystem/unity/troubleshooting)。

## 获取帮助

- [Discord](https://discord.gg/esAYcM6RDQ)
- QQ 群：1047250380
- 邮箱：leanclr@code-philosophy.com
