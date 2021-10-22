---
title: Javascript中变量、函数、对象、类的声明方法汇总
date: 2021-09-21 08:07:16
tags: 知识汇总
---



[变量](https://zh.javascript.info/variables)

> 关注变量的声明符，`let`、`const`、`var` [旧时的 "var"](https://zh.javascript.info/var)
>
> - `let` — 现代的变量声明方式。
> - `var` — 老旧的变量声明方式。一般情况下，我们不会再使用它。但是，我们会在 [旧时的 "var"](https://zh.javascript.info/var) 章节介绍 `var` 和 `let` 的微妙差别，以防你需要它们。
> - `const` — 类似于 `let`，但是变量的值无法被修改。
>
> 变量的命名：
>
> - 变量名称必须仅包含字母，数字，符号 `$` 和 `_`。
>
> - 首字符必须非数字。
>
> 变量的连续声明用逗号分隔

[函数](https://zh.javascript.info/function-basics)

> 声明方式，function <functionName>([parameters]) { /* code */}
>
> - 作为参数传递给函数的值，会被复制到函数的局部变量。
> - 函数可以访问外部变量。但它只能从内到外起作用。函数外部的代码看不到函数内的局部变量。
> - 函数可以返回值。如果没有返回值，则其返回的结果是 `undefined`
>
> 函数命名：
>
> - 函数名应该清楚地描述函数的功能。当我们在代码中看到一个函数调用时，一个好的函数名能够让我们马上知道这个函数的功能是什么，会返回什么。
> - 一个函数是一个行为，所以函数名通常是动词。
> - 目前有许多优秀的函数名前缀，如 `create…`、`show…`、`get…`、`check…` 等等。使用它们来提示函数的作用吧。

[对象](https://zh.javascript.info/object)

> 可以用下面两种语法中的任一种来创建一个空的对象（“空柜子”）：
>
> ```javascript
> let user = new Object(); // “构造函数” 的语法
> let user = {};  // “字面量” 的语法
> ```
>
> 属性命名没有限制。属性名可以是任何字符串或者 symbol（一种特殊的标志符类型，将在后面介绍）。
>
> 其他类型会被自动地转换为字符串，**值可以是任何类型**。
>
> 可以用下面的方法访问属性：
>
> - 点符号: `obj.property`。
> - 方括号 `obj["property"]`，方括号允许从变量中获取键，例如 `obj[varWithKey]`。
>
> 其他操作：
>
> - 删除属性：`delete obj.prop`。
> - **检查是否存在给定键的属性：`"key" in obj`**。
> - **遍历对象：`for(let key in obj)` 循环**。
>
> JavaScript 中还有很多其他类型的对象：
>
> - `Array` 用于存储有序数据集合，
> - `Date` 用于存储时间日期，
> - `Error` 用于存储错误信息。
> - ……等等。
>
> 它们有着各自特别的特性，我们将在后面学习到。有时候大家会说“Array 类型”或“Date 类型”，但其实**它们并不是自身所属的类型，而是属于一个对象类型即 “object”。它们以不同的方式对 “object” 做了一些扩展**。

[函数对象](https://zh.javascript.info/function-object)

> - `name` —— 函数的名字。通常取自函数定义，但如果函数定义时没设定函数名，JavaScript 会尝试通过函数的上下文猜一个函数名（例如把赋值的变量名取为函数名）。
> - `length` —— 函数定义时的入参的个数。Rest 参数不参与计数。
>
> 如果函数是**通过函数表达式的形式被声明的（不是在主代码流里），并且附带了名字，那么它被称为命名函数表达式（Named Function Expression）**。这个名字可以用于在该函数内部进行自调用，例如递归调用等。

[函数原型](https://zh.javascript.info/prototype-inheritance)

> [总结](https://zh.javascript.info/prototype-inheritance#zong-jie)
>
> - 在 JavaScript 中，所有的对象都有一个隐藏的 `[[Prototype]]` 属性，它要么是另一个对象，要么就是 `null`。
> - 我们可以使用 `obj.__proto__` 访问它（历史遗留下来的 getter/setter，这儿还有其他方法，很快我们就会讲到）。
> - 通过 `[[Prototype]]` 引用的对象被称为“原型”。
> - 如果我们想要读取 `obj` 的一个属性或者调用一个方法，并且它不存在，那么 JavaScript 就会尝试在原型中查找它。
> - 写/删除操作直接在对象上进行，它们不使用原型（假设它是数据属性，不是 setter）。
> - 如果我们调用 `obj.method()`，而且 `method` 是从原型中获取的，`this` 仍然会引用 `obj`。因此，方法始终与当前对象一起使用，即使方法是继承的。
> - `for..in` 循环在其自身和继承的属性上进行迭代。所有其他的键/值获取方法仅对对象本身起作用。

[类](https://zh.javascript.info/class)

> 基本的类语法看起来像这样：
>
> ```javascript
> class MyClass {
>   prop = value; // 属性
> 
>   constructor(...) { // 构造器
>     // ...
>   }
> 
>   method(...) {} // method
> 
>   get something(...) {} // getter 方法
>   set something(...) {} // setter 方法
> 
>   [Symbol.iterator]() {} // 有计算名称（computed name）的方法（此处为 symbol）
>   // ...
> }
> ```
>
> 技术上来说，`MyClass` 是一个函数（我们提供作为 `constructor` 的那个），而 methods、getters 和 settors 都被写入了 `MyClass.prototype`。

总结一下：

> **JavaScript 中，一切都是对象**。在一个函数对象中，可以声明基础变量，叫做静态属性，属于这个对象。
>
> this.[props] 声明的是对象实例化后的公有属性，可以用来进行方法操作。
>
> 方法，又有好几种声明方法，函数式声明，函数表达式声明，对象键值对式的声明。
>
> - 键值对式的声明，一般用在对象中，作为属性存在；
>
> - 函数声明，用在类中，作为对象原型中的方法存在，在函数对象中，做为私有方法存在；
>
> - 函数表达式，有this，则公有，否，私有的。

See see: [前端程序员经常忽视的一个JavaScript面试题](https://github.com/Wscats/articles/issues/85)