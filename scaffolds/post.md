---
title: 奇怪的换行
date: 2024-09-24 10:36:23
tags: 编程难题
---

![image-20240924102051222](/blog/source/images/image-20240924102051222.png)

在一个 div 元素内部渲染了很多 span 子元素，并且 div 的样式被定义为：

```css
width: 50%;
overflow: hidden;
```

正常情况下，不在 div 内容区域的元素都会被隐藏。

但是偶尔有元素，不按预想的方式溢出隐藏，而是直接换行了。

![image-20240924102051222](/blog/source/images/2024-09-24 102730.png)

使我百思不得其解。

问了chatgpt 后，觉得可能是样式没有正常生效。观察了一番，看到了每次换行前的一个元素是包含空格的。类似：

```html
<span>projector lens<span>（overflow）
```

让我想到，可能是没有禁用换行引起的问题。

随后在父元素上加上了：

```css
white-space: nowrap;
```

问题解决。

至于为什么会出这样的问题——渲染包含空格的 span 后，之后的元素另起一行？

是什么让渲染器猛然觉得自己要换行来着。

