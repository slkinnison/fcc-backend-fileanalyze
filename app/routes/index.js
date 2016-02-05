'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.post('/api/fileanalyze', upload.single('inputFile'), function (req, res, next) {
			var returnObj = {fileSize: req.file.size};
			res.json(returnObj);
		});		
};
