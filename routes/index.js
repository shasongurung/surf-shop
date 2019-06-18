const express = require('express');
const router = express.Router();

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
	updateProfile
} = require('../controllers/index');
const { asyncErrorHandler, isLoggedIn, isValidPassword, changePassword } = require('../middleware/index');

/* GET home/landing page. */
// => function ES6
router.get('/', asyncErrorHandler(landingPage));

// GET /register
router.get('/register', getRegister);

// POST /register
// postRegister calls postRegister function from 'controllers/index'
router.post('/register', asyncErrorHandler(postRegister));

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
	'/profile/',
	isLoggedIn,
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),
	asyncErrorHandler(updateProfile)
);

// GET /forgot password
router.get('/forgot-pw', (req, res, next) => {
	res.send('forgot-pw');
});

// PUT /forgot password
router.put('/forgot-pw', (req, res, next) => {
	res.send('forgot-pw');
});

// GET /Reset password
router.get('/reset-pw/:token', (req, res, next) => {
	res.send('reset-pw');
});

// PUT /Reset password
router.put('/reset-pw/:token', (req, res, next) => {
	res.send('reset-pw');
});

module.exports = router;
