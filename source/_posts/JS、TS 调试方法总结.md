---
title: JS/TS 调试方法总结
date: 2024-07-29 22:26:23
tags: 源代码分析

---

对于 `js` 文件：

- 运行命令：`node xx.js`
- 调试命令（需要 IDE 的配合， 以 vscode 为例）：
  - 开启 `ctrl+shift+p` 开启 `auto attach`， 启动程序后自动 attach debugger process 到 nodejs process
  - 在专门的`js debug` 控制台运行程序（JavaScript Debug Terminal）
  - 设置 `launch.json` 配置，通过侧边栏 debug 功能选择配置启动调试

对于 `ts` 文件：

- 运行命令： `tsx xx.ts`
- 调试命令（需要有文件对应的 `source map` 文件，作为中间层，把 js 代码的执行状态传回 ts 文件）：
  - 具体操作为 `tsc --sourceMap xx.ts，生成对应的 js 和 map` 文件，就直接可以 `F5`调试了
  - 使用 `tsx` [调试文件](https://tsx.is/vscode#setup)， 
  - 对于特定的框架，比如 `vitest` ，内置了相关的支持，查看文档，添加相应的配置即可

坑点（关于[`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)）：

- 对于 `tsc`，不指定文件，则使用当前目录下的 `tsconfig.json`, 如果指定特定的文件进行编译， 那么不使用当前目录下的 `tsconfig.json`；（不知道为什么这样设计）

