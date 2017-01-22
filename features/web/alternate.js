var
	express = require('express'),
	path = require('path'),
	config = require('config'),
;

var protocol = config.has('web.protocol') ? config.get('web.protocol') : 'http';
var http_port = process.env.PORT || config.get('web.port');
var domain = config.get('web.domain');

var app = express();
var http = require('http').Server(app);

app.get('*', (req, res) => {
	res.send("Hello World");
});

http.listen(http_port, function() {
	console.log('http listenting on port '+http_port+'!');
});