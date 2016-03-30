var express = require('express');
var jwt = require('express-jwt');
var jsonwebtoken = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var userConfig = require('../config/user.config');
var databaseController = require('../controllers/databaseController');

var that = {};

var jwtCheck = jwt({
  secret: userConfig.secret
});

var createToken = function(user) {
  return jsonwebtoken.sign(_.omit(user, 'password'), userConfig.secret, { expiresIn: 60*60*5 });
};

var _findUser = function(users, username) {
  return _.find(users, { username: username });
};

var getUsers = function(req, res) {
  databaseController.getCollection(userConfig.databaseCollection, function(users) {
    res.json({
      users: users
    })
  });
};

var handleSignup = function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("You must send the username and the password");
    return;
  }
  databaseController.addUser(userConfig.databaseCollection, req.body.username, req.body.password, function(result) {
    if (result)
    if (result.result.ok && result.ops[0].username == req.body.username) {
      res.status(201).send(result);
    } else {
      res.status(400).send(result.message);
    }
  });
};

var handleLogin = function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("You must send the username and the password");
    return;
  }
  databaseController.getCollection(userConfig.databaseCollection, function(users) {

    var user = _findUser(users, req.body.username);

    if (!user) {
      res.status(401).send("The username or password don't match");
      return;
    }

    if (!bcrypt.compareSync(req.body.password, user.hash)) {
      res.status(401).send("The username or password don't match");
      return;
    }

    res.status(201).send({ id_token: createToken(user) });
    return;
  });
};

that.jwtCheck = jwtCheck;
that.handleSignup = handleSignup;
that.handleLogin = handleLogin;
that.getUsers = getUsers;

module.exports = that;