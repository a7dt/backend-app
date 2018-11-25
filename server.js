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


// view engine
app.set('view engine', 'ejs');

// body parser for post-requests (JSON-data)
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// for frontend app requests to work
//app.use(cors());

app.use(cors({
    origin:['http://localhost:3000'],
    methods:['GET','POST'],
    credentials: true // enable set cookie
}));

app.use(methodOverride());

// handing static files
app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// set routers
var eventsRouter = require('./routes/eventsRouter');
app.use('/', eventsRouter);

var usersRouter = require('./routes/usersRouter');
app.use('/users', usersRouter);

app.use(customErrorHandler);

app.listen(5000, () => {
	console.log("server running at port 5000.");
});