---
title: Node 模块系统介绍
date: 2024-07-24 16:26:23
tags: 源代码分析
---



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

今天又被模块系统坑了一把，所有来做个总结