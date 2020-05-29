const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const rimraf = require('rimraf');
const base = require('./base.js');
const path = require('path');
const projectRoot = require('./../until/root');
const config = base({
    entry:"./src/app.js",
    outer:"./dist"
});

config
    .optimization
    .minimizer('js')
    .use(require('terser-webpack-plugin'),[{
        cache: true,
        parallel: true,
        terserOptions:{
            ie8:true,
            compress: {
                drop_console: true,
                drop_debugger: true, 
            }    
        }    
    }])   
config.plugin('clean')
    .use(CleanWebpackPlugin)   

let compiler = webpack(config.toConfig())
rimraf(path.resolve(projectRoot,'./dist'),err=>{
    compiler.run()
})

