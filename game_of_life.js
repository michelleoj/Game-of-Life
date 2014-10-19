var helper = require('./game_functions');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

app.set("jsonp callback", true);


//Routing 

app.get('/nextgen', function(req, res) {
	
	if (req.query.callback) {
		var nextGen = helper.getNextGen(req.query.liveCells, req.query.M, req.query.N);
		res.jsonp(nextGen);
	}
	
});


//Start Server
var server = app.listen(5000, function() {
	var host = server.address().address;
	var port = server.address().port;
});
