const currentTask = angular.module('currentTask', []);

currentTask.controller('currentTaskController', function($scope, $rootScope, httpFactory) {
  
  $scope.currentTask;

  // Adds additional pomodoros to the current task
  $scope.addPomodoros = ($event) => {
    if ($event.stopPropagation) $event.stopPropagation();
    $scope.currentTask.pomodoros++;
    httpFactory.putTask($scope.currentTask._id, $scope.currentTask);
    // Sends updated pomodoro number to timer
    $rootScope.$broadcast('updatePomodoros', $scope.currentTask.pomodoros);
  };
  // Removes pomodoros from the current task
  $scope.subtractPomodoros = ($event) => {
    if ($event.stopPropagation) $event.stopPropagation();
    $scope.currentTask.pomodoros = Math.max(1, --$scope.currentTask.pomodoros);
    httpFactory.putTask($scope.currentTask._id, $scope.currentTask);
    // Sends updated pomodoro number to timer
    $rootScope.$broadcast('updatePomodoros', $scope.currentTask.pomodoros);
  };
  $rootScope.$on('reduceCurrentPomodoros', () => {
    $scope.subtractPomodoros($scope.currentTask);
  });

  // Deletes the current task
  $scope.deleteCurrentTask = ($event) => {
    if ($event.stopPropagation) $event.stopPropagation();
    httpFactory.deleteTask($scope.currentTask._id);
    $scope.currentTask = undefined;
  };
  $rootScope.$on('deleteCurrentTask', $scope.deleteCurrentTask);

  // Changes the 'current task'
  const stageTask = (event, task) => {
    if ($scope.currentTask !== undefined) {
      // Sends currentTask back to the taskListController, where it will be added back to the task list
      $rootScope.$broadcast('unstageTask', $scope.currentTask);
    }
    // Sets the clicked task as the current task
    $scope.currentTask = task;
    // Resets timer
    $rootScope.$broadcast('resetTimerForNewTask');

    // Sends updated pomodoro number to timer
    if($scope.currentTask !== undefined) $rootScope.$broadcast('updatePomodoros', $scope.currentTask.pomodoros);
  };
  $rootScope.$on('stageTask', stageTask);

  // Toggles visibility of the edit task modal
  $scope.editTask = ($event) => {
    $event.stopPropagation();
    $rootScope.$broadcast('editTask', $scope.currentTask);
  }
});