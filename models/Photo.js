const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: String,
  caption: String,
  location: String,
  blob_url: String,
  uploaded_by: String,
  uploaded_at: { type: Date, default: Date.now },
  username: String
});

module.exports = mongoose.model('Photo', photoSchema);
