---
title: Vue2 响应式原理源代码分析
date: 2024-07-17 22:26:23
tags: 源代码分析
---

Vue 的核心原理就是响应式，通俗一点来讲就是某个数据变化了，依赖它的数据，随之发生改变。

下面从源代码来分析，这个响应式原理的实现过程。这个过程涉及三个重要的对象，Observer、Dep、Watcher，通过 Observer 遍历对象的每一个属性，并且创建 Dep 实例，劫持 getter 和 setter 方法，将 Watcher 实例添加到每一个属性的 Dep 实例中（Watcher 实例在这里是一种访问数据元素的事物的抽象，可以是模板，可以是数据属性）：

1. 遍历对象属性，进行数据劫持

   ```js
   /**
          * Walk through all properties and convert them into
          * getter/setters. This method should only be called when
          * value type is Object.
          */
   const keys = Object.keys(value)
   for (let i = 0; i < keys.length; i++) {
       const key = keys[i]
       defineReactive(value, key, NO_INITIAL_VALUE, undefined, shallow, mock)
   }
   ```

2. 重写数据属性的 getter 和 setter 方法（重点关注核心逻辑，if 分支非必要不理睬）

   ```js
     Object.defineProperty(obj, key, {
       enumerable: true,
       configurable: true,
       get: function reactiveGetter() {
         const value = getter ? getter.call(obj) : val
         if (Dep.target) {
           if (__DEV__) {
             dep.depend({
               target: obj,
               type: TrackOpTypes.GET,
               key
             })
           } else {
             dep.depend() // 将当前的 DepTarget（Watcher 的实例，也就是依赖当前数据的抽象） 添加到当前属性 Dep 实例的 subs 数组中，进行依赖收集
           }
           if (childOb) {
             childOb.dep.depend()
             if (isArray(value)) {
               dependArray(value)
             }
           }
         }
         return isRef(value) && !shallow ? value.value : value
       },
       set: function reactiveSetter(newVal) {
         const value = getter ? getter.call(obj) : val
         if (!hasChanged(value, newVal)) {
           return
         }
         if (__DEV__ && customSetter) {
           customSetter()
         }
         if (setter) {
           setter.call(obj, newVal)
         } else if (getter) {
           // #7981: for accessor properties without setter
           return
         } else if (!shallow && isRef(value) && !isRef(newVal)) {
           value.value = newVal
           return
         } else {
           val = newVal
         }
         childOb = !shallow && observe(newVal, false, mock)
         if (__DEV__) {
           dep.notify({
             type: TriggerOpTypes.SET,
             target: obj,
             key,
             newValue: newVal,
             oldValue: value
           })
         } else {
           dep.notify() // 运行 subs 内部的 Watcher 实例的更新方法，Watcher 实例内部定义了更新策略，是数据还是模板
         }
       }
     })
   ```

3. 同步运行 watcher 的 run 方法，执行回调

   ```js
     /**
      * Scheduler job interface.
      * Will be called by the scheduler.
      */
     run() {
       if (this.active) { // run 方法会检查 watcher 是否处于活跃状态。如果 watcher 已经被停止（如通过 teardown 方法），则不会执行后续逻辑。
         const value = this.get() // 调用 this.get() 方法获取当前被观察的值。get 方法会重新评估表达式并触发依赖收集。
         if (
           value !== this.value ||
           // Deep watchers and watchers on Object/Arrays should fire even
           // when the value is the same, because the value may
           // have mutated.
           isObject(value) ||
           this.deep
         ) { // 比较当前值 (value) 和之前保存的值 (this.value)。如果新值与旧值不同，或者是对象类型（因为对象和数组的引用可能没有变化，但其内部的属性可能已经发生了变化），或者是深度监听（this.deep）的 watcher，则继续执行后续操作
           // set new value
           const oldValue = this.value
           this.value = value // 更新 watcher 的值。首先保存旧值，然后将新值赋给 this.value。
           if (this.user) {
             const info = `callback for watcher "${this.expression}"`
             invokeWithErrorHandling( // 这里的 this.user 用于区分用户自定义的 watcher 和内部的 watcher。对于用户自定义的 watcher，会调用 invokeWithErrorHandling 方法，以便在回调执行过程中捕获并处理错误。否则，直接调用回调函数 (this.cb) 并传入新旧值。
               this.cb,
               this.vm,
               [value, oldValue],
               this.vm,
               info
             )
           } else {
             this.cb.call(this.vm, value, oldValue)
           }
         }
       }
     }
   ```

4. 异步运行，进行 watcher 任务调度（例如 渲染Watcher 和 计算属性 Watcher）

   ```js
   /**
    * Push a watcher into the watcher queue.
    * Jobs with duplicate IDs will be skipped unless it's
    * pushed when the queue is being flushed.
    */
   export function queueWatcher(watcher: Watcher) {
     const id = watcher.id
     if (has[id] != null) {
       return // 每个 watcher 都有一个唯一的 id。has 对象用于记录当前队列中的 watcher。如果该 watcher 已经存在于队列中（通过检查 has[id]），则直接返回，避免重复添加。
     }
   
     if (watcher === Dep.target && watcher.noRecurse) {
       return // 如果当前的 watcher 是目标 watcher（Dep.target）并且 watcher 设置了 noRecurse 标志，则返回。这个检查用于防止递归 watcher 自身。
     }
   
     has[id] = true
     if (!flushing) {
       queue.push(watcher)
     } else {
       // if already flushing, splice the watcher based on its id
       // if already past its id, it will be run next immediately.
       let i = queue.length - 1
       while (i > index && queue[i].id > watcher.id) {
         i--
       }
       queue.splice(i + 1, 0, watcher) // 当前正在刷新队列（flushing 为 true），则根据 watcher 的 id 进行插入排序。通过从队列尾部向前查找，找到合适的位置插入新 watcher，以确保队列的顺序
     }
     // queue the flush
     if (!waiting) {
       waiting = true
   
        //  通过 watcher 队列，Vue 可以在一个事件循环内合并和处理所有的响应式数据变化。
       if (__DEV__ && !config.async) {
         flushSchedulerQueue()
         return
       }
       nextTick(flushSchedulerQueue)
     }
   }
   
   ```