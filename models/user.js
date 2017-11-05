// grab mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true, lowercase: true },
  passHash: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  created_at: Date,
  admin: Boolean,
  events: [String]
});

// create a model using this schema
var User = mongoose.model('User', userSchema);

// make this available to others
module.exports = User;
