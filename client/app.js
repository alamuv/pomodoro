angular.module('pomodoro', [
  'login',
  'todos',
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
      templateUrl: 'features/todos/views/todos.html',
      controller: 'todosController'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.run(($rootScope, $location, $http) => {
  // Redirects to login page if there is no session id
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