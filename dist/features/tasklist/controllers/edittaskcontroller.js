'use strict';

var editTask = angular.module('editTask', []);

editTask.controller('editTaskController', function ($scope, $rootScope, httpFactory) {

  // Determines whether edit task modal is visible
  $scope.isEditingTask = false;

  // Stores task being edited
  $scope.editTask;

  // Shows/hides the task edit modal
  $scope.toggleIsEditingTask = function (event, task) {
    $scope.isEditingTask = !$scope.isEditingTask;
    $scope.editTask = task;
  };
  $rootScope.$on('editTask', $scope.toggleIsEditingTask);

  $scope.updateTask = function () {
    // Updates task on server
    httpFactory.putTask($scope.editTask._id, $scope.editTask).then(function (response) {
      $scope.editTask = undefined;
      $scope.toggleIsEditingTask();
    });
  };
});
//# sourceMappingURL=edittaskcontroller.js.map
