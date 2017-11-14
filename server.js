const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const pg = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:54321/gis';
const port = process.env.PORT || 3000;

const app = express();
const client = new pg.Client(connectionString)
const router = express.Router();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

client.connect();


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
		client.query('SELECT DISTINCT name, amenity FROM planet_osm_point WHERE amenity != \'\' LIMIT 5', (err, res) => {
			console.log(err ? err.stack : res)
			client.end()
		});
		res.json({ message: 'API state is OK! GET accepted' });
	});


app.use('/api', router);
app.listen(port, () => console.log('Example app listening on port 3000 and running on http://127.0.0.1:3000'));
