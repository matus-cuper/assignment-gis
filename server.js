const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');


var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.use(function(req, res, next) {
	console.log('Something is happening.');
	next();
});

router.get('/', (req, res) => res.json({ message: 'API state is OK!' }));

router.route('/points')
	.post(function(req, res) {
		res.json({ message: 'API state is OK! POST accepted' });
	})
	.get(function(req, res) {
		res.json({ message: 'API state is OK! GET accepted' });
	});


app.use('/api', router);
app.listen(port, () => console.log('Example app listening on port 3000 and running on http://127.0.0.1:3000'));
