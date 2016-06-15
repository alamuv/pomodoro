const mongoose = require(__dirname + '/config/dbConfig.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require(__dirname + '/config/serverConfig');
const router = require(__dirname + '/routers/router.js');
const app = express();

app.use('/', express.static('dist'));
app.use('/', express.static('client'));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(router);

app.listen(config.port, () => {
  console.log(`Server.js is listening on port ${config.port}!`)
});

module.exports = app;