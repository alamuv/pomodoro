angular.module('auth', [])

.factory('authFactory', function($http) {
  return ({
    authorizeUser: (username, password) => {
      return $http.post('/authorize', {
        username,
        password,
      });
    }
  })
});