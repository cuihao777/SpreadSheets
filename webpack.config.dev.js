const path = require('path');
const webpack = require('webpack');
const prodConfig = require('./webpack.config');

module.exports = (env = {}) => {
    const config = prodConfig(env);

    config.plugins.push(new webpack.NamedModulesPlugin());
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.devServer = {
        contentBase: path.join(__dirname, "dist"),
        hot: true
    };

    return config;
};