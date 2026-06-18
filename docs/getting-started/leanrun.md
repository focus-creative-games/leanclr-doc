# leanrun 命令行工具

## 工具概述

**leanrun** 是内嵌 LeanCLR 运行时的命令行工具，可直接加载 .NET 程序集（`.dll`）并执行入口方法，**无需**在本机安装完整 .NET 运行时。

> 原工具名 **lean** 已更名为 **leanrun**。

适用场景：

- 快速验证程序集能否在 LeanCLR 上运行
- 本地冒烟测试（非替代 `dotnet run` 进行日常开发）

```text
leanrun [options] <dll_name> [-- <dll_args>...]
```

## 构建与安装

源码位于 `leanclr/src/tools/leanrun/`。构建方式：

```bat
cd src\tools\leanrun
build.bat
```

或通过仓库脚本间接构建（`src/tools/leanrun/build.*` 转发到 `scripts/`）。构建成功后，在 `out/cmake/` 对应目录下找到 `leanrun.exe`（Windows）或可执行文件（Unix）。

构建 LeanCLR 运行时本身见 [构建运行时](./build-runtime)。

## 基本用法

### 选项

| 选项 | 说明 |
|------|------|
| `-l, --lib-dir <dir>` | 添加程序集搜索路径（可重复） |
| `-e, --entry <entry>` | 指定入口，格式 `Namespace.Type::Method` |
| `-h, --help` | 帮助信息 |

### 示例

```bat
leanrun -l libraries\dotnetframework4.x -l out\dotnet\CoreTests\Debug CoreTests -e Tests.CSharp.App::Main
```

- 第一个非选项参数为程序集名（**不带** `.dll` 后缀）
- `--` 之后的参数会转发给目标程序集

### 典型工作流

1. 用 `dotnet build` 编译你的 C# 项目为 .dll
2. 用 `leanrun` 指定 `-l` 指向 BCL 与依赖目录
3. 观察输出，确认 LeanCLR 兼容性

:::note
日常 C# 开发仍应使用 .NET SDK；`leanrun` 用于验证「发布到 LeanCLR 后能否运行」。
:::
