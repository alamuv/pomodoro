angular.module('http', [])

.factory('httpFactory', function($http) {
  return({
    getTasks: () => {
      return $http.get('/api/tasks');
    },

    postTask: (newTask) => {
      return $http.post('/api/tasks', newTask);
    },

    putTask: (id, task) => {
      return $http.put(`/api/tasks/${id}`, task);
    },

    deleteTask: (id) => {
      return $http.delete(`/api/tasks/${id}`);
    }
  })
});