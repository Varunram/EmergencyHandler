var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var Firebase = require('firebase');
var fbRef = new Firebase('https://hackathon-152218.firebaseio.com/');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var db = mongoose.connection;
// Route Files
var analytics = require('./routes/analytics');
var routes = require('./routes/index');
var incidents = require('./routes/incidents');
var statuses = require('./routes/statuses');
var ambulances = require('./routes/ambulances');
var users = require('./routes/users');
var drivers = require('./routes/drivers');

// Init App
var app = express();

app.use(passport.initialize());
app.use(passport.session());


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Logger
app.use(logger('dev'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', routes);
app.use('/incidents', incidents);
app.use('/statuses', statuses);
app.use('/ambulances', ambulances);
app.use('/users', users);
app.use('/drivers', drivers);
app.use('/analytics', analytics);
// Set Port
app.set('port', (process.env.PORT || 3000));

// Run Server
app.listen(app.get('port'), function(){
  console.log('Server started on port: '+app.get('port'));
});
