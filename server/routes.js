/**
 * Defines routes and associated controller.
 */

'use strict';
var express = require('express');
var multer = require('multer');

var apiController = require('./controllers/apiController');
var userController = require('./controllers/userController.js');
var songsheetController = require('./controllers/songsheetController');
var uploadController = require('./controllers/uploadController');
var searchController = require('./controllers/searchController');
var statisticController = require('./controllers/statisticController');
var similarityController = require('./controllers/similarityController');

var router = express.Router();
var upload = multer({ dest: 'public/uploads/' });


/* ========================================
 * ========== PUBLIC API REQUESTS =========
 * ======================================== */
router.get('/api', apiController.getStats);

/* Songsheets */
router.get('/api/songsheets', songsheetController.getUploads);
router.get('/api/songsheets/:signature', songsheetController.getSongsheetBySignature);
router.get('/api/image/:name', songsheetController.getImageByName);
router.post('/api/search', searchController.search);

/* Statistics */
router.get('/api/index/:mode', statisticController.getStats);
router.get('/api/similarity', similarityController.getAll);
router.get('/api/similarity/:signature', similarityController.getOne);


/* ========================================
 * ======== PROTECTED API REQUESTS ========
 * ======================================== */
router.use('/api/protected', userController.jwtCheck);

/* Users */
router.get('/api/protected/users', userController.getUsers);

/* Songsheets */
router.put('/api/protected/songsheet/add', songsheetController.handleUpload);
router.put('/api/protected/scan/add', upload.any(), uploadController.postUpload);

/* Statistics */
router.put('/api/protected/index/update/:mode', statisticController.putStats);
router.put('/api/protected/similarity/update/:signature', similarityController.updateOne);


/* ========================================
 * ============ AUTHENTICATION ============
 * ======================================== */
router.put('/user/create', userController.handleSignup);
router.post('/user/login', userController.handleLogin);


/* ========================================
 * =============== FRONTEND ===============
 * ======================================== */
router.get('*', function(req, res) {
  res.render('index', { title: 'Home' });
});


module.exports = router;