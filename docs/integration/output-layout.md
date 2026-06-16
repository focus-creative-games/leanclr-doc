# 输出目录结构

## out/ 总览

LeanCLR 约定**所有构建与中间产物**写入仓库根目录下的 `out/`，保持 `src/` 源码树干净。

可通过环境变量覆盖根路径：

```text
LEANCLR_OUT_ROOT=<自定义路径>
```

未设置时默认为仓库根目录下的 `out/`。

```text
out/
├── cmake/<module>/<Config>-<Arch>/   # CMake 构建树与原生二进制
└── dotnet/<ProjectName>/<Config>/    # .NET 程序集输出
```

清理全部输出：

```bat
scripts\dev\clean-out.bat
```

```bash
./scripts/dev/clean-out.sh
```

## cmake 输出树

| 模块 | 典型路径 | 产物 |
|------|----------|------|
| **runtime** | `out/cmake/runtime/Release-x64/` | `leanclr.lib` / `libleanclr.a` |
| **tests/basic-tester** | `out/cmake/tests/basic-tester/Debug-x64/bin/Debug/` | `test.exe` |
| **tests/aot-tester** | `out/cmake/tests/aot-tester/Release-x64/` | `aot-tester` 可执行文件 |
| **tests/aot-tester (wasm)** | `out/cmake/tests/aot-tester/Release-wasm/` | WASM 版 aot-tester |

架构名（`x64`、`x86`、`wasm` 等）随平台与 CMake 配置变化。

### 示例：运行时静态库

Windows x64 Release：

```text
out/cmake/runtime/Release-x64/runtime_build/Release/leanclr.lib
```

## dotnet 输出树

由根目录 `Directory.Build.props` 统一配置输出路径：

```text
out/dotnet/<ProjectName>/<Config>/net8.0/
```

| 项目 | 说明 |
|------|------|
| **LeanAOT** | AOT 编译器 CLI |
| **Pgo2Aot** | `pgo2aot.dll` |
| **CoreTests** / **AotTests** 等 | 托管测试程序集 |

示例：

```text
out/dotnet/LeanAOT/Release/net8.0/LeanAOT.dll
out/dotnet/Pgo2Aot/Release/net8.0/pgo2aot.dll
out/dotnet/CoreTests/Debug/CoreTests.dll
```

## 与样本项目的关系

部分样本（如 `src/samples/startup`）默认在本地 `build/` 下生成工程文件，仍通过 CMake 链接 `src/runtime`；仓库级脚本则将产物集中到 `out/`。

集成预编译库时，请指向 `out/cmake/runtime/...` 下的实际路径，而非 `src/runtime/build`（旧布局）。
