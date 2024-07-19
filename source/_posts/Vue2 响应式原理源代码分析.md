---
title: Vue2 scheduler 源代码分析
date: 2024-07-18 17:26:23
tags: 源代码分析
---

在 Vue2 中，调度器（scheduler） 模块主要负责管理和协调多个 Watcher 的更新。它的作用是在 Vue 应用中高效地处理依赖变化，确保响应式数据变化时，相关的视图能够以优化地形式进行。

主要作用包括：

1. 批量更新
   - 调度器模块通过将多个 Watcher 的更新操作批量处理，避免在一次事件循环中进行多次 DOM 更新。这减少了不必要地渲染，提高了性能
2. 去重
   - 在同一事件循环中，如果一个 Watcher 被多次触发更新，调度器模块会确保整个 Watcher 制备运行一次。这是通过 ID 去重机制实现的。
3. 调度优先级
   - 不同类型的 Watcher (如渲染 Watcher 和 计算属性 Watcher) 有不同的优先级。调度器模块通过一个队列管理这些 Watcher，并按照优先级顺序进行更新
4. 延迟执行
   - 使用 `nextTick` 函数将 Watcher 更新推迟到下一个事件循环，这样可以确保所有同步操作完成后，再进行 DOM 更新，避免中间态造成的不必要更新。

```js
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher(watcher: Watcher) { // 属性更新的时候，需要进行入队，也就是说这个 watcher 资源需要更新了
  const id = watcher.id
  if (has[id] != null) { // 通过 id 去重
    return
  }

  if (watcher === Dep.target && watcher.noRecurse) { 
    return
  }

  has[id] = true
  if (!flushing) {
    queue.push(watcher) // 队列，直接任务入队
  } else {
    // if already flushing, splice the watcher based on its id
    // if already past its id, it will be run next immediately.
    let i = queue.length - 1
    while (i > index && queue[i].id > watcher.id) {
      i--
    }
    queue.splice(i + 1, 0, watcher)
  }
  // queue the flush
  if (!waiting) {
    waiting = true

    if (__DEV__ && !config.async) {
      flushSchedulerQueue() // 同步的短化，直接运行
      return
    }
    nextTick(flushSchedulerQueue) // 异步则延迟到下一个事件循环
  }
}

```

```js
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(sortCompareFn)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (__DEV__ && has[id] != null) { // ：在开发环境中，检查并防止循环更新。如果观察者的 ID 再次被标记为非空，表示发生了循环更新。
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' +
            (watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice() // 包含所有在本次调度过程中被激活的组件。
  const updatedQueue = queue.slice() // 本次调度中被更新的组件

  // 创建副本是为了确保在重置调度器状态之前保留这些队列的当前状态。
  resetSchedulerState() // 重置调度器的状态，包括清空队列、重置相关标志和计数器。

    // 确保组件在其激活和更新时执行相应的生命周期钩子。
  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)
  cleanupDeps()

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) { // 如果启用了开发工具，触发 flush 事件。这允许开发工具在调度队列被清空时做出相应反应。
    devtools.emit('flush')
  }
}
```

```js
export function callHook(
  vm: Component,
  hook: string,
  args?: any[],
  setContext = true
) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const prevInst = currentInstance
  const prevScope = getCurrentScope()
  setContext && setCurrentInstance(vm)
  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, args || null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  if (setContext) {
    setCurrentInstance(prevInst)
    prevScope && prevScope.on()
  }

  popTarget()
}

```

`callHook` 函数是 Vue.js 框架中一个非常重要的内部函数，用于调用组件实例的生命周期钩子函数。生命周期钩子是 Vue.js 中定义的一系列方法，在组件的不同阶段被自动调用，比如 `created`、`mounted`、`updated`、`destroyed` 等。

### `callHook` 函数的实现

下面是 `callHook` 函数的源码：

```javascript
function callHook(vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```

### 详细解释

#### 1. `pushTarget()`

```javascript
pushTarget()
```

- `pushTarget()`：暂时禁用依赖收集（Dep collection）。
  - Vue.js 使用一个全局的 `Dep.target` 来跟踪当前正在计算的依赖项。在调用生命周期钩子时，我们不希望收集任何依赖项，因此需要禁用依赖收集。

#### 2. 获取生命周期钩子处理函数

```javascript
const handlers = vm.$options[hook]
const info = `${hook} hook`
```

- `const handlers = vm.$options[hook]`：从组件实例的选项中获取相应的生命周期钩子函数。
  - `vm.$options` 是组件实例的配置对象，包含了所有的生命周期钩子函数。
  - `hook` 是钩子函数的名称，比如 `created`、`mounted`、`updated` 等。
- `const info = `${hook} hook`：为当前钩子函数调用生成一个描述信息，主要用于错误处理和调试。

#### 3. 调用生命周期钩子函数

```javascript
if (handlers) {
  for (let i = 0, j = handlers.length; i < j; i++) {
    invokeWithErrorHandling(handlers[i], vm, null, vm, info)
  }
}
```

- `if (handlers)`：检查是否存在相应的生命周期钩子函数。
- 如果存在，将通过 `for` 循环遍历并调用每一个钩子函数。
  - `invokeWithErrorHandling`：安全地调用钩子函数，捕获和处理任何错误。
    - `handlers[i]`：当前生命周期钩子函数。
    - `vm`：当前组件实例。
    - `null`：调用钩子函数时传递的参数（这里没有参数）。
    - `vm`：调用钩子函数时的上下文。
    - `info`：钩子函数调用的描述信息。

`invokeWithErrorHandling` 函数的定义如下：

```javascript
function invokeWithErrorHandling(handler, context, args, vm, info) {
  let res
  try {
    res = args ? handler.apply(context, args) : handler.call(context)
  } catch (e) {
    handleError(e, vm, info)
  }
  return res
}
```

该函数通过 `try-catch` 块调用生命周期钩子函数，以便在出现错误时进行处理。

#### 4. 触发钩子事件

```javascript
if (vm._hasHookEvent) {
  vm.$emit('hook:' + hook)
}
```

- `if (vm._hasHookEvent)`：检查组件实例是否监听了生命周期钩子事件。
  - Vue.js 允许使用事件机制监听生命周期钩子，通过 `$emit` 触发这些事件。
- `vm.$emit('hook:' + hook)`：触发相应的钩子事件，例如 `hook:mounted`、`hook:updated` 等。

#### 5. `popTarget()`

```javascript
popTarget()
```

- `popTarget()`：恢复依赖收集状态。
  - 在禁用依赖收集后调用，恢复到之前的状态，允许接下来的依赖收集正常进行。

### 总结

`callHook` 函数的主要作用是：

1. 暂时禁用依赖收集，以确保生命周期钩子调用不会干扰响应式系统。
2. 从组件实例的选项中获取相应的生命周期钩子函数。
3. 安全地调用每一个钩子函数，并处理任何可能的错误。
4. 如果组件实例监听了生命周期钩子事件，触发相应的事件。
5. 恢复依赖收集状态。

通过这些步骤，`callHook` 函数确保了 Vue.js 在组件生命周期的各个阶段能够正确地执行开发者定义的钩子函数，同时维护响应式系统的完整性和稳定性。