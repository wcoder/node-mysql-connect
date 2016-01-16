var http = require('http');
var db = require('../lib');
var connection = db({
	user: 'root',
	password: '',
	database: 'mysql',
	logger: console.log
});


http.createServer(function (req, res) {

	if (req.url === '/favicon.ico') {
		res.end('');
		return;
	}

	connection.query("SELECT 1 + 1 AS solution", function (err, data) {
		if (err) {
			res.end("Server error - " + err);
			return;
		}

		res.end("It work!");
	});

}).listen(3000);