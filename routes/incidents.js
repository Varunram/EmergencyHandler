// id, Lat, Lng,          status
// Id, Artist, Title,     Genrre
// Albums -> Incident  Genre -> Status
// artist -> lat title -> lng  genre->status
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

router.get('/', function(req, res, next) {
  	var incidentRef = fbRef.child('incidents');

	incidentRef.once('value', function(snapshot){
		var incidents = [];
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
		res.render('incidents/index',{incidents: incidents});
		// for each incident, on clicking that for further details, get a map and siplay the details.
	});
});
router.get('/add', function(req, res, next) {
   var statusRef = fbRef.child('statuses');
   statusRef.once('value', function(snapshot){
      var data = [];
      snapshot.forEach(function(childSnapshot){
         var key = childSnapshot.key();
         var childData = childSnapshot.val();
         data.push({
            id: key,
            name: childData.name,
         });
      });
      res.render('incidents/add',{statuses: data});
   });
});

router.post('/add', function(req, res, next) {
	 var incident = {
		 	lat: req.body.lat,
      lng: req.body.lng,
      status: req.body.status,
   }
   var incidentRef=fbRef.child('incidents');
   incidentRef.push().set(incident);
   req.flash('success_msg', 'Incident Saved');
   res.redirect('/incidents');
});

router.get('/details/:id',  function(req, res){
  var ambulanceRef = fbRef.child('ambulances');
  var ambulances = [];
  ambulanceRef.once('value', function(snapshot){
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
  });

	var id = req.params.id;
	var incidentRef = new Firebase('https://hackathon-152218.firebaseio.com/incidents/'+id);

	incidentRef.once('value', function(snapshot){
		var incident = snapshot.val();
		res.render('incidents/details', {incident: incident, id:id, ambulances: ambulances});
		// have a tab for ambulances and hospitals
		// jquery- click incident- shows ambulance map, click hospital, shows hospital map
		// Render the hospital page and display the nearby ambulances along with data
    // pass the incident details and plot the nearby hospitals
	});
});

router.get('/edit/:id', function(req, res, next) {
	var id = req.params.id;
	var incidentRef = new Firebase('https://hackathon-152218.firebaseio.com/incidents/'+id);

	var statusRef = fbRef.child('statuses');

	statusRef.once('value', function(snapshot){
		var statuses = [];
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key();
			var childData = childSnapshot.val();
			statuses.push({
				id: key,
				name: childData.name
			});
		});
		incidentRef.once("value", function(snapshot) {
		var incident = snapshot.val();
		res.render('incidents/edit', {incident: incident, id: id, statuses: statuses});
	});
	});
});

router.post('/edit/:id', function(req, res, next) {
	var id = req.params.id;
	var incidentRef = new Firebase('https://hackathon-152218.firebaseio.com/incidents/'+id);

		incidentRef.update({
			lat: req.body.lat,
			lng: req.body.lng,
			status: req.body.status,
		});

	req.flash('success_msg', 'Incident Updated');
	res.redirect('/incidents/details/'+id);
});

router.delete('/delete/:id', function(req, res, next) {
	var id = req.params.id;
	var incidentRef = new Firebase('https://hackathon-152218.firebaseio.com/incidents/'+id);

	incidentRef.remove();

	req.flash('success_msg','Incident Deleted');
	res.send(200);
});

module.exports = router;
