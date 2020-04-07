const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const fs = require('fs');


module.exports = {
    entry: {
        "covidTimeSeries": './src/timeSeries/index.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './src/timeSeries/timeSeries.css'
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'covidTimeSeries',
            template: './src/timeSeries/index.html',
            filename: './dist/timeSeries/index.html',
            inject: false
        }),
        new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf-8'))
    ],
    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'

            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
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
            }
        ]
    },
    output: {
        filename: "[name].min.js",
    },
};