---
title: JSDoc
date: 2021-06-29 19:56:03
tags: 翻译 Wiki
---

### [JSDoc](https://en.wikipedia.org/wiki/JSDoc)

看到页面没有中文选项，那我就来翻译一下。

JSDoc 是一种用来注释 JavaScript 源代码的标记语言。使用包含 JSDoc 的注释，程序员可以创建描述程序接口的文档。这种注释，可以被各种工具处理，生成类似 HTML 和 富文本格式的文档。JSDoc 规范基于  [CC BY-SA 3.0](https://en.wikipedia.org/wiki/CC_BY-SA_3.0) 协议发布，与之对应的文档生成器和解析库是基于 [Apache License 2.0](https://en.wikipedia.org/wiki/Apache_License_2.0) 发布的免费软件。

### 历史

JSDoc 的语法和语义类似于 javadoc 。JSDoc 与之不同之处在于，它专门用于处理 Javascript 的动态行为。

一个早期的例子，在 Netscape/Mozilla 的 Rhino 项目中，使用类似于 javadoc 语法的 js 文档发布在 1999 年。这是一个用 Java 写的 Javascript 运行系统，它包含一个玩具级的 HTML 生成器，版本更迭到 1.3，它也是 js 功能的一个例子。

所有主要版本的 JSDoc 都由 Michael Mathews 领导。在 2001 年，他与加拿大程序员 Gabriel Reid 合作，开始 JSDoc.pm 项目，这是一个用 Perl 写的简易系统。系统被托管在 SourceForge 上一个 CVS 仓库中。到 JSDoc 1.0 时，他用 Javascript 重写了系统，在一系列的拓展后，JSDoc 2.0 获得了一个 jsdoc-toolkit 的名字。基于 [MIT License](https://en.wikipedia.org/wiki/MIT_License) 发布，被托管在 Google Code 的 Subversion仓库中。到 2011 年，他重构了系统到 JSDoc 3.0 版本，系统被托管在 Github 上。现如今运行在 Node.js 上。

### JSDoc 标签

在现代的 JSDoc 中，常用的注释标签

|      标签      |                          描述                          |
| :------------: | :----------------------------------------------------: |
|   `@author`    |                       开发者名字                       |
| `@constructor` |                   把函数标记为构造器                   |
| `@deprecated`  |                     标记函数被弃用                     |
|  `@exception`  |                   `@throws` 的同义词                   |
|   `@exports`   |             识别一个被导出成一个模块的成员             |
|    `@param`    | 记录一个函数的参数，数据类型可以放在花括号中被添加进来 |
|   `@private`   |                    表示成员时私有的                    |
|   `@returns`   |                       记录返回值                       |
|   `@return`    |                  `@returns` 的同义词                   |
|     `@see`     |                 记录到另一个对象的关联                 |
|    `@todo`     |                   记录一些缺少的东西                   |
|    `@this`     |     明确在一个函数中， this 关键字所指的对象的类型     |
|   `@throws`    |                  记录方法所抛出的异常                  |
|   `@version`   |                      提供库的版本                      |

### 实例

```javascript
/** @class Circle representing a circle. */
class Circle {
/**
 * Creates an instance of Circle.
 *
 * @author: moi
 * @param {number} r The desired radius of the circle.
 */
  constructor(r) {
    /** @private */ this.radius = r
    /** @private */ this.circumference = 2 * Math.PI * r
  }

  /**
   * Creates a new Circle from a diameter.
   *
   * @param {number} d The desired diameter of the circle.
   * @return {Circle} The new Circle object.
   */
  static fromDiameter(d) {
    return new Circle(d / 2)
  }

  /**
   * Calculates the circumference of the Circle.
   *
   * @deprecated since 1.1.0; use getCircumference instead
   * @return {number} The circumference of the circle.
   */
  calculateCircumference() {
    return 2 * Math.PI * this.radius
  }

  /**
   * Returns the pre-computed circumference of the Circle.
   *
   * @return {number} The circumference of the circle.
   * @since 1.1.0
   */
  getCircumference() {
    return this.circumference
  }

  /**
   * Find a String representation of the Circle.
   *
   * @override
   * @return {string} Human-readable representation of this Circle.
   */
  toString() {
    return `[A Circle object with radius of ${this.radius}.]`
  }
}

/**
 * Prints a circle.
 *
 * @param {Circle} circle
 */
function printCircle(circle) {
    /** @this {Circle} */
    function bound() { console.log(this) }
    bound.apply(circle)
}
```

注意，@class 和 @constructor 标签事实上可以被省略。ECMA 语法足够清晰的表明它们，JSDoc 利用了这个。@overrride 也是可以被自动地推断出来的。

### 使用中的 JSDoc

- 谷歌的闭源 Linter 和 编译器，后者抽取出类型信息来优化 Javascript 的输出
- Typescript 可以对有 JSDoc 类型注释的 js 文件执行类型检查。微软已经指定了一种有着可拓展标签的 TSDoc 语言
- 一个很受欢迎的编辑器 Sublime Text 通过 DocBlocker 或者 DoxyDoxygen 插件支持 JSDoc
- 在 Apress 的书 Ajax 基础 中， JSDoc 语法具有相当的篇幅
- [IntelliJ IDEA](https://en.wikipedia.org/wiki/IntelliJ_IDEA), [NetBeans](https://en.wikipedia.org/wiki/NetBeans), [Visual Studio Code](https://en.wikipedia.org/wiki/Visual_Studio_Code) 和 [RubyMine](https://en.wikipedia.org/wiki/RubyMine) 支持 JSDoc 语法
- 基于 Eclipse [Aptana Studio](https://en.wikipedia.org/wiki/Aptana_Studio) 支持 ScriptDoc
- [Mozile](http://mozile.mozdev.org/0.8/doc/jsdoc/index.html), the Mozilla Inline Editor 使用了 JSDoc.pm
- [Helma](https://web.archive.org/web/20150420064930/http://dev.helma.org/) 应用框架使用了 JSDoc
- SproutCore 是使用 JSDoc 生成的
- [Visual Studio](https://en.wikipedia.org/wiki/Visual_Studio), [WebStorm](https://en.wikipedia.org/wiki/WebStorm) 和许多其他的 IDE、编辑器，提供基于 JSDoc 注释的代码补全和辅助
-  [Atom](https://en.wikipedia.org/wiki/Atom_(text_editor)) 通过 [atom-easy-jsdoc](https://github.com/tgandrews/atom-easy-jsdoc) 插件支持 JSDoc

### 参见

- [Comparison of documentation generators](https://en.wikipedia.org/wiki/Comparison_of_documentation_generators)
- [Google Closure Tools](https://en.wikipedia.org/wiki/Google_Closure_Tools)