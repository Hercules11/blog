---
title: npm命令行参数
date: 2021-11-25 20:25:29
tags: 文档摘抄
---

[npm Docs](https://docs.npmjs.com/)

本文将介绍 `npm CLI` 即 npm 命令行 常用操作参数的含义，给他们做一个汇总。

概要：

```bash
npm <command> [args]
```

## npm init

`npm iniy <iniyializer>` 用来初始化一个npm 包。

e.g. 创建一个 esm 兼容的包，

```bash
$ mkdir my-esm-lib && cd my-esm-lib
$ npm init esm --yes
# 使用 -y 或者 --yes 跳过所有提问
```

## npm install

`npm install` 用来安装包所依赖的包，

默认安装 package.json 里的依赖，如果包内有 packa-lock.json 或者 npm-shrinkwrap.json, yarn.lock 文件，则安装上述文件所指明的依赖。

使用 `-g` 或者 `--global`, 指明安装的包的上下文环境为全局环境。

设置 `--production` 标志或者 `NODE_ENV` 环境变量为 `production` , npm 将不会安装在 `devDependencies` 中列出的包。可以设置 `--production=false` 否掉生产环境，使得npm 安装 `dependencies` 和 `devDependcies` 内的包。

**`-P， --save-prod` 包将默认出现在 `dependencies` 中。**

**`-D，--save-dev` 包将出现在 `devDependencies` 中**

`-O， --save-optional` 包将出现在 `optionalDepencies` 中

`--no-save` 包不出现在 `dependcies` 中

## npx

`npm exec -- <pkg>[@<version>] [args...]` 运行本地或者远程的包