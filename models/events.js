// grab mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  eventName: { type: String, required: true, unique: true, index: true },
  location: { type: String, required: true },
  time: { type: String },
  date: { type: Date, required: true },
  capacity: { type: Number },
  author: { type: String, required: true },
  contact: { type: String }
});
