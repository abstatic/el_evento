// grab mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  username: { type: String, required: true, lowercase: true },
  passHash: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  created_at: Date,
  events: [String]
});

// schema methods
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passHash);
};

// create a model using this schema
var User = mongoose.model('User', userSchema);

// make this available to others
module.exports = User;
