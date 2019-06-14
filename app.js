require('dotenv').config();
const express = require('express');
const engine = require('ejs-mate');
const createError = require('http-errors');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require ('passport');
// const passportLocalMongoose = require('passport-local-mongoose');
const logger = require('morgan');
const User = require('./models/user');
const session = require ('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const seedPosts = require('./seeds');

// seedPosts();

//Require routes
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const reviewsRouter = require('./routes/reviews');

const app = express();

// connect to the database
  //mongoose.connect('mongodb://localhost:27017/surf-shop');
mongoose.connect('mongodb://localhost:27017/surf-shop', {useNewUrlParser: true, useCreateIndex : true }).then(()=>{
    console.log("Connected to DB");
  }).catch(err => {
    console.log("Error", err.message);
  });

//use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setup public assests directory
app.use(express.static('public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

//Configure Sessions and Passport
// Session comes befoe pasport, keep in mind the order
app.use(session({
  secret: 'developer is good',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local variables middleware
app.use((req,res,next)=>{
  req.user = {
    '_id' : '5cfadf428bcead15541ecc72',
    'username' : 'shason'
  };
  res.locals.currentUser = req.user;

  // set default page title
  res.locals.title= 'Surf Shop';
  // set success flash messgae
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue to on to next function in middleware chain
  next();
});

// Mount routes
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});



module.exports = app;
