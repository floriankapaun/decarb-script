const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/ping.js'),
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ],
    },
    resolve: {
        extensions: ['*', '.js'],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'ping.min.js',
    },
};