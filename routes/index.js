const express = require('express');
const router = express.Router();

/* GET home page. */
// => function ES6
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Sur Shop - Home' });
});



module.exports = router;
