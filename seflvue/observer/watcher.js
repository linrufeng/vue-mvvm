
import Dep from "./dep.js";

/**
 *  观察者用来给想要监听的数据添加一个订阅 dep 当数据变化时候 watcher 对数据有个反馈 cd 它通过订阅器 dep 中的 notify 触发 updata
 * 可以理解为 watcher 是用来对需要监听数据变化的一个行为的反馈,当需要监听的数据数据变化时候做什么 
 */
export default class Watcher{
    constructor(vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;

        // 先获取下老的值为了触发 observe 的 get 方法
        this.value = this.get();
        debugger
    }
    getVal(vm, key) { // 获取实例上对应的数据
        key = key.split('.');
        return key.reduce((prev, next) => { //vm.$data.a
            return prev[next]
        }, vm.$data)
    }

    get() {
        Dep.target = this;
        // 这一步为了触发 observer 里面的 get
        let value = this.getVal(this.vm, this.key);
        Dep.target = null;
        return value
    }

    // 对外暴露的方法
    update(){
        let newValue = this.getVal(this.vm, this.key);
        let oldValue = this.value

        if(newValue !== oldValue){
            this.cb(newValue); // 对应 watch 的callback
        }
    }

}