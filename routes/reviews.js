const express = require('express');
//allows an access to the ids (in this case from '/posts/:id/reviews')
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler, isLoggedIn, isReviewAuthor } = require('../middleware');
const { reviewCreate, reviewUpdate, reviewDestroy } = require('../controllers/reviews');

/* POST reviews CREATE  /posts/:id/reviews */
router.post('/', isLoggedIn, asyncErrorHandler(reviewCreate));

/* PUT reviews UPDATE  /posts/:id/reviews/review_id */
router.put('/:review_id', isLoggedIn, isReviewAuthor, asyncErrorHandler(reviewUpdate));

/* DELETE reviews DESTROY  /posts/:id/reviews/review_id */
router.delete('/:review_id', isLoggedIn, isReviewAuthor, asyncErrorHandler(reviewDestroy));

module.exports = router;

//RESTFUL ROUTE PATTERNS
// GET INDEX    -  reviews
// GET new      -  reviews/new
// POST Create  -  reviews
// GET show     -  reviews/:review_id
// GET edit     -  reviews/:review_id/edit
// PUT update   -  reviews/:review_id
// DELETE destroy- reviews/:review_id
