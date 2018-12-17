var utils = require('./utils');
var webpack = require('webpack');
var path = require('path');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});
module.exports = merge(baseWebpackConfig, {
    output: {
        path: config.dev.assetsRoot,
        filename: utils.assetsPath('js/[name].js'),
        chunkFilename: utils.assetsPath('js/[name].chunk.js')
    },
    module: {
        // rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: false
        })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-source-map',
    plugins: [
        // 允许你创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // new ExtractTextPlugin({
        //     filename: utils.assetsPath('css/[name].css')
        // }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        /*new HtmlWebpackPlugin({
         filename: 'index.html',
         template: 'index.html',
         inject: true
         }),*/
        new FriendlyErrorsPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            }
        ])
    ].concat(utils.htmlPlugins())
});
