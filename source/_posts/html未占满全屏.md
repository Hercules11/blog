---
title: html未占满全屏
date: 2021-12-28 17:24:41
tags: bug fix
---



解决 html, body 元素未占满全屏的问题

设置

```css
html, body {
    width: 100%
}
```

后，并没有解决问题。

因为浏览器默认按照窗口大小（viewport）来设置 html 元素大小。于是，当页面缩小的时候，html 变小，但是页面元素的尺寸是写死的，于是越界，侧边出现白边。

解决办法是设置

```css
html, body {
	min-width: 1400px;
}
```

就是设置最小宽度，使得 html 元素包含内部元素。不随着窗口大小改变到最小值以下。