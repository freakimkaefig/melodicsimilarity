var express = require('express');
var apiConfig = require('../config/api.config');
var userController = require('../controllers/userController.js');
var router = express.Router();

/* GET api requests */
router.get('/api', function(req, res) {
  res.json({
    version: apiConfig.version
  });
});
router.get('/api/users', function(req, res) {
  var users = userController.getUsers(req, res);
});

/* GET protected api requests */
router.use('/api/protected', userController.jwtCheck);
router.get('/api/protected/random-quote', function(req, res) {
  res.status(200).send("Chuck Norris doesn't call the wrong number. You answer the wrong phone.");
});

/* GET authentication */
router.post('/sessions/create', function(req, res) {
  var response = userController.handleLogin(req, res);
});

/* GET frontend pages */
router.get('*', function(req, res) {
  res.render('index', { title: 'Main' });
});


module.exports = router;