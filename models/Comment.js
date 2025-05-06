const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  photo_title: String,
  user_id: String,
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
