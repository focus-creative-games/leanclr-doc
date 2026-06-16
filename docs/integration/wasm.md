# WebAssembly 构建

**lean-wasm** 将 LeanCLR 运行时编译为 WebAssembly，使 .NET 程序集可在浏览器中执行。

源码：`leanclr/src/samples/lean-wasm`

## lean-wasm 概述

构建产物：

| 文件 | 说明 |
|------|------|
| `lean.js` | Emscripten 胶水代码与模块加载器 |
| `lean.wasm` | LeanCLR 运行时 WASM 二进制 |

特性：

- 通过 JavaScript `ccall` / `cwrap` 与 WASM 交互
- 支持 `ALLOW_MEMORY_GROWTH` 动态扩容
- 需由 JS 侧提供程序集字节（`load_assembly_file` 回调）

:::note 与 Unity WebGL 的区别
本页描述**裸 WASM 嵌入**。Unity 项目请使用 [leanclr-unity](../ecosystem/unity/)，无需手动构建 lean-wasm。
:::

## 环境准备

| 工具 | 要求 |
|------|------|
| **CMake** | 3.15+ |
| **Ninja** | 推荐 |
| **Emscripten SDK** | `emsdk install latest && emsdk activate latest` |

安装 emsdk 后，**每次构建前**在当前终端激活环境：

```bat
emsdk_env.bat
```

```bash
source ./emsdk_env.sh
```

验证：`emcc --version`

## 构建步骤

```bat
cd leanclr\src\samples\lean-wasm
build-wasm.bat
```

脚本执行 `emcmake cmake` 配置 + `emmake cmake --build` 编译。

### 构建输出

```text
build-wasm/bin/
├── lean.js
└── lean.wasm
```

## 在浏览器中运行

### 1. 引入模块

```html
<script src="lean.js"></script>
```

### 2. 初始化 Module

```javascript
let Module = null;
const assemblyCache = {};

const moduleConfig = {
  print: (text) => console.log(text),
  printErr: (text) => console.error(text),
};

createStartupModule(moduleConfig).then((Module_) => {
  Module = Module_;

  Module.load_assembly_file = function (namePtr, bufPtr, sizePtr) {
    const view = Module.HEAPU8;
    let end = namePtr;
    while (view[end] !== 0) end++;
    const name = new TextDecoder('utf-8').decode(view.slice(namePtr, end));

    const data = assemblyCache[name];
    if (!data) return 1;

    const ptr = Module._malloc(data.length);
    Module.HEAPU8.set(data, ptr);
    Module.setValue(bufPtr, ptr, '*');
    Module.setValue(sizePtr, data.length, 'i32');
    return 0;
  };
});
```

### 3. 预加载程序集

```javascript
async function loadAssembly(url, cacheName) {
  const buf = await (await fetch(url)).arrayBuffer();
  assemblyCache[cacheName] = new Uint8Array(buf);
}

await loadAssembly('mscorlib.dll.bytes', 'mscorlib');
await loadAssembly('YourApp.dll.bytes', 'YourApp');
```

### 4. 初始化运行时并调用

```javascript
const initResult = Module.ccall('initialize_runtime', 'number', [], []);
if (initResult !== 0) throw new Error('init failed');

const loadAssemblyFn = Module.cwrap('load_assembly', 'number', ['string']);
const asm = loadAssemblyFn('YourApp');

const invoke = Module.cwrap('invoke_method', 'number', ['number', 'string', 'string']);
invoke(asm, 'Namespace.ClassName', 'MethodName');
```

## 导出函数

| C 函数 | 说明 |
|--------|------|
| `_initialize_runtime` | 初始化 LeanCLR |
| `_load_assembly` | 按名称加载程序集 |
| `_invoke_method` | 调用托管方法 |

## Demo

[leanclr-demo](https://github.com/focus-creative-games/leanclr-demo) 的 **h5** 目录提供可运行的预构建 Demo；`lean-wasm/h5/` 也可能包含本地示例文件。

## 故障排除

| 问题 | 处理 |
|------|------|
| `emcmake` 未找到 | 运行 `emsdk_env` |
| CMake 版本过低 | 升级到 3.15+ |
| 内存不足 | 构建已启用 `ALLOW_MEMORY_GROWTH`；检查程序集总大小 |
| `file://` 打开失败 | 必须通过 HTTP 服务访问页面 |

更完整的嵌入说明见 [嵌入 LeanCLR](./embed-leanclr)。
