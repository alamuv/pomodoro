'use strict';

angular.module('pomodoro', ['login', 'timer', 'currentTask', 'createTask', 'editTask', 'taskList', 'ngRoute', 'http', 'auth', 'ngCookies']).config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'features/login/views/login.html',
    controller: 'loginController'
  }).when('/pomodoros', {
    templateUrl: 'todos.html'
  }).otherwise({
    redirectTo: '/'
  });
}).run(function ($rootScope, $location, $http) {
  // Redirects to login page if there is no valid session id
  $rootScope.$on('$routeChangeStart', function (next, event, current) {
    $http.get('/checksession').then(function (response) {
      if (response.status === 200) {
        $location.path('/pomodoros');
      } else {
        $location.path('/');
      }
    }, function (error) {
      $location.path('/');
    });
  });
});
//# sourceMappingURL=app.js.map
