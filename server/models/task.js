const mongoose = require(__dirname + '/config/dbConfig.js');

const taskSchema = mongoose.Schema({
  name: String,
  description: String,
  pomodoros: Number,
  username: String,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;