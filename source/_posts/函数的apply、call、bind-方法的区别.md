---
title: 函数的apply、call、bind 方法的区别
date: 2021-10-22 09:26:00
tags: 知识总结
---

参考：[装饰器模式和转发，call/apply](https://zh.javascript.info/call-apply-decorators)

**装饰器** 是一个围绕改变函数行为的包装器。主要工作仍由该函数来完成。

装饰器可以被看作是可以添加到函数的 “features” 或 “aspects”。我们可以添加一个或添加多个。而这一切都无需更改其代码！

为了实现 `cachingDecorator`，我们研究了以下方法：

- [func.call(context, arg1, arg2…)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Function/call) —— 用给定的上下文和参数调用 `func`。也就是说，**将传进来的context 对象作为函数的调用对象**；
- [func.apply(context, args)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) —— 调用 `func` 将 `context` 作为 `this` 和类数组的 `args` 传递给参数列表。

通用的 **呼叫转移（call forwarding）** 通常是使用 `apply` 完成的：

```javascript
let wrapper = function() {
  return original.apply(this, arguments);
};
```

我们也可以看到一个 **方法借用（method borrowing）** 的例子，就是我们从一个对象中获取一个方法，并在另一个对象的上下文中“调用”它。采用数组方法并将它们应用于参数 `arguments` 是很常见的。另一种方法是使用 Rest 参数对象，该对象是一个真正的数组。

------

call:

```js
(method) Function.call(this: Function, thisArg: any, ...argArray: any[]): any

Calls a method of an object, substituting another object for the current object. // 引用一个对象的方法，把那个对象替换为当前对象（传进来的那个）

@param thisArg — The object to be used as the current object.

@param argArray — A list of arguments to be passed to the method.
```

apply:

```js
(method) Function.apply(this: Function, thisArg: any, argArray?: any): any
Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function. // 引用函数值，替换函数的this 为指定的对象。指定数组作为函数的参数

@param thisArg — The object to be used as the this object.

@param argArray — A set of arguments to be passed to the function.
```

bind:

```js
(method) Function.bind(this: Function, thisArg: any, ...argArray: any[]): any
For a given function, creates a bound function that has the same body as the original function. The this object of the bound function is associated with the specified object, and has the specified initial parameters. // 对于被给定的函数，创建一个和原始函数有相同主体的绑定了的函数，这个绑定了的函数和指定的对象相关联，有着明确的初始化参数。

@paramthisArg — An object to which the this keyword can refer inside the new function.

@paramargArray — A list of arguments to be passed to the new function.
```

