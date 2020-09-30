const path = require('path');
const webpack = require('webpack');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const prodConfig = require('./webpack.config');

module.exports = (env = {}) => {
    const config = prodConfig(env);

    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new CleanTerminalPlugin());

    config.devServer = {
        contentBase: path.join(__dirname, "dist"),
        hot: true
    };

    return config;
};
