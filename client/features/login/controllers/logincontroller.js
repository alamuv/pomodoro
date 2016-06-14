angular.module('login', [])

.controller('loginController', function($scope, $location, authFactory) {
  $scope.username = '';
  $scope.password = '';

  $scope.authorize = () => {
    authFactory.authorizeUser($scope.username, $scope.password)
      .then((response) => {
        $location.path('/pomodoros');
      })
  }
});