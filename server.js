const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const port = process.env.PORT || 3000;

const app = express();
const router = require('./api');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(function(req, res, next) {
	console.log('Accessing server, this is handler for every request.');
	next();
});

app.get('/', function(req, res, next) {
	console.log('Accessing /');
	res.json({
		message: 'Accessing / route',
		status: 'OK',
		reroute: 'Go to /api for more details'
	});
	next();
});


app.use('/api', router);
app.listen(port, () => console.log('Example app listening on port 3000 and running on http://127.0.0.1:3000'));
