var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');

var Event = require('../models/events.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Event.find({}, function(err, events) {
    
    res.render('viewevent', { title: 'Available Events', 'data': events, user: req.user });
  });
});

// GET New user page
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login', message: req.flash('errMsg'), user: req.user });
});

// POST to /login for logging in the user
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/viewevents',
  failureRedirect: '/login',
  failureFlash: true
}));

// POST to register user service
router.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
})); // end POST

// get endpoint for deleting

// GET TO VIEW ALL EVENTS
router.get('/viewevents', function(req, res) {
  Event.find({}, function(err, events) {
    
    res.render('viewevent', { title: 'Available Events', 'data': events, user: req.user });
  });
});

// GET TO ADD EVENT
router.get('/addevent', isLoggedIn, function(req, res) {
  res.render('addevent', { title: 'Add event', user: req.user });
});

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
      res.render('addevent', { title: 'Add event', user: req.user, message: 'Failed to add event' });
      console.log(err);
    } else {
      res.render('addevent', { title: 'Add event', user: req.user, message: 'Event created successfully' });
    }
  });
});

// GET endpoint for deleting an event
router.get('/deleteevent', isLoggedIn, function(req, res) {

  var ename = req.query.name;

  console.log(ename);
  Event.findOne({eventName: ename}, function(err, doc) {
    if (err)
      console.log(err);
    if (doc)
      doc.remove();
    res.redirect('/viewevents');
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
