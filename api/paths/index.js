const express = require('express');
const fs = require('fs');
const router = express.Router();

var sqlQuery = fs.readFileSync('queries/amenities.sql').toString();


router.get('/', function(req, res, next) {
  console.log('Accessing /api/paths');
  console.log(sqlQuery);
  const pool = req.app.get('pool');

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query(sqlQuery, ['guest_house'], (err, result) => {
      done();
      console.log('Returned ' + result.rowCount + ' rows');

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
