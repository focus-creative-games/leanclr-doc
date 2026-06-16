# 测试框架

## 目录结构

```text
tests/
├── basic-tester/          # C++ runner（CI）
├── aot-tester/            # AOT runner
├── managed/
│   ├── managed.sln
│   ├── Common/            # Assert、[UnitTest]、TestCaseBase
│   ├── SharedTests/       # 共享源，链入 CoreTests / AotTests
│   ├── CoreTests/         # CLR / IL / C# 语义
│   ├── CorlibTests/       # BCL icall / intrinsic
│   ├── AotTests/          # LeanAOT 专有
│   ├── ILTests/           # .il + wrapper
│   └── RunTests/          # C# 反射 runner（本地）
└── TESTING.md             # 仓库内简短索引（指向文档站）
```

## 测试项目职责

| 项目 | 测什么 | 不应放什么 |
|------|--------|------------|
| **CoreTests** | 解释器、IL（C# 可写）、C# 特性、回归 | BCL icall 细节、AOT 链路专有 |
| **CorlibTests** | mscorlib / System：icall、intrinsic、P/Invoke | 纯 CLR 指令语义 |
| **ILTests** | C# 难构造的 IL（`.il` + ilasm） | 可用 C# 表达的用例 |
| **AotTests** | IL→C++ 后正确性 | 与 CoreTests 完全重复的指令测 |
| **Common** | 基础设施 | 测试用例本身 |

## Runner 发现规则

| 规则 | basic-tester | RunTests | AotTests.App |
|------|-------------|----------|--------------|
| 标记 | `[UnitTest]` | `[UnitTest]` | `[UnitTest]` |
| 签名 | `void`，无参 | 同左 | 同左 |
| static 方法 | **不支持** | 支持 | 支持 |
| 跳过 | 无 | `[IgnoreTest]` 类级 | 无 |
| 推荐基类 | `TestCaseBase` | 同左 | 多数未继承 |

## 编写测试

### 最小示例

```csharp
namespace Tests.CSharp
{
    class TC_MyFeature : TestCaseBase
    {
        [UnitTest]
        public void Addition()
        {
            Assert.Equal(3, 1 + 2);
        }
    }
}
```

- 类推荐命名 `TC_{主题}.cs`
- 方法：`public void`、无参、`[UnitTest]`
- basic-tester 要求**实例方法**（非 static）

### Assert API（Common）

| 方法 | 说明 |
|------|------|
| `Fail()` / `Fail(string)` | 立即失败 |
| `IsTrue` / `IsFalse` / `True` / `False` | 布尔 |
| `Null` / `NotNull` | 引用 |
| `Equal` / `NotEqual` | 值相等 |
| `EqualAny` | `Object.Equals` |

### 放置指南

| 场景 | 项目 | 目录 |
|------|------|------|
| IL 指令（C#） | CoreTests | `Instructions/` |
| C# 语言特性 | CoreTests | `Runtime/` |
| Bug 回归 | CoreTests | `Regression/` |
| Fixture | CoreTests | `Shared/Fixtures/` |
| BCL icall | CorlibTests | `InternalCall/` |
| 纯 IL asm | ILTests | `Instructions/*.il` + `Wrappers/` |
| 跨解释器+AOT 共享 | SharedTests | `Instructions/` 或 `Runtime/` |
| AOT 专有 | AotTests | 项目根目录 |

### CoreTests 目录（摘要）

```text
CoreTests/
├── Runtime/           # C# 语言特性
├── Instructions/      # IL 指令（Arithmetic、Branches…）
├── Regression/        # 历史 Bug
├── Shared/Fixtures/   # 辅助类型（namespace AOTDefs）
└── Bootstrap/         # C++ 引导测
```

### ILTests {#iltests}

1. 在 `ILTests/Instructions/` 添加 `.il`，程序集名须为 **`ILTests.Native`**
2. 在 `ILTests/Wrappers/` 添加 `TC_*.cs`，`[UnitTest]` 调用 IL 并断言
3. `dotnet build managed.sln` 会通过 ILAsm NuGet 编译 `.il`

产出：`ILTests.Native.dll` + `ILTests.dll`（wrapper）。

### AotTests 专有用例（示例）

| 文件 | 说明 |
|------|------|
| `TC_EvalStackNotEmpty.cs` | HL 转换 eval stack |
| `TC_StaticCtorOrder.cs` | 静态构造器顺序 |
| `TC_Call_AotInterp.cs` | AOT / 解释器混编 |
| `TC_PInvoke.cs` | P/Invoke 相关 |
| `TC_MonoPInvokeCallback.cs` | 回调 |

依赖 `AOTDefs` 的通用测试留在 **CoreTests**，由解释器路径执行。

## 相关文档

- [测试指南](./testing) — 构建与运行
- [开发脚本](./dev-scripts)
