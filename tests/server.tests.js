const expect = require('chai').expect;
const server = require('../server/server.js');
let request = require('supertest');

const Task = require('../server/models/task.js');

const apiUrl = 'http://127.0.0.1:' + process.env.PORT || 3000;

// Dummy data for tests
let newUser = {
  username: 'foo', 
  password: 'bar'
}
let sessionId;
let task = {
  name: 'Laundry',
  description: 'Laundry',
  pomodoros: 3,
}
let updateTask = {
  name: 'Errands',
  description: 'Laundry',
  pomodoros: 4,
}
let taskId

describe('Basic server functionality', () => {

  it('POST /authorize should create a new user', (done) => {
    request(server)
      .post('/authorize')
      .type('json')
      .send(newUser)
      .end((err, res) => {
        sessionId = res.headers['set-cookie'][0].match(/sessionId=(\w+);/)[1];
        expect(res.status).to.equal(302);
        done();
      });
  });

  it('POST /authorize should not authorize incorrect password', (done) => {
    request(server)
      .post('/authorize')
      .type('json')
      .send({
        username: 'foo',
        password: 'foobar'
      })
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
  });

  it('GET to /api/tasks should respond with 200 OK', (done) => {
    request(server)
      .get('/api/tasks')
      .set('Cookie', [`sessionId=${sessionId}`])
      .end((error, response) => {
          expect(response.status).to.equal(200);
          done();
      });
  });

  it('POST to /api/tasks should respond with 400 Bad Request if task object invalid', (done) => {
    request(server)
      .post('/api/tasks')
      .set('Cookie', [`sessionId=${sessionId}`])
      .send({})
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal('Invalid task object');
        done();
      });
  });

  it('POST to /api/tasks should respond with 201 Created', (done) => {
    request(server)
      .post('/api/tasks')
      .set('Cookie', [`sessionId=${sessionId}`])
      .send(task)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal('Success');
        taskId = response.body.id;
        done();
      });
  });

  it('GET to /api/tasks should return newly created tasks', (done) => {
    request(server)
      .get('/api/tasks')
      .set('Cookie', [`sessionId=${sessionId}`])
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
        expect(response.body[0].name).to.equal('Laundry');
        expect(response.body[0].description).to.equal('Laundry');
        expect(response.body[0].pomodoros).to.equal(3);
        done();
      });
  });

  it('PUT /api/tasks/:id should respond with 400 Bad Request if task id invalid', (done) => {

    request(server)
      .put('/api/tasks/12345')
      .set('Cookie', [`sessionId=${sessionId}`])
      .send(updateTask)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal('Invalid id');
        done();
      });
  });

  it('PUT /api/tasks/:id should respond with 200 OK if task id valid', (done) => {
    request(server)
      .put(`/api/tasks/${taskId}`)
      .set('Cookie', [`sessionId=${sessionId}`])
      .send(updateTask)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('Success');
        expect(response.body.id).to.equal(taskId);
        done();
      });
  });

  it('GET to /api/tasks should return updated tasks', (done) => {
    request(server)
      .get('/api/tasks')
      .set('Cookie', [`sessionId=${sessionId}`])
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
        expect(response.body[0].name).to.equal('Errands');
        expect(response.body[0].description).to.equal('Laundry');
        expect(response.body[0].pomodoros).to.equal(4);
        done();
      });
  });

  it('DELETE /api/tasks/:id should respond with 400 Bad Request if task id invalid', (done) => {
    request(server)
      .del('/api/tasks/12345')
      .set('Cookie', [`sessionId=${sessionId}`])
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal('Invalid id');
        done();
      })
  });

  it('DELETE /api/tasks/:id should respond with 200 OK if task id valid', (done) => {
    request(server)
      .del(`/api/tasks/${taskId}`)
      .set('Cookie', [`sessionId=${sessionId}`])
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('Success');
        done();
      });
  });

  it('GET to /api/tasks should not return deleted tasks', (done) => {
    request(server)
      .get('/api/tasks')
      .set('Cookie', [`sessionId=${sessionId}`])
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(0);
        done();
      });
  });

  it('should respond with 400 Bad Request for invalid endpoints', (done) => {
    request(server)
      .get('/foo/bar')
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
  });

  after(() => {
    Task.remove({ _id: taskId }).exec();
  });

})