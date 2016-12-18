var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var fbRef = new Firebase('https://hackathon-152218.firebaseio.com/');

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('users/login');
    }
}

// Post to localhost:9000/ambulances

router.post('/', function(req,res,next){

   var ambulance = {
      lat: req.body.lat,
      lng: req.body.lng,
      phno: req.body.phno,
      status: req.body.status
   }

   var ambulanceRef=fbRef.child('ambulances');
   ambulanceRef.push().set(ambulance); // do upsert instead of insert so location details will be updated automatically.
   req.flash('success_msg', 'Status has been saved');
   res.sendStatus(200);
});

router.get('/', function(req, res, next) {
	var incidents = [];
	var incidentRef = fbRef.child('incidents');
	incidentRef.once('value', function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var key = childSnapshot.key();
				var childData = childSnapshot.val();
				incidents.push({
					id: key,
					lat: childData.lat,
					lng: childData.lng,
					status: childData.status,
				});
			});
	});

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
		res.render('ambulances/index',{ambulances: ambulances, incidents: incidents});
		// for each ambulance, on clicking that for further details, get a map and siplay the details.
	});
});

module.exports = router;
