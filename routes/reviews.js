const express = require('express');
//allows an access to the ids (in this case from '/posts/:id/reviews')
const router = express.Router({mergeParams: true});

/* GET reviews INDEX  /posts/:id/reviews */
router.get('/', (req, res, next) => {
  res.send('INDEX');
});

// /* GET reviews NEW  /posts/:id/reviews/new */
// router.get('/new', (req, res, next) => {
//     res.send('NEW');
//   }); 

/* POST reviews CREATE  /posts/:id/reviews */
router.post('/', (req, res, next) => {
    res.send('CREATE');
  });

// /* GET reviews SHOW  /posts/:id/reviews/review_id */
// router.get('/:review_id', (req, res, next) => {
//     res.send('SHOW');
//   });

/* GET reviews EDIT  /posts/:id/reviews/review_id/edit */
router.get('/:review_id/edit', (req, res, next) => {
    res.send('EDIT');
  });

/* PUT reviews UPDATE  /posts/:id/reviews/review_id */
router.put('/:review_id', (req, res, next) => {
    res.send('UPDATE');
  });

/* DELETE reviews DESTROY  /posts/:id/reviews/review_id */
router.delete('/:review_id', (req, res, next) => {
    res.send('DESTROY');
  });

module.exports = router;


//RESTFUL ROUTE PATTERNS
// GET INDEX    -  reviews
// GET new      -  reviews/new
// POST Create  -  reviews
// GET show     -  reviews/:review_id
// GET edit     -  reviews/:review_id/edit
// PUT update   -  reviews/:review_id
// DELETE destroy- reviews/:review_id