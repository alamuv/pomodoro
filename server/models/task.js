const mongoose = require('../config/dbConfig.js');

const taskSchema = mongoose.Schema({
  name: String,
  description: String,
  pomodoros: Number,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;