const express = require('express');
const router = express.Router();


//extracting postRegister function from '/controllers/index'
      // const indexObj = require ('../controllers/index');
      // const postRegister = indexObj.postRegister
// destructuring
const {postRegister, postLogin, getLogout} = require('../controllers/index');
const {asyncErrorHandler} = require('../middleware/index');

/* GET home page. */
// => function ES6
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Sur Shop - Home' });
});

// GET /register
router.get('/register', (req, res, next) => {
  res.send('register');
});

// POST /register
// postRegister calls postRegister function from 'controllers/index'
router.post('/register', asyncErrorHandler(postRegister));

// GET /login
router.get('/login', (req, res, next) => {
  res.send('login');
});

// POST /login
router.post('/login', postLogin);

// GET /logout
router.get('/logout', getLogout);

// GET /profile
router.get('/profile', (req, res, next) => {
  res.send('profile');
});


// PUT /profile/:user_id
router.put('/profile/:user_id', (req, res, next) => {
  res.send('profile');
});

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
