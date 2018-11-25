var express = require("express");
var router = express.Router();

var User = require("../models/User");
var bcrypt = require("bcryptjs");


// Registering new user
router.post("/register", (req, res, next) => {

	var username = req.body.username;
	var pwd = req.body.password;

	if( !(username || pwd))
		next(new Error("empty field"));

	bcrypt.genSalt(10, function(err, salt) {

		bcrypt.hash(pwd, salt, function(err, hash) {

			if(err) {
				next(err);
			}

			else {

				var newUser = new User({
					username:username,
					password: hash
				});

				newUser.save((err) => {

					if(err) {
						next(err);
					}

					else {
						res.json( {success:true} );
					}
				});
			}
		});
	});
});


// Logging in functionality
router.post("/login", (req, res, next) => {

	var username = req.body.username;
	var pwd = req.body.password;

	if( !(username || pwd))
		next(new Error("empty field"));

	User.findOne({username:username}, (err, user) => {

		if(err)
			next(err);

		if(user) {

			bcrypt.compare(pwd, user.password, function(err, result) {

				if(result) {
					// If username and password match, start session
					req.session.user_id = user.id;
					console.log("session started");
					res.json( {success:true} );
				}

				else {
					next(err);
				}
			});

		}
		else {
			next(new Error("user not found"));
		}
	});
});


// Logout
router.get("/logout", (req, res) => {
	req.session.destroy();
	console.log("Session destroyed");
	res.json( {success:true} );
});

module.exports = router;