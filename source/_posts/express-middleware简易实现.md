---
title: Express Middleware 的简易实现
date: 2022-01-09 21:00:43
tags: 知识总结
---

原文地址：[Simple implementation principle of Express Middleware](https://programmer.ink/think/simple-implementation-principle-of-express-middleware.html)

简而言之，express 中间件，就是在服务器端处理**请求对象**和**响应对象**的函数。

遵循一个先注册，先执行的原则，通过调用`next()`函数，把执行权交给下一个函数。

核心代码：

```js
const next = () => {
    const stack = stacks.shift();
    if(stack) {
        stack(req, res, next);
    }
}
next();
```

express 简易实现的代码如下：

```js
const http = require('http')
const slice = Array.prototype.slice

 class Express {
     constructor() {
        this.router = {
            all: [], // Match all middleware functions
            get: [],
            post: []
        }
     }

     /**
      * Integrate middleware here
      * @param {string} path 
      * @returns {object}
      */
     middlewareHandler(path) {
        const info = {}
        if (typeof path === 'string') {
            // by use()、get()、post()、pass into <path> and <handler>
            // 如果包含路劲参数，那么第二个参数开始才是中间件函数
            info.path = path
            info.stack = slice.call(arguments, 1)  // Middleware array
        } else {
            // 只传进去中间件函数，那么全部是handler.
            info.path = '/'
            info.stack = slice.call(arguments, 0)
        }

        return info
     }

     use() {
        const allStack = this.middlewareHandler(...arguments)
        this.router.all.push(allStack)
     }

     get() {
        const getStack = this.middlewareHandler(...arguments)
        this.router.get.push(getStack)
     }

     post() {
        const postStack = this.middlewareHandler(...arguments)
        this.router.post.push(postStack)
     }
// 通过按照 方法 分类，建立 路径 到 处理函数 的映射
      /**
       * 
       * @param {string} method 
       * @param {string} url
       * @returns {Array} 
       */
     accordStack(method, url) {
        let stacks = []
        stacks = stacks.concat(this.router.all)
        stacks = stacks.concat(this.router[method])
        return stacks
        .filter(stack => {
            return url.indexOf(stack.path) !== -1
        }).map(item => item.stack[0]) // 这里有点问题，不应该只传进去第一个handler.
     }

     handler(req, res, stacks) {
         // Function expression
        const next = () => {
            const stack = stacks.shift()
            if(stack) {
                stack(req, res, next)
            }
        }
        next()
     }

     callback() {
        return (req, res) => {
            res.json = data => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            }
            
            // Get the request method and url, and filter the middleware functions
            const {method, url} = req
            const stacks = this.accordStack(method.toLowerCase(), url)
            this.handler(req, res, stacks)
        } 
     }

     listen(...args) {
         const server = http.createServer(this.callback())
         server.listen(...args)
     }
 }

 // Factory mode, export an instance object
module.exports = () => {
    return new Express()
}
```

