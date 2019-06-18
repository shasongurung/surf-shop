const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
	asyncErrorHandler: (fn) => (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	},
	isReviewAuthor: async (req, res, next) => {
		let review = await Review.findById(req.params.review_id);
		if (review.author.equals(req.user._id)) {
			return next();
		}
		req.session.error = 'Bye bye';
		return res.redirect('/');
	},
	isLoggedIn: (req, res, next) => {
		if (req.isAuthenticated()) return next();
		req.session.error = 'You need to be logged in to perform the task';
		req.session.redirectTo = req.originalUrl;
		res.redirect('/login');
	},
	// checks post author
	isAuthor: async (req, res, next) => {
		let post = await Post.findById(req.params.id);
		if (post.author.equals(req.user._id)) {
			res.locals.post = post;
			return next();
		}
		req.session.error = 'Access denied';
		res.redirect('back');
	},
	// check current password when user tries to update their profile
	isValidPassword: async (req, res, next) => {
		const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
		if (user) {
			// add user to res.locals
			res.locals.user = user;
			next();
		} else {
			req.session.error = 'Incorrect current password';
			return res.redirect('/profile');
		}
	},
	// check wether or not user is trying to change their current password
	changePassword: async (req, res, next) => {
		const { newPassword, passwordConfirmation } = req.body;
		if (newPassword && !passwordConfirmation) {
			req.session.error = 'Missing password confirmation';
			return res.redirect('/profile');
		} else if (newPassword && passwordConfirmation) {
			const { user } = res.locals;
			// check wether newPassword and passwordConfirmation are same or not
			// double checking (as already checked in client side)
			if (newPassword === passwordConfirmation) {
				// if all ok then change
				await user.setPassword(newPassword);
				next();
			} else {
				// if not then flash an error message
				req.session.error = 'New passwords must match';
				return res.redirect('/profile');
			}
		} else {
			next();
		}
	}
};
