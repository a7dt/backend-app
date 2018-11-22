var express = require("express");
var router = express.Router();

var User = require("../models/User");
var bcrypt = require("bcryptjs");



router.post("/register", (req, res) => {

	var username = req.body.username;
	var pwd = req.body.password;

	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(pwd, salt, function(err, hash) {

			if(err)
				res.send("error cannot hash");

			var newUser = new User({
				username:username,
				password: hash
			});

			newUser.save((err) => {

				if(err) {
					res.send("ERROR");
				}
			});

		});
	});

	res.redirect("/events");
});


router.post("/login", (req, res) => {

	var username = req.body.username;
	var pwd = req.body.password;

	if( !(username || pwd))
		res.end("fill all fields");


	User.findOne({username:username}, (err, user) => {

		if(err)
			console.log(err);

		if(user) {

			bcrypt.compare(pwd, user.password, function(err, result) {

				if(result) {
					req.session.user_id = user.id;
					res.redirect("/events");
				}

				else {
					console.log("failed to auth");
				}

			});


		}
		else {
			console.log("user not found");
		}

	});

});


router.get("/logout", (req, res) => {
	req.session.destroy();

	res.redirect("/events");
});

module.exports = router;