const TerserPlugin = require('terser-webpack-plugin');
const path = require('path')

module.exports = {
    entry: './registry-client.js',
    output: {
        filename: 'registry-client.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimizer: [new TerserPlugin()],
    },
};
