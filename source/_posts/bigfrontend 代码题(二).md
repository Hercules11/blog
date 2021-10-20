---
title: bigfrontend 代码题(二)
date: 2021-10-19 16:17:53
tags: 做题
---

# 4. 手写throttle()

Throttle是web应用中经常用到的技巧，通常情况下你应该使用现有的实现，比如[lodash throttle()](https://lodash.com/docs/4.17.15#throttle) 。

你能够自己实现一个基本的`throttle()`吗？

再次说明一下，`throttle(func, delay)`返回一个function，这个function无论多么频繁地调用，原始的func的调用也不会超过指定的频率。

比如，这是throttle之前的调用

─A─B─C─ ─D─ ─ ─ ─ ─ ─ E─ ─F─G

按照3个单位进行throttle过后

─A─ ─ ─C─ ─ ─D ─ ─ ─ ─ E─ ─ ─G

注意到

- A因为不在任何的冷却时间，所以立即被执行
- B被跳过了，因为B和C都在A的冷却时间里。

**注意**

1. 请按照以上spec完成代码。以上逻辑和`lodash.throttle()`并不完全一致
2. 因为 `window.setTimeout` 和 `window.clearTimeout` 并不精确。所以在test你写的代码的时候，这两个方法会被替换为静态的实现。不过不用担心，interface是一样的。

大概会按照以下的样子进行代码测试。

```js
let currentTime = 0

const run = (input) => {
  currentTime = 0
  const calls = []

  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }

  const throttled = throttle(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => throttled(arg), time)
  })
  return calls
}

expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['A@0', 'C@3'])
```

ans:

```js
/**
 * @param {Function} func
 * @param {number} wait
 */
function throttle(func, wait) {
  // your code here
  let timerId, lastArgs;
  return function throttled(...args) {
    if(!timerId) {
      func.apply(this, args);
      timerId = setTimeout(() => {
        if(lastArgs) {
          func.apply(this, lastArgs); 
          clearTimeout(timerId);
        }
      }, wait)
    } else {
      lastArgs = args;
    }
  }
}
// throttle 节流阀，节流，也就是说在一定时间内，只执行一次，冷却时间过后, 再执行下一次事件，在冷却时间内的调用，会被推到定时器时间结束
```

<hr>

# 5. 手写throttle()并支持leading 和 trailing

该题目是[4. 手写throttle()](https://bigfrontend.dev/zh/problem/implement-basic-throttle)的后续，请先完成第4题。

本题目中你需要实现一个增强的`throttle()`，使其支持第三个参数`option: {leading: boolean, trailing: boolean}`

1. leading: 是否立即执行
2. trailing: 是否在冷却后执行

[4. 手写throttle()](https://bigfrontend.dev/zh/problem/implement-basic-throttle()) 实际上是 `{leading: true, trailing: true}`的特殊情形。

**具体说明**

同样地按照之前的3单位的throttle来举例。

─A─B─C─ ─D─ ─ ─ ─ ─ ─ E─ ─F─G

用`{leading: true, trailing: true}`来throttle后，我们得到

─A─ ─ ─C─ ─ ─D ─ ─ ─ ─ E─ ─ ─G

如果是 `{leading: false, trailing: true}`，A 和 E 被跳过了

─ ─ ─ ─C─ ─ ─D─ ─ ─ ─ ─ ─ ─G

如果是 `{leading: true, trailing: false}`，只有 A D E 被保留

─A─ ─ ─ ─D─ ─ ─ ─ ─ ─ E

如果是 `{leading: false, trailing: false}`，显而易见，什么都不会发生

**注意**

1. 请按照以上spec完成代码。以上逻辑和`lodash.throttle()`并不完全一致
2. 因为 `window.setTimeout` 和 `window.clearTimeout` 并不精确。所以在test你写的代码的时候，这两个方法会被替换为静态的实现。不过不用担心，interface是一样的。

大概会按照以下的样子进行代码测试。

```js
let currentTime = 0

const run = (input) => {
  currentTime = 0
  const calls = []

  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }

  const throttled = throttle(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => throttled(arg), time)
  })
  return calls
}

expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['A@0', 'C@3'])
```

ans:

```js
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} option.leading
 * @param {boolean} option.trailing
 */
function throttle(func, wait, option = {leading: true, trailing: true}) {
  // your code here
  let timerId, lastArgs;
  return function throttled(...args) {
    const waitFunc = () => {
      if(option.trailing && lastArgs) {
        func.apply(this, lastArgs);
        lastArgs = null;
        timerId = setTimeout(waitFunc, wait)
      } else {
        timerId = null;
      }
    }
    if(!timerId) {
      if(option.leading) {
        func.apply(this, args);
      }
      timerId = setTimeout(waitFunc, wait);
    } else {
      lastArgs = args;
    }
  }
}

// 难度还是挺大的，最关键的是要明白，在冷却时间后，要不要再设置定时器
// 根据题目要求，根据lastyargs 和trailing 参数，决定是否设置定时器
```

<hr>

# 6. 手写debounce()

**Debounce是web应用中经常用到的技巧，通常情况下你应该使用现有的实现，比如[lodash debounce()](https://lodash.com/docs/4.17.15#debounce) 。**

你能够自己实现一个基本的`debounce()`吗？

比如，在debounce之前如下的调用

─A─B─C─ ─D─ ─ ─ ─ ─ ─E─ ─F─G

经过3单位的debounce之后变为了

─ ─ ─ ─ ─ ─ ─ ─ D ─ ─ ─ ─ ─ ─ ─ ─ ─ G

**注意**

1. 请按照以上spec完成代码。以上逻辑和`lodash.debounce()`并不完全一致
2. 因为 `window.setTimeout` 和 `window.clearTimeout` 并不精确。所以在test你写的代码的时候，这两个方法会被替换为静态的实现。不过不用担心，interface是一样的。

大概会按照以下的样子进行代码测试。

```js
let currentTime = 0

const run = (input) => {
  currentTime = 0
  const calls = []

  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }

  const throttled = throttle(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => throttled(arg), time)
  })
  return calls
}

expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['A@0', 'C@3'])
```

ans:

```js
/**
 * @param {Function} func
 * @param {number} wait
 */
function debounce(func, wait) {
  // your code here
  let timerId, lastArgs;
  return function debouced(...args) {
    const waitFunc = () => {
      if(!lastArgs) {
        func.apply(this, args);
      } else {
        func.apply(this, lastArgs);
        lastArgs = null;
      }
      timerId = null;
    }
    if(timerId) {
      lastArgs = args;
      clearTimeout(timerId);
    }
    timerId = setTimeout(waitFunc, wait);
  }
}

// 防抖也是一段时间后，再执行函数，不过冷却时间内有新的事件，那么定时器时间则重新开始计算
```

<hr>

# 7. 手写debounce()并支持leading 和 trailing

该题目是[6. 手写debounce()](https://bigfrontend.dev/zh/problem/implement-basic-debounce)的延续，请先完成第6题。

本题目中你需要实现一个增强的`debounce()`，使其支持第三个参数`option: {leading: boolean, trailing: boolean}`

1. leading: 是否立即执行
2. trailing: 是否在冷却后执行

[6. 手写debounce()](https://bigfrontend.dev/zh/problem/implement-basic-debounce) 实际上是 `{leading: false, trailing: true}`的特殊情形。

**具体说明**

还是之前的3单位的例子来说明。

─A─B─C─ ─D─ ─ ─ ─ ─ ─ E─ ─F─G

用`{leading: false, trailing: true}`来debounce过后，我们得到：

─ ─ ─ ─ ─ ─ ─ ─D─ ─ ─ ─ ─ ─ ─ ─ ─ G

如果是`{leading: true, trailing: true}`的话：

─A─ ─ ─ ─ ─ ─ ─D─ ─ ─E─ ─ ─ ─ ─ ─G

如果是`{leading: true, trailing: false}`：

─A─ ─ ─ ─ ─ ─ ─ ─ ─ ─E

如果是 `{leading: false, trailing: false}`，当然，什么都不会发生。

**注意**

1. 请按照以上spec完成代码。以上逻辑和`lodash.debounce()`并不完全一致
2. 因为 `window.setTimeout` 和 `window.clearTimeout` 并不精确。所以在test你写的代码的时候，这两个方法会被替换为静态的实现。不过不用担心，interface是一样的。

大概会按照以下的样子进行代码测试。

```js
let currentTime = 0

const run = (input) => {
  currentTime = 0
  const calls = []

  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }

  const throttled = throttle(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => throttled(arg), time)
  })
  return calls
}

expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['A@0', 'C@3'])
```

ans:

```js
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} option.leading
 * @param {boolean} option.trailing
 */
function debounce(func, wait, option = {leading: false, trailing: true}) {
  // your code here
  let timerId, lastArgs;
  return function debouced(...args) {
    const waitFunc = () => {
      if(option.trailing) {
        if(lastArgs) {
          func.apply(this, lastArgs);
          lastArgs = null;
        }
      }
      timerId = null;
    }
    if(timerId) {
      lastArgs = args;
      clearTimeout(timerId);
    } else {
      if(option.leading) {
        func.apply(this, args);
      } else {
        lastArgs = args; // 陷阱：option.leading 为false, 的时候，冷却时间到了，开头的事件也是要执行的 
      }
    }
    timerId = setTimeout(waitFunc, wait);
  }
}
```

