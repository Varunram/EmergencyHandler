// Albums -> Incident  Gerne -> Status
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
		res.render('statuses/index',{statuses: statuses});
	});
});

router.get('/add', function(req, res, next) {
  	res.render('statuses/add');
});

router.post('/add', function(req, res, next) {
   var status = {
      name: req.body.name
   }
   var statusRef= fbRef.child('statuses'); //refer whether plural
   statusRef.push().set(status);
   req.flash('success_msg', 'Status has been saved');
   res.redirect('/statuses');
});

router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
		var statusRef = new Firebase('https://hackathon-152218.firebaseio.com/status/' + id);

		statusRef.once("value", function(snapshot){
			var status = snapshot.val();
			res.render('statuses/edit', {status: status, id: id});
		});
});

router.post('/edit/:id', function(req, res, next) {
    var id = req.params.id;
		var name = req.body.name;
		var statusRef = new Firebase('https://hackathon-152218.firebaseio.com/status/' + id);

		statusRef.update({
			name: name
		});
		res.redirect('/statuses');
});

router.delete('/delete/:id', function(req, res, next) {
	var id = req.params.id;
	var statusRef = new Firebase('https://hackathon-152218.firebaseio.com/status/'+id);

	statusRef.remove();

	req.flash('success_msg','Status Deleted');
	res.send(200);
});

module.exports = router;
