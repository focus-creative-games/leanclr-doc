# 安装

## Package Manager 安装（推荐）

在 Unity 中打开 **Window → Package Manager**，点击 **+ → Add package from git URL...**，填入：

**默认安装最新版本（推荐）：**

```text
https://github.com/focus-creative-games/leanclr-unity.git
```

Gitee 镜像：

```text
https://gitee.com/focus-creative-games/leanclr-unity.git
```

不指定 `#tag` 时，Package Manager 将跟踪仓库默认分支的最新提交。

### 安装指定 Release 版本

若需锁定到某一发布标签，在 URL 末尾追加 `#标签名`：

```text
https://github.com/focus-creative-games/leanclr-unity.git#v1.0.0
```

请将 `v1.0.0` 替换为 [leanclr-unity Releases](https://github.com/focus-creative-games/leanclr-unity/releases) 页面上实际存在的 tag。

:::tip
生产项目可在验证通过后锁定 tag；日常开发可直接跟踪 `main` 获取最新修复。
:::

## 验证安装

1. 菜单栏出现 **LeanCLR → Settings...**（或 **Edit → Project Settings → LeanCLR**）
2. 确认 **Enable** 已勾选
3. 切换构建目标为 **WebGL**（或目标小游戏平台），执行一次 Development Build 冒烟

## 示例工程

参考 [leanclr-unity-demo](https://github.com/focus-creative-games/leanclr-unity-demo) 获取已配置好的示例项目。

下一步：[项目设置](./settings)。
