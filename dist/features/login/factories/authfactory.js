'use strict';

angular.module('auth', []).factory('authFactory', function ($http) {
  return {
    authorizeUser: function authorizeUser(username, password) {
      return $http.post('/authorize', {
        username: username,
        password: password
      });
    }
  };
});
//# sourceMappingURL=authfactory.js.map
