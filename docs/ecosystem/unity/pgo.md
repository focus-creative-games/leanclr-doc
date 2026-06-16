# Unity 中的 PGO

**Profile Guided AOT（PGO）** 根据运行时采集的调用统计，将热点方法写入 **`pgo-aot.xml`**，在后续构建中**追加** AOT 编译（与 `aot.xml` 的包含 / 排除策略配合）。

完整技术说明见 [Profile Guided AOT](../../aot/pgo)。本页仅描述 Unity 侧操作步骤。

## 启用 Profile 采集

1. 打开 **LeanCLR Settings → Lean AOT**
2. 开启 **`enablePgoProfile`**
3. 发布一个 **Development / Profiling** 构建（WebGL 或目标小游戏平台）

该构建会在生成代码中插入 profile 桩，用于记录每个方法的 `calls` 与 `cost`。

## 导出 Profile 数据

在代表性游戏流程（加载、战斗、UI 等）运行后，调用托管 API 导出 JSON：

| API | 说明 |
|-----|------|
| `LeanCLR.Profile.ExportGlobalStatsJson(path)` | 导出累计统计到文件 |
| `LeanCLR.Profile.GetGlobalStatsJson()` | 获取 JSON 字符串 |
| `LeanCLR.Profile.ExportPeriodStatsJson(path)` | 导出当前周期统计 |

插件包内可参考 **`LeanClrPgoGui.cs`** 示例：在 `persistentDataPath/LeanCLR-PGO/` 下按会话保存 `global-*.json`。

### WebGL / 小游戏

无法直接写本地文件时：

1. 调用 `LeanCLR.Profile.GetGlobalStatsJson()` 取得 JSON 字符串
2. 通过 HTTP 上传到服务器，或复制到开发机落盘为 `.json`

## 生成 pgo-aot.xml

使用包内 **`LeanCLR~/pgo2aot/`** 目录下的 `pgo2aot.dll`（亦可用 leanclr 仓库构建产物）：

```bat
dotnet pgo2aot.dll --input global.json --output pgo-aot.xml --strategy pareto --pareto-ratio 0.8
```

- 输出文件名统一使用 **`pgo-aot.xml`**
- 格式与 `aot.xml` **不同**，勿混用
- 可多次 `--input` 合并多个会话 JSON

策略选择见 [Profile Guided AOT](../../aot/pgo)。

## 应用 PGO 规则并正式发包

1. 将 `pgo-aot.xml` 放到工程内（如 `Assets/LeanCLR/pgo-aot.xml`）
2. 在 **Lean AOT → pgoRuleFiles** 中添加该路径
3. **关闭** `enablePgoProfile`
4. 发布正式 Player 构建

## 推荐策略组合

| 文件 | 典型用途 |
|------|----------|
| `aot.xml` | 对大程序集设 `aot="0"`，默认尽量少 AOT |
| `pgo-aot.xml` | 由 profile 精确列出热点方法，**追加** AOT |

PGO 规则**仅追加**（off → on），不会取消 `aot.xml` 已包含的方法。详见 [Profile Guided AOT](../../aot/pgo)。
