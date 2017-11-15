const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  console.log('Accessing /api/points');
	res.json({
		message: 'Accessing /api/points route',
		status: 'OK'
	});
});


module.exports = router;
