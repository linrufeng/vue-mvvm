const webpack = require('webpack');
const base = require('./self.js');
const WebpackDevServer = require('webpack-dev-server')
const config = base({
    entry:"./src/selfVue.js",
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