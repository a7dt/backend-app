var express = require("express");
var router = express.Router();

var Event = require("../models/Event");

router.get("/", (req, res) => {

	var user_id = req.session.user_id;


	Event.find({ user : user_id}, (err, events) => {

		if(err) {
			console.log(err);
			res.send(err);
		}

		res.render("../views/index", {
			isLogged: user_id,
			events:events
		});
	});
});



/*

router.get("/search", (req,res) => {

	var searchterm = req.query.term;
	var isFree = req.query.free;

	if(!isFree)
		Event.find( { name: { "$regex": searchterm, "$options": "i" }, price : {$gt:0} }, (err, data) => {
			console.log(data)
		});

	else {
		Event.find( { name: { "$regex": searchterm, "$options": "i"}, price : 0 }, (err, data) => {
			console.log(data)
		});
	}
});

*/




router.get("/delete/:id", (req,res) => {

	var id = req.params.id;
	
	Event.findByIdAndRemove(id, (err) => {
		if(err) {
			console.log(err);
			res.send(err);
		}
		res.redirect("/events");
	})
});


// Form for edit
router.get("/edit/:id", (req,res) => {

	var id = req.params.id;

	Event.findById(id, (err, event) => {
		if(err) {
			console.log(err);
			res.send(err);
		}

		res.render("../views/edit", {
			data:event
		});
	});
});






router.post("/edit/:id", (req, res) => {

	var id = req.params.id;

	var name = req.body.name;
	var desc = req.body.description;
	var price = req.body.price;


	Event.findOneAndUpdate({_id:id}, { $set: { name: name, description:desc, price:price } }, function(err, result) {

        if(err){
            console.log(err);
            res.send(err);
        }

        res.redirect("/events");
    });

});









router.post("/create", (req,res) => {

	var user_id = req.session.user_id;

	if(!user_id) {
		res.end();
	}

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
			console.log(err);
			res.send(err);
		}

		console.log("Saved succesfully");

	});

	res.redirect("/events");

});

module.exports = router;

