var express = require('express');
var app = express();
var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
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