var webpack = require('webpack');
var path = require('path');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
  cache: true,
  entry: {
    index: './src/index.js'
  },
  output: {
    path: 'public/build',
    filename: '[name].js',
    publicPath: 'build/'
  },
  module: {
    loaders: [
      {test: /\.js?/, loader: 'babel', exclude: /(node_modules|lib)/ },
      {test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!less')},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass')},
      {test: /\.png$/, loader: 'url?limit=10000&mimetype=image/png'},
      {test: /\.(woff|woff2)$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot$/, loader: 'file'},
      {test: /\.svg$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /\.mp3$/, loader: 'file'},
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  plugins: [
    // new WebpackCleanupPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('[name].css'),
    new CopyWebpackPlugin([
      {from: 'node_modules/midi/soundfont', to: 'soundfont'}
    ])
  ]
};

module.exports = config;
