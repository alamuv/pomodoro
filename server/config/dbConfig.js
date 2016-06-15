const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI+'/pomodoro');

const db = mongoose.connection;

db.on('error', () => {
  console.log('Error: could not connect to database');
});

db.once('open', () => {
  console.log('Successfully connected to MongoDB');
});

module.exports = mongoose;