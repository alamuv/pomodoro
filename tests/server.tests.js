const expect = require('chai').expect;
const server = require('../server/server.js');
const request = require('request');

const apiUrl = '127.0.0.1:3000';

// Dummy data for tests
let task = {
  description: 'Laundry',
  pomodoros: 3,
}
let updateTask = {
  description: 'Laundry',
  pomodoros: 4,
}
let taskId

describe('Basic server functionality', () => {

  it('GET to /api/tasks should respond with 200 OK', (done) => {
    request({
      method: 'GET',
      uri: `${apiUrl}/api/tasks`
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('POST to /api/tasks should respond with 400 Bad Request if task object invalid', (done) => {
    request({
      method: 'POST',
      uri: `${apiUrl}/api/tasks`,
      body: {},
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      body = JSON.parse(body);
      expect(response.statusCode).to.equal(400);
      expect(body.status).to.equal('Invalid task object');
      done();
    })
  });

  it('POST to /api/tasks should respond with 201 Created', (done) => {
    request({
      method: 'POST',
      uri: `${apiUrl}/api/tasks`,
      body: {},
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      body = JSON.parse(body);
      expect(response.statusCode).to.equal(201);
      expect(body.status).to.equal('Success');
      taskId = body.id;
      done();
    })
  });

  it('GET to /api/tasks should return newly created tasks', (done) => {
    request({
      method: 'GET',
      uri: `${apiUrl}/api/tasks`
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      body = JSON.parse(body);
      expect(response.statusCode).to.equal(200);
      expect(body.length).to.equal(1);
      expect(body[0].description).to.equal('Laundry');
      expect(body[0].pomodoros).to.equal(3);
      done();
    });
  });

  it('PUT /api/tasks/:id should respond with 400 Bad Request if task id invalid', (done) => {
    request({
      method: 'PUT',
      uri: `${apiUrl}/api/tasks/12345`,
      body: updateTask,
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      body = JSON.parse(body);
      expect(response.statusCode).to.equal(400);
      expect(body.status).to.equal('Invalid id');
    })
  });

  it('PUT /api/tasks/:id should respond with 400 Bad Request if request body invalid', (done) => {
    request({
      method: 'PUT',
      uri: `${apiUrl}/api/tasks/${taskId}`,
      body: {},
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      body = JSON.parse(body);
      expect(response.statusCode).to.equal(400);
      expect(body.status).to.equal('Invalid task object');
    })
  });

  it('PUT /api/tasks/:id should respond with 200 OK if task id valid', (done) => {
    request({
      method: 'PUT',
      uri: `${apiUrl}/api/tasks/${taskId}`,
      body: updateTask,
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      body = JSON.parse(body);
      expect(response.statusCode).to.equal(200);
      expect(body.status).to.equal('Success');
      expect(body.id).to.equal(taskId);
    })
  });

  it('GET to /api/tasks should return updated tasks', (done) => {
    request({
      method: 'GET',
      uri: `${apiUrl}/api/tasks`
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      body = JSON.parse(body);
      expect(response.statusCode).to.equal(200);
      expect(body.length).to.equal(1);
      expect(body[0].description).to.equal('Laundry');
      expect(body[0].pomodoros).to.equal(5);
      done();
    });
  });

  it('DELETE /api/tasks/:id should respond with 400 Bad Request if task id invalid', (done) => {
    request({
      method: 'DELETE',
      uri: `${apiUrl}/api/tasks/12345`,
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      body = JSON.parse(body);
      expect(response.statusCode).to.equal(400);
      expect(body.status).to.equal('Invalid task id');
    })
  });

  it('DELETE /api/tasks/:id should respond with 200 OK if task id valid', (done) => {
    request({
      method: 'DELETE',
      uri: `${apiUrl}/api/tasks/${taskId}`,
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      body = JSON.parse(body);
      expect(response.statusCode).to.equal(200);
      expect(body.status).to.equal('Success');
    })
  });

})