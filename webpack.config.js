var webpack = require('webpack');
var fs = require('fs');
var path = require('path');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var env = {};
env.HOST = typeof process.env.HOST !== 'undefined' ? process.env.HOST : '127.0.0.1';
env.PORT = typeof process.env.PORT !== 'undefined' ? process.env.PORT : 3000;
env.BASE_URL = 'http://' + env.HOST + ':' + env.PORT + '/';
env.MONGO_URI = typeof process.env.MONGO_URI !== 'undefined' ? process.env.MONGO_URI : 'mongodb://127.0.0.1:27017/melodicsimilarity';
env.SOLR_URI = typeof process.env.SOLR_URI !== 'undefined' ? process.env.SOLR_URI : 'http://127.0.0.1:8983/';
env.SOLRINTERACTION_BASE_URI = typeof process.env.SOLRINTERACTION_BASE_URI !== 'undefined' ? process.env.SOLRINTERACTION_BASE_URI : 'http://127.0.0.1:8080/';
env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
env.AWS_REGION = process.env.AWS_REGION;
console.log(env);
fs.writeFileSync(path.join(__dirname, '.env.json'), JSON.stringify(env));

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
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css!sass')},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css')},
      {test: /\.png$/, loader: 'url?limit=10000&mimetype=image/png'},
      {test: /\.(woff|woff2)$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot$/, loader: 'file'},
      {test: /\.svg$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /\.mp3$/, loader: 'file'},
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
    ])
  ],
  resolve: {
    modules: ['node_modules', 'client '],
    alias: {
      'react-input-range-css': path.join(__dirname, './node_modules/react-input-range/dist/react-input-range.css')
    }
  }
};

module.exports = config;
