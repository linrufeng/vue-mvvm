/**
 * 订阅器
 * 它在主要用来在数据节流器初始化一个实例来添加该数据的观察者
 * 
 */
export default class Dep {
    constructor() {
        // 订阅的数组
        this.subs = []
    }

    addSub(watcher) {
        this.subs.push(watcher)
    }

    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}