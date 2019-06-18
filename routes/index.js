const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//extracting postRegister function from '/controllers/index'
// const indexObj = require ('../controllers/index');
// const postRegister = indexObj.postRegister
// destructuring
const {
	landingPage,
	getRegister,
	postRegister,
	getLogin,
	postLogin,
	getLogout,
	getProfile,
	updateProfile,
	getForgotPw,
	putForgotPw,
	getReset,
	putReset
} = require('../controllers/index');
const { asyncErrorHandler, isLoggedIn, isValidPassword, changePassword } = require('../middleware/index');

/* GET home/landing page. */
// => function ES6
router.get('/', asyncErrorHandler(landingPage));

// GET /register
router.get('/register', asyncErrorHandler(getRegister));

// POST /register
// postRegister calls postRegister function from 'controllers/index'
router.post('/register', upload.single('image'), asyncErrorHandler(postRegister));

// GET /login
router.get('/login', getLogin);

// POST /login
router.post('/login', asyncErrorHandler(postLogin));

// GET /logout
router.get('/logout', getLogout);

// GET /profile
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

// PUT /profile/:user_id
router.put(
	'/profile',
	isLoggedIn,
	upload.single('image'),
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),
	asyncErrorHandler(updateProfile)
);

// GET /forgot password
router.get('/forgot-password', getForgotPw);

// PUT /forgot password
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

// GET /Reset password
router.get('/reset/:token', asyncErrorHandler(getReset));

// PUT /Reset password
router.put('/reset/:token', asyncErrorHandler(putReset));

module.exports = router;
