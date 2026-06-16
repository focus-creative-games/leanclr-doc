# P/Invoke 示例

仓库内提供可构建的自定义 P/Invoke 参考示例 **`custom-pinvoke-x64`**（`leanclr/src/samples/custom-pinvoke-x64`）。

P/Invoke 的 C# 声明、`register_pinvoke_func` 与 invoker 写法**各平台相同**；该样本在 Windows x64 上演示完整流程，其他平台可照搬注册逻辑，仅原生链接与宿主启动方式不同。

机制说明见 [自定义 P/Invoke](./custom-pinvoke)。

## 相关文件

- `main.cpp` — 注册 `my_add` 与 invoker
- `src/tests/managed/CoreTests/CustomPInvoke.cs` — C# `DllImport` 声明

## 构建与运行

```bat
cd leanclr\src\samples\custom-pinvoke-x64
build.bat
```

亦可在 Visual Studio 中打开生成解决方案。运行后通过 P/Invoke 调用原生 `my_add` 并校验结果。

## 要点

- 使用 `RuntimeApi::register_pinvoke_func` 绑定签名 `[CoreTests]test.CustomPInvoke::Add(System.Int32,System.Int32)`
- 先 `vm::Runtime::initialize()` 成功，再注册 P/Invoke
- 上述顺序与 API 适用于所有 LeanCLR 目标平台

## 与测试工程的关系

`CoreTests/CustomPInvoke.cs` 也被解释器路径测试引用；AOT 相关用例见 `AotTests/TC_PInvoke.cs` 等。

## 下一步

- [自定义 P/Invoke](./custom-pinvoke) — 逐步说明
- [嵌入 LeanCLR](../integration/embed-leanclr)
