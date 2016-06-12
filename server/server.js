const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const router = require('./routers/router.js');

const app = express();

app.use(bodyParser.json());

app.use(router);

app.listen(config.port, () => {
  console.log(`Server.js is listening on port ${config.port}!`)
});

module.exports = app;