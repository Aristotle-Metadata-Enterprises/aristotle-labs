/* eslint-env node */
const merge = require('webpack-merge');
const webpack = require('webpack')
const path = require('path');

const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
        // This is used to pass tokens in development
        // TODO remove once metadata is public
        new webpack.EnvironmentPlugin({
            'TOKEN': ''
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
        ]
    }
});
