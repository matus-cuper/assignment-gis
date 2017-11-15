const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  console.log('Accessing /api/paths');
  const client = req.app.get('client')

  client.query("SELECT DISTINCT ON (name) way, name, tourism AS amenity " +
               "FROM planet_osm_point " +
               "WHERE name != '' " +
               "AND tourism in ('alpine_hut', 'apartment', 'apartments', 'chalet', 'guest_house', 'hostel', 'hotel', 'motel', 'resort', 'wilderness_hut') " +
               "ORDER BY name, tourism, way", (err, result) => {

    console.log('Returned ' + result.rowCount + ' rows');

    var i;
    var r = [];
    for (i in result.rows) {
      r.push(result.rows[i]);
    }

    res.json(r);
  });
});


module.exports = router;
