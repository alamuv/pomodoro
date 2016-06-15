angular.module('pomodoro', [
  'login',
  'timer',
  'currentTask',
  'createTask',
  'editTask',
  'taskList',
  'ngRoute',
  'http',
  'auth',
  'ngCookies'
])

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'features/login/views/login.html',
      controller: 'loginController'
    })
    .when('/pomodoros', {
      templateUrl: 'todos.html'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.run(($rootScope, $location, $http) => {
  // Redirects to login page if there is no valid session id
  $rootScope.$on('$routeChangeStart', (next, event, current) => {
    $http.get('/checksession')
      .then((response) => {
        if(response.status === 200) {
          $location.path('/pomodoros');
        } else {
          $location.path('/');
        }
      }, (error) => {
        $location.path('/');
      })
  });
});