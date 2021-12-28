---
title: 清除浮动clear
date: 2021-12-15 16:49:31
tags: 记笔记
---

# [clear](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)

 **`clear`** [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) 属性指定一个元素**是否必须移动(清除浮动后)到在它之前的浮动元素下面**。`clear` 属性适用于浮动和非浮动元素。

<div><iframe class="interactive" height="390" src="https://interactive-examples.mdn.mozilla.net/pages/css/clear.html" title="MDN Web Docs Interactive Example" loading="lazy"></iframe></div>

当应用于非浮动块时，它将非浮动块的[边框边界](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)移动到所有相关浮动元素[外边界](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)的下方。这个非浮动块的[垂直外边距](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)会折叠。

另一方面，两个浮动元素的垂直外边距将不会折叠。当应用于浮动元素时，它将元素的[外边界](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)移动到所有相关的浮动元素[外边框边界](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)的下方。这会影响后面浮动元素的布局，后面的浮动元素的位置无法高于它之前的元素。