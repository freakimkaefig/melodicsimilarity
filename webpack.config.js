var webpack = require('webpack');
var path = require('path');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  cache: true,
  entry: {
    index: './src/index.js'
  },
  output: {
    path: 'public/build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {test: /\.js?/, loader: 'babel', exclude: /(node_modules|lib)/ },
      {test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!less')},
      {test: /\.png$/, loader: 'url?limit=10000&mimetype=image/png'},
      {test: /\.(woff|woff2)$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot$/, loader: 'file'},
      {test: /\.svg$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ]
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('[name].css')
  ]
};

module.exports = config;
