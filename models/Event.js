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
		},

		user: [
			{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
		]
	});


var Event = mongoose.model('Event', eventSchema);

module.exports = Event;