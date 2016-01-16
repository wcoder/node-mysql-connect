# node-mysql-wrapper

Simple wrapper with additional functionality over node-mysql.

## Install
```
npm i node-mysql-connect --save
```

## Using
Minimal config:
```js
var config = {
	user: '<your_user>',
	password: '<your_password>',
	database: '<your_database_name>'
};
```
Include and initialize module:
```js
var connection = require('node-mysql-connect')(config);
```
Do query:
```js
connection.query("SELECT * FROM <your_table>", function (err, data) {
	if (err) throw err;

	// working with data ...
});
```
Query with params:
```js
connection.query("SELECT * FROM <your_table> WHERE a = ? AND b = ?", [a, b], function (err, data) {
	if (err) throw err;

	// working with data ...
});
```

## Configuration
`logger` - enable logging:
```js
var config = {
	//...
	logger: console.log // for example
};
```
