const mongoose = require('../config/dbConfig.js');

const taskSchema = mongoose.Schema({
  description: String,
  pomodoros: Number,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;