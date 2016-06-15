const express = require('express');
const router = express.Router();
const requestHandlers = require(__dirname + '/requestHandlers/requestHandlers.js');
const authHandlers = require(__dirname + '/requestHandlers/authHandlers.js')

router.get('/api/tasks', requestHandlers.getTasks);

router.post('/api/tasks', requestHandlers.postTask);

router.put('/api/tasks/:id', requestHandlers.putTask);

router.delete('/api/tasks/:id', requestHandlers.deleteTask);

router.post('/authorize', authHandlers.postAuthorize);

router.get('/logout', authHandlers.getLogout);

router.get('/checksession', authHandlers.checkSessionId);

module.exports = router; 
