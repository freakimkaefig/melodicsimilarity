/**
 * Backend controller for handling user signup and login.
 */

'use strict';
var jwt = require('express-jwt');
var jsonwebtoken = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var userConfig = require('../config/user.config');
var databaseService = require('../services/databaseService');
var databaseConfig = require('../config/database.config.json');

var that = {};

// Function to check json web tokens
var jwtCheck = jwt({
  secret: userConfig.secret
});

/**
 *
 * @param user
 */
var createToken = function(user) {
  return jsonwebtoken.sign(_.omit(user, 'password'), userConfig.secret, { expiresIn: 60*60*5 });
};

/**
 *
 * @param {Array} users - list of all users
 * @param {string} username - The username you're searching for
 * @returns {undefined|object} The found user
 * @private
 */
var _findUser = function(users, username) {
  return _.find(users, { username: username });
};

/**
 * Get list of users
 * @param {object} req - request object
 * @param {object} res - response object
 */
var getUsers = function(req, res) {
  databaseService.getCollection(databaseConfig.collections.users, 0, 0, function(users, count) {
    res.json({
      users: users,
      totalCount: count
    });
  });
};

/**
 * Handle singup of user.
 * Adds new entry for user in database
 * @param {object} req - request object
 * @param {object} res - response object
 */
var handleSignup = function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("You must send the username and the password");
    return;
  }
  databaseService.addUser(req.body.username, req.body.password, function(result) {
    if (result.ok && result.value.username == req.body.username) {
      res.status(201).send(result);
    } else {
      res.status(400).send(result.message);
    }
  });
};

/**
 * Handles login.
 * Checks username and password and returns token when correct.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var handleLogin = function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("You must send the username and the password");
    return;
  }
  databaseService.getCollection(databaseConfig.collections.users, 0, 0, function(users, count) {

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
  });
};

that.jwtCheck = jwtCheck;
that.handleSignup = handleSignup;
that.handleLogin = handleLogin;
that.getUsers = getUsers;

module.exports = that;