var express = require('express');
var multer = require('multer');

var apiController = require('../controllers/apiController');
var userController = require('../controllers/userController.js');
var songsheetController = require('../controllers/songsheetController');
var uploadController = require('../controllers/uploadController');

var router = express.Router();
var upload = multer({ dest: 'public/uploads/' });


/* ========================================
 * ========== PUBLIC API REQUESTS =========
 * ======================================== */
router.get('/api', apiController.getStats);

/* Songsheets */
router.get('/api/songsheets', songsheetController.getUploads);
router.get('/api/songsheets/:signature', songsheetController.getSongsheetBySignature);
router.post('/api/protected/songsheet/add', songsheetController.handleUpload);
router.post('/api/protected/scan/add', upload.any(), uploadController.postUpload);

/* ========================================
 * ======== PROTECTED API REQUESTS ========
 * ======================================== */
router.use('/api/protected', userController.jwtCheck);

/* Test random quote */
router.get('/api/protected/random-quote', function(req, res) {
  res.status(200).send("Chuck Norris doesn't call the wrong number. You answer the wrong phone.");
});

/* Users */
router.get('/api/protected/users', userController.getUsers);



/* ========================================
 * ============ AUTHENTICATION ============
 * ======================================== */
router.post('/user/create', userController.handleSignup);
router.post('/user/login', userController.handleLogin);


/* ========================================
 * =============== FRONTEND ===============
 * ======================================== */
router.get('*', function(req, res) {
  res.render('index', { title: 'Home' });
});


module.exports = router;