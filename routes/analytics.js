var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var fbRef = new Firebase('https://hackathon-152218.firebaseio.com/');

// Home Page
router.get('/', function(req, res, next) {
  	var ambulanceRef = fbRef.child('ambulances');

	ambulanceRef.once('value', function(snapshot){
		var ambulances = [];
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key();
			var childData = childSnapshot.val();
			ambulances.push({
				id: key,
				lat: childData.lat,
        lng: childData.lng,
				status: childData.status,
			});
		});
		res.render('analytics/index',{ambulances: ambulances});
		// for each ambulance, on clicking that for further details, get a map and siplay the details.
	});
});

router.get('/chart', function(req, res, next) {
  	res.render('analytics/chart');
});

router.get('/heatmap', function(req, res, next) {
  	res.render('analytics/heatmap');
});

router.get('/line', function(req, res, next) {
  	res.render('analytics/line');
});

module.exports = router;
