const path = require('path');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env = { prod: false }) => ({
    mode: env.prod ? 'production' : "development",
    devtool: env.prod ? undefined : 'eval-source-map',
    module: {
        rules: [
            { test: /\.(ts|js)x?$/, exclude: /node_modules/, loader: "babel-loader" },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new WebpackBar(),
        new FriendlyErrorsWebpackPlugin(),
        new ESLintPlugin({
            files: ["src"],
            extensions: ["js", "jsx", "ts", "tsx"]
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            minify: false,
            title: 'SpreadSheets Demo',
            template: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkHash].bundle.css',
            chunkFilename: '[id].[chunkHash].bundle.css'
        })
    ],
    stats: {
        modules: false,
        errorDetails: false,
        errors: false,
        children: false,
        warnings: false
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx', '.json', 'css', 'scss'],
        alias: {
            '@': path.resolve(__dirname, 'src/')
        }
    },
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
});
