# P/Invoke 示例

仓库内提供两个可直接构建的自定义 P/Invoke 示例。

## 示例索引

| 示例 | 路径 | 平台 |
|------|------|------|
| **custom-pinvoke-x64** | `leanclr/src/samples/custom-pinvoke-x64` | Windows x64 |
| **custom-pinvoke-wasm** | `leanclr/src/samples/custom-pinvoke-wasm` | WebAssembly |

机制说明见 [自定义 P/Invoke](./custom-pinvoke)。

## Windows x64 示例

### 相关文件

- `main.cpp` — 注册 `my_add` 与 invoker
- `src/tests/managed/CoreTests/CustomPInvoke.cs` — C# `DllImport` 声明

### 构建与运行

```bat
cd leanclr\src\samples\custom-pinvoke-x64
build.bat
```

在 Visual Studio 中打开生成解决方案亦可。运行后通过 P/Invoke 调用原生 `my_add` 并校验结果。

### 要点

- 使用 `RuntimeApi::register_pinvoke_func` 绑定签名 `[CoreTests]test.CustomPInvoke::Add(System.Int32,System.Int32)`
- 先 `Runtime::initialize()`，再注册

## WebAssembly 示例

### 要点

- 原生函数可通过 Emscripten 导出，签名为 `__Internal`
- `AotTests` 中含 `TC_PInvoke.cs` 等 WASM P/Invoke 用例（`#if IL2CPP_ONLY`）
- 需配合 JS 侧模块加载与 `leanclr_test_pinvoke.js` 等胶水

### 构建

```bat
cd leanclr\src\samples\custom-pinvoke-wasm
build-wasm.bat
```

具体步骤以样本目录 README 与 `src/tests/aot-tester` 为准。

## 与测试工程的关系

`CoreTests/CustomPInvoke.cs` 也被 Corlib / 解释器测试引用；AOT 路径下见 `AotTests/TC_PInvoke.cs`。

编写新 P/Invoke 时，建议先在 x64 样本验证注册与签名，再移植到 WASM。

## 下一步

- [自定义 P/Invoke](./custom-pinvoke) — 逐步说明
- [WebAssembly 构建](../integration/wasm)
