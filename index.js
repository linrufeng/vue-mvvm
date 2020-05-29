
const webpack = require('webpack');
const test = require('./config2/base');
const path = require('path');
const projectRoot = path.resolve('./')
const build = require('./config/webpack.build');
class Core{    
    constructor(param){
        this.path = path;
        this.globPath = projectRoot; // 获取命令行所在项目路径
        this.entrySrc = path.resolve(projectRoot,'./src/app.js');
        this.outSrc = path.resolve(projectRoot,'./build');
        this.type = param.type;
        this.webpack = webpack;
    }
    run(){
        
        // const webpackfn = webpack(test({
        //     entry:this.entrySrc,
        //     outer:this.outSrc
        // }))
        const webpackfn = webpack(build)
        webpackfn.run((err, stats) => {
            console.log(err)
        })
    }
}
module.exports = Core;