const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'consumer' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
