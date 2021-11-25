---
title: CSS高频面试题
date: 2021-11-25 23:09:37
tags: 学习总结
---

CSS 面试题

盒模型：

![](/blog/images/posts/photo_2021-11-21_00-39-09.jpg)

在标准模型中，如果你给盒设置 `width` 和 `height`，实际设置的是 *content box*。 padding 和 border 再加上设置的宽高一起决定整个盒子的大小。默认浏览器会使用标准模型。如果需要使用替代模型，您可以通过为其设置 `box-sizing: border-box` 来实现。

---

BFC: （创建一个块级的上下文环境， like function scope）

块格式化上下文对浮动定位（参见 [`float`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float)）与清除浮动（参见 [`clear`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)）都很重要。浮动定位和清除浮动时只会应用于同一个BFC内的元素。浮动不会影响其它BFC中元素的布局，而清除浮动只能清除同一BFC中在它前面的元素的浮动。外边距折叠（[Margin collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)）也只会发生在属于同一BFC的块级元素之间。

---

选择器:

| 选择器                                                       | 示例                | 学习CSS的教程                                                |
| :----------------------------------------------------------- | :------------------ | :----------------------------------------------------------- |
| [类型选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Type_selectors) | `h1 { }`            | [类型选择器](https://developer.mozilla.org/zh-CN/docs/user:chrisdavidmills/CSS_Learn/CSS_Selectors/Type_Class_and_ID_Selectors#Type_selectors) |
| [通配选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors) | `* { }`             | [通配选择器](https://developer.mozilla.org/zh-CN/docs/user:chrisdavidmills/CSS_Learn/CSS_Selectors/Type_Class_and_ID_Selectors#The_universal_selector) |
| [类选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Class_selectors) | `.box { }`          | [类选择器](https://developer.mozilla.org/zh-CN/docs/user:chrisdavidmills/CSS_Learn/CSS_Selectors/Type_Class_and_ID_Selectors#Class_selectors) |
| [ID选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/ID_selectors) | `#unique { }`       | [ID选择器](https://developer.mozilla.org/zh-CN/docs/user:chrisdavidmills/CSS_Learn/CSS_Selectors/Type_Class_and_ID_Selectors#ID_Selectors) |
| [标签属性选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors) | `a[title] { }`      | [标签属性选择器](https://developer.mozilla.org/zh-CN/docs/User:chrisdavidmills/CSS_Learn/CSS_Selectors/Attribute_selectors) |
| [伪类选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes) | `p:first-child { }` | [伪类](https://developer.mozilla.org/zh-CN/docs/User:chrisdavidmills/CSS_Learn/CSS_Selectors/Pseuso-classes_and_Pseudo-elements#What_is_a_pseudo-class) |
| [伪元素选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements) | `p::first-line { }` | [伪元素](https://developer.mozilla.org/zh-CN/docs/User:chrisdavidmills/CSS_Learn/CSS_Selectors/Pseuso-classes_and_Pseudo-elements#What_is_a_pseudo-element) |
| [后代选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Descendant_combinator) | `article p`         | [后代运算符](https://developer.mozilla.org/zh-CN/docs/User:chrisdavidmills/CSS_Learn/CSS_Selectors/Combinators#Descendant_Selector) |
| [子代选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Child_combinator) | `article > p`       | [子代选择器](https://developer.mozilla.org/zh-CN/docs/User:chrisdavidmills/CSS_Learn/CSS_Selectors/Combinators#Child_combinator) |
| [相邻兄弟选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Adjacent_sibling_combinator) | `h1 + p`            | [相邻兄弟](https://developer.mozilla.org/zh-CN/docs/User:chrisdavidmills/CSS_Learn/CSS_Selectors/Combinators#Adjacent_sibling) |
| [通用兄弟选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/General_sibling_combinator) | `h1 ~ p`            | [通用兄弟](https://developer.mozilla.org/zh-CN/docs/User:chrisdavidmills/CSS_Learn/CSS_Selectors/Combinators#General_sibling) |

---

层叠上下文:

把网页看作是面向用户的层叠的视图，那么可以用z-index 来指定渲染绘制的先后。`z-index` 属性设定了一个定位元素及其后代元素或 flex 项目的 z-order。 当元素之间重叠的时候， z-index 较大的元素会覆盖较小的元素在上层进行显示。

有点儿复杂，具体情况自己查。

---

两栏布局：

```css
 .container{
    display: flex;
  }
  .left{
    height: 200px;
    width: 100px;
    background-color: skyblue;
  }
  .right{
    height: 200px;
    flex: 1;    /* 自动填充满容器  */
    background-color: pink;
  }
/*
flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
flex-grow: 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大
flex-shrink: 定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
flex-basis: 给上面两个属性分配多余空间之前, 计算项目是否有多余空间, 默认值为 auto, 即项目本身的大小 */
```

三栏布局：

```css
.container{
  display: flex;
}
.left {
    background: green;
    width: 200px;
    height: 200px;;
}
.center {
    background: pink;
    height: 200px;;
    flex: 1;
}
.right {
    background: skyblue;
    width: 300px;
    height: 200px;;
}
```

一个 flex 走天下。

---

垂直居中：

水平居中很好处理，不外乎就是设定`margin:0 auto;`或是`text-align:center;`，就可以轻松解决掉水平居中的问题

```css
.use-flexbox{
    display:flex;
    align-items:center; // alignitems justify-content.
    justify-content:center; // 又是你， flexbox
    width:200px;
    height:150px;
    border:1px solid #000;
}
.use-flexbox div{
    width:100px;
    height:50px;
    background:#099;
}
```

---

自适应布局 rem原理:

在默认字体大小情况下，1em = 16px,那么0.625em=10px。

```css
em = desired element pixel value / parent element font-size in pixels
```

这样的话，为了简化Font-size的换算，我们在根元素中设置Font-size:62.5%, 需要多少像素，设置为十分之一 rem 即可

百分比是相对于父元素的尺寸。%的特点——百分比是相对于父元素的尺寸，这和em(相对于当前元素继承来的字体尺寸 )以及rem（相对于根元素的字体尺寸）都不同

---

评论区补充。。。