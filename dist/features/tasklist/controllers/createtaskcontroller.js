'use strict';

var createTask = angular.module('createTask', []);

createTask.controller('createTaskController', function ($scope, $rootScope, httpFactory) {

  // Determines whether create task modal should be shown
  $scope.isCreatingTask = false;

  // Store newly created task
  $scope.newTask = {
    name: '',
    description: '',
    pomodoros: 1
  };

  $scope.toggleIsCreatingTask = function () {
    // Shows/hides the task creation modal
    $scope.isCreatingTask = !$scope.isCreatingTask;
  };
  $rootScope.$on('createTask', $scope.toggleIsCreatingTask);

  $scope.submitTask = function () {
    // Posts task to the server
    httpFactory.postTask($scope.newTask).then(function (response) {
      // Adds the id (from server response) to the new task and pushes it to the new task list
      $scope.newTask._id = response.data.id;
      $rootScope.$broadcast('unstageTask', $scope.newTask);
      // Resets the new task object
      $scope.newTask = {
        name: '',
        description: '',
        pomodoros: 1
      };
      $scope.toggleIsCreatingTask();
    });
  };
});
//# sourceMappingURL=createtaskcontroller.js.map
