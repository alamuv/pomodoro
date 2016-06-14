const todos = angular.module('todos', []);

todos.controller('todosController', function($scope, $timeout) {

  // Stores tasks
  $scope.tasks = [
    {
      id: 1,
      name: 'Bugs',
      description: 'Fix server bugs',
      pomodoros: 3
    },
    {
      id: 2,
      name: 'Style',
      description: 'Improve CSS styling',
      pomodoros: 2
    },
    {
      id: 3,
      name: 'Deploy',
      description: 'Deploy to production',
      pomodoros: 4
    },
    {
      id: 4,
      name: 'Do stuff',
      description: 'Stuff Stuff Stuff Stuff Stuff Stuff Stuff',
      pomodoros: 2
    }
  ];

  // Stores task that is currently being worked on
  $scope.currentTask;

  // Determines whether create task modal should be shown
  $scope.isCreatingTask = false;

  // Time left for current pomodoro
  const taskTime = 25;
  $scope.timeLeft = taskTime;
  // String display of minutes left
  $scope.minutes = '25';
  // String display of second sleft
  $scope.seconds = '00';
  // Toggle to start/pause timer
  $scope.isPaused = false;
  // Denotes whether currently in a break
  const breakTime = 5;
  $scope.isBreak = false;

  // Store newly created task
  $scope.newTask = {
    name: '',
    description: '',
    pomodoros: 1,
  }

  // Add/remove pomodoros based on user interaction
  $scope.addPomodoros = (task, $event) => {
    console.log($scope.timeLeft);
    $event.stopPropagation();
    task.pomodoros++;
  };

  $scope.subtractPomodoros = (task, $event) => {
    $event.stopPropagation();
    task.pomodoros = Math.max(1, --task.pomodoros);
  };

  // Change the 'current task'
  $scope.stageTask = (task) => {
    // Pushes current task to the task list
    if ($scope.currentTask !== undefined) $scope.tasks.push($scope.currentTask);
    // Sets the clicked task as the current task, removes it from the task list
    $scope.currentTask = task;
    $scope.tasks.forEach((current, index, array) => {
      if (current.id === task.id) {
        array.splice(index, 1);
      }
    });

    // Resets the timer
    $scope.timeLeft = taskTime;
    $scope.isPaused = true;
    minsToString();
    secsToString();
    decrementTimer();
  };

  // Toggles the timer on/off
  $scope.toggleTimer = () => {
    $scope.isPaused = !$scope.isPaused;
    decrementTimer();
  };
  // Decrements the timer by 1 second
  const decrementTimer = () => {
    if (!$scope.isPaused) {
      $scope.timeLeft = Math.max($scope.timeLeft - 1 / 60, 0);
      // Updates the minutes string
      minsToString();
      // Updates the seconds string
      secsToString();
      // If last pomodoro, delete task
      if ($scope.timeLeft === 0 && $scope.currentTask.pomodoros === 1 && $scope.isBreak === false) {
        $scope.currentTask = undefined;
        $scope.isPaused = true;
      } else if ($scope.timeLeft === 0 && $scope.isBreak === false) { // If not the last pomodoro, starts break timer
        $scope.timeLeft = breakTime;
        minsToString();
        secsToString();

        $scope.currentTask.pomodoros--;

        $scope.isBreak = true;
        decrementTimer();
      } else if ($scope.timeLeft === 0 && $scope.isBreak === true) { // If end of break, starts timer for next pomodoro
        $scope.timeLeft = taskTime;
        minsToString();
        secsToString();
        $scope.isBreak = false;
        decrementTimer();
      } else if (!$scope.isPaused) {
        $timeout(decrementTimer, 1000);
      }
    }
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

  $scope.toggleIsCreatingTask = () => {
    $scope.isCreatingTask = !$scope.isCreatingTask;
  }

  $scope.submitTask = () => {
    $scope.tasks.push($scope.newTask);
    $scope.toggleIsCreatingTask();
  }

  // Stages the initial task
  $scope.init = () => {
    $scope.stageTask($scope.tasks[0]);
  };
  $scope.init();
});

module.exports = todos;
