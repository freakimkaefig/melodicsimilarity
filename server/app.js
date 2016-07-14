/**
 * Main backend component.
 * It takes care of routing and rendering associated views.
 */

'use strict';
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./routes');

var app = express();

// Set Access-Control
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Views engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
