var webpack = require('webpack');
var path = require('path');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
  cache: true,
  entry: {
    index: './client/index.js'
  },
  output: {
    path: 'public/build',
    filename: '[name].js',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      {test: /\.js?/, loader: 'babel', exclude: /(node_modules|lib)/ },
      {test: /\.json$/, loader: 'json' },
      {test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css!less')},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css')},
      {test: /\.png$/, loader: 'url?limit=10000&mimetype=image/png'},
      {test: /\.(woff|woff2)$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.(eot|mp3)$/, loader: 'file'},
      {test: /\.svg$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=./[hash].[ext]" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  plugins: [
    // new WebpackCleanupPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('[name].css'),
    new CopyWebpackPlugin([
      {from: 'node_modules/midi/soundfont', to: 'soundfont'},
      {from: 'lib/abcjs/bin/abcjs_basic_2.4.0.js', to: '../../lib/abcjs.js'}
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NPM_CONFIG_PRODUCTION ? '"production"' : '"development"'
    })
  ],
  resolve: {
    modules: ['node_modules', 'client', 'config'],
    alias: {
      'react-input-range-css': path.join(__dirname, './node_modules/react-input-range/dist/react-input-range.css')
    }
  }
};

module.exports = config;
