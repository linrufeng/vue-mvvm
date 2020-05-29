import observer from "./observer"

export default class MyVue{
    /**
     * 
     * @param {Element} el 
     * @param {Object} data 
     */
    constructor(el,data={}){
        console.log(el,data)
    }
}