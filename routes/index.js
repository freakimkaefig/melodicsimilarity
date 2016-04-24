var express = require('express');
var apiController = require('../controllers/apiController');
var userController = require('../controllers/userController.js');
var songsheetController = require('../controllers/songsheetController');
var router = express.Router();


/* ========================================
 * ========== PUBLIC API REQUESTS =========
 * ======================================== */
router.get('/api', function(req, res) {
  apiController.getStats(req, res);
});

/* Songsheets */
router.get('/api/songsheets', function(req, res) {
  songsheetController.getUploads(req, res);
});
router.get('/api/songsheets/:signature', function(req, res) {
  songsheetController.getSongsheetBySignature(req, res);
});
router.post('/api/protected/upload', function(req, res) {
  songsheetController.handleUpload(req, res);
});


/* ========================================
 * ======== PROTECTED API REQUESTS ========
 * ======================================== */
router.use('/api/protected', userController.jwtCheck);

/* Test random quote */
router.get('/api/protected/random-quote', function(req, res) {
  res.status(200).send("Chuck Norris doesn't call the wrong number. You answer the wrong phone.");
});

/* Users */
router.get('/api/protected/users', function(req, res) {
  userController.getUsers(req, res);
});


/* ========================================
 * ============ AUTHENTICATION ============
 * ======================================== */
router.post('/user/create', function(req, res) {
  userController.handleSignup(req, res);
});
router.post('/user/login', function(req, res) {
  userController.handleLogin(req, res);
});


/* ========================================
 * =============== FRONTEND ===============
 * ======================================== */
router.get('*', function(req, res) {
  res.render('index', { title: 'Home' });
});


module.exports = router;