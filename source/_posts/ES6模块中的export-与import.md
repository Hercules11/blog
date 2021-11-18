---
title: ES6模块中的export 与import
date: 2021-11-19 01:44:23
tags: 学习总结
---

细说ES6模块中的export 与import。

1. 导出语句必须在模块顶级，不能嵌套在某个块中（import 同理）

   ```js
   // 允许
   export ... 
   // 不允许
   if (condition) { 
    export ... 
   } 
   ```

2. 命名导出 模块就好像是被导出的值的容器

   ```js
   // 允许
   const foo = 'foo'; 
   export { foo }; 
   
   // 允许
   export const foo = 'foo'; 
   
   // 允许，但应该避免
   export { foo }; 
   const foo = 'foo'; 
   ```

3. 别名必须在export 子句的大括号语法中指定（import 同理）

   ```js
   const foo = 'foo'; 
   export { foo as myFoo };
   ```

4. ES6 模块系统会识别作为别名提供的 default 关键字

   ```js
   const foo = 'foo'; 
   
   // 等同于 export default foo; 
   export { foo as default }; 
   ```

5. 正确示例

   ```js
   // 命名行内导出
   export const baz = 'baz'; 
   export const foo = 'foo', bar = 'bar'; 
   export function foo() {} 
   export function* foo() {} 
   export class Foo {}  // 一边声明就一边导出了
   
   // 命名子句导出
   export { foo }; 
   export { foo, bar }; 
   export { foo as myFoo, bar };  // 给它加个容器，反正都是要加进来的
   
   // 默认导出
   export default 'foo'; 
   export default 123; 
   export default /[a-z]*/; 
   export default { foo: 'foo' }; 
   export { foo, bar as default }; 
   export default foo 
   export default function() {} 
   export default function foo() {} 
   export default function*() {} 
   export default class {}  // 记住别名在子句，默认不行内，一个模块一个默认导出
   ```

   

6. 禁止项

   ```js
   // 会导致错误的不同形式：
   
   // 行内默认导出中不能出现变量声明
   export default const foo = 'bar';  // 关键字太多，解释器受不了😫
   
   // 只有标识符可以出现在 export 子句中
   export { 123 as foo }
   
   // 别名只能在 export 子句中出现
   export const foo = 'foo' as myFoo; // 过于奇怪，解释器不想理你
   ```

总结一下就是：

- 可以在声明时候导出，或者默认导出
- 可以把标识符放到括号里，可以在括号也就是子语句里面起别名

---

1. 与 export 类似，import 必须出现在 模块的顶级

2. 命名导出可以使用 `*` 批量获取并赋值给保存导 出集合的别名，而无须列出每个标识符

   ```js
   const foo = 'foo', bar = 'bar', baz = 'baz'; 
   export { foo, bar, baz } 
   import * as Foo from './foo.js';  // * 代表整个导出的对象
   
   console.log(Foo.foo); // foo 
   console.log(Foo.bar); // bar 
   console.log(Foo.baz); // baz
   ```

3. 如果模块同时导出了命名导出和默认导出，则可以在 import 语句中同时取得它们。可以依次列出 特定导出的标识符来取得，也可以使用*来取得

   ```js
   import foo, { bar, baz } from './foo.js'; 
   
   import { default as foo, bar, baz } from './foo.js'; 
   
   import foo, * as Foo from './foo.js'; // 除默认导出外。其它的导出打包到 *
   ```

总结一下就是：

- 默认导出，不加花括号，也就是说不用解构赋值
- 在括号中，可以起别名，可以`default as xx` 正如在导出时 `xx as default`