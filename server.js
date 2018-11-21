var express = require('express');
var app = express();
var path = require('path');

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/events';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => { console.log("Connected to MongoDB")});


// view engine
app.set('view engine', 'ejs');

// body parser for post-requests JSON-data
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handing static files
app.use(express.static(path.join(__dirname, 'public')));

// set routers
var eventsRouter = require('./routes/eventsRouter');
app.use('/events', eventsRouter);

app.listen(5000, () => {
	console.log("server running at port 5000.");
});