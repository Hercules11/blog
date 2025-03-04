---
title: 调试react源代码的步骤
tags: 教程
date: 2025-01-29 02:45:23
---

[全网最优雅的 React 源码调试方式](https://juejin.cn/post/7126501202866470949)

被教程坑了一把，react 在 19 版本以后就删除了 umd 的构建方式，导致原作者文章中提供的方法失效了。

具体表现为，在将 react 和 react-dom 替换为外部引用（即包含react编译后的源代码到react源代码的映射的map文件）的时候，文件系统不支持 cjs 类型的模块引用。本身项目是由 webpack 打包起来的，但是当作者将 react 和 react-dom 脱离 webpack 的管辖时，原有的模块系统也失效了。umd 本身是自包含的，可以不借助打包工具直接引入到浏览器中使用。

当我在想，是回退到作者演示的版本去搭建测试环境，还是想办法解决现有的模块引用问题的时候，我了问 chatgpt, 如何进行测试项目中的 react 源代码调试？

结果，chatgpt 告诉我可以用 yarn link，生成源文件模块的引用，再到测试项目中进行 yarn link [package name]。

于是乎，我用了 chatgpt 提示的方法，成功运行起了测试环境，也可以链接到 react 源代码进行调试。我发现和原作者讲的有一些不同，原作者认为 react 源代码编译到 单个文件 加 单个文件.map.js 的形式，再通过 webpack 打包到 bundle.js 到运行到浏览器中，调试工具不能触及 react 源代码。因为调试工具只解析一次 sourceMap。我实际测试发现，可以正常调试 react 源代码，调试工具会定位原文件的位置。

![2025-01-29-025642](/blog/images/2025-01-29-025642.png)