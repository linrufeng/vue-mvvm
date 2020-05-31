import Dep from "./dep.js";
/**
 * Observer 主要用来完成数据变化劫持,通过 defineProperty 的特性，当数据被劫持时候通过 Dep 订阅 存入一个 Watcher （观察者），在数据发生变化时候 Observer 通过 set 下面的 dep.notify 发放通知当前的观察者
 */
export default class Observer{
    constructor(data) {
        this.observe(data)
    }
    observe(data){
        // 如果不存在或者不是对象返回
        if (!data || Object.prototype.toString.call(data) !== '[object Object]') {
            return
        }
        // 将数据一一劫持
        Object.keys(data).forEach(key => {
            // 劫持
            this.defineReactive(data, key, data[key])
            //递归深度劫持
            this.observe(data[key]) 
        })
    }
    defineReactive(obj,key,value){
        let that = this;
        // 这是一个循环 每个循环都有一个 Dep 的实例他们都是对于每个 key 之间不会有干扰。
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() { // 取值时调用的方法
                // watch 的 getVal 触发了observe中的 get 在之前先 Dep.target = this 见 wathcer 22h行
                // dep.addSub 把这个 new Watch 的实例存在数组里面了
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) { // 当给data属性中设置的时候，更改属性的值
                if (newValue !== value) {
                    // 这里的this不是实例
                    that.observe(newValue) // 如果是对象继续劫持
                    value = newValue;
                    dep.notify(); //通知所有人更新了
                }
            }
        })
    }

}