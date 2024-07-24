---
title: Node 模块系统介绍
date: 2024-07-24 16:26:23
tags: 源代码分析
---


今天又被模块系统坑了一把，所有来做个总结。
```ts
namespace SynchronousExecution {
	function greet(): void {
		const readlineSync = require("readline-sync");

		let name: string = readlineSync.question("What is your name? ");
		console.log(`Hi ${name}!`);
	}
	function weather(): void {
		const open = require("open").default; // 需要加个默认
		console.log(open);
		open("https://www.weather.com/");
	}

	greet();
	weather();
}

```



先看下面这张图，

![Node module](/blog/images/Node-rules.jpg)

首先确定当前文件使用的模块系统。

其次来看 Node 的官方文档，对 CommonJS 和 ES module 的介绍。

Node.js 把有下面这些特征的文件看作是 [CommonJS modules](https://nodejs.org/api/modules.html)：

- 有 `.mjs` 文件拓展名的
- 有 `.js` 文件拓展名，并且最近的父级 `package.json` 文件包含顶层的字段 `type`，值为`commonjs`
- 详情见文档说明

-------

ES module 和 CommonJS 的互相操作：

在 CommonJS 模块内部，可以使用动态 import() 来载入 ES modules，或者使用 require 同步载入 ES modules（前提是开启 --experimental-require-module），module.exports 对象作为 default export。

在 ES modules 模块内部，可以直接导入 CommonJS 模块。

ES modules 和 CommonJS 主要区别：

- ES modules 没有 require，exports 和 module.exports
- ES modules 没有 _filename 和 _dirname，取而代之的是 import.meta.filename，和 import.meta.dirname
- ES modules 没有 Addon Loading，替代方案为 module.createRequire() 或 process.dlopen
- ES modules 没有 require.resolve，取而代之的是 import.meta.resolve.