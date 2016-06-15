'use strict';

angular.module('login', []).controller('loginController', function ($scope, $location, authFactory) {
  $scope.username = '';
  $scope.password = '';

  // Signs up/logs in the user
  $scope.authorize = function () {
    authFactory.authorizeUser($scope.username, $scope.password).then(function (response) {
      $location.path('/pomodoros');
    });
  };
});
//# sourceMappingURL=logincontroller.js.map
