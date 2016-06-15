const User = require(__dirname + '/models/User.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const genSessionId = () => {
  const cipher = crypto.createCipher('aes192', 'pomodoropassword');
  const randomString = (Math.random() * 100000).toString();
  let encrypted = cipher.update(randomString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Checks if sessionId is valid. If not valid, the cookie is destroyed and user redirected to login page
const checkSessionId = (request, response, next) => {
  const sessionId = request.cookies.sessionId;
  User.find({
    sessionId
  }, (error, users) => {
    if (error) {
      response.cookie('sessionId', '').status(401).send();
    } else if (users.length === 0) {
      response.cookie('sessionId', '').status(401).send();
    } else {
      response.status(200).send();
    }
  })
};

const postAuthorize = (request, response) => {
  const saltRounds = 10;
  // Checks if user already exists
  User.find({
    username: request.body.username
  }, (error, users) => {
    if (error) {
      console.log('Error: could not find user in database', error);
      response.status(500).send();
    // If user found, checks authentication
    } else if (users.length > 0) {
      const hashedPassword = users[0].password;
      const plainPassword = request.body.password;
      // Checks password versus database
      bcrypt.compare(plainPassword, hashedPassword, (error, isAuthorized) => {
        if (error) {
          response.status(500).send();
        } else if (isAuthorized) {
          const sessionId = genSessionId();
          users[0].update({
            sessionId: sessionId
          }, (error, user) => {
            if (error) {
              response.status(500).send();
            } else {
              response.cookie('sessionId', sessionId, { maxAge: 86400000 });
              response.status(200).redirect('/');
            }
          });
        } else {
          response.status(401).send({ status: 'Unathorized' });
        }
      })
    // If user not found, creates user
    } else {
      // Hashes password and saves user
      bcrypt.hash(request.body.password, saltRounds, (err, hash) => {
        if (err) {
          console.log('Error: Could not hash password', err);
          response.status(500).send();
        } else {
          const sessionId = genSessionId();
          const newUser = new User({
            username: request.body.username,
            password: hash,
            sessionId: sessionId,
          });
          newUser.save((error, user) => {
            if (error) {
              console.log('Error: Could not save password', err);
              response.status(500).send();
            } else {
              // Set session id cookie, Expires after 24hrs
              response.cookie('sessionId', user.sessionId, { maxAge: 86400000 });
              response.status(201).json({ status: 'Success' });
            }
          });
        }
      });
    }
  });
};

const getLogout = (request, response) => {
  // Destroys cookie and redirects to homepage
  response.cookie('sessionId', '');
  response.redirect('/');
};

module.exports = {
  checkSessionId,
  postAuthorize,
  getLogout,
  User,
}