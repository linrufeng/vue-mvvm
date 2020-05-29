const path = require('path');
const Webpack = require('webpack');
const fs = require('fs');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const chalk= require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const config = require('./../package.json');
const argv = require('yargs').argv;
const vendordev = './../static/vendor.dll.js';
const projectRoot = require('./../until/root')
let baseConfig = Object.assign({},{
    entry: {
      app: path.resolve(projectRoot,'./src/app.js')
    },
    output:{
        filename: 'js/[name].js',
        path: path.resolve(projectRoot,'./build/1.0'),  // path.resolve(__dirname, '../build'),
      }, 
    externals:{
       vue:'Vue',
      'vue-router':'VueRouter',
      'axios':'axios',   
      'vuex':'Vuex'  
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js', '.vue','.svg' ]
    },  
    plugins:[
      new HappyPack({
          id: 'css',
          // 如何处理 .css 文件，用法和 Loader 配置中一样
          loaders: [ 
              'css-loader',
              {
                  loader: 'sass-loader',
                  options: {
                      data: `@import "@nutui/nutui/dist/styles/index.scss";`
                  }
              }
          ],
           //共享进程池
          threadPool: happyThreadPool,
          //允许 HappyPack 输出日志
          verbose: false,
      }), 
      new HappyPack({
          //用id来标识 happypack处理那里类文件
        id: 'happyBabel',
        //如何处理  用法和loader 的配置一样
        loaders: [{
          loader: 'babel-loader?cacheDirectory=true',
        }],
        //共享进程池
        threadPool: happyThreadPool,
        //允许 HappyPack 输出日志
        verbose: false,
      }), 
      new VueLoaderPlugin(),
      new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',      
      clear: false, 
      width: 100
      }),
      new WebpackBuildNotifierPlugin({
      title: "My Project Webpack Build",        
      suppressSuccess: true
      })
    ]
});
if(fs.existsSync(path.join(__dirname,vendordev))) {
    baseConfig.plugins = [
        ...baseConfig.plugins,
        new Webpack.DllReferencePlugin({
            context:__dirname,
            manifest: require('./../static/vendor-manifest.json')
        })
    ];
}
module.exports = baseConfig;