var express = require("express");
var router = express.Router();

var Event = require("../models/Event");


// Return all events that belong to current logged in user
router.get("/", (req,res,next) => {

	var user_id = req.session.user_id;

	// If session with user_id doesnt exist, return unauthorized
	if(!user_id) {
		next(new Error("unauthorized"));
	}
	
	else {

		Event.find({ user : user_id}).lean().exec(function (err, events) {
			if(err) {
				next(err);
			}
			else {
				res.json( {events:events} )
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

		var searchterm = req.query.term ? req.query.term : "";
		var isFree = req.query.free;


		if(isFree === "false" && searchterm !== "") {

			Event.find( { user: user_id, name: { "$regex": searchterm, "$options": "i" }, price : {$gt:0} } )
			.lean().exec( function (err, events) {

				if(err) {
					next(err);
				}

				if(events) {
					res.json({ events:events });
				}

				else {
					res.json({ success: true });
				}
			});
		}

		else if(isFree === "true" && searchterm !== "") {

			Event.find( { user: user_id, name: { "$regex": searchterm, "$options": "i"}, price : {$eq: 0} } )
			.lean().exec(function (err, events) {

				if(err) {
					next(err);
				}

				if(events) {
					res.json({ events:events });
				}

				else {
					res.json({ success: true });
				}
			});
		}

		else if(isFree === "true" && searchterm === "") {

			Event.find( { user: user_id, price : {$eq: 0} } )
			.lean().exec(function (err, events) {

				if(err) {
					next(err);
				}

				if(events) {
					res.json({ events:events });
				}

				else {
					res.json({ success: true });
				}
			});
		}

		else if(isFree === "false" && searchterm === "") {

			Event.find( { user: user_id, price : {$gt: 0} } )
			.lean().exec(function (err, events) {

				if(err) {
					next(err);
				}

				if(events) {
					res.json({ events:events });
				}

				else {
					res.json({ success: true });
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
			res.json( {success:true} );
		}
	});
});



// For rendering edit form with data
router.get("/edit/:id", (req,res,next) => {

	var id = req.params.id;

	Event.findById(id).lean().exec(function (err, event) {

		if(err) {
			next(err);
		}

		if(!event) {
			next(new Error());
		}
		else {
			res.json({ event:event });
		}
	});
});


// Updating data
router.post("/edit/:id", (req,res,next) => {

	var id = req.params.id;

	var name = req.body.name;
	var desc = req.body.description;
	var price = req.body.price;

	if(!name || !desc || typeof price != "number") {
		next(new Error());
	}

	else {

		Event.findOneAndUpdate({_id:id}, { $set: { name: name, description:desc, price:price } }, function(err, result) {

        	if(err) {
            	next(err);
        	}

        	if(result) {
        		res.json( {success: true} )
        	} 
        	else {
        		next(new Error());
        	}
        
    	});
	}
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
			name: name,
			description: desc,
			price: price,
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
				res.json( {success: true} )
			}
		});
	}
});

module.exports = router;

