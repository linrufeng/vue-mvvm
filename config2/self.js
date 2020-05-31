const Config = require('webpack-chain');
const path = require('path');
const projectRoot = require('./../until/root');
module.exports =(option)=>{

    const config = new Config();

    config
        .entry('app')
            .add(path.resolve(projectRoot,option.entry))
            .end()
        .output
            .path(path.resolve(projectRoot,option.outer))
            .filename('js/[name].js');
      
    config.module
            .rule('js')
            .test(/\.js/)
            .use('babel-loader')
            .loader('babel-loader')
            .options({
                presets:['@babel/preset-env']
            })

    config.plugin('htmlWebpackPlugin')
        .use(require('html-webpack-plugin'),[{
            title:"vue_stage",
            template:path.resolve(projectRoot,'./src/test.html')
        }])
    return config;
}