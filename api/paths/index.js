const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  console.log('Accessing /api/paths');
	res.json({
		message: 'Accessing /api/paths route',
		status: 'OK'
	});
});


module.exports = router;
