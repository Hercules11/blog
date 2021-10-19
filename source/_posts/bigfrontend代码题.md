---
title: bigfrontend 代码题(一)
date: 2021-10-19 12:56:53
tags: 做题
---

# 1. 实现curry()

[柯里化(Currying)](https://en.wikipedia.org/wiki/Currying) 在JavaScript是一个常用的技巧。

请实现一个`curry()`方法，接受一个function然后返回一个柯里化过后的function。

这是一个例子

```js
const join = (a, b, c) => {
   return `${a}_${b}_${c}`
}

const curriedJoin = curry(join)

curriedJoin(1, 2, 3) // '1_2_3'

curriedJoin(1)(2, 3) // '1_2_3'

curriedJoin(1, 2)(3) // '1_2_3'
```

阅读更多

https://javascript.info/currying-partials

https://lodash.com/docs/4.17.15#curry

------

ans:

```js
function curry(func) {

  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };

}
// func.length 指的是函数定义的参数长度
// bind，apply，call三者都可以改变函数的this对象指向。
// 三者第一个参数都是this要指向的对象，如果如果没有这个参数或参数为undefined或null，则默认指向全局window。
// 三者都可以传参，但是apply是数组，而call是参数列表，且apply和call是一次性传入参数，而bind可以分为多次传入。
// bind 是返回绑定this之后的函数，便于稍后调用；apply 、call 则是立即执行 。
```

参考：[bind，apply，call三者的区别](https://zhuanlan.zhihu.com/p/82340026)

<hr size="5px">

# 2. 实现支持placeholder的curry()

该问题紧接着[1. 实现curry()](https://bigfrontend.dev/zh/problem/implement-curry)。

请实现一个支持placeholder的`curry()`，可以像这样使用。

```js
const  join = (a, b, c) => {
   return `${a}_${b}_${c}`
}

const curriedJoin = curry(join)
const _ = curry.placeholder

curriedJoin(1, 2, 3) // '1_2_3'

curriedJoin(_, 2)(1, 3) // '1_2_3'

curriedJoin(_, _, _)(1)(_, 3)(2) // '1_2_3'
```

阅读更多

https://javascript.info/currying-partials

https://lodash.com/docs/4.17.15#curry

https://github.com/planttheidea/curriable

------

ans:

```js
/**
 * @param { Function } func
 */
function curry(func) {
  return function curried(...args) {
    const complete = args.length >= func.length && !args.slice(0, func.length).includes(curry.placeholder);
    if(complete) return func.apply(this, args)
    return function(...newArgs) {
      // replace placeholders in args with values from newArgs
      const res = args.map(arg => arg === curry.placeholder && newArgs.length ? newArgs.shift() : arg);
      return curried(...res, ...newArgs);
    }
  }
}

curry.placeholder = Symbol()
// 很巧妙，用了一个递归的思想
```

<hr size="5px">

# 3. 实现Array.prototype.flat()

[Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)可以用来扁平化数组。

你能够自己实现一个flat么？

```js
const arr = [1, [2], [3, [4]]];

flat(arr)
// [1, 2, 3, [4]]

flat(arr, 1)
// [1, 2, 3, [4]]

flat(arr, 2)
// [1, 2, 3, 4]
```

**追问**

能否不用递归而用迭代的方式实现？

<hr>

ans:

```js
// 递归版本
/**
 * @param { Array } arr
 * @param { number } depth
 * @returns { Array }
 */
function flat(arr, depth = 1) {
  // your imeplementation here
  let result = []
  if(depth >= 1) {
    for(let item of arr) {
      if(typeof item === 'object') {
        result = result.concat(flat(item, depth-1));
      } else {
        result.push(item)
      }
    }
    return result;
  } else {
    return arr;
  }

}

// 迭代版本
function flat(arr, depth = 1) {
  // [[1,1] [[2],1], [[3, [4]],1]]
  // [[[2],1], [[3, [4]],1]]
  // [[2,0], [[3, [4]],1]]
  // [[[3, [4]],1]]
  // [[3, 0], [[4], 0]]
  
  const result = []
  const stack = [...arr.map(item => ([item, depth]))]
  
  while (stack.length > 0) {
    const [top, depth] = stack.pop()
    if (Array.isArray(top) && depth > 0) {
      stack.push(...top.map(item => ([item, depth - 1])))
    } else {
      result.push(top)
    }
  }
  
  return result.reverse()
}
// 这个迭代版本就是把元素一个一个剥开一层都推入stack 中，符合条件的，推入结果数组
```

<hr size="5px">



