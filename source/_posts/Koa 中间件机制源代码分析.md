---
title: Koa 中间件源代码分析
date: 2024-06-27 01:26:23
tags: 源代码分析
---

首先是通过 app.use 收集中间件函数

```js
  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    // 收集中间件函数到数组中
    this.middleware.push(fn);
    return this;
  }
```

返回一个用于原生 http server 的回调

```js
  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */

  callback() {
      // 构建中间件机制模型
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      if (!this.ctxStorage) {
        return this.handleRequest(ctx, fn);
      }
        // 执行中间件相关函数
      return this.ctxStorage.run(ctx, async() => {
        return await this.handleRequest(ctx, fn);
      });
    };

    return handleRequest;
  }

```

中间件机制模型 koa-compose

```js
/**
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  // 中间件机制核心代码
  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch(i) {
      // i 始终大于 index, 否则是 next 被调用多次
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i] // 获取到当前执行的中间件函数
      if (i === middleware.length) fn = next // 如果 i-arr.length 那么则执行完毕，fn === undefined ，
      if (!fn) return Promise.resolve() // 当 fn 处于 undefined 时，结束执行，
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1))); // 执行 中间件函数，并且把dispath(i+1) 当作是 next（中间件函数内部的 next ） 函数执行
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

