const createTask = angular.module('createTask', []);

createTask.controller('createTaskController', function ($scope, $rootScope, httpFactory) {

  /*
   * The below functions are used for creating tasks:
   *  - toggleIsCreatingTask: Shows/hides the task creation modal
   *  - submitTask: Sends the the new task to the server, where it will be stored
   */

  // Determines whether create task modal should be shown
  $scope.isCreatingTask = false;

  // Store newly created task
  $scope.newTask = {
    name: '',
    description: '',
    pomodoros: 1,
  }

  $scope.toggleIsCreatingTask = () => {
    // Shows/hides the task creation modal
    $scope.isCreatingTask = !$scope.isCreatingTask;
  }
  $rootScope.$on('createTask', $scope.toggleIsCreatingTask);

  $scope.submitTask = () => {
    // Posts task to the server
    httpFactory.postTask($scope.newTask)
      .then((response) => {
        // Adds the id (from server response) to the new task and pushes it to the new task list
        $scope.newTask._id = response.data.id;
        $rootScope.$broadcast('unstageTask', $scope.newTask);
        // Resets the new task object
        $scope.newTask = {
          name: '',
          description: '',
          pomodoros: 1,
        };
        $scope.toggleIsCreatingTask();
      });
  }

});