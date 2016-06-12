const expect = require('chai').expect;
const server = require('../server/server.js');
const request = require('request');

const Task = require('../server/models/task.js');

const apiUrl = 'http://127.0.0.1:3000';

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
      json: {},
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        console.log(error);
        expect(true).to.equal(false);
        done();
      }
      expect(response.statusCode).to.equal(400);
      expect(body.status).to.equal('Invalid task object');
      done();
    })
  });

  it('POST to /api/tasks should respond with 201 Created', (done) => {
    request({
      method: 'POST',
      uri: `${apiUrl}/api/tasks`,
      json: task,
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
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
      json: updateTask,
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      expect(response.statusCode).to.equal(400);
      expect(body.status).to.equal('Invalid id');
      done();
    })
  });

  it('PUT /api/tasks/:id should respond with 200 OK if task id valid', (done) => {
    request({
      method: 'PUT',
      uri: `${apiUrl}/api/tasks/${taskId}`,
      json: updateTask,
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      expect(response.statusCode).to.equal(200);
      expect(body.status).to.equal('Success');
      expect(body.id).to.equal(taskId);
      done();
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
      expect(body[0].pomodoros).to.equal(4);
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
      expect(body.status).to.equal('Invalid id');
      done();
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
      done();
    })
  });

  it('GET to /api/tasks should not return deleted tasks', (done) => {
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
      expect(body.length).to.equal(0);
      done();
    });
  });

  it('should respond with 400 Bad Request for invalid endpoints', (done) => {
    request({
      method: 'GET',
      uri: `${apiUrl}/foo/bar`
    }, (error, response, body) => {
      if (error) {
        // Auto-fail test if error
        expect(true).to.equal(false);
        done();
      }
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  after(() => {
    Task.remove({ _id: taskId }).exec();
  });

})