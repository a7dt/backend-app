var express = require("express");
var router = express.Router();

var Event = require("../models/Event");


// Main page
router.get("/", (req,res,next) => {

	var user_id = req.session.user_id;

	// For quest users, render view with login and register forms
	if(!user_id) {
		res.render("../views/index", {
			isLogged: false,
		});
	}
	else {

		Event.find({ user : user_id}, (err, events) => {

			if(err) {
				next(err);
			}
			else {
				res.render("../views/index", {
					isLogged: user_id,
					events:events
				});
			}
		});
	}
});


// Search functionality
router.get("/search", (req,res,next) => {

	var user_id = req.session.user_id;

	// If session with user_id doesnt exist, return unauthorized
	if(!user_id) {
		next(new Error("unauthorized"));
	}
	else {

	var searchterm = req.query.term;
	var isFree = req.query.free;


	// User can search by event name and event price

	if(!isFree) {
		Event.find( { user: user_id, name: { "$regex": searchterm, "$options": "i" }, price : {$gt:0} }, (err, events) => {

			if(err) {
				next(err);
			}
			else {
				res.render("../views/index", {
					isLogged: user_id,
					events:events
				});
			}
		});
	}
	else {
		Event.find( { user: user_id, name: { "$regex": searchterm, "$options": "i"}, price : 0 }, (err, events) => {
			if(err) {
				next(err);
			}
			else {
				res.render("../views/index", {
					isLogged: user_id,
					events:events
				});
			}
		});
	}
}
});


// Deleting event
router.get("/delete/:id", (req,res,next) => {

	var id = req.params.id;
	
	Event.findByIdAndRemove(id, (err) => {
		if(err) {
			next(err);
		}
		else {
			res.redirect("/");
		}
	});
});



// Rendering edit form with pre-filled data
router.get("/edit/:id", (req,res,next) => {

	var id = req.params.id;

	Event.findById(id, (err, event) => {
		if(err) {
			next(err);
		}
		else {
			res.render("../views/editForm", {
				data:event
			});
		}
	});
});


// Updating data
router.post("/edit/:id", (req,res,next) => {

	var id = req.params.id;

	var name = req.body.name;
	var desc = req.body.description;
	var price = req.body.price;


	Event.findOneAndUpdate({_id:id}, { $set: { name: name, description:desc, price:price } }, function(err, result) {

        if(err) {
            next(err);
        }
        else {
        	res.redirect("/");
        }
    });
});


// Create new event
router.post("/create", (req,res,next) => {

	var user_id = req.session.user_id;

	if(!user_id) {
		next(new Error("unauthorized"));
	}
	else {

	var name = req.body.name;
	var desc = req.body.description;
	var price = req.body.price;

	var newEvent = new Event({
		name:name,
		description:desc,
		price:price,
		user: user_id
	});

	
	/* Another way
	SomeModel.create({ name: 'also_awesome' }, function (err, awesome_instance) {
		if (err) return handleError(err);
		// saved!
	});
	*/

	newEvent.save((err) => {

		if(err) {
			next(err);
		}
		else {
			res.redirect("/");
		}
	});
}
});

module.exports = router;

