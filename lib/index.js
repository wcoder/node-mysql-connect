var _mysql = require('mysql')
	, _logger
	, _config
	, _connection;


function log(message) {
	if (_logger && typeof _logger === 'function') {
		_logger(message);
	}
}

function startConnection() {
	if (!!_connection
		&& _connection.state !== 'protocol_error'
		&& _connection.state !== 'disconnected') return;

	_connection = _mysql.createConnection(_config);

	// The server is either down
	// or restarting (takes a while sometimes).
	_connection.connect(connect);

	_connection.on('error', errorHandler);
}

function connect(err) {
	if (err) {
		log('MYSQL [error]:', err);
		if (err.code === 'ECONNREFUSED') {
			log('MYSQL [server not found].');
		} else {
			reConnect();
		}
	} else {
		log('MYSQL [connected].');
	}
}

function reConnect() {
	// We introduce a delay before attempting to reconnect,
	// to avoid a hot loop, and to allow our node script to
	// process asynchronous requests in the meantime.
	// If you're also serving http, display a 503 error.
	setTimeout(startConnection, 2000);
}

function errorHandler(err) {
	log('MYSQL [error]:', err);

	if (err.code === 'PROTOCOL_CONNECTION_LOST') {
		log('MYSQL [disconected].');

		// Connection to the MySQL server is usually
		// lost due to either server restart, or a
		// connnection idle timeout (the wait_timeout
		// server variable configures this)
		startConnection();
	} else {
		throw err;
	}
}

function query(sql, values, callback) {

	// by analogy of node-mysql
	if (!callback && typeof values === 'function') {
		callback = values;
		values = null;
	}

	if (_connection.state !== 'disconnected') {
		log('MYSQL [query]: ' + sql);


		_connection.query(sql, callback);
	} else {
		callback(new Error('MYSQL [no connection]'));
		reConnect();
	}
}


module.exports = function (config) {

	// init

	_logger = config.logger;
	_config = {
		host: config.host,
		user: config.user,
		port: config.port || 3306,
		password: config.password,
		database: config.database
	};

	startConnection();

	// API

	return {
		query: query
	};
};