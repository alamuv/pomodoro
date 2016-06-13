const express = require('express');
const router = express.Router();
const requestHandlers = require('../requestHandlers/requestHandlers.js');

router.get('/api/tasks', requestHandlers.getTasks);

router.post('/api/tasks', requestHandlers.postTask);

router.put('/api/tasks/:id', requestHandlers.putTask);

router.delete('/api/tasks/:id', requestHandlers.deleteTask);

module.exports = router; 
