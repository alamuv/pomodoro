const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pomodoro');

const db = mongoose.connection;

db.on('error', () => {
  console.log('Error: could not connect to database');
});

db.once('open', () => {
  console.log('Successfully connected to MongoDB');
});

module.exports = mongoose;