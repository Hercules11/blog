---
title: Express cors 中间件和自定义中间件函数设置 Header 的区别
date: 2024-03-25 10:57:54
tags: 后端开发
---

今天又踩了个大坑，问题是这样的。
我正在使用 `GraphQL` 的 SANDBOX 环境测试接口，需要 `Express` 配置跨域。origin 的值是 `https://studio.apollographql.com` , 本来是一件很简单的事情，但是我又折腾了一个下午。

一开始沙盒环境请求 `http://localhost:8080/graphql` 报错，
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at [http://localhost:8080/graphql](http://localhost:8080/graphql "http://localhost:8080/graphql"). (Reason: CORS request did not succeed). Status code: (null).
```
我心想这简单，配置一下` Access-Control-Allow-Origin` 设置为 `*` 即可。但是呢，因为后续需要模拟登录状态，保存 Cookie, 需要设置 `Access-Control-Allow-Credentials` 为 `true`, 那么 `Access-Control-Allow-Origin` 就不能为 `*` 通配符了。所以 `Access-Control-Allow-Origin` 需要设置为具体的值 `https://studio.apollographql.com` ，形成一个类似于白名单的效果。<br>
最终的设置:
```js
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://studio.apollographql.com"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE"
    );
    next();
});
```
但是 `GraphQL` 的沙盒环境还是一直报错，`405 Method Not Allowed` , 即使设置了 `Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE` 也不行，预检请求响应字段里面还有一个 `ALLOW: "GET, POST"`, 看了一下 MDN 文档，发现是 405 的响应必须要一个 ALLOW 字段，显示当前 server 支持的请求方法列表。

**我的疑惑来了，我明明配置了跨域的请求方法，为什么还会报错**？

想了好久。<br>
用 `cors` 中间件设置跨域的参数:
```js
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);
```
居然就不报错了，奇怪啊。去翻看了一下 `cors` 的源代码，不长，就两百多行。

我发现除了一些基础的配置之外， `cors` 做了一个判断，当请求的方法是 `OPTIONS` 的时候，直接 `res.end()` 结束了响应，而其他情况，则调用 `next()`, 继续往下运行。

到这个时候，我明白了。<br>
OPTIONS 预检请求，是询问 server 是否当前 origin 可以访问，一般来讲，预检请求成功返回，就是代表 origin 可以做请求了（由浏览器控制）。这个时候，server 再定义一些字段来精细化控制后续的请求。<br>
我遇到的情况报错是因为, 针对预检请求，没有做特殊处理，导致后续的 `Apollo Server` 对这个 `OPTIONS` 请求报错了，导致预检请求失败。前面所做的配置，也就无效了。<br>
所以说, 自定义预检请求的中间件函数应该这样写:
```js
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://studio.apollographql.com"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE"
    );
    if (req.method === "OPTIONS") {
        res.send();
    } else {
        next();
    }
});
```
针对预检请求，设置完参数后，直接返回，不要让后续的中间件再进行处理了。<br>
弄清楚问题后，我直接注释了我写的配置，直接使用用 `cors` 中间件配置, 一了百了。