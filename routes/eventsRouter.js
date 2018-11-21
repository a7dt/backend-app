var express = require("express");
var router = express.Router();

var Event = require("../models/Event");

router.get("/", (req, res) => {
	res.render("../views/index");
});

router.post("/", (req,res) => {

	var name = req.body.name;
	var desc = req.body.description;
	var price = req.body.price;

	var newEvent = new Event({
		name:name,
		description:desc,
		price:price
	});

	newEvent.save((err) => {

		if(err) {
			console.log(err);
			res.send(err);
		}

		console.log("Saved succesfully");

		res.redirect("/events");

	});
});

module.exports = router;

