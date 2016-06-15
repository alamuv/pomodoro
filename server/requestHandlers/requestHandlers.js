const Task = require('./models/task.js');
const User = require('./requestHandlers/authHandlers.js').User;
const mongoose = require('./config/dbConfig.js');

const getUserName = (sessionId) => {
  return new Promise((resolve, reject) => {
    User.find({
      sessionId
    }, (error, users) => {
      if (error) {
        reject(error);
      } else {
        resolve(users[0].username);
      }
    });
  });
}

const getTasks = (request, response) => {
  const sessionId = request.cookies.sessionId;
  getUserName(sessionId)
    .then((username) => {
      Task.find({ username }, (error, tasks) => {
        if (error) {
          console.log('Error: Could not get tasks from database', error);
          response.status(500).json();
        } else {
          response.status(200).json(tasks);
        }
      });

    })
    .catch((error) => {
      console.log('Error: Could not get user from sessionId', error);
      response.status(500).send();
    })
};

const postTask = (request, response) => {
  const sessionId = request.cookies.sessionId;
  getUserName(sessionId)
    .then((username) => {
      if (request.body.description === undefined || request.body.pomodoros === undefined || request.body.name === undefined) {
        response.status(400).json({
          status: 'Invalid task object'
        });
      } else {
        request.body.username = username;
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
    })
    .catch((error) => {
      console.log('Error: Could not get user from sessionId', error);
      response.status(500).send();
    })
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
