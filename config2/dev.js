const webpack = require('webpack');
const base = require('./base.js');
const WebpackDevServer = require('webpack-dev-server')
const config = base({
    entry:"./src/app.js",
    outer:"./dist"
})
config
.mode('development'); 
let compiler = webpack(config.toConfig())
const server = new WebpackDevServer(compiler,{
    open:true,  
    noInfo: true,       
    hot: true,
    hotOnly:true,
}  )
server.listen(8081,'0.0.0.0',err=>{
    console.log(err)
})