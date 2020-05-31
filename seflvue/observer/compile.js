// "use strict";
import Watcher from "./watcher";
window.nodeArrayText =[];
// nodeArrayText[0].textContent
const CompileUtil = {
    getVal(vm, dataKey) { // 获取实例上对应的数据
       
        let dataKeyArray = dataKey.split('.'); // 处理 jsonText.text 的情况
        return dataKeyArray.reduce((prev, next) => { 
            return prev[next] // 譬如 vm.$data.jsonText.text、vm.$data.message
        }, vm.$data)
    },
    getTextVal(vm, expr) { // 获取文本编译后的结果 原理就是 replace {{name}} 为 vm 中 name 的实际值
        return expr.replace(/\{\{([^}]+)\}\}/g, () => {
            
            let keyval = RegExp.$1;
            return this.getVal(vm, keyval)           
        })
    },    
    text(node, vm, expr) { // 文本处理 参数 [节点, vm 实例, 指令的属性值]
        let updateFn = this.updater['textUpdater'];
        let value = this.getTextVal(vm, expr)
        updateFn && updateFn(node, value)
        nodeArrayText.push(node)
        expr.replace(/\{\{([^}]+)\}\}/g, () => {           
            new Watcher(vm, RegExp.$1, () => {
                console.log('textchange')
                // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
                updateFn && updateFn(node, this.getTextVal(vm, expr))
            })
        })
    },
    setVal(vm, expr, value) {
        expr = expr.split('.');
        // 收敛
        return expr.reduce((prev, next, currentIndex) => {
            if (currentIndex === expr.length - 1) {
                return prev[next] = value
            }
            return prev[next]
        }, vm.$data)
    },
    model(node, vm, expr) { // 输入框处理
        let updateFn = this.updater['modelUpdater'];
        
        updateFn && updateFn(node, this.getVal(vm, expr))
        // 我们知道了 model 其实就是input 框，而vue 对应 input 监听也是通过 input 的事件进行的。
        node.addEventListener('input',e=>{
            let inputVal = e.target.value;
            // 这一步通过监听 input 事件可以把 新得到的值更改 data
            this.setVal(vm, expr, inputVal)
           
            // this.updater.textUpdater(node,inputVal)

        })
       
        new Watcher(vm, expr, (newValue) => {
            console.log('inputchange')
            // 当值变化后会调用cb 将newValue传递过来（）
            updateFn && updateFn(node, this.getVal(vm, expr))
        })
    },
    updater: {
        // 文本更新
        textUpdater(node, value) {
             node.textContent = value
        },
        // 输入框更新
        modelUpdater(node, value) {
            node.value = value;
        }
    }
}
export default class Compile{
    /**
     * 
     * @param {Element} el 
     * @param {new MyVue Objcet} vm 
     */
    constructor(el,vm){        
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        this.vm = vm
        if(this.el){
            // fragment 文档碎片 放到内存中
            let fragment = this.node2fragment(this.el)

            console.log(fragment)
            // 对内存中的模板进行编译 本例子主要匹配 {{}} v-model
            this.compile(fragment)
            this.el.appendChild(fragment)            
        }
    }
    isElementNode(node){
        return node.nodeType === 1;
    }
    node2fragment(el){
        let fragment = document.createDocumentFragment();
        let i =0;
        while (el.firstChild) { // 移动DOM到文档碎片中
            i++;
            console.log(i,el.firstChild)
            fragment.appendChild(el.firstChild)
        }
        return fragment;
    }
    compile(fragment) {
        // 遍历节点 可能节点套着又一层节点 所以需要递归
        let childNodes = fragment.childNodes
        console.log('childNodes',childNodes)
        Array.from(childNodes).forEach(node => {
            console.log('node',node)
            // 元素节点
            if (this.isElementNode(node)) {
                // 是元素节点 继续递归
                // 这里需要编译元素
                this.compileElement(node);
                // 递归调用子元素
                this.compile(node)
            } else {
                // 文本节点
                // 这里需要编译文本
                 this.compileText(node)
            }
        })
    }
    isDirective(name) {
        return /v-/.test(name)
    }
    compileElement(node) {
        // v-model 编译
        let attrs = node.attributes; // 取出当前节点的属性
        Array.from(attrs).forEach(attr => {
            let attrName = attr.name;
            // 判断属性名是否包含 v-
            if (this.isDirective(attrName)) {
                // 取到对应的值，放到节点中
                let expr = attr.value;
                // v-model v-html v-text...
                // let [, type] = attrName.split('-')
                CompileUtil['model'](node, this.vm, expr);
            }
        })
    }
    compileText(node){
       
         // 编译 {{}}
         let expr = node.textContent; //取文本中的内容
         let reg = /\{\{([^}]+)\}\}/g;
         if (reg.test(expr)) {                    
             CompileUtil['text'](node, this.vm, expr)
         }
    }

}


