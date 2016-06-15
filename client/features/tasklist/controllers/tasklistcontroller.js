const taskList = angular.module('taskList', []);

taskList.controller('taskListController', function($scope, $rootScope, $timeout, httpFactory) {

  // Stores tasks
  $scope.tasks;

  // Adds additional pomodoros to the task
  $scope.addPomodoros = (task, $event) => {
    $event.stopPropagation();
    task.pomodoros++;
    httpFactory.putTask(task._id, task);
  };
  // Removes pomodoros from the task
  $scope.subtractPomodoros = (task, $event) => {
    $event.stopPropagation();
    task.pomodoros = Math.max(1, --task.pomodoros);
    httpFactory.putTask(task._id, task);
  };

  // Switches the 'current task'
  $scope.stageTask = (task) => {
    // Tells currentTaskController to stage task
    $rootScope.$broadcast('stageTask', task);
    // Removes task from the task list
    const taskIndex = $scope.tasks.indexOf(task);
    $scope.tasks.splice(taskIndex, 1);
  };

  // Adds a task back to the list
  const unstageTask = (event, task) => {
    $scope.tasks.push(task);
  }
  $rootScope.$on('unstageTask', unstageTask);

  // Deletes a task
  $scope.deleteTask = (task, $event) => {
    // Stops propagation if event object passed in
    if($event) $event.stopPropagation();
    // Deletes the task from the database
    httpFactory.deleteTask(task._id)
      .then((response) => {
        // Removes the task from the view
        const taskIndex = $scope.tasks.indexOf(task);
        $scope.tasks.splice(taskIndex, 1);
      });
  }

  // Shows the create event modal
  $scope.toggleIsCreatingTask = () => {
    $rootScope.$broadcast('createTask');
  };
  // Shows the edit task modal
  $scope.editTask = (task, $event) => {
    $event.stopPropagation();
    $rootScope.$broadcast('editTask', task);
  };

  /* Initializes the app on load by:
   *  - Getting the user's tasks from ther server
   *  - Staging the first task in the list
   */
  const init = () => {
    httpFactory.getTasks()
      .then((response) => {
        $scope.tasks = response.data;
        $scope.stageTask($scope.tasks[0]);
      });
  };
  init();
});
