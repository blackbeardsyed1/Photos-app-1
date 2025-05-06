const jwt = require('jsonwebtoken');

module.exports = (user) => {
  const payload = {
    user_id: user._id,
    username: user.username,
    role: user.role
  };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
};
