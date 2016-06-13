angular.module('pomodoro', [
  'login',
  'todos',
  'ngRoute',
])

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'features/login/views/login.html',
      controller: 'loginController'
    })
    .when('/pomodoros', {
      templateUrl: 'features/todos/views/todos.html',
      controller: 'todosController'
    })
    .otherwise({
      redirectTo: '/'
    });
});