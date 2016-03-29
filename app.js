/**
 * Created by Lukas Lamm on 26.03.2016.
 */
'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

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