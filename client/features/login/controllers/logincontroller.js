angular.module('login', [])

.controller('loginController', function($scope, $location, authFactory) {
  $scope.username = '';
  $scope.password = '';

  // Signs up/logs in the user
  $scope.authorize = () => {
    authFactory.authorizeUser($scope.username, $scope.password)
      .then((response) => {
        $location.path('/pomodoros');
      })
  }
});