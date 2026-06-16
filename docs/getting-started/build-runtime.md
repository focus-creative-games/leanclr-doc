# 构建运行时

## 获取源码

```bash
git clone https://github.com/focus-creative-games/leanclr.git
cd leanclr
```

Gitee 镜像：`https://gitee.com/focus-creative-games/leanclr`

## 推荐方式：仓库级脚本

在仓库根目录执行（Windows）：

```bat
scripts\build.bat runtime Release
```

Linux / macOS：

```bash
./scripts/build.sh runtime Release
```

该命令在 `out/cmake/runtime/Release-x64/`（架构名随平台变化）下生成构建树，并编译 `leanclr` 静态库。

### 常用变体

| 命令 | 说明 |
|------|------|
| `scripts\build.bat runtime Debug` | Debug 构建 |
| `scripts\build.bat runtime Release x86` | 32 位 Windows |
| `scripts\build.bat runtime sln` | 仅生成 Visual Studio 解决方案，不编译 |

完整脚本说明见 [脚本参考](../integration/scripts-reference)。

## Windows 详细选项

也可进入 `src/runtime` 使用本地转发脚本：

```bat
cd src\runtime
build.bat Release
```

`build.bat` 支持：`Debug` / `Release`、`x86` / `x64`、`clean`、`shared`、`sln` 等参数。生成 VS 解决方案后，可在 `out/cmake/runtime/vs-sln-x64/` 打开 `leanclr.sln` 在 IDE 中编译。

### 手动 CMake（可选）

```bat
cd src\runtime
mkdir build
cd build
cmake -G "Visual Studio 17 2022" -A x64 ..
cmake --build . --config Release
```

## Linux / macOS

```bash
./scripts/build.sh runtime Release
# 或 CI 一键构建并测试：
./scripts/ci.sh Release
```

## 构建产物位置

Windows x64 Release 静态库示例路径：

```
out/cmake/runtime/Release-x64/runtime_build/Release/leanclr.lib
```

Linux / macOS 对应 `libleanclr.a`。所有构建输出均在仓库根目录 `out/` 下，**不会**污染 `src/` 源码树。目录规则见 [输出目录结构](../integration/output-layout)。

WebAssembly 产物路径不同，见 [WebAssembly 构建](../integration/wasm)。

## 常见问题

**CMake 找不到**

- 确认已安装并加入 PATH，安装后重启终端

**Visual Studio 生成器不可用**

- 安装 VS 2022 及「使用 C++ 的桌面开发」工作负载

**C++ 标准错误**

- LeanCLR 运行时要求 **C++11**，请确认编译器与 `CXX_STANDARD` 设置正确

**Emscripten 相关错误**

- 运行 `emsdk_env.bat`（或 `.sh`）后再构建 WASM 目标

下一步：[第一个嵌入示例](./first-embed) 或 [嵌入 LeanCLR 完整指南](../integration/embed-leanclr)。
