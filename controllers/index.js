const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
	// GET
	async landingPage(req, res, next) {
		const posts = await Post.find({});
		res.render('index', { posts, mapBoxToken: process.env.MAPBOX_TOKEN, title: 'Sur Shop - Home' });
	},
	// GET / register
	getRegister(req, res, next) {
		res.render('register', { title: 'Register', username: '', email: '' });
	},

	// POST /register
	async postRegister(req, res, next) {
		// const newUser = new User({
		// 	username: req.body.username,
		// 	email: req.body.email,
		// 	image: req.body.image
		// });
		try {
			const user = await User.register(new User(req.body), req.body.password);
			// try logging in with the newly created credentials
			req.login(user, (err) => {
				if (err) return next(err);
				req.session.success = `Welcome to Surf Shop,${user.username}`;
				res.redirect('/');
			});
		} catch (err) {
			const { username, email } = req.body;
			let error = err.message;
			if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
				error = 'A user with given emailis already registered';
			}
			res.render('register', { title: 'Register', username, email, error });
		}
	},
	// GET /login
	getLogin(req, res, next) {
		// isAuthenticated is function from passport
		// if user is already logged in and tries accessing the/login route
		if (req.isAuthenticated()) return res.redirect('/');
		res.render('login', { title: 'Login' });
	},
	async postLogin(req, res, next) {
		const { username, password } = req.body;
		const { user, error } = await User.authenticate()(username, password);
		if (!user && error) return next(error);
		req.login(user, (err) => {
			if (err) return next(err);
			req.session.success = `Welcome back, ${username}!`;
			// getting the url user came before asked to login
			// if user came through login then we will redirect to index page
			const redirectUrl = req.session.redirectTo || '/';
			// now delete the session
			delete req.session.redirectTo;
			// pass the url user came from and redirect user to that URL
			res.redirect(redirectUrl);
		});
	},
	getLogout(req, res, next) {
		req.session.success = 'Logged out successfully';
		req.logout();
		res.redirect('/');
	}
};
