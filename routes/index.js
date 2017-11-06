var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');

var Event = require('../models/events.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', user: req.user });
});

router.get('/helloworld', isLoggedIn, function(req, res) {
  res.render('helloworld', { title: 'ERROR, USERNAME EXISTS', user: req.user });
});

// get userlist page
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('user_table');
  collection.find({}, {}, function(e, docs) {
    res.render('userlist', {
      "userlist": docs
    });
  });
});

// GET New user page
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login', message: req.flash('errMsg'), user: req.user });
});

// POST to /login for logging in the user
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/helloworld',
  failureRedirect: '/login',
  failureFlash: true
}));

// POST to register user service
router.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
})); // end POST

// GET TO ADD EVENT
router.get('/addevent', isLoggedIn, function(req, res) {
  res.render('addevent', { title: 'Add event', user: req.user });
});
//
// POST TO ADD EVENT
router.post('/addevent', isLoggedIn, function(req, res) {

  Event.findOne({ 'eventName': req.eventname }, function(err, event) {
    if (err)
      return done(err);

    // check if the event exists
    if (event) {
      res.render('addevent', { title: 'Add event', user: req.user, message: 'Another event with the same name exists' });
    }
  });

  var newEvent = new Event();
  newEvent.eventName = req.body.eventname;
  newEvent.location = req.body.eventlocation;
  newEvent.date = new Date();
  newEvent.capacity = req.body.eventcapacity;
  newEvent.author = req.user.email;
  newEvent.contact = req.body.eventcontact;

  // // save the user to the database
  newEvent.save(function(err) {
    if (err) { 
      // res.render('addevent', { title: 'Add event', user: req.user, message: 'Failed to add event' });
      console.log("NOT SAVE");
      console.log(err);
    } else {
      // res.render('addevent', { title: 'Add event', user: req.user, message: 'Event created successfully' });
      console.log("SAVED");
    }
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

module.exports = router;
