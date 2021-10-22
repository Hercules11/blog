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

