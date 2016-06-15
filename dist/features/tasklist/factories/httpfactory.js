'use strict';

angular.module('http', []).factory('httpFactory', function ($http) {
  return {
    getTasks: function getTasks() {
      return $http.get('/api/tasks');
    },

    postTask: function postTask(newTask) {
      return $http.post('/api/tasks', newTask);
    },

    putTask: function putTask(id, task) {
      return $http.put('/api/tasks/' + id, task);
    },

    deleteTask: function deleteTask(id) {
      return $http.delete('/api/tasks/' + id);
    }
  };
});
//# sourceMappingURL=httpfactory.js.map
