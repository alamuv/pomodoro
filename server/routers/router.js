const express = require('express');
const router = express.Router();

const mongoose = require('../config/dbConfig.js');

const Task = require('../models/task.js');

router.get('/api/tasks', (request, response) => {
  Task.find((error, tasks) => {
    if (error) {
      console.log('Error: Could not get tasks from database');
      response.status(500).json();
    } else {
      response.status(200).json(tasks);
    }
  })
});

router.post('/api/tasks', (request, response) => {
  if (request.body.description === undefined || request.body.pomodoros === undefined) {
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
});

router.put('/api/tasks/:id', (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    response.status(400).json({ status: 'Invalid id' });
  } else {
    Task.findByIdAndUpdate(request.params.id, request.body, (error, task) => {
      if (error) {
        console.log('Error: could not update task', error);
        response.status(500).json();
      } else {
        response.status(200).json({ status: 'Success', id: task.id });
      }
    });
  }
});

router.delete('/api/tasks/:id', (request, response) => {
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
});

module.exports = router; 
