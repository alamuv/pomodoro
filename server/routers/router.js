const express = require('express');
const router = express.Router();

router.get('/api/tasks', (request, response) => {
  response.status(200).send();
});

router.post('/api/tasks', (request, response) => {
  if (request.body.description === undefined || request.body.pomodoros === undefined) {
    response.status(400).send({
      status: 'Invalid task object'
    });
  } else {
    response.status(201).send({
      status: 'Success',
    });
  }

});

module.exports = router;  