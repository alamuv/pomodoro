'use strict';

var currentTask = angular.module('currentTask', []);

currentTask.controller('currentTaskController', function ($scope, $rootScope, httpFactory) {

  $scope.currentTask;

  // Adds additional pomodoros to the task
  $scope.addPomodoros = function ($event) {
    if ($event.stopPropagation) $event.stopPropagation();
    $scope.currentTask.pomodoros++;
    httpFactory.putTask($scope.currentTask._id, $scope.currentTask);
    // Sends updated pomodoro number to timer
    $rootScope.$broadcast('updatePomodoros', $scope.currentTask.pomodoros);
  };
  // Removes pomodoros from the task
  $scope.subtractPomodoros = function ($event) {
    if ($event.stopPropagation) $event.stopPropagation();
    $scope.currentTask.pomodoros = Math.max(1, --$scope.currentTask.pomodoros);
    httpFactory.putTask($scope.currentTask._id, $scope.currentTask);
    // Sends updated pomodoro number to timer
    $rootScope.$broadcast('updatePomodoros', $scope.currentTask.pomodoros);
  };
  $rootScope.$on('reduceCurrentPomodoros', function () {
    $scope.subtractPomodoros($scope.currentTask);
  });

  $scope.deleteCurrentTask = function ($event) {
    if ($event.stopPropagation) $event.stopPropagation();
    httpFactory.deleteTask($scope.currentTask._id);
    $scope.currentTask = undefined;
  };
  $rootScope.$on('deleteCurrentTask', $scope.deleteCurrentTask);

  // Change the 'current task'
  var stageTask = function stageTask(event, task) {
    // Sends currentTask back to the taskListController
    if ($scope.currentTask !== undefined) {
      $rootScope.$broadcast('unstageTask', $scope.currentTask);
      $rootScope.$broadcast('updatePomodoros', $scope.currentTask.pomodoros);
    }
    // Sets the clicked task as the current task, removes it from the task list
    $scope.currentTask = task;
    // Resets timer
    $rootScope.$broadcast('resetTimer');
    // Sends updated pomodoro number to timer
  };
  $rootScope.$on('stageTask', stageTask);

  $scope.editTask = function ($event) {
    $event.stopPropagation();
    $rootScope.$broadcast('editTask', $scope.currentTask);
  };
});
//# sourceMappingURL=currenttaskcontroller.js.map
