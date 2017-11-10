var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');

var Event = require('../models/events.js');
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home page', user: req.user });
  // Event.find({}, function(err, events) {
    
    // res.render('viewevent', { title: 'Available Events', 'data': events, user: req.user });
  // });
});

// GET New user page
router.get('/login', function(req, res) {
  if (req.user)
  	res.redirect('/');
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
  newEvent.date = new Date(req.body.eventdatetime);
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

// get for registering to an event
router.get('/registerevent', isLoggedIn, function(req, res) {

  var ename = req.query.name;
  var email = req.query.email;
  var eauthor = req.query.author;

  User.findOne({email: eauthor}, function(err, usr) {
    if (err)
      console.log(err);
    if (usr) {
      var insObj = {
        e_name: ename,
        u_email: email
      };

      usr.pending_requests.push(insObj);
    }

    usr.save();
  });

  Event.findOne({eventName: ename}, function(err, doc) {
    if (err)
      console.log(err);
    if (doc)
        doc.pending.push(req.user.email);
    doc.save(function(err) {
      if (err) { 
        console.log(err);
      } else {
        res.redirect('/viewevents');
      }
    });
  });
});

// show the acceptrequest page
router.get('/acceptrequest', isLoggedIn, function(req, res) {

  User.findOne({email: req.user.email}, function(err, usr) {
    if (err)
      console.log(err);
    if (usr) {
      res.render('acceptrequest', {title: 'Accept Request', user: req.user, data: usr.pending_requests});
    }
  });
});


// accept or reject a request
router.get('/takeaction', isLoggedIn, function(req, res) {

  var ename = req.query.event;
  var action = req.query.action;
  var user = req.query.email;

  Event.findOne({eventName: ename}, function(err, evt) {
    if (err)
      console.log(err)
    if (evt) {
      evt.pending.pull(user);

      if (action == "accept")
        evt.registered.push(user);
    }

    var author = evt.author;

    evt.save();

    User.update(
      { "email": author},
      { $pull: {"pending_requests": {"e_name": ename, "u_email": user}}},
      { safe: true, multi: true},
      function (err, obj) {
        console.log("Removed");
      }
    );

    res.redirect('/acceptrequest');
  });
});

// try to cancel the registration
router.get('/cancelregister', isLoggedIn, function(req, res) {
  var ename = req.query.name;

  Event.findOne({eventName: ename}, function(err, doc) {
    if (err)
      console.log(err);
    if (doc)
      doc.registered.pull(req.user.email);
    doc.save(function(err) {
      if (err) { 
        console.log(err);
      } else {
        res.redirect('/viewevents');
      }
    });
  });
});

// get for viewing the calendar
router.get('/viewcalendar', isLoggedIn, function(req, res) {
  Event.find({}, function(err, events) {
    
    res.render('viewcalendar', { title: 'View Calendar', 'data': events, user: req.user });
  });
});

//get for returning the events json
router.get('/vieweventsjson', function(req, res) {
  Event.find({}, 'eventName date', function(err, events) {
    
    res.send(events);
  });
});


// logout
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
