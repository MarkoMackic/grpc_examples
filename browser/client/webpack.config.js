const path = require('path');
const fs = require('fs');
const cfg = require('./config.js');
const webpack = require('webpack');
const ProtoCompileWebpackPlugin = require('./protc_compile.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');

console.log(fs.readdirSync(path.resolve(process.cwd(), '../../protos/')));


module.exports = {
    plugins: [
        new ProtoCompileWebpackPlugin({
            sourceDir: path.resolve(__dirname, '../../protos'),
            targetDir: path.resolve(__dirname, 'src/_protos')
        }),
        new webpack.DefinePlugin({
            "process.env.SERV_PORT" : cfg.ENVOY_PORT
        }),
        new HTMLWebpackPlugin({template: path.resolve(__dirname, "src/index.html")})
    ],
}
