var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');

module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Configuration for local signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'userEmail',
    passwordField: 'userPassword',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },

  function(req, userEmail, userPassword, done) {

    // asynchronous
    // Users.findOne wont fire unless data is sent back
    process.nextTick(function() {

      // find a user whose email is same as the given input email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'email': userEmail }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('errMsg', 'Sorry, email is already registered. Please try again.'));
        } else {

          // if there is no user with that email
          // create the user
          var newUser = new User();
                    console.log(req);
          console.log(req.body);

          newUser.username = req.body.userUsername;
          newUser.passHash = newUser.generateHash(userPassword);
          newUser.email = userEmail;
          newUser.created_at = new Date();

          // save the user to the database
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    // overriding defaults
    usernameField: 'userEmail',
    passwordField: 'userPassword',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function(req, userEmail, userPassword, done) { // callback function

    // find a user whose email is the same as the the forms email
    // we are chekcing to see if the user trying to login already exists
    User.findOne({ 'email': userEmail }, function(err, user) {

      if (err)
        return done(err);

      if (!user)
        return done(null, false, req.flash('message', 'No user with that email exists.'));

      if (!user.validPassword(userPassword))
        return done(null, false, req.flash('message', 'Oops! Wrong Password.'));

      // all is well, return successful user
      return done(null, user);
    });
  }));
};
