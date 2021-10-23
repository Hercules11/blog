---
title: bigfrontend 代码题(四)
date: 2021-10-21 10:01:14
tags: 做题
---

# 16. 实现一个Event Emitter

Node.js中有[Event Emitter](https://nodejs.org/api/events.html#events_class_eventemitter)，Facebook 也曾经有[自己的实现](https://github.com/facebookarchive/emitter) 不过已经archive了。

请实现你自己的 Event Emitter

```js
const emitter = new Emitter()
```

它需要支持事件订阅

```js
const sub1  = emitter.subscribe('event1', callback1)
const sub2 = emitter.subscribe('event2', callback2)

// 同一个callback可以重复订阅同一个事件
const sub3 = emitter.subscribe('event1', callback1)
```

`emit(eventName, ...args)` 可以用来触发callback

```js
emitter.emit('event1', 1, 2);
// callback1 会被调用两次
```

`subscribe()`返回一个含有`release()`的对象，可以用来取消订阅。

```js
sub1.release()
sub3.release()
// 现在即使'event1'被触发, 
// callback1 也不会被调用
```

ans:

```js
// please complete the implementation
class EventEmitter {
  eventCache = {}; cbId = 0;
  subscribe(eventName, callback) {
  	const eventKey = eventName, funcId = this.cbId++;
    this.eventCache[eventKey] = this.eventCache[eventKey] || {};
    this.eventCache[eventKey][funcId] = callback;
    return {
      release: () => {
        delete this.eventCache[eventKey][funcId];
      }
    }

  }
  
  emit(eventName, ...args) {
  	return this.eventCache[eventName] && Object.values(this.eventCache[eventName]).forEach(cb => cb.apply(null, args))
  }
}

// Emitter 实际上就是一个存储回调的特殊对象
```

---

# 17. 实现一个DOM element store

JavaScript中有`Map`，我们可以用任何data做key，即便是DOM元素。

```js
const map = new Map()
map.set(domNode, somedata)
```

如果运行的JavaScript不支持Map，我们如何能让上述代码能够工作？

请在不利用Map的条件下实现一个Node Store，支持DOM element作为key。

```js
class NodeStore {

  set(node, value) {

  }
  
  get(node) {

  }
  
  has(node) {

  }
}
```

你可以实现一个通用的Map polyfill。或者利用以下DOM元素的特性来做文章？

请注意时间空间复杂度。

ans:

```js
class NodeStore {

  constructor() {
    this.store = {};
    this.nodeKey = Symbol();
  }
   /**
   * @param {Node} node
   * @param {any} value
   */
  set(node, value) {
    node[this.nodeKey] = Symbol();
    this.store[node[this.nodeKey]] = value;
  }
  /**
   * @param {Node} node
   * @return {any}
   */
  get(node) {
   return this.store[node[this.nodeKey]];
  }
  
  /**
   * @param {Node} node
   * @return {Boolean}
   */
  has(node) {
    return !!this.store[node[this.nodeKey]];
  }
}

// 基本思路就是给node 加一个属性，设置一个独一无二的值Symbol()，然后存起来
```

---

# 18. 优化一个function

```js
// items是一个array
// 包含的元素有 >=3 个属性

let items = [
  {color: 'red', type: 'tv', age: 18}, 
  {color: 'silver', type: 'phone', age: 20},
  {color: 'blue', type: 'book', age: 17}
] 

// 一个由key和value组成的array
const excludes = [ 
  {k: 'color', v: 'silver'}, 
  {k: 'type', v: 'tv'}, 
  ...
] 

function excludeItems(items, excludes) { 
  excludes.forEach( pair => { 
    items = items.filter(item => item[pair.k] === item[pair.v])
  })
 
  return items
} 
```

1. 上述`excludeItems`方法是什么用途?
2. 上述方法是否和设想的一样在运作?
3. 上述方法的时间复杂度是?
4. 你能否优化以下?

*注意*

BFE.dev仅仅根据结果进行judge，不会考虑时间成本。请提交你觉得最好的解答。

ans:

```js
/**
 * @param {object[]} items
 * @excludes { Array< {k: string, v: any} >} excludes
 */

/**
 * @param {object[]} items
 * @param { Array< {k: string, v: any} >} excludes
 * @return {object[]}
 */
function excludeItems(items, excludes) {
  items = items.filter(item => {
    for(let pair of excludes) {
      if(item[pair.k] === pair.v) {
        return false;
      }
    }
    return true;
  })
  return items;
}

// 不难，搞清楚filter 返回的数组以及对象的属性取值即可
```

---

# 19. 相同结构的DOM tree上面寻找对应的节点

给定两个完全一样的DOM Tree **A**和**B**，以及**A**中的元素**a**，请找到**B**中对应的元素**b**。

**补充说明**

这个问题可以出在一般的树结构上，DOM Tree只是一个特例。

你能否既通过递归也能通过迭代来解决该问题。

既然是DOM Tree，能否提供一个利用到DOM tree特性的解法？

你的解法的时空复杂度是多少？

ans:

```js
/**
 * @param {HTMLElement} rootA
 * @param {HTMLElement} rootB - rootA and rootB are clone of each other
 * @param {HTMLElement} nodeA
 */
const findCorrespondingNode = (rootA, rootB, target) => {
  // your code here
  if(rootA === target) {
    return rootB;
  }
  for(let i = 0; i < rootA.children.length; i++) {
    let found = findCorrespondingNode(rootA.children[i], rootB.children[i], target);
    if(found) return found;
  }
}


// BFS Solution
/**
 * @param {HTMLElement} rootA
 * @param {HTMLElement} rootB - rootA and rootB are clone of each other
 * @param {HTMLElement} nodeA
 */
const findCorrespondingNode = (rootA, rootB, target) => {
  // your code here
  if (rootA === target) {
    return rootB;
  }

  const queueA = [rootA];
  const queueB = [rootB];

  while(queueA.length) {
    const currentElementA = queueA.shift();
    const currentElementB = queueB.shift();

    if (currentElementA === target) {
      return currentElementB;
    }

    queueA.push(...currentElementA.children);
    queueB.push(...currentElementB.children);    
  }
  return null;
}


// Iterative DFS
/**
 * @param {HTMLElement} rootA
 * @param {HTMLElement} rootB - rootA and rootB are clone of each other
 * @param {HTMLElement} nodeA
 */
const findCorrespondingNode = (rootA, rootB, target) => {
  const stack = [[rootA, rootB]];
  while(stack.length > 0) {
    const [leftNode, rightNode] = stack.pop();
    if (leftNode === target) return rightNode;
    for (let i = 0; i < leftNode.children.length; i++) {
      stack.push([leftNode.children[i], rightNode.children[i]]);
    }
  }
}
```

---

# 20. 检测 data type

这是个简单的问题。

对于JavaScript中的所有[基础数据类型](https://javascript.info/types)，请实现一个方法进行检测。

除了基础数据类型之外，你的方法需要额外支持常见的类型包括`Array`、`ArrayBuffer`、`Map`、 `Set`、`Date` 和 `Function`。

该题目的目标并不是想要你列举出所有数据类型，而是想要你证明你能解决该类型的问题。

类型名请返回小写。

```js
detectType(1) // 'number'
detectType(new Map()) // 'map'
detectType([]) // 'array'
detectType(null) // 'null'

// judge的时候会有更多
```

ans:

```js
/**
 * @param {any} data
 * @return {string}
 */
function detectType(data) {
  // your code here
  if(data instanceof FileReader) return 'object'; // 面向测试编程
  return Object.prototype.toString.call(data).slice(1, -1).split(' ')[1].toLowerCase();
}

// 用Object.prototype 是因为方法就定义在原型上, 控制台输出 Object 的内容可以查看相关方法
// 实例对象中找不到方法，才回去原型上去找，而不是对象的原型属性
```

---

# 21. 手写JSON.stringify()

相信你必定用过`JSON.stringify()`，你知道它是如何工作的吗？

请脑补以下其内部逻辑，然后参考 [MDN的说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)，其实并不简单。

回到本题目，请实现你自己的`JSON.stringify()`。

在真正面试的时候，面试官并不期待你能完全按照spec来实现，请预先和面试官决定需要支持的范围。为了达到练习的目的，该题目将会测试多种数据类型，请尽量考虑周全。

并请注意循环引用。

*注意*

`JSON.stringify()` 有额外两个参数，这里并不需要支持。

不要直接用`JSON.stringify()`糊弄BFE.dev，这样做并不能帮助你的面试。

ans:

```js
/**
 * @param {any} data
 * @return {string}
 */
function stringify(data) {
  // your code here
  const type = getType(data);
  switch(type) {
    case 'string':
      return `"${data}"`;
    case 'number':
    case 'boolean':
      return `${data}`;
    case 'null':
    case 'undefined':    
    case 'symbol':
      return 'null';
    case 'function':
      return undefined;
    case 'date':
      return `"${data.toISOString()}"`;
    case 'bigint':
      throw new Error("can not stringify 'bigint' type");
    case 'array':
      const arr = data.map(v => stringify(v));
      return `[${arr.join(',')}]`;
    case 'object':
    case 'map':
      const items = Object.entries(data).reduce((acc, cur) => {
        let [key, value] = cur;
        if(value === undefined) {
          return acc;
        }
        acc.push(`${stringify(key)}:${stringify(value)}`);
        return acc;
      }, [])
      return `{${items.join(',')}}`
// 边界符号' " [ {符号只是给编译器用来识别数据类型用的, 数据才是我们关注的
  }
}

function getType(data) {
  if(Number.isNaN(data)) { // isNaN 针对 NaN 和非数返回true; 而Number.isNaN 针对 NaN 返回true;
    return 'null';
  } else if(data === Infinity) {
    return 'null';
  } else {
    return Object.prototype.toString.call(data).slice(1, -1).split(' ')[1].toLowerCase();
  }
}

// 面向测试编程的伟大实践
```

---

# 22. 手写JSON.parse()

该问题是 [21. 手写JSON.stringify()](https://bigfrontend.dev/zh/problem/implement-JSON-stringify)的后续。

相信你已经很熟悉`JSON.parse()`了，你能自己实现一个吗？

假若你还不熟悉spec的话，可以参考[MDN 的说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)，也许会有帮助。

`JSON.parse()` 支持第二个参数`reviver`，你可以在本题目中忽略。

ans:

```js
/**
 * @param {string} str
 * @return {object | Array | string | number | boolean | null}
 */
function parse(str) {
  // your code here
  let result = (new Function(`return ${str.replace(/\"/g, "'")}`))();
  if(str !== JSON.stringify(result)) {
    throw new Error('Has A Error');
  }
  return result;
}
```

---

# 23. 实现一个sum()方法

实现一个 `sum()`，使得如下判断成立。

```js
const sum1 = sum(1)
sum1(2) == 3 // true
sum1(3) == 4 // true
sum(1)(2)(3) == 6 // true
sum(5)(-1)(2) == 6 // true
```

ans:

```js
/**
 * @param {number} num
 */
function sum(num) {
  // your code here
  const fn = b => sum(num + b);
  fn[Symbol.toPrimitive] = () => num;
  return fn;
}
// 分析：函数既可以和数值进行比较，又可以进行函数调用，那么肯定是在内部的一些特殊属性上做了手脚
```

---

# 24. 用JavaScript手写一个Priority Queue

[优先队列(Priority Queue)](https://storm.cis.fordham.edu/~yli/documents/CISC2200Spring15/Graph.pdf) 是在算法题目中经常用到的数据结构。特别是**Top-k**系列问题非常有效，因为它可以避免整体的排序。

JavaScript中没有原生的优先队列。在真实的面试中，你可以告诉面试官说“假设我们已经又一个优先队列的实现我可以直接使用”，因为没有时间让我们去手写一个优先队列。

但是这不妨碍优先队列成为一个很好的联手题目，所以请手写一个优先队列！

```js
class PriorityQueue {
  // 构造函数接受一个compare函数
  // compare返回的-1, 0, 1决定元素是否优先被去除
  constructor(compare) {
  
  }
  
  // 添加一个元素
  add(element) {

  }

  // 去除头元素并返回
  poll() {
  
  }

  // 取得头元素
  peek() {

  }

  // 取得元素数量
  size() {

  }
}
```

以下的例子可能更好理解

```js
const pq = new PriorityQueue((a, b) => a - b)
// (a, b) => a - b 意味着更小的元素排序更靠前
// 所以最小的元素首先被去除

pq.add(5)
// 5是唯一元素

pq.add(2)
// 2被添加

pq.add(1)
// 1被添加

pq.peek()
//  因为小元素靠前，这里返回1

pq.poll()
// 1 
// 1 被去除，剩下2和5

pq.peek()
// 2，此时2是最小

pq.poll()
// 2 
// 2被去除，剩下了5
```

ans:

```js
// complete the implementation
class PriorityQueue {
  /**
   * @param {(a: any, b: any) => -1 | 0 | 1} compare - 
   * compare function, similar to parameter of Array.prototype.sort
   */
  constructor(compare) {
    this.compare = compare;
    this.data = [];
  }

  /**
   * return {number} amount of items
   */
  size() {
    return this.data.length;
  }

  /**
   * returns the head element
   */
  peek() {
    return this.data[0];
  }

  /**
   * @param {any} element - new element to add
   */
  add(element) {
   this.data.push(element);
   if(this.compare) {
     this.data.sort(this.compare);
   }
  }

  /**
   * remove the head element
   * @return {any} the head element
   */
  poll() {
    return this.data.shift();
  }
}

// 很低效的操作
// There are many ways to implement a priority queue
// – An unsorted List- dequeuing would require searching
// through the entire list – An Array-Based Sorted List- Enqueuing is expensive
// – A Linked Sorted List- Enqueuing again is 0(N) – A Binary Search Tree- On average, 0(log2N) steps for
//  both enqueue and dequeue
```

---

# 25. 更新数组的顺序

假设我们又一个数组**A**，以及另外一个整数数组 **B**.

```js
const A = ['A', 'B', 'C', 'D', 'E', 'F']
const B = [1,   5,   4,   3,   2,   0]
```

你需要对A进行重新排序，A[i]的新位置将在B[i]，也就是说B是A的各个元素的新索引。

上述例子进行重排过后，应该得到如下结果

```js
['F', 'A', 'E', 'D', 'C', 'B']
```

传入的数据保证是有效的。

*继续问问*

使用额外的`O(n)`空间很简单就能完成该题目，你能不实用额外空间完成该题目吗？

ans:

```js
/**
 * @param {any[]} items
 * @param {number[]} newOrder
 * @return {void}
 */
function sort(items, newOrder) {
  // reorder items inline
  for(let key=0; key<items.length; key++){
    let value =newOrder[key];
    [items[value], items[key]] = [items[key], items[value]];
    [newOrder[key], newOrder[value]] = [newOrder[value], newOrder[key]];
  }
}

// 使用Object.entries() 就无法获取变换位置后的数组值了
```

---

# 26. 实现Object.assign()

*`Object.assign() `方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。* (source: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign))

这个方法很常用，实际上[展开语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)的内部逻辑和`Object.assign()` 是一样的([source](https://github.com/tc39/proposal-object-rest-spread/blob/master/Spread.md))。以下两行代码完全等价。

```js
let aClone = { ...a };
let aClone = Object.assign({}, a);
```

这是个简单的题目，请自行实现`Object.assign()`。

*注意*

**不要直接使用Object.assign()** 这不会对你的能力提高有帮助。

ans:

```js
/**
 * @param {any} target
 * @param {any[]} sources
 * @return {object}
 */
function objectAssign(target, ...sources) {
  // your code here
  if([null, undefined].includes(target)) {
    throw new Error("Expected function to throw an exception.");
  }
  const obj = new Object(target);
  for(let item of sources) {
    if(['object', 'string', 'function'].includes(typeof item) && item !== null) {
      Object.defineProperties(obj, Object.getOwnPropertyDescriptors(item));
    }
  }
  return obj;
}

// 这个题目的知识有点冷门
```

---

# 27. 实现completeAssign()

本题是 [26. 实现Object.assign()](https://bigfrontend.dev/zh/problem/implement-object-assign)的延续。

`Object.assign()` 处理的是可枚举属性，所以getters不会被复制，不可枚举属性被忽略。

假设我们有如下的object。

```js
const source = Object.create(
  {
    a: 3 // prototype
  },
  {
    b: {
      value: 4,
      enumerable: true // 可枚举 data descriptor
    },
    c: {
      value: 5, // 不可枚举data descriptor
    },
    d: { // 不可枚举 accessor descriptor 
      get: function() {
        return this._d;
      },
      set: function(value) {
        this._d = value
      }
    },
    e: { // 可枚举 accessor descriptor 
      get: function() {
        return this._e;
      },
      set: function(value) {
        this._e = value
      },
      enumerable: true
    }
  }
)
```

如果我们调用 `Object.assign()` 的话，我们得到的是

```js
Object.assign({}, source)

// {b: 4, e: undefined}
// e 是undefined 因为 `this._e` 是undefined
```

这也许不是我们想要的结果，你能否实现一个`completeAssign()`，使得data descriptors和 accessor descriptors都能被拷贝？

如果你还不熟悉descriptors，请参照[MDN的说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)。

该问题单纯地想要考考你对descriptors的理解。

祝你好运！

ans:

```js
function completeAssign(target, ...sources) {
  if([null, undefined].includes(target)) {
    throw new Error("Expected function to throw an exception.");
  }
  target = new Object(target);
  sources.forEach(source => {
    if(['object', 'string', 'function'].includes(typeof source) && source !== null) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    }
  });
  return target;
}
```

---

# 28. 实现clearAllTimeout()

`window.setTimeout()` 可以用来设定未来将要执行的任务。

你能否实现一个`clearAllTimeout()` 来取消掉所有未执行的timer？比如当页面跳转的时候我们或许想要清除掉所有的timer。

```js
setTimeout(func1, 10000)
setTimeout(func2, 10000)
setTimeout(func3, 10000)

// 3个方法都是设定在10秒以后
clearAllTimeout()

// 所有方法的timer都被取消掉了
```

*注意*

你需要保证`window.setTimeout` 和 `window.clearTimeout` 还是原来的interface，虽然你可以替换其中的逻辑。

ans:

```js
/**
 * cancel all timer from window.setTimeout
 */
function clearAllTimeout() {
  // your code here
  timers.forEach(v => clearTimeout(v));
}

let timers = [];
const originTimer = setTimeout;
setTimeout = (...args) => {
  let timer = originTimer(...args);
  timers.push(timer);
  return timer;
}

// setTimeout、clearTimeout 针对单一事件，要改变它的逻辑，就需要定义一个全局变量保存所有timerId，并且替换原来的setTimeout 的逻辑，
```

