const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config');

module.exports = {
    ...config,
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        ...config.plugins,
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    }
};