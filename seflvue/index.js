import Observer from "./observer"
import Compile from "./observer/compile";
export default class MyVue{
    /**
     * 
     * @param {Element} el 
     * @param {Object} data 
     */
    constructor({el,data}={}){
        
        this.$el = el;
        this.$data = data;        
        if(this.$el){
            // 数据劫持
            new Observer(this.$data);
            // 渲染
            this.compile = new Compile(this.$el,this)
        }
    }
}