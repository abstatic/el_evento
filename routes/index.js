var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'ERROR, USERNAME EXISTS', error: '' });
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
  res.render('login', { title: 'Login', language: 'Jade' });
});

// POST to register user service
router.post('/adduser', function(req, res) {

  // Set our DB variable
  var db = req.db;

  // Get the form values, depend on the "name" attributes of form
  var userName = req.body.username;
  var userPassword = req.body.userpassword;
  var userEmail = req.body.useremail;


  // Set our collection into which we insert data
  var collection = db.get('user_table');

  // asynchronously hash the password and store it inside DB
  bcrypt.hash(userPassword, 10, function(err, passHash) {

    // Submit to the DB for inserting
    collection.insert({
      "u_id": userName,
      "email": userEmail,
      "password": passHash
    }, function(err, doc) {
      if (err) {
        // if it failed, return error
        res.send("There was a problem in adding the information to the database.");
      }
      else {
        // and forward to success page
        res.redirect("userlist");
      }
    }); // end insert collection
  }); // end pass hash async
}); // end POST

// POST TO ADD EVENT
router.post('/addevent', function(req, res) {

});

module.exports = router;
