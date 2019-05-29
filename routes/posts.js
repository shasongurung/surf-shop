const express = require('express');
const router = express.Router();

/* GET posts INDEX /posts */
// => function ES6
router.get('/', (req, res, next) => {
  res.send('/posts');
});

/* GET posts NEW /posts/new */
router.get('/new', (req, res, next) => {
    res.send('/posts/new');
  }); 

/* POST posts CREATE /posts */
router.post('/', (req, res, next) => {
    res.send('CREATE /posts');
  });

/* GET posts SHOW /posts/:id */
router.get('/:id', (req, res, next) => {
    res.send('/posts/:id');
  });

/* GET posts EDIT /posts/:id/edit */
router.get('/:id/edit', (req, res, next) => {
    res.send('/posts/:id/edit');
  });

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