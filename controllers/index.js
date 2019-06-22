const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
// comes with newer node
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');

const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
// set API key on sendgridmail (sgMail)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
	// GET
	async landingPage(req, res, next) {
		const posts = await Post.find({});
		res.render('index', { posts, mapBoxToken: process.env.MAPBOX_TOKEN, title: 'Surf Shop - Home' });
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
	},
	getForgotPw(req, res, next) {
		res.render('users/forgot');
	},
	async putForgotPw(req, res, next) {
		// look up the user with the given email
		const { email } = req.body;
		const user = await User.findOne({ email });
		// const user = await User.findOne({ email: req.body.email });

		//validate email
		if (!user) {
			req.session.error = 'No account with that email address exists.';
			return res.redirect('/forgot-password');
		}

		// create a hex as a token
		const token = await crypto.randomBytes(20).toString('hex');

		//prep value to be put into the db
		user.resetPasswordToken = token;
		// add expires time
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

		//save
		await user.save();

		// create a message
		const msg = {
			// destination ->user email address who requested
			to: user.email,
			from: 'Surf Shop Admin <your@email.com>',
			subject: 'Surf Shop - Forgot Password / Reset',
			text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
				Please click on the following link, or copy and paste it into your browser to complete the process:
				http://${req.headers.host}/reset/${token}
				If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/				/g, '')
		};

		// send reset email
		await sgMail.send(msg);

		req.session.success = `An e-mail has been sent to ${user.email} with further instructions.`;
		res.redirect('/forgot-password');
	},
	async getReset(req, res, next) {
		const { token } = req.params;
		const user = await User.findOne({
			resetPasswordToken: token,
			// object syntax
			// $gt mongo db operator -> greater than
			// check wether existing token expire is greater than current time
			resetPasswordExpires: { $gt: Date.now() }
		});
		// if no user found or password token expired
		// flash error msg and redirect
		if (!user) {
			req.session.error = 'Password reset token is invalid or has expired.';
			return res.redirect('/forgot-password');
		}
		// if matched then render reset page and pass the token to reset page
		res.render('users/reset', { token });
	},
	async putReset(req, res, next) {
		const { token } = req.params;
		const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

		if (!user) {
			req.session.error = 'Password reset token is invalid or has expired.';
			return res.redirect(`/reset/${token}`);
		}

		if (req.body.password === req.body.confirm) {
			// set new password
			await user.setPassword(req.body.password);
			// remove the token and expiry
			user.resetPasswordToken = null;
			user.resetPasswordExpires = null;
			// save the db
			await user.save();

			// as user credentials has been updated
			// get updated credentials
			const login = util.promisify(req.login.bind(req));
			// use the updated credentials
			await login(user);
		} else {
			req.session.error = 'Passwords do not match.';
			return res.redirect(`/reset/${token}`);
		}

		// creat success email message
		const msg = {
			to: user.email,
			from: 'Surf Shop Admin <your@email.com>',
			subject: 'Surf Shop - Password Changed',
			text: `Hello,
			  This email is to confirm that the password for your account has just been changed.
			  If you did not make this change, please hit reply and notify us at once.`.replace(/		  	/g, '')
		};
		// send success email
		await sgMail.send(msg);
		// flash the sucess messageß
		req.session.success = 'Password successfully updated!';
		res.redirect('/');
	}
};
