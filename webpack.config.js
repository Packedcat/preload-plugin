const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const PreLoadPlugin = require('./preload/pre-load-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Code Splitting',
      inject: false,
    }),
    new PreLoadPlugin({filename: ''}),
  ],
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};