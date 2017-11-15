const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  console.log('Accessing /api');
	res.json({
		message: 'Accessing /api route',
		status: 'OK',
		reroute: 'Go to one of following',
    routes: ['paths', 'points', 'rectangles']
	});
	next();
});


module.exports = router;

const paths = require('./paths');
const points = require('./points');
const rectangles = require('./rectangles');

router.use('/paths', paths);
router.use('/points', points);
router.use('/rectangles', rectangles);
