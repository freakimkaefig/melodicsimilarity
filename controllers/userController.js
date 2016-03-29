var express = require('express');
var jwt = require('express-jwt');
var jsonwebtoken = require('jsonwebtoken');
var _ = require('lodash');
var config = require('../config/user.config');

var that = {};

// TODO: this should be retrieved from Database
var users = [{
  id: 1,
  username: 'admin',
  password: 'admin'
}];

var jwtCheck = jwt({
  secret: config.secret
});

var createToken = function(user) {
  return jsonwebtoken.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
};

var findUser = function(username) {
  return _.find(users, { username: username });
};

var handleLogin = function(req) {
  var status;
  var message;

  if (!req.body.username || !req.body.password) {
    return {
      status: 400,
      message: "You must send the username and the password"
    }
  }

  var user = findUser(req.body.username);

  if (!user) {
    return {
      status: 401,
      message: "The username or password don't match"
    }
  }

  if (user.password !== req.body.password) {
    return {
      status: 401,
      message: "The username or password don't match"
    }
  }

  return {
    status: 201,
    message: { id_token: createToken(user) }
  }
};

that.jwtCheck = jwtCheck;
that.handleLogin = handleLogin;

module.exports = that;