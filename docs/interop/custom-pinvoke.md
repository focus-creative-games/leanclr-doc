# 自定义 P/Invoke

LeanCLR 支持自定义 **P/Invoke**，在托管 C# 与原生 C++ 之间互操作。为保持跨平台可移植性，P/Invoke 目标目前须为 **AOT 编译的原生函数**；在 IL→AOT 工具链完全自动化之前，**需手动注册**原生实现。

示例工程：

- `src/samples/custom-pinvoke-x64` — Windows x64
- `src/samples/custom-pinvoke-wasm` — WebAssembly

## 概述

流程两步：

1. 在 C# 中声明 `extern` P/Invoke 方法
2. 在 C++ 中实现原生函数，并在运行时 **`register_pinvoke_func`** 注册 invoker

## C# 侧定义

```csharp
using System.Runtime.InteropServices;

namespace test
{
    public class CustomPInvoke
    {
        [DllImport("CustomNativeLib.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Add(int a, int b);
    }
}
```

:::note
由于绑定靠手动注册，`DllImport` 的 DLL 名与 `CallingConvention` 目前为**占位符**，不影响实际绑定。
:::

## C++ 侧注册

### 包含头文件

```cpp
#include "public/leanclr.hpp"
// C 项目可用 #include "public/leanclr.h"
```

### 实现原生函数

```cpp
int32_t my_add(int32_t a, int32_t b)
{
    return a + b;
}
```

### 编写 Invoker

LeanCLR 通过固定签名的 **invoker** 从托管栈取参并写回返回值：

```cpp
RtResultVoid my_add_invoker(metadata::RtManagedMethodPointer,
                            const metadata::RtMethodInfo*,
                            const interp::RtStackObject* params,
                            interp::RtStackObject* ret)
{
    size_t offset = 0;
    auto a = RuntimeApi::get_argument<int32_t>(params, offset);
    auto b = RuntimeApi::get_argument<int32_t>(params, offset);
    int32_t result = my_add(a, b);
    RuntimeApi::set_return_value<int32_t>(ret, result);
    RET_VOID_OK();
}
```

Invoker 签名必须为：

```cpp
RtResultVoid (metadata::RtManagedMethodPointer,
              const metadata::RtMethodInfo*,
              const interp::RtStackObject* params,
              interp::RtStackObject* ret)
```

- `get_argument<T>(params, offset)` — `offset` 为栈槽偏移，结构体参数可能占多槽
- `set_return_value<T>(ret, value)` — 写回返回值
- `RET_VOID_OK()` — 返回成功

### 注册

在 **`vm::Runtime::initialize()` 成功之后**：

```cpp
void RegisterCustomPInvokeMethods()
{
    RuntimeApi::register_pinvoke_func(
        "[CoreTests]test.CustomPInvoke::Add(System.Int32,System.Int32)",
        (vm::PInvokeFunction)&my_add,
        my_add_invoker);
}

int main()
{
    auto ret = vm::Runtime::initialize();
    if (ret.is_err()) return -1;

    RegisterCustomPInvokeMethods();
    // ...
}
```

**签名字符串格式：**

```text
[<dll>]<fullname>::<method>(T1,T2,...,TN)
```

无冲突时可省略 `[dll]` 前缀，使用短形式 `<fullname>::<method>(...)`。

参数：

| 参数 | 说明 |
|------|------|
| signature | 与 C# 声明一致，含命名空间、类型、方法名、参数类型 |
| pinvoke_func | 原生实现指针 |
| pinvoke_invoker | 上述 invoker |

## 最佳实践

- 在 `initialize` **之后**注册
- 签名字符串与 C# 元数据严格一致
- 使用 `RuntimeApi` 辅助函数访问栈，避免手工算偏移
- WASM 平台注意 `__Internal` 与 JS 胶水，见 [P/Invoke 示例](./pinvoke-samples)

## LeanAOT 自动生成（展望）

LeanAOT  toolchain 发展后，部分 P/Invoke 包装可由 AOT 自动生成。当前以手动注册为准。

## 相关文档

- [P/Invoke 示例](./pinvoke-samples)
- [嵌入 LeanCLR](../integration/embed-leanclr)
- [AOT 工作流](../aot/workflow)
