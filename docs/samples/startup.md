# startup 示例

`src/samples/startup` 是仓库内**最小的 Win64 嵌入示例**：链接 `leanclr` 静态库、注册文件加载器、初始化运行时并加载 mscorlib。

完整 API 说明见 [第一个嵌入示例](../getting-started/first-embed) 与 [嵌入 LeanCLR](../integration/embed-leanclr)。

## 示例说明

- **`main.cpp`** — `assembly_file_loader`、`Runtime::initialize()`、`Assembly::get_corlib()`
- **`CMakeLists.txt`** — `add_subdirectory(../../runtime)` 并链接 `leanclr`

## 构建与运行

### 命令行（推荐）

```bat
cd leanclr\src\samples\startup
build.bat
```

Linux / macOS：

```bash
cd leanclr/src/samples/startup
./build.sh
```

可执行文件通常在 `build/bin/` 或 `build/Debug/` 下（取决于生成器与配置）。

### Visual Studio

```bat
cd leanclr\src\samples\startup
generate-vs-sln.bat
```

在 VS 中打开生成的解决方案，将 `startup` 设为启动项目并编译运行。

## 运行要求

- 已构建 LeanCLR 运行时（`build.bat` 会一并构建 runtime）
- 运行目录下可找到 BCL，例如 `libraries/dotnetframework4.x/mscorlib.dll`（startup 会尝试从相对 `samples` 的路径解析 `libraries/`）

成功时控制台输出 corlib 加载成功信息。

## 下一步

- 扩展为加载业务程序集：在 `initialize` 后调用 `Assembly::load_by_name`
- 接入 LeanAOT：见 [AOT 工作流](../aot/workflow)
