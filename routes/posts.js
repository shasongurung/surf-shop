const express = require('express');
const router = express.Router();
const {errorHandler} = require ('../middleware/index');
const {getPosts, newPost, createPost, editPost} = require ('../controllers/posts');

/* GET posts INDEX /posts */
// => function ES6
router.get('/', errorHandler(getPosts));

/* GET posts NEW /posts/new */
router.get('/new', newPost); 

/* POST posts CREATE /posts */
router.post('/', errorHandler(createPost));

/* GET posts SHOW /posts/:id */
router.get('/:id', (req, res, next) => {
    res.send('/posts/:id');
  });

/* GET posts EDIT /posts/:id/edit */
router.get('/:id/edit', editPost);

/* PUT posts UPDATE /posts/:id */
router.put('/:id', (req, res, next) => {
    res.send('/posts/:id');
  });

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