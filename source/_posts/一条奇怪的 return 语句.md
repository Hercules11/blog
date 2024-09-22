---
title: 一条奇怪的 return 语句
date: 2024-09-22 23:26:23
tags: 编程难题
---



```ts
    if (newVal) {
      let size = 0
      let deg = 450
      const intervalId = setInterval(() => {
        if (size >= 332) {
          clearInterval(intervalId)
          return
        }
        size += 332 / 60
        deg -= 6
        // 确保 target 是 SVGElement 类型
        const circle = target.value.children[0] as SVGElement
        const dot = target.value.children[1] as SVGElement
        // 使用 CSSStyleDeclaration 进行类型标注
        circle.style.strokeDashoffset = `${size}px`
        dot.style.transform = `rotate(${deg}deg)`
      }, 1000)
    } else {
      // 恢复初始状态
      // TODO: // 完成后没有立即执行
      // console.log('恢复动画')
      // target.value.children[0].style['stroke-dashoffset' as any] = '0px'
      // target.value.children[1].style['transform' as any] = 'rotate(450deg)'
      // 确保 target 是 SVGElement 类型
      const circle = target.value.children[0] as SVGElement
      const dot = target.value.children[1] as SVGElement

      // 使用 CSSStyleDeclaration 进行类型标注
      circle.style.strokeDashoffset = '0px'
      dot.style.transform = 'rotate(450deg)'
    }
```



清除定时器 Id 后面的 return 语句，是我一开始写的时候没有加上去，导致多跑了一次调度，动画尺寸对不上。而且还出现一个问题，当newVal 值变为 false 时，else 内部的代码，执行了，但是效果没有渲染到页面上，令我百思不得其解。

我想了好久，决定先解决动画尺寸问题，没想到 else 内部代码不执行的问题也自然而然地解决了。

问了 chatgpt, 回答如下：

> **添加 `return` 的作用**：
>
> - 当 `size` 达到 332 时，`clearInterval(intervalId)` 停止定时器，`return` 语句立即退出当前 `setInterval` 回调函数。
> - 如果没有 `return` 语句，即使定时器已被清除，`setInterval` 的回调函数仍然会继续执行剩下的代码，直到当前执行完毕。
> - 这种行为可能会导致在 `else` 分支中（`newVal` 为 `false` 的情况下）无法立即执行恢复动画的代码，因为定时器回调函数仍未完全退出，造成异步执行的错乱现象。
>
> **为何 `return` 使代码运行正常**：
>
> - `return` 语句在定时器回调函数中添加了一个退出点。当满足 `size >= 332` 的条件时，`clearInterval` 立即停止定时器的触发，并通过 `return` 退出当前的回调。
> - 这避免了回调中残余代码的执行，确保了在 `newVal` 为 `false` 时，立即执行 `else` 分支的逻辑，恢复动画至初始状态。

不是很能说服我，先放这里，以后有机会再来探索