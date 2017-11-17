const express = require('express');
const fs = require('fs');
const router = express.Router();

var sqlQuery = fs.readFileSync('queries/amen-test.sql').toString();


router.get('/', function(req, res, next) {
  console.log('Accessing /api/points');
  console.log(sqlQuery);
  const pool = req.app.get('pool');

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query(sqlQuery, ['guest_house'], (err, result) => {
      done();
      console.log('Returned ' + result.rowCount + ' rows');

      var lat = req.query.lat;
      var lon = req.query.lon;
      var i, j;
      for (j in req.query) {
        if (Array.isArray(req.query[j])) {
          for (i in req.query[j]) {
            console.log(j + ' ' + req.query[j][i]);
          }
        }
        else {
          console.log(j + ' ' + req.query[j]);
        }
      }

      var i;
      var r = [];
      for (i in result.rows) {
        r.push(result.rows[i]);
      }

      res.json(r);
    });
  });
});


module.exports = router;
