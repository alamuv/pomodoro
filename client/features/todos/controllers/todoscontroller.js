angular.module('todos', [])

.controller('todosController', function($scope, $timeout) {

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
      description: 'Stuff Stuff Stuff Stuff Stuff Stuff Stuff Stuff Stuff Stuff Stuff',
      pomodoros: 2
    }
  ];

  // Stores task that is currently being worked on
  $scope.currentTask;

  // Time left for current pomodoro
  $scope.timeLeft = 25;
  // String display of minutes left
  $scope.minutes = '25';
  // String display of second sleft
  $scope.seconds = '00';
  // Toggle to start/pause timer
  $scope.paused = false;
  // Denotes whether currently in a break
  $scope.isBreak = false;

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
    $scope.timeLeft = 25;
    $scope.paused = true;
    $scope.minsToString();
    $scope.secsToString();
    $scope.decrementTimer();
  };

  // Toggles the timer on/off
  $scope.toggleTimer = () => {
    $scope.paused = !$scope.paused;
    $scope.decrementTimer();
  };
  // Decrements the timer by 1 second
  $scope.decrementTimer = () => {
    if (!$scope.paused) {
      $scope.timeLeft = Math.max($scope.timeLeft - 1 / 60, 0);
      // Updates the minutes string
      $scope.minsToString();
      // Updates the seconds string
      $scope.secsToString();
      // If at 0 seconds, reduces the number of pomodoros remaining
      if ($scope.timeLeft === 0) {
        $scope.currentTask.pomodoros--;
        $scope.paused = true;
      } else {
        $timeout($scope.decrementTimer, 1000);
      }
    }
  };
  // Converts minutes to a string
  $scope.minsToString = () => {
    const mins = Math.floor($scope.timeLeft).toString().length > 1 ? Math.floor($scope.timeLeft).toString() : '0' + Math.floor($scope.timeLeft).toString();
    $scope.minutes = mins;
  };
  // Converts seconds to a string
  $scope.secsToString = () => {
    let secs = Math.floor(($scope.timeLeft - parseInt($scope.minutes)) * 60).toString();
    if (secs.length < 2) secs = '0' + secs;
    $scope.seconds = secs;
  };

  // Stages the initial task
  $scope.init = () => {
    $scope.stageTask($scope.tasks[0]);
  };
  $scope.init();
});
