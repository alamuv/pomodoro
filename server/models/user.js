const mongoose = require('server/config/dbConfig.js');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  sessionId: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;