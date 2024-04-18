---
title: ts-node-dev + redis 运行 demo 踩坑记录
date: 2024-03-19 10:57:01
tags: 后端开发
---

运行一个后端的小 demo, 技术栈是 ts-node-dev + redis + express。耽误了一整天, 就做了这点事, 不写个文章记录一下，真对不起我花的这么多时间。

第一个坑点:
```
error TS2688: Cannot find type definition file for 'ioredis'.
  The file is in the program because:
    Entry point for implicit type library 'ioredis'
```
这是 `tsconfig.json` 文件报的错。疑惑的是，我明明安装了 `@types/ioredis` 依赖包，似乎没有起作用。去搜索了一下原因，发现仓库赫然写着:
```
Author message:

This is a stub types definition. ioredis provides its own type definitions, so you do not need this installed.
```
也看了其他的解决方案，说是把版本降到 4.x。但是呢，我想着作者已经用 ts 升级了依赖，为什么还要走老路呢。于是我干脆利落地卸载了 `@types/ioredis`。发现问题并没有解决，**遇事不绝，重启 vscode**。再次打开项目时，第一个问题真的解决好了。

第二个坑点：
`error TS2339: Property 'userid' does not exist on type 'Session & Partial<SessionData>'`, 这个问题一看就是定义的属性不存在于 `Seesion` 类型上面。但是这里我们需要把自定义的数据属性放到 `req.session` 对象上，就必须要用到自定义属性，怎么解决呢？去找了一些解决方案，发现可以使用 ts 的 `Declaring Merging` **声明融合**功能，为原先的类型扩充属性。

```
import { Session } from "express-session";

declare module "express-session" {
    interface Session {
        userid: string | undefined;
        loadedCount: number;
    }
}
```

第三个坑点: 自定义的类型没有生效，查看了一些解决方案后，发现可以为 `tsconfig.json` 配置文件添加 `typeRoots` 属性值。
像这样
```
"typeRoots": [
      "./src/types", // this is where you define your types
       "./node_modules/@types" //this where npm packages containing types are located
    ],                                  /* Specify multiple folders that act like './node_modules/@types'. */
```
定义了类型后，发现 vscode 的错误提示还是存在，没办法，再次重启。好了，红色波浪线不见了，但是命令行运行 `ts-node-dev --respawn src/index.ts` 还是报错, 属性不存在, 愁死我了。心想，`ts-node-dev` 是不是没有加载根目录的配置文件。看到启动 `ts-node-dev` 打印的 ts 版本与当前项目的 ts 版本不一致，让我觉得这样想准没错。找了半天文档，没看见啥命令行 options 可以打印当前的配置的。问题再度陷入了僵局，我左思右想，在 `ts-node-dev` 的 npm 仓库介绍，看到这样一句话
```
Tweaked version of node-dev that uses ts-node under the hood.
```
是不是应该从 `ts-node` 寻找突破口。
果然让我发现了 `--showConfig` 可以打印配置信息，前往 vscode 终端一试，发现我自定义的类型文件是包含在里面的。也就是说，定义的配置文件是加载到了，问题又进入了僵局。
接着搜索名，看看其他人有什么解决方案。
```
By default, `ts-node` does not load `files`, `include` or `exclude` from `tsconfig.json` on startup. The `--files` option enables it.

See <https://github.com/TypeStrong/ts-node#missing-types>
```
终于破案了，这个坑太大了，谁能想得到。因为 `ts-node-dev` 是基于 `ts-node` 构建的，对于后者有效的配置，前者也有效。终于耗了我一整个下午的问题终于解决了。

第四个坑点:
`TypeError: Class constructor RedisStore cannot be invoked without 'new'`。问题还是出在教学示例使用的依赖版本偏低了。升级后的依赖做了 breaking changes。找到了官方发布的 [release log](https://github.com/tj/connect-redis/releases/tag/v7.0.0)。重写了实例化 redisStore 的代码。现在一切正常了。

总结反思：学习编程就是这样不断的发现问题，解决问题的过程。解决问题的思路，会越来越开阔，随着对问题的刨析，也会越来越清晰。这就是编程的魅力啊。