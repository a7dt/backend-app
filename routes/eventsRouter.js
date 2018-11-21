var express = require("express");
var router = express.Router();

var Event = require("../models/Event");

router.get("/", (req, res) => {

	Event.find({}, (err, data) => {

		if(err) {
			console.log(err);
			res.send(err);
		}

		res.render("../views/index", {
			events:data
		});
	});
});

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


	Event.findOneAndUpdate({_id:id}, req.body, function(err, result) {

        if(err){
            console.log(err);
        }

        console.log("RESULT: " + result);

        res.send('Done');
    });

});


router.post("/create", (req,res) => {

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

