const timer = angular.module('timer', []);

timer.controller('timerController', function($scope, $rootScope, $timeout) {

  /*
   * The below variables control how the timer operates and how it is displayed
   */
  
  // Default length of task and break
  $scope.timerSettings = {
    taskTime: 25,
    breakTime: 5
  }
  // Time left for current pomodoro
  $scope.timeLeft = $scope.timerSettings.taskTime;
  // String display of minutes left
  $scope.minutes = '25';
  // String display of seconds sleft
  $scope.seconds = '00';
  // Toggle to start/pause timer
  $scope.isPaused = true;
  // Denotes whether currently in a break
  $scope.isBreak = false;
  // Last time the timer was decremented
  $scope.lastCheckedTime;



  // Toggles the timer on/off
  $scope.toggleTimer = () => {
    if ($scope.isPaused && ($scope.isBreak && $scope.timeLeft === $scope.timerSettings.breakTime || !$scope.isBreak && $scope.timeLeft === $scope.timerSettings.taskTime)) {
      $scope.lastCheckedTime = Date.now();
    }
    $scope.isPaused = !$scope.isPaused;
    decrementTimer();
  };

  // Resets timer to timerSettings.taskTime/breakTime
  $scope.resetTimer = () => {
    if ($scope.isBreak) {
      $scope.timeLeft = $scope.timerSettings.breakTime;
      $scope.isPaused = true;
      minsToString();
      secsToString();
    } else {
      $scope.timeLeft = $scope.timerSettings.taskTime;
      $scope.isPaused = true;
      minsToString();
      secsToString();
    }
  };
  $rootScope.$on('resetTimerForNewTask', () => {
    $scope.isBreak = false;
    $scope.resetTimer();
  });

  /*
   * The below 2 functions convert the time into a string that is displayed on the page
   */

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

  /*
   * The below functions determine what happens when the timer reaches 0 seconcds
   */

  // Switches to break timer when pomodoro is over
  const switchToBreak = () => {
    $scope.isBreak = true;
    
    // Sets the timer to the break duration (Default 5min)
    $scope.timeLeft = $scope.timerSettings.breakTime;
    // Reduces the number of pomodoros on the task by 1
    $rootScope.$broadcast('reduceCurrentPomodoros');

    // Shows pomodoro complete alert box and hides it after 1500ms
    togglePomodoroCompleteAlert();
    $timeout(togglePomodoroCompleteAlert, 1500);
  };

  // Switches to pomodoro timer when break is over
  const switchToTask = () => {
    $scope.isBreak = false;
    
    // Sets the timer to the task/pomodoro duration (Default 25min)
    $scope.timeLeft = $scope.timerSettings.taskTime;
  }

  // Suspends timer when there are no more pomodoros left in the task
  const endTask = () => {
    // Pauses the timer
    $scope.isPaused = true;

    // Deletes the task that was just completed
    $rootScope.$broadcast('deleteCurrentTask');

    $scope.resetTimer();

    // Shows task complete alert box and hides it after 1500ms
    toggleTaskCompleteAlert();
    $timeout(toggleTaskCompleteAlert, 1500);
  }
  // Decrements the timer by 1 second
  const decrementTimer = () => {
    if (!$scope.isPaused) {
      const now = Date.now();
      $scope.timeLeft = Math.max(0, $scope.timeLeft - ((now - $scope.lastCheckedTime) / 1000) / 60);
      $scope.lastCheckedTime = now;
      // If last pomodoro, delete task
      if ($scope.timeLeft === 0 && currentPomodoros === 1 && $scope.isBreak === false) endTask();
      // If pomodoro complete, switch to break timer
      else if ($scope.timeLeft === 0 && $scope.isBreak === false) switchToBreak();
      // If break complete, switch to pomodoro timer
      else if ($scope.timeLeft === 0 && $scope.isBreak === true) switchToTask();
      // Queues additional call to decrementTimer
      $timeout(decrementTimer, 0);
      // Converts timeLeft to formatted minutes and seconds
      minsToString();
      secsToString();
    }
  };

  // Shows/hides the 'Pomodoro complete' message
  $scope.showPomodoroAlert = false;
  const togglePomodoroCompleteAlert = () => {
    $scope.showPomodoroAlert = !$scope.showPomodoroAlert;
  }
  
  // Shows/hides the 'Task complete' message (task is complete when all of its pomodoros are complete)
  $scope.showCompleteAlert = false;
  const toggleTaskCompleteAlert = () => {
    $scope.showCompleteAlert = !$scope.showCompleteAlert;
  };

  // Tracks pomodoros left on the currently staged task
  let currentPomodoros;
  $rootScope.$on('updatePomodoros', (event, pomodoros) => {
    currentPomodoros = pomodoros;
  });

});
