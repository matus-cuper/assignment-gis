const express = require('express');
const fs = require('fs');
const pg = require('pg');
const router = express.Router();

const routingConnectionString = process.env.ROUTING_DATABASE_URL || 'postgres://postgres:postgres@localhost:54321/routing';
var sqlQuery = fs.readFileSync('queries/paths.sql').toString();

const routingPool = new pg.Pool({
	connectionString: routingConnectionString
});


router.get('/', function(req, res, next) {
  console.log('Accessing /api/paths');
  console.log(sqlQuery);

  routingPool.connect((err, client, done) => {
    if (err) throw err;
		console.log(req.query);
		if (Object.keys(req.query).length == 0) {
			res.json({
				message: 'Accessing /api/paths route',
				status: 'OK'
			});
			next();
		}
		else {
			client.query(sqlQuery, [req.query.lng[0], req.query.lat[0],
				req.query.lng[1], req.query.lat[1]], (err, result) => {
	      done();

				console.log('lng        ' + req.query.lng);
	      console.log('lat        ' + req.query.lat);
	      console.log('Returned ' + result.rowCount + ' rows');


	      var i;
	      var r = [];
	      for (i in result.rows) {
	        r.push(result.rows[i].geojson);
	      }

	      res.json(r);
	    });
		}
  });
});


module.exports = router;
