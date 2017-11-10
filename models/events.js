// grab mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  eventName: { type: String, required: true, unique: true, index: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  capacity: { type: Number },
  author: { type: String, required: true },
  contact: { type: String },
  pending: [String],
  registered: [String]
});

// create a model using this schema
var Event = mongoose.model('Event', eventSchema);

// make this available to others
module.exports = Event;
