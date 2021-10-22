---
title: bigfrontend 代码题(三)
date: 2021-10-20 10:00:37
tags: 做题
---

# 8. 手写shuffle()随机打乱一个数组

能否手写一个shuffle() ?

当传入一个数组的时候，shuffle()需要更换元素的顺序，每一种最终的数列都需要被相等的概率生成。

比如

```js
const arr = [1, 2, 3, 4]
```

以上的数组共有4! = 24 中不同的排列

```js
[1, 2, 3, 4]
[1, 2, 4, 3]
...


```

你写的 `shuffle()` 需要按照相同的概率(1/24)来返回上述排列中的一种。

*注意*

你写的 `shuffle()`会被调用很多次，计算出每一种出现的概率，然后根据[标准差](https://zh.wikipedia.org/wiki/標準差)来判断

ref: https://javascript.info/task/shuffle

ans:

```js
/**
  * @param {any[]} arr
  */
function shuffle(array) {
  // modify the arr inline to change the order randomly
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// function shuffle(array) {
//  array.sort(() => Math.random() - 0.5);
// }
// 用这个有问题

```

<hr>

# 9. 解密消息

在一个字符串的二维数组中，有一个隐藏字符串。

```js
I B C A L K A
D R F C A E A
G H O E L A D 
```

可以按照如下步骤找出隐藏消息

1. 从左上开始，向右下前进
2. 无法前进的时候，向右上前进
3. 无法前进的时候，向右下前进
4. 2和3的重复

无法前进的时候，经过的字符就就是隐藏信息

比如上面的二维数组的话，隐藏消息是`IROCLED`

注：如果没有的话，返回空字符串

ans:

```js
/**
 * @param {string[][]} message
 * @return {string}
 */
function decode(message) {
  // your code here
  let result = "";
  let cols = message[0]?.length;
  let direction = 1, i = 0, j = 0;
  while(cols > j) {
    result += message[i][j];
    if(!message[i+direction]) {
      direction *= -1;
    }
    i += direction;
    j++;
  }
  return result;
}
```

------

# 10. 找出第一个不良版本

一个程序有多个版本，不知道什么时候开始有个bug混在其中。请你找到第一个坏掉的版本。

特定版本是否有bug，可以用`isBad(revision)`进行判定。

*注意*

1. 传入的都是非负整数
2. 如果没有找到，返回-1

ans:

```js
// 二分法的妙用
/*
 type TypIsBad = (version: number) => boolean
 */

/**
 * @param {TypIsBad} isBad 
 */
function firstBadVersion(isBad) {
	// firstBadVersion receive a check function isBad
  // and should return a closure which accepts a version number(integer)
  return (version) => {
    // write your code to return the first bad version
    // if none found, return -1
    let start = 0;
    let end = version;
    while(start <= end) {
      let mid = Math.floor((start+end)/2);
      if(isBad(mid)) {
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }
    return start <= version ? start : -1;
  }
}
```

------

# 11. 什么是Composition?实现pipe()

什么是Composition? 其实并不难理解，看看[@dan_abramov 's 的说明](https://whatthefuck.is/composition)就知道了。

现在需要你自己写一个`pipe()` 方法。

假设有一些简单的四则运算方法：

```js
const times = (y) =>  (x) => x * y
const plus = (y) => (x) => x + y
const subtract = (y) => (x) => x - y
const divide = (y) => (x) => x / y
```

`pipe()` 可以用来生成新的计算方式

```js
pipe([
  times(2),
  times(3)
])  
// x * 2 * 3

pipe([
  times(2),
  plus(3),
  times(4)
]) 
// (x * 2 + 3) * 4

pipe([
  times(2),
  subtract(3),
  divide(4)
]) 
// (x * 2 - 3) / 4
```

**注意**

1. 为了简单，可以假设传给`pipe()`的方法都只有一个参数

ans:

```js
/**
 * @param {Array<(arg: any) => any>} funcs 
 * @return {(arg: any) => any}
 */
function pipe(funcs) {
	// your code here
	return arg => {
		return funcs.reduce((result, func) => {
			return func.call(this, result);
		}, arg)
	}
}
```

---

# 12. 实现 Immutability helper

如果你使用React，你肯定会遇到想要修改state的一部分的情况。

比如下面的state。

```js
const state = {
  a: {
    b: {
      c: 1
    }
  },
  d: 2
}
```

如果我们想要修改`d`来生成一个新的state，我们可以用 [_.cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep)，但是这样没必要因为`state.a`并不需要被clone。

一个更好的办法是如下的浅拷贝

```js
const newState = {
  ...state,
  d: 3
}
```

但是又有了新问题，如果我们同时需要修改`c`的话，我们需要写很复杂的代码，比如：

```js
const newState = {
  ...state,
  a: {
    ...state.a,
    b: {
       ...state.b,
       c: 2
    }
  }
}
```

这显然还不如cloneDeep。

[Immutability Helper](https://reactjs.org/docs/update.html) 可以很好的解决这个问题。

请实现你自己的Immutability helper `update()`，需要支持如下调用

### 1. `{$push: array}` 添加元素到数组

```js
const arr = [1, 2, 3, 4]
const newArr = update(arr, {$push: [5, 6]})
// [1, 2, 3, 4, 5, 6]
```

### 2. {$set: any} 修改目标

```js
const state = {
  a: {
    b: {
      c: 1
    }
  },
  d: 2
}

const newState = update(
  state, 
  {a: {b: { c: {$set: 3}}}}
)
/*
{
  a: {
    b: {
      c: 3
    }
  },
  d: 2
}
*/
```

注意我们可以通过`$set`来修改数组中的元素

```js
const arr = [1, 2, 3, 4]
const newArr = update(
  arr, 
  {0: {$set: 0}}
)
//  [0, 2, 3, 4]
```

### 3. {$merge: object} 合并到目标object

```js
const state = {
  a: {
    b: {
      c: 1
    }
  },
  d: 2
}

const newState = update(
  state, 
  {a: {b: { $merge: {e: 5}}}}
)
/*
{
  a: {
    b: {
      c: 1,
      e: 5
    }
  },
  d: 2
}
*/
```

### 4. {$apply: function} 自定义修改

```js
const arr = [1, 2, 3, 4]
const newArr = update(arr, {0: {$apply: (item) => item * 2}})
// [2, 2, 3, 4]
```

ans:

```js
/**
 * @param {any} data
 * @param {Object} command
 */
function update(data, command) {
  // your code here
  for(const [key, value] of Object.entries(command)) {
    switch(key) {
      case '$push':
        return [...data, ...value];
      case '$set':
        return value;
      case '$merge':
        if(!(data instanceof Object)) {
          throw Error("Bad merge")
        }
        return {...data, ...value};
      case '$apply':
        return value(data);
      default:
        if(data instanceof Array) {
          const res = [...data]; // 做一个拷贝，原数组取值，现数组设置值
          res[key] = update(data[key], value);
          return res;
        } else {
          return {
            ...data,
            [key]: update(data[key], value)
          }
        }
    }

  }
}

// 用到了递归，妙啊
```

---

# 13. 利用栈(Stack)创建队列(Queue)

在JavaScript中，我们可以用Array来充作Stack或者Queue.

```js
const arr = [1, 2, 3, 4]

arr.push(5) // 变为 [1, 2, 3, 4, 5]
arr.pop() // 5, 数组变为 [1, 2, 3, 4]
```

上述是Stack的用法，以下则是Queue

```js
const arr = [1, 2, 3, 4]

arr.push(5) //  [1, 2, 3, 4, 5]
arr.shift() // 1, 现在数组是 [2, 3, 4, 5]
```

假设你有Stack，包含如下的方法

```js
class Stack {
  push(element) { /* 添加元素到stack */ }
  peek() { /* 获取top 元素 */ }
  pop() { /* 弹出top 元素 */}
  size() { /* 获取元素数量 */}
}
```

你能否通过只使用Stack实现一个包含如下方法的Queue？

```js
class Queue {
  enqueue(element) { /* 添加元素到Queue，类似于Array.prototype.push */ }
  peek() { /* 获取头元素*/ }
  dequeue() { /* 弹出头元素，类似于Array.prototype.pop */ }
  size() { /* 获取元素数量 */ }
}
```

*注意*

请只使用Stack，不要使用Array。

ans:

```js
/* you can use this Class which is bundled together with your code

class Stack {
  push(element) { // add element to stack }
  peek() { // get the top element }
  pop() { // remove the top element}
  size() { // count of element }
}
*/

/* Array is disabled in your code */

// you need to complete the following Class
class Queue {
  constructor() {
    this.stack = new Stack();
  }

  enqueue(element) { 
    // add new element to the rare
    this.stack.push(element);
  }
  peek() { 
    // get the head element
    let rStack = this._reverse(this.stack);
    let result = rStack.peek();
    this.stack = this._reverse(rStack);
    return result;
  }
  size() { 
    // return count of element
    return this.stack.size();
  }
  dequeue() {
    // remove the head element
    let rStack = this._reverse(this.stack);
    let result = rStack.pop();
    this.stack = this._reverse(rStack);
    return result;
  }

  _reverse(stack) {
    let rStack = new Stack();
    while(stack.size() > 0) {
      rStack.push(stack.pop());
    }
    return rStack;
  }
}
// 记得复习一下函数，对象，类的写法
```

---

# 14. 实现`memo()`

[Memoization](https://whatthefuck.is/memoization) 是应用广泛的性能优化的手段，如果你开发过React应用，你一定不会对`React.memo`感到陌生。

Memoization在算法题目中也经常用到，如果你可以用递归解决某个问题，那么很多时候加上Memoization可以得到更好的解法，甚至最终引导到动态规划的解法。

那么，请实现你自己的`memo()` 函数。传入相同的参数的时候，直接返回上一次的结果而不经过计算。

```js
const func = (arg1, arg2) => {
  return arg1 + arg2
}

const memoed = memo(func)

memoed(1, 2) 
// 3， func 被调用

memoed(1, 2) 
// 3，func 未被调用 

memoed(1, 3)
// 4，新参数，func 被调用
```

参数有可能不是字符串，所以你的`memo()`需要能接受第三个决定缓存key的参数，有点类似于[_.memoize()](https://lodash.com/docs/4.17.15#memoize) 。

```js
const memoed = memo(func, () => 'samekey')

memoed(1, 2) 
// 3，func被调用，缓存key是 'samekey'

memoed(1, 2) 
// 3，因为key是一样的，3被直接返回，func未调用

memoed(1, 3) 
// 3，因为key是一样的，3被直接返回，func未调用
```

默认的key可以用`Array.from(arguments).join('_')`。

*注意*

这是一种空间换时间的优化，在实际面试中，请仔细分析时间空间复杂度。

ans:

```js
/**
 * @param {Function} func
 * @param {(args:[]) => string }  [resolver] - cache key generator
 */
function memo(func, resolver) {
  // your code here
  const cache = new Map();
  return function memoried(...args) {
    const key = typeof resolver === 'function' ? resolver.apply(this, args) : args.join('_');
    if(cache.has(key)) {
      return cache.get(key);
    } else {
      let result = func.apply(this, args);
      cache.set(key, result);
      return result;
    }
  }
}
```

---

# 15. 实现类似jQuery的DOM wrapper

如果你使用过jQuery，你一定不会对下面的代码感到陌生。

```js
$('#button')
  .css('color', '#fff')
  .css('backgroundColor', '#000')
  .css('fontWeight', 'bold')
```

以上的代码把几处更改链接在一起，更改了按钮的背景色和文字颜色。

链式操作的使用，让代码更具可读性。

为了让上述代码可用，请实现自己的`$()`，只需要支持`css(propertyName: string, value: any)`即可。

ans:

```js
/**
 * @param {HTMLElement} el - element to be wrapped
 */
function $(el) {
  // your code here
  return {
    css(prop, value) {
      el.style[prop] = value;
      return this;
    }
  }
}

// 对象中的this 指的是自己，函数对象中的this 指的是调用函数的对象
```

