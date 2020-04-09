const path = require('path');

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VueLoaderPlugin = require('vue-loader/lib/plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');


module.exports = {
    entry: {
        "covidTimeSeries": './src/timeSeries/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: 'covidTimeSeries',
            template: './src/timeSeries/index.html',
            filename: './timeSeries/index.html',
        }),
        new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf-8')),
    ],
    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'

            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 25000,
                        },
                    },
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    output: {
        filename: "[name].min.js",
    },
};
