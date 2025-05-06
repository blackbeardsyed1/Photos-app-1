const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  photo_title: String,
  user_id: String,
  username: String,
  rating: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);
