var helper = require('./game_functions');
var express = require('express');
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());
app.use(bodyParser.json());

app.set("jsonp callback", true);


//Routing 

app.get('/nextgen', function(req, res) {
	
	if (req.query.callback) {
		var nextGen = helper.getNextGen(req.query.liveCells, req.query.M, req.query.N);
		res.jsonp(nextGen);
	}
	
});


//Start Server
var port = Number(process.env.PORT || 5000);
var server = app.listen(port);
