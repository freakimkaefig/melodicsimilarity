var express = require('express');
var apiConfig = require('../config/api.config');
var userController = require('../controllers/userController.js');
var router = express.Router();

/* Public api requests */
router.get('/api', function(req, res) {
  res.json({
    version: apiConfig.version
  });
});
/* Protected api requests */

router.use('/api/protected', userController.jwtCheck);
router.get('/api/protected/random-quote', function(req, res) {
  res.status(200).send("Chuck Norris doesn't call the wrong number. You answer the wrong phone.");
});
router.get('/api/protected/users', function(req, res) {
  var users = userController.getUsers(req, res);
});
router.post('/api/protected/find-document', function(req, res) {
  
});

/* Authentication */
router.post('/user/create', function(req, res) {
  userController.handleSignup(req, res);
});
router.post('/user/login', function(req, res) {
  var response = userController.handleLogin(req, res);
});

/* Frontend */
router.get('*', function(req, res) {
  res.render('index', { title: 'Main' });
});


module.exports = router;