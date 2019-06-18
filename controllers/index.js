const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
// comes with newer node
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
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
			// check if user uploaded img during registration or not
			if (req.file) {
				const { secure_url, public_id } = req.file;
				req.body.image = {
					secure_url,
					public_id
				};
			}
			const user = await User.register(new User(req.body), req.body.password);
			// try logging in with the newly created credentials
			req.login(user, (err) => {
				if (err) return next(err);
				req.session.success = `Welcome to Surf Shop,${user.username}`;
				res.redirect('/');
			});
		} catch (err) {
			// if any error occured, delete uploaded image
			deleteProfileImage(req);
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
		// check if returnTo exist i.e. where the login request came from
		// if yes assign redirectTo with the value of where the user came from
		if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
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
	},
	async getProfile(req, res, next) {
		//comparing author -object id with current logged in user Id
		const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
		res.render('profile', { posts });
	},
	async updateProfile(req, res, next) {
		// get email and username
		const { email, username } = req.body;
		// destructe user available in res.locals
		const { user } = res.locals;
		// now prep value for username, email and image
		if (username) user.username = username;
		if (email) user.email = email;
		// if user uploaded new picture, destroy existing first and then assign the new value
		if (req.file) {
			if (user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);
			const { secure_url, public_id } = req.file;
			user.image = { secure_url, public_id };
		}
		awai;
		// now save the profile
		await user.save();
		// as user credentials has been updated
		// get updated credentials
		const login = util.promisify(req.login.bind(req));
		// use the updated credentials
		await login(user);
		// flash success msg
		req.session.success = 'Profile successfully updated';
		// redirect
		res.redirect('/profile');
	}
};
