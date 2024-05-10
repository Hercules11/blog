---
title: p-limit 源代码分析
date: 2024-05-10 00:26:23
tags: 源代码分析
---

之前在狼叔的了不起的Nodejs 书中接触到这个库，了解了一下，觉得很有意思。虽然实际工作中没有接触过大量并发的业务，但是了解一下极端情况下JS异步任务的调度也是挺不错的。

下面是智普清言的介绍：

> `p-limit` 是一个 Node.js 和浏览器都支持的库，用于限制并发执行的数量。它基于 `p-queue`，是一个用于控制异步任务队列的库，可以确保同时只有指定数量的异步操作在进行。
> 以下是一些可能使用 `p-limit` 的情况：
>
> 1. **限制并发请求数量**：在进行大量异步网络请求（例如使用 `fetch` 或 `axios`）时，为了避免服务器过载或达到API限制，可以使用 `p-limit` 来限制同时发出的请求数量。
> 2. **资源密集型任务**：当执行一些CPU或内存密集型的任务时，如果同时运行太多的任务可能会影响系统性能，使用 `p-limit` 可以确保系统资源得到合理分配。
> 3. **文件处理**：在处理大量文件读写操作时，为了防止磁盘I/O成为瓶颈，可以使用 `p-limit` 来限制并发文件操作的数量。
> 4. **数据库操作**：在进行数据库批量操作时，为了避免过多的并发连接导致数据库响应缓慢或超时，可以使用 `p-limit` 来限制并发数据库操作的数量。
> 5. **API节流**：如果你正在开发一个需要调用第三方服务API的应用，并且该API对请求频率有限制，使用 `p-limit` 可以帮助你控制请求的速率，避免触发API的限制。
> 6. **提高成功率**：在某些情况下，限制并发数可以提高任务的成功率，因为减少了同时操作可能导致的冲突或错误。
> 使用 `p-limit` 可以帮助你更好地控制异步流程，确保系统的稳定性和性能。它通过创建一个限制器实例，并指定最大并发数，然后使用这个限制器来包装异步任务，从而实现并发控制。

下面是核心代码：

```js
import Queue from 'yocto-queue'; // 一个双端队列
import {AsyncResource} from '#async_hooks'; // 提供简单的函数 bind 操作

export default function pLimit(concurrency) {
	if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up');
	} // 参数校验，必须为正整数

	const queue = new Queue();
	let activeCount = 0;

		const next = () => {
		activeCount--;

		if (queue.size > 0) {
			console.log("next 前");
			queue.dequeue()(); // 开始执行第二个任务， run
			console.log("next 后");
		}
	};

	const run = async (function_, resolve, arguments_) => {
		activeCount++;

		console.log("res 前", function_.toString());
		const result = (async () => function_(...arguments_))();
		console.log("res 后", function_.toString());

		resolve(result);

		try {
			console.log("await 前", function_.toString()); // Promise.all 将第一个异步任务执行到这
			await result;
			console.log("await 后", function_.toString()); // 发现二、三都执行不了的时候，主线程又回到这里继续执行第一个
		} catch {}

		next();
	};

	const enqueue = (function_, resolve, arguments_) => {
		console.log("已经入队", function_.toString());
		queue.enqueue(
			AsyncResource.bind(run.bind(undefined, function_, resolve, arguments_)),
		);

		console.log("异步开启", function_.toString());
		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
			// when the run function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
			console.log("异步前", function_.toString());
			await Promise.resolve(); // 首先三个注册的异步任务都会指定到这个 await , 保存执行栈，后面的代码放到微任务队列。
			console.log("异步后", function_.toString());

			console.log("已经执行", function_.toString()); // 当 Promise.all 执行第二、三个任务的时候，由于并发数量限制，所以又停在这里
			if (activeCount < concurrency && queue.size > 0) {
				console.log("准备出队", function_.toString());
				queue.dequeue()();
			}
		})();
	};

	const generator = (function_, ...arguments_) => new Promise(resolve => {
		enqueue(function_, resolve, arguments_);
	}); // 把异步任务包装成 Promise, 把改变 Promise 状态的 resolve 和函数、参数入队

	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount,
		},
		pendingCount: {
			get: () => queue.size,
		},
		clearQueue: {
			value() {
				queue.clear();
			},
		},
	}); // 定义获取生成器的运行状态信息的函数

	return generator;
}
```



日志打印结果：

```js
已经入队 () => fetchSomething('foo')
异步开启 () => fetchSomething('foo')
异步前 () => fetchSomething('foo')
已经入队 () => fetchSomething('bar')
异步开启 () => fetchSomething('bar')
异步前 () => fetchSomething('bar')
已经入队 () => doSomething()
异步开启 () => doSomething()
异步前 () => doSomething()
All Promise 前
异步后 () => fetchSomething('foo')
已经执行 () => fetchSomething('foo')
准备出队 () => fetchSomething('foo')
res 前 () => fetchSomething('foo')
res 后 () => fetchSomething('foo')
await 前 () => fetchSomething('foo')
异步后 () => fetchSomething('bar')
已经执行 () => fetchSomething('bar')
异步后 () => doSomething()
已经执行 () => doSomething()
await 后 () => fetchSomething('foo')
next 前
res 前 () => fetchSomething('bar')
res 后 () => fetchSomething('bar')
await 前 () => fetchSomething('bar')
next 后
await 后 () => fetchSomething('bar')
next 前
res 前 () => doSomething()
res 后 () => doSomething()
await 前 () => doSomething()
next 后
await 后 () => doSomething()
All Promise 后
[ undefined, undefined, undefined ]
foo
bar
doSomething
```

总结就是对嵌套调用的 async await ，await 调用的表达式，必须执行完整，才会往下执行。对于内部 await 阻塞的语句，会先执行可以执行的。被称为主线程代码（相对来说）。

```js
const asyncFunc1 = async () => {
    console.log("async1 before");
    await Promise.resolve((async () => {
        console.log("promise before")
        await Promise.resolve("test");
        console.log("promise after")
    })());
    console.log("async1 after")
}


const asyncFunc2 = () => {
    console.log("async2 before");
    asyncFunc1();
    console.log("async2 after")
}


const asyncFunc3 = async () => {
    console.log("async3 before");
    await Promise.resolve("test")
    await asyncFunc2();
    console.log("async3 after")
}

await asyncFunc3();
console.log("main func")
```

打印结果：

```js
async3 before
async2 before
async1 before
promise before
async2 after
promise after
async3 after
async1 after
main func
```

疑问： async3 为什么在 async1之前？