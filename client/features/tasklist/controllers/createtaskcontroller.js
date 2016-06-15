const createTask = angular.module('createTask', []);

createTask.controller('createTaskController', function ($scope, $rootScope, httpFactory) {

  // Determines whether create task modal is visible
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
        // Adds the id (from server response) to the new task
        $scope.newTask._id = response.data.id;
        // Adds new task to the task list
        $rootScope.$broadcast('unstageTask', $scope.newTask);
        // Resets the new task object
        $scope.newTask = {
          name: '',
          description: '',
          pomodoros: 1,
        };
        // Hides the creation modal
        $scope.toggleIsCreatingTask();
      });
  }

});