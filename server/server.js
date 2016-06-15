const mongoose = require('./config/dbConfig.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/serverConfig.js');
const router = require('./routers/router.js');
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