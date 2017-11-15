const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  console.log('Accessing /api/rectangles');
	res.json({
		message: 'Accessing /api/rectangles route',
		status: 'OK'
	});
});


module.exports = router;
