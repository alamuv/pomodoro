const Task = require('../models/task.js');
const mongoose = require('../config/dbConfig.js');

const getTasks = (request, response) => {
  Task.find((error, tasks) => {
    if (error) {
      console.log('Error: Could not get tasks from database');
      response.status(500).json();
    } else {
      response.status(200).json(tasks);
    }
  })
};

const postTask = (request, response) => {
  if (request.body.description === undefined || request.body.pomodoros === undefined || request.body.name === undefined) {
    response.status(400).json({
      status: 'Invalid task object'
    });
  } else {
    const newTask = new Task(request.body);
    newTask.save((error, task) => {
      if (error) {
        console.log('Error: Could not save new task to database')
      } else {
        response.status(201).json({
          status: 'Success',
          id: task.id,
        });       
      }
    });
  }
};

const putTask = (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    response.status(400).json({ status: 'Invalid id' });
  } else {
    Task.findByIdAndUpdate(request.params.id, request.body, (error, task) => {
      if (error) {
        console.log('Error: could not update task', error);
        response.status(500).json();
      } else if (!task) {
        response.status(400).json({ status: 'Invalid id' });
      } else {
        response.status(200).json({ status: 'Success', id: task.id });
      }
    });
  }
};

const deleteTask = (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    response.status(400).json({ status: 'Invalid id' });
  } else {
    Task.remove({ _id: request.params.id }, (error) => {
      if (error) {
        console.log('Error: Could not delete task ${taskId}', error);
        response.status(500).json();
      } else {
        response.status(200).json({ status: 'Success' });
      }
    })
  }
};

module.exports = {
  getTasks,
  postTask,
  putTask,
  deleteTask,
}
