/**
 * Main backend component.
 * It takes care of routing and rendering associated views.
 */

'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var routes = require('./routes');

var app = express();

var logFile = fs.createWriteStream(path.join(__dirname, '../', 'log/', 'error.log'), {flags: 'a'});
morgan.token('statusMessage', function(req, res) {
  return res.statusMessage;
});
app.use(morgan(':date :method :url :status :statusMessage', {
  stream: logFile,
  skip: function(req, res) {
    return res.statusCode < 400;
  }
}));

// Set Access-Control
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Cache-Control, Accept, Options, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Views engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Include parsers for url params and json
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

// server static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Include routes in ./routes/index.js
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function response (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function response (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;
