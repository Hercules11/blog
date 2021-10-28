---
title: bigfrontend 代码题(五)
date: 2021-10-23 20:11:13
tags: 做题
---

# 29. 实现async helper - sequence()

该题目和[11. 什么是Composition?实现pipe()](https://bigfrontend.dev/zh/problem/what-is-composition-create-a-pipe)有些类似。

请实现一个async helper - `sequence()`。`sequence()`像`pipe()` 那样将异步函数串联在一起。

本题目中的所有异步函数是如下interface。

```ts
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void
```

你的`sequence()`需要能接受一个**AsyncFunc 数组**，并且通过callback将之串联在一起。

假设我们有一个异步函数把数字乘以2

```js
const asyncTimes2 = (callback, num) => {
   setTimeout(() => callback(null, num * 2), 100)
}
```

`sequence()` 需要使以下成为可能

```js
const asyncTimes4 = sequence(
  [
    asyncTimes2,
    asyncTimes2
  ]
)

asyncTimes4((error, data) => {
   console.log(data) // 4
}, 1)
```

当Error发生的时候，需要直接触发最后的callback，未执行的异步函数需要保持未被调用的状态。

**再问问**

能否使用Promise完成题目？能否不使用Promise完成该题目？

ans:

```js
/*
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void

*/

/**
 * @param {AsyncFunc[]} funcs
 * @return {(callback: Callback) => void}
 */
function sequence(funcs){
  // your code here
  return function sequenced(callback, num) {
    if(funcs.length === 0) return callback(undefined, num);
    const [first, ...rest] = funcs;
    first((error, data) => error ? callback(error) : sequence(rest)(callback, data), num)
  }
}
```

---

# 30. 实现async helper - parallel()

本题目是 [29. 实现async helper - `sequence()`](https://bigfrontend.dev/zh/problem/implement-async-helper-sequence)的延续。

请实现async helper - `parallel()`！ `parallel()` 有点类似`Promise.all()`。和29题中的 `sequence()`不同，异步函数的执行没有先后顺序，在`parrallel()`中是同时触发。

本题目中的所有异步函数是如下interface。

```ts
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void
```

你的`parallel()` 需要能 **接受 AsyncFunc 数组**，并且返回一个function，这个function将会在所有的异步函数完成或者error发生的时候被触发。

假设我们有如下3个异步函数。

```js
const async1 = (callback) => {
   callback(undefined, 1)
}

const async2 = (callback) => {
   callback(undefined, 2)
}

const async3 = (callback) => {
   callback(undefined, 3)
}
```

`parallel()`需要使得以下成为可能。

```js
const all = parallel(
  [
    async1,
    async2,
    async3
  ]
)

all((error, data) => {
   console.log(data) // [1, 2, 3]
}, 1)
```

当Error发生的时候，只有第一个error需要被传递到最后，剩下的error和data都被忽略。

ans:

```js
/*
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void

*/
const promisify = fn => input => new Promise((res, rej) => {
  fn((error, output) => error ? rej(error) : res(output), input);
});
/**
 * @param {AsyncFunc[]} funcs
 * @return {(callback: Callback) => void}
 */
function parallel(funcs){
  return (cb, input) => {
    Promise
    .all(funcs.map(fn => promisify(fn)(input)))
    .then(output => cb(undefined, output))
    .catch(error => cb(error, undefined))
  }
}


// Promise 对象是由关键字 new 及其构造函数来创建的。
// 该构造函数会把一个叫做“处理器函数”（executor function）的函数作为它的参数。
// 这个“处理器函数”接受两个函数——resolve 和 reject ——作为其参数。当异步任务顺利完成且返回结果值时，会调用 resolve 函数；
// 而当异步任务失败且返回失败原因（通常是一个错误对象）时，会调用reject 函数。


// 有不明白的地方，在fn 利用input 执行完异步操作后，output 和error 是如何传到外面的？
```

---

# 31. 实现async helper - race()

这个题目是[30. 实现async helper - `parallel()`](https://bigfrontend.dev/zh/problem/implement-async-helper-parallel)的后续。

请实现一个async function helper - `race()` 。 `race()`有点类似[Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)。 `parallel()`会等待所有的function执行结束，`race()`会在任何一个function结束或者产生error的时候调用最终的callback。

本题目中的所有异步函数是如下interface。

```ts
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void
```

你的`race()` 需要 **接受 AsyncFunc 数组**，并且返回一个新的函数。这个函数会在任何一个function调用结束或者发生error的时候被调用。

假设我们有如下3个async function。

```js
const async1 = (callback) => {
   setTimeout(() => callback(undefined, 1), 300)
}

const async2 = (callback) => {
    setTimeout(() => callback(undefined, 2), 100)
}

const async3 = (callback) => {
   setTimeout(() => callback(undefined, 3), 200)
}
```

你的`race()` 需要使得如下逻辑成立。

```js
const first = race(
  [
    async1,
    async2,
    async3
  ]
)

first((error, data) => {
   console.log(data) 
   // 2, 因为2是第一个成功执行的结果
}, 1)
```

ans:

```js
/*
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void

*/

/**
 * @param {AsyncFunc[]} funcs
 * @return {(callback: Callback) => void}
 */
function race(funcs){
  // your code here
  let flag = false;
  return (cb, data) => {
    const cbWrapper = (...args) => {
      if(flag) return;
      cb(...args);
      flag = true;
    }

    funcs.forEach(func => func(cbWrapper, data));
  }
}
```

---

# 32. 实现Promise.all()

> Promise.all(iterable) 方法返回一个 Promise 实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中 promise 有一个失败（rejected），此实例回调失败（reject），失败的原因是第一个失败 promise 的结果。

source - [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

你能否实现自己的 `Promise.all()` ?

*注意*

**请不要直接使用Promise.all()** ，这并不能帮助你提升。

ans:

```js
/**
 * @param {Array<any>} promises - notice input might have non-Promises
 * @return {Promise<any[]>}
 */
async function all(promises) {
  // your code here
  let result = [];
  for(let promise of promises) {
    result.push(await promise);
  }
  return result;
}

// 可以看出，用async 和await 更符合直觉


function all(promises) {
  return new Promise((res, rej) => {
    let result = [];

    if(promises.length === 0) return res(result);

    let countPending = promises.length;
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(value => {
        result[index] = value;
        countPending--;
        if(countPending === 0) {
          res(result);
        }
      }, rej)
    })
  })
}
```

---

# 33. 实现Promise.allSettled()

> Promise.allSettled()方法返回一个在所有给定的promise都已经fulfilled或rejected后的promise，并带有一个对象数组，每个对象表示对应的promise结果。

- from [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

和`Promise.all()`不同，`Promise.allSettled()` 会等待所有的promise直到fulfill或者reject。

你能实现自己的`Promise.allSettled()` 吗?

ans:

```js
/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
  return Promise.all(promises.map(promise => 
  Promise.resolve(promise).then(value =>{
    return {
      status: "fulfilled",
      value
    }
  },
  reason => {
    return {
      status: "rejected",
      reason
    }
  })
  ))
}
```

---

# 34. 实现Promise.any()

> Promise.any() 接收一个Promise可迭代对象，只要其中的一个 promise 成功，就返回那个已经成功的 promise 。如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise 和AggregateError类型的实例，它是 Error 的一个子类，用于把单一的错误集合在一起。本质上，这个方法和Promise.all()是相反的。

- from [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

你能实现自己的`Promise.any()`吗?

*注意*

`AggregateError` 暂时还没有被Chrome支持。但是你仍然可以使用它因为我们在judge你的code时候添加了AggregateError。

你可以这样：

```js
new AggregateError(
  'No Promise in Promise.any was resolved', 
  errors
)
```

ans:

```js
/**
 * @param {Array<Promise>} promises
 * @return {Promise}
 */
function any(promises) {
  // your code here
  return new Promise((res, rej) => {
    let isFullfilled = false;
    let errors = [];
    promises.forEach((promise, index) => {
      promise.then(data => {
        if(!isFullfilled) {
          res(data);
          isFullfilled = true;
        }
      }, error => {
        errors[index] = error;
        if(errors.length === promises.length) {
          rej(new AggregateError('none resolved', errors));
        }
      })
    })
  })
}

```

---

# 35. 实现Promise.race()



该问题有些类似 [31. 实现async helper - `race()`](https://bigfrontend.dev/zh/problem/implement-async-helper-race)，只不过处理的是Promise。

> Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。source: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

你能实现自己的`Promise.race()`吗？

ans:

```js
/**
 * @param {Array<Promise>} promises
 * @return {Promise}
 */
function race(promises) {
  // your code here
  return !promises.length ? Promise.resolve() : new Promise((res, rej) => {
    for(let promise of promises) {
      Promise.resolve(promise).then(res, rej);
      // promise.then(res, rej);
    }
  })
}
```

---

# 36. 实现一个 fake timer(setTimeout)

`setTimeout` 可以设定未来的任务，但是其执行时间并不精确。([Event Loop](https://javascript.info/event-loop))。

大多数时候这都不是问题，但是在test的时候却有些头疼。

比如，[5. 手写throttle()并支持leading 和 trailing](https://bigfrontend.dev/zh/problem/implement-throttle-with-leading-and-trailing-option) 中我们就需要比较精确的测试。

你能否实现一个静态化的`setTimeout()`和`clearTimeout()`，而不再有Event Loop的问题。这也正是[FakeTimes](https://github.com/sinonjs/fake-timers) 的用途。

“精确”的意思是，“假设所有的函数的执行耗时为0，同时时间戳从0开始，那么`setTimeout(func1, 100)`将会精确的在时间戳:100进行执行func1"。

你需要同时修改`Date.now()`来提供新的时间戳。

```js
class FakeTimer {
  install() {
    // setTimeout(), clearTimeout(), and Date.now() 
    // are replaced
  }

  uninstall() {
    // restore the original APIs
    // setTimeout(), clearTimeout() and Date.now()
  }

  tick() {
     // run all the schedule functions in order
  }
}
```

输入的代码将会大概像这样进行测试。

```js
const fakeTimer = new FakeTimer()
fakeTimer.install()

const logs = []
const log = (arg) => {
   logs.push([Date.now(), arg])
}

setTimeout(() => log('A'), 100)
// log 'A' at 100

const b = setTimeout(() => log('B'), 110)
clearTimeout(b)
// b is set but cleared

setTimeout(() => log('C'), 200)

expect(logs).toEqual([[100, 'A'], [200, 'C']])

fakeTimer.uninstall()
```

*注意*

测试的时候只会用到`Date.now()`，其他的时间相关的函数可以忽略。

ans:

```js
class FakeTimer {
constructor() {
  this.original = {
    setTimeout: window.setTimeout,
    clearTimeout: window.clearTimeout,
    dateNow: Date.now
  }
  this.currentTime = 0;
  this.queue = [];
  this.timerId = 1;
}

  install() {
    // replace window.setTimeout, window.clearTimeout, Date.now
    // with your implementation
    window.setTimeout = (cb, time, ...args) => {
      let id = this.timerId++;
      this.queue.push({
        cb,
        time: time+this.currentTime,
        id,
        args
      })
    this.queue.sort((a,b) => a.time - b.time);
    return id;      
    }
    window.clearTimeout = toRemoveId => {
      this.queue = this.queue.filter(obj => obj.id !== toRemoveId);
    }
    Date.now = () => {
      return this.currentTime;
    }
  }
  
  uninstall() {
    // restore the original implementation of
    // window.setTimeout, window.clearTimeout, Date.now
    window.setTimeout = this.original.setTimeout;
    window.clearTimeout = this.original.clearTimeout;
    Date.now = this.original.dateNow;
  }
  
  tick() {
    // run the scheduled functions without waiting
    while(this.queue.length) {
      let { cb, time, args} = this.queue.shift();
      this.currentTime = time;
      cb(...args);
    }
  }
}

// 本质上是构造一个类，去替换掉原生的计时器方法
```

---

# 37. 手写Binary Search (unique)

即使是前端的面试，基本的算法比如[二分查找](https://en.wikipedia.org/wiki/Binary_search_algorithm)被问到的可能性还是有的。

**请实现一个二分查找，对象是不重复，升序整数数组**。

请不要直接使用`Array.prototype.indexOf()`，这不是本题的目的。

ans:

```js
/**
 * @param {number[]} arr - ascending unique array
 * @param {number} target
 * @return {number}
 */
function binarySearch(arr, target){
  // your code here
  let start = 0, end = arr.length - 1;
  while(start <= end) {
    let mid = parseInt((start+end) / 2);
    if(target === arr[mid]) {
      return mid;
    } else if(target < arr[mid]) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return -1;
}
```

---

# 38. 实现jest.spyOn()

如果你写过单元测试的话，一定很熟悉`Spy`的用法。

**请自己实现一个spyOn(object, methodName)** ，类似于 [jest.spyOn()](https://jestjs.io/docs/en/jest-object#jestspyonobject-methodname)。

以下是`spyOn`需要完成的内容。

1. spy被调用的时候，原来的method也需要被调用。
2. spy需要又一个`calls`数组，数组中含有所有调用的参数

以下代码说明了一切。

```ts
const obj = {
   data: 1, 
   increment(num) {
      this.data += num
   }
}

const spy = spyOn(obj, 'increment')

obj.increment(1)

console.log(obj.data) // 2

obj.increment(2)

console.log(obj.data) // 4

console.log(spy.calls)
// [ [1], [2] ]
```

ans:

```js
/**
 * @param {object} obj
 * @param {string} methodName
 */
function spyOn(obj, methodName) {
  // your code here
  const method = obj[methodName];
  if(typeof method !== 'function') {
    throw new Error(`${methodName} is not a function`);
  }
  const calls = [];
  obj[methodName] = (...args) => {
    calls.push(args);
    method.apply(this, args)
  }
  return { calls };
}
```

---

# 39. 手写range()

请实现一个`range(from, to)` 。

```js
for (let num of range(1, 4)) {
  console.log(num)  
}
// 1
// 2
// 3
// 4
```

这个题目非常简单，注意你不一定必须要返回一个数组，你能想到除了for循环之外更多更炫酷的解法吗？

ans:

```js
/**
 * @param {integer} from
 * @param {integer} to
 */
function range(from, to) {
  // your code here
  let result = [];
  while(from <= to) {
    result.push(from++);
  }
  return result;
}

// 2. implement iterable/iterator protocol
// for ... of uses interable protocol
// [Symbol.iterator]: () =>  Iterator
// next: () => {done: bolean, value?: any} 

function range(from, to) {
  return {
    // iterable protocol
    [Symbol.iterator]() {
      // iterator protocol
      return {
        next() {
          return {
            done: from > to,
            value: from++
          }
        }
      }
    }
  }
}
```

---

# 40. 实现Bubble Sort

即使是前端开发，也需要掌握基本的排序算法。

请手写[Bubble Sort](https://en.wikipedia.org/wiki/Bubble_sort)。

请直接修改传入的数组，不要返回新数组。

*追问*

时间空间复杂度是多少？是否是稳定的排序？

ans:

```js
/**
 * @param {number[]} arr
 */
function bubbleSort(arr) {
  // your code here
  for(let i = 0; i < arr.length-1; i++) { // 要遍历的次数
    for(let j = 0; j < arr.length-1-i; j++) { // 具体遍历的索引
      if(arr[j] > arr[j+1]) {
        [arr[j] ,arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
}


// 维基百科的示例代码
Array.prototype.bubble_sort = function() {
	var i, j, temp;
	for (i = 0; i < this.length - 1; i++)
		for (j = 0; j < this.length - 1 - i; j++)
			if (this[j] > this[j + 1]) {
				temp = this[j];
				this[j] = this[j + 1];
				this[j + 1] = temp;
			}
	return this;
};
var num = [22, 34, 3, 32, 82, 55, 89, 50, 37, 5, 64, 35, 9, 70];
num.bubble_sort();
for (var i = 0; i < num.length; i++)
	document.body.innerHTML += num[i] + " ";
```

---

# 41. 手写Merge Sort

即使是前端开发，也需要掌握基本的排序算法。

请手写[Merge Sort](https://en.wikipedia.org/wiki/Merge_sort)。

请直接修改传入的数组，不要返回新数组。

*追问*

时间空间复杂度是多少？是否是稳定的排序？

ans:

```js
// 维基百科版本
function merge(left, right){
  var result = [];
  while(left.length > 0 && right.length > 0){
    if(left[0] < right[0]){
      result.push(left.shift());
    }else{
      result.push(right.shift());
    }
  }
  return result.concat(left, right);
}

function mergeSort(arr){
  if(arr.length <=1) return arr;
  var middle = Math.floor(arr.length / 2);
  var left = arr.slice(0, middle);
  var right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}


/**
 * @param {number[]} arr
 */
function mergeSort(arr) {
  if (arr.length < 2) return

  let mid = Math.floor(arr.length / 2)
  let left = arr.slice(0, mid)
  let right = arr.slice(mid)
  
  mergeSort(left)
  mergeSort(right)
  
  let l = 0, r = 0
  while (l < left.length || r < right.length)
    arr[l+r] = (r === right.length || left[l] <= right[r]) ? left[l++] : right[r++] // ⭐⭐
}
// 很巧妙啊，双指针的写法
// r===right.length 是为了让右数组用完后,可以继续进行左数组的赋值.
// 如果是左数组用完,判断式子自然为false, 执行右数组的赋值
```

---

# 42. 手写 Insertion Sort

即使是前端开发，也需要掌握基本的排序算法。

请手写[Insertion Sort](https://en.wikipedia.org/wiki/Insertion_sort)。

请直接修改传入的数组，不要返回新数组。

*追问*

时间空间复杂度是多少？是否是稳定的排序？

ans:

```js
/**
 * @param {number[]} arr
 */
function insertionSort(arr) {
  // your code here
  for(let i=1; i<arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while(j >= 0 && arr[j] > key) {
      arr[j+1] = arr[j];
      j--;
    }
    arr[j+1] = key;
  }
}

// 插入排序的核心在于, 一个一个比较,腾笼换鸟
```

---

