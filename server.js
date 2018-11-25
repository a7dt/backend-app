var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var methodOverride = require('method-override')
var cors = require('cors')


// Middleware function for errors
customErrorHandler = (err, req, res, next) => {

	if(err.message === "unauthorized") {
		res.status(401).send( {"error": "unauthorized"} );
	}

	else if(err.message === "empty field") {
		res.status(400).send( {"error": "fill all fields"} );
	}

	else if(err.message === "not found") {
		res.status(400).send( {"error": "user not found"} );
	}

	else {
		res.status(500).send( {"error": "error with status 500"} );
	}

	next();

}


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



// Body parser middleware to handle json data in post-requests
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// For frontend app requests to work as intended
app.use(cors({
    origin:['http://localhost:3000'],
    methods:['GET','POST'],
    credentials: true
}));


// For error handling middleware
app.use(methodOverride());


// Handing static files
app.use(express.static(path.join(__dirname, 'public')));


// Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


// Set routers
var eventsRouter = require('./routes/eventsRouter');
app.use('/', eventsRouter);

var usersRouter = require('./routes/usersRouter');
app.use('/users', usersRouter);


app.use(customErrorHandler);


app.listen(5000, () => {
	console.log("Server running at port 5000.");
});