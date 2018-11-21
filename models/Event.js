var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema(
	{ 
		name: {
			type: String,
			required: true

		},
		description: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			min: 0
		}
	});


var Event = mongoose.model('Event', eventSchema);

module.exports = Event;