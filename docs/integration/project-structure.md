# 项目结构

## 仓库顶层布局

```text
leanclr/
├── src/
│   ├── runtime/       # LeanCLR 运行时核心（C++）
│   ├── libraries/     # BCL（mscorlib、System 等）
│   ├── leanaot/       # LeanAOT 编译器（C#）
│   ├── tools/         # lean、pgo2aot 等命令行工具
│   ├── samples/       # 集成示例（startup、lean-wasm 等）
│   └── tests/         # C++ runner + 托管测试
├── scripts/           # 构建、测试、发布脚本
├── licenses/          # 第三方许可
└── out/               # 所有构建输出（默认位置）
```

:::info 文档位置
项目文档已迁移至 [https://doc.leanclr.com](https://doc.leanclr.com)。主仓库 `docs/` 目录将逐步移除。
:::

面向最终用户的独立 Demo 见 [leanclr-demo](https://github.com/focus-creative-games/leanclr-demo)。

## 运行时核心（src/runtime）

| 目录 | 说明 |
|------|------|
| **metadata** | ECMA-335 元数据解析（PE/COFF、CLI 表） |
| **vm** | 虚拟机核心：类型系统、方法调用、程序集加载 |
| **interp** | IL / IR 解释器 |
| **gc** | 准确式 mark-sweep 垃圾回收 |
| **icalls** | internal call 实现 |
| **alloc** | 元数据与托管对象分配 |
| **intrinsics** | 内建方法 |
| **os** | 操作系统抽象（Standard 版） |
| **utils** | 工具函数 |
| **platform** | 平台相关实现 |

运行时以 **C++11** 编译，CMake 目标名为 `leanclr`（静态库）。

## libraries

`src/libraries` 提供运行时所需的 .NET Framework 4.x 核心库：

- `mscorlib.dll`
- `System.dll`
- `System.Core.dll`

另有 `dotnetframework4.x`、`dotnetframework4.x-linux` 等变体目录。已验证范围见 [兼容性说明](../intro/compatibility)。

## tools

| 工具 | 路径 | 说明 |
|------|------|------|
| **lean** | `src/tools/lean` | 内嵌 CLR 的命令行 runner |
| **pgo2aot** | `src/tools/pgo2aot` | Profile JSON → `pgo-aot.xml` |
| **LeanAOT** | `src/leanaot` | IL → C++ AOT 编译器 |

## samples

| 示例 | 说明 |
|------|------|
| **startup** | Win64 最小嵌入 |
| **lean-wasm** | 浏览器 WASM |
| **custom-pinvoke-x64 / wasm** | 自定义 P/Invoke |
| **simple-aot** | AOT 生成 C++ 并链接 |

## tests

| 目录 | 说明 |
|------|------|
| **basic-tester** | C++ 测试 runner（CoreTests、CorlibTests、ILTests） |
| **aot-tester** | AOT 正确性测试 |
| **managed/** | C# 测试工程（CoreTests、AotTests 等） |

详见 [测试指南](../development/testing)。

## scripts 与 out/

- **`scripts/`** — 仓库级构建入口，见 [脚本参考](./scripts-reference)
- **`out/`** — 构建产物根目录，见 [输出目录结构](./output-layout)

## 外部仓库

| 仓库 | 说明 |
|------|------|
| [leanclr-unity](https://github.com/focus-creative-games/leanclr-unity) | Unity 插件 |
| [leanclr-demo](https://github.com/focus-creative-games/leanclr-demo) | 独立体验 Demo |
| [leanclr-godot](https://github.com/focus-creative-games/leanclr-godot) | Godot 扩展（开发中） |
