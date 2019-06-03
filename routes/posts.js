const express = require('express');
const router = express.Router();
const {asyncErrorHandler} = require ('../middleware/index');
const {postIndex, postNew, postCreate, postShow, postEdit, postUpdate} = require ('../controllers/posts');

/* GET posts INDEX /posts */
// => function ES6
router.get('/', asyncErrorHandler(postIndex));

/* GET posts NEW /posts/new */
router.get('/new', postNew); 

/* POST posts CREATE /posts */
router.post('/', asyncErrorHandler(postCreate));

/* GET posts SHOW /posts/:id */
router.get('/:id', asyncErrorHandler(postShow));

/* GET posts EDIT /posts/:id/edit */
router.get('/:id/edit', asyncErrorHandler(postEdit));

/* PUT posts UPDATE /posts/:id */
router.put('/:id', asyncErrorHandler(postUpdate));

/* DELETE posts DESTROY /posts/:id */
router.delete('/:id', (req, res, next) => {
    res.send('/posts/:id');
  });

module.exports = router;


//RESTFUL ROUTE PATTERNS
// GET INDEX    - /posts
// GET new      - /posts/new
// POST Create  - /posts
// GET show     - /posts/:id
// GET edit     - /posts/:id/edit
// PUT update   - /posts/:id
// DELETE destroy-/posts/:id