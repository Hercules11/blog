---
title: require 是什么
date: 2022-01-09 16:31:25
tags: 学习总结
---

原文地址：[What is require?](https://nodejs.org/en/knowledge/getting-started/what-is-require/)

Nodejs 遵循 CommonJS 模块系统规则，内置的`require` 函数，是引入模块最简单的方法。`require` 基础功能是读取 Javascript 文件，执行文件，然后返回`exports` 对象。例子如下：

```JavaScript
console.log("evaluating example.js");

var invisible = function () {
  console.log("invisible");
}

exports.message = "hi";

exports.say = function () {
  console.log(exports.message);
}
```

如果运行 `let example = require('./example.js')` , example.js 被计算求值，example 等于：

```js
{
  message: "hi",
  say: [Function]
}
```

如果要将 `exports` 对象设置为函数或新对象，则必须使用 `module.exports` 对象。举个例子:

```js
module.exports = function () {
  console.log("hello world")
}

require('./example2.js')() //require itself and run the exports object
```

值得注意的是，每当您随后需要一个已经需要的文件时，导出对象都会被缓存并重用。

```bash
node> require('./example.js')
evaluating example.js
{ message: 'hi', say: [Function] }
node> require('./example.js')
{ message: 'hi', say: [Function] }
node> require('./example.js').message = "hey" //set the message to "hey"
'hey'
node> require('./example.js') //One might think that this "reloads" the file...
{ message: 'hey', say: [Function] } //...but the message is still "hey" because of the module cache.
```

从上面可以看到，example.js 是第一次计算的，但是所有后续调用都只需要调用模块缓存，而不是再次读取文件。如上所述，这偶尔会产生副作用。

require 查找文件的规则可能有点复杂，但一个简单的经验法则是，如果文件不以 "./" 或 "/"，那么它要么被视为核心模块(并检查本地 Node.js 路径) ，要么被视为本地 node _ modules 文件夹中的依赖项。如果文件以 "./"  开头。它被认为是调用 require 的文件的相对文件。如果文件以 "/" 开头，则认为它是绝对路径。注意: 你可以省略 ".js" 。如果需要的话，会自动添加。有关更多详细信息，请参阅官方文档。

另外需要注意的是：如果传递的文件名实际上是一个目录，那么它将首先在目录中查找 package.json 并加载 main 属性中引用的文件。否则，它将查找 index.js。



