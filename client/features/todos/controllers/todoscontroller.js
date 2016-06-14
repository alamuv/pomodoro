const todos = angular.module('todos', []);

todos.controller('todosController', function($scope, $timeout, httpFactory) {

  /*
   * The below functions control the tasks currently displayed on the screen:
   *  - addPomodoros: Adds an additional pomodoro to the task
   *  - subtractPomodoros: Removes a pomodoro from the task (minimum 1 pomodoro per task)
   *  - stageTask: Switches the task that is currently being timed
   */

  // Stores tasks
  $scope.tasks;

  // Stores task that is currently being worked on
  $scope.currentTask;

  // Add/remove pomodoros based on user interaction
  $scope.addPomodoros = (task, $event) => {
    $event.stopPropagation();
    task.pomodoros++;
    httpFactory.putTask(task._id, task);
  };

  $scope.subtractPomodoros = (task, $event) => {
    $event.stopPropagation();
    task.pomodoros = Math.max(1, --task.pomodoros);
    httpFactory.putTask(task._id, task);
  };

  // Change the 'current task'
  $scope.stageTask = (task) => {
    // Pushes current task to the task list
    if ($scope.currentTask !== undefined) $scope.tasks.push($scope.currentTask);
    // Sets the clicked task as the current task, removes it from the task list
    $scope.currentTask = task;
    $scope.tasks.forEach((current, index, array) => {
      if (current._id === task._id) {
        array.splice(index, 1);
      }
    });

    // Resets the timer
    $scope.timeLeft = taskTime;
    $scope.isPaused = true;
    minsToString();
    secsToString();
  };

  /*
   * The below functions are used to control the timer:
   *  - toggleTimer: Starts/pauses the timer when users clicks the start/pause button
   *  - minsToString: Converts the time number into a minutes string
   *  - secsToString: Converts the time number into a seconds string
   *  - switchToBreak: Switches to break timer when pomodoro is complete
   *  - switchToTask: Switches to pomodoro timer when break is complete
   *  - endTask: Suspends the timer when there are no more pomodoros left
   *  - decrementTimer: Reduces timer by 1 second
   */

   // Default start time for a pomodoro
   const taskTime = 25;
   // Time left for current pomodoro
   $scope.timeLeft = taskTime;
   // String display of minutes left
   $scope.minutes = '25';
   // String display of seconds sleft
   $scope.seconds = '00';
   // Toggle to start/pause timer
   $scope.isPaused = false;
   // Denotes whether currently in a break
   $scope.isBreak = false;
   // Default start time for break
   const breakTime = 5;

  // Toggles the timer on/off
  $scope.toggleTimer = () => {
    $scope.isPaused = !$scope.isPaused;
    decrementTimer();
  };
  // Converts minutes to a string
  const minsToString = () => {
    const mins = Math.floor($scope.timeLeft).toString().length > 1 ? Math.floor($scope.timeLeft).toString() : '0' + Math.floor($scope.timeLeft).toString();
    $scope.minutes = mins;
  };
  // Converts seconds to a string
  const secsToString = () => {
    let secs = Math.floor(($scope.timeLeft - parseInt($scope.minutes)) * 60).toString();
    if (secs.length < 2) secs = '0' + secs;
    $scope.seconds = secs;
  };
  // Switches to break timer when pomodoros is over
  const switchToBreak = () => {
    $scope.timeLeft = breakTime;
    $scope.isBreak = true;
    $scope.currentTask.pomodoros--;
  };
  // Switches to pomodoro timer when break is over
  const switchToTask = () => {
    $scope.timeLeft = taskTime;
    $scope.isBreak = false;
  }
  // Suspends timer when there are no more pomodoros left in the task
  const endTask = () => {
    $scope.deleteTask($scope.currentTask);
    $scope.currentTask = undefined;
    $scope.isPaused = true;
  }
  // Decrements the timer by 1 second
  const decrementTimer = () => {
    if (!$scope.isPaused) {
      $scope.timeLeft = Math.max($scope.timeLeft - 1 / 60, 0);
      // If last pomodoro, delete task
      if ($scope.timeLeft === 0 && $scope.currentTask.pomodoros === 1 && $scope.isBreak === false) endTask();
      // If pomodoro complete, switch to break timer
      else if ($scope.timeLeft === 0 && $scope.isBreak === false) switchToBreak();
      // If break complete, switch to pomodoro timer
      else if ($scope.timeLeft === 0 && $scope.isBreak === true) switchToTask();
      // Queues additional call to decrementTimer
      $timeout(decrementTimer, 1000);
      // Converts timeLeft to formatted minutes and seconds
      minsToString();
      secsToString();
    }
  };

  /*
   * The below functions are used for creating new tasks:
   *  - toggleIsCreatingTask: Shows/hides the task creation modal
   *  - submitTask: Submits/creates the new task
   *  - 
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
    $scope.isCreatingTask = !$scope.isCreatingTask;
  }

  $scope.submitTask = () => {
    httpFactory.postTask($scope.newTask)
      .then((response) => {
        $scope.newTask._id = response.data.id;
        $scope.tasks.push($scope.newTask);
        $scope.newTask = {
          name: '',
          description: '',
          pomodoros: 1,
        };
        $scope.toggleIsCreatingTask();
      });
  }

  $scope.deleteTask = (task, $event) => {
    // Stops propagation if event object passed in
    if($event) $event.stopPropagation();
    // Deletes the task from the database
    httpFactory.deleteTask(task._id)
      .then((response) => {
        // Removes the task from the view
        if (task === $scope.currentTask) {
          $scope.currentTask = undefined;
        } else {
          $scope.tasks.forEach((curr, index, array) => {
            if (curr._id === task._id) array.splice(index, 1);
          });
        }
      });
  }

  // Initializes the app on load
  const init = () => {
    httpFactory.getTasks()
      .then((response) => {
        $scope.tasks = response.data;
        $scope.stageTask($scope.tasks[0]);
      });
  };
  init();
});
