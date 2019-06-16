const express = require('express');
const router = express.Router();
const multer = require('multer');
// upload locally
// const upload = multer({'dest': 'uploads/'});
const { cloudinary, storage } = require('../cloudinary/index');
const upload = multer({ storage });
const { asyncErrorHandler, isLoggedIn, isAuthor } = require('../middleware/index');
const { postIndex, postNew, postCreate, postShow, postEdit, postUpdate, postDestroy } = require('../controllers/posts');

/* GET posts INDEX /posts */
// => function ES6
router.get('/', asyncErrorHandler(postIndex));

/* GET posts NEW /posts/new */
router.get('/new', isLoggedIn, postNew);

/* POST posts CREATE /posts */
//upload (multer) middlewar
// 4 denotes no. images one can upload
// upload.array will create an array of files - 'files', which can be accessed later via req.files
router.post('/', isLoggedIn, upload.array('images', 4), asyncErrorHandler(postCreate));

/* GET posts SHOW /posts/:id */
router.get('/:id', asyncErrorHandler(postShow));

/* GET posts EDIT /posts/:id/edit */
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postEdit));

/* PUT posts UPDATE /posts/:id */
//upload (multer) middleware
// 4 denotes no. images one can upload
// upload.array will create an array of files - 'files', which can be accessed later via req.files
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload.array('images', 4), asyncErrorHandler(postUpdate));

/* DELETE posts DESTROY /posts/:id */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postDestroy));

module.exports = router;

//RESTFUL ROUTE PATTERNS
// GET INDEX    - /posts
// GET new      - /posts/new
// POST Create  - /posts
// GET show     - /posts/:id
// GET edit     - /posts/:id/edit
// PUT update   - /posts/:id
// DELETE destroy-/posts/:id
