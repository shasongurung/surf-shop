const express = require('express');
const router = express.Router();

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
router.post('/register', (req, res, next) => {
  res.send('register');
});

// GET /login
router.get('/login', (req, res, next) => {
  res.send('login');
});

// POST /login
router.post('/login', (req, res, next) => {
  res.send('login');
});

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
