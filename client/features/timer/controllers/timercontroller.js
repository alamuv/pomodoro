const timer = angular.module('timer', []);

timer.controller('timerController', function($scope, $rootScope, $timeout) {
  // Timer settings
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
  // Tracks pomodoros left on staged task
  let currentPomodoros;
  $rootScope.$on('updatePomodoros', (event, pomodoros) => {
    currentPomodoros = pomodoros;
  });

  // Toggles the timer on/off
  $scope.toggleTimer = () => {
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
  }

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
    $scope.timeLeft = $scope.timerSettings.breakTime;
    $scope.isBreak = true;
    $rootScope.$broadcast('reduceCurrentPomodoros');
  };
  // Switches to pomodoro timer when break is over
  const switchToTask = () => {
    $scope.timeLeft = $scope.timerSettings.taskTime;
    $scope.isBreak = false;
  }
  // Suspends timer when there are no more pomodoros left in the task
  const endTask = () => {
    $rootScope.$broadcast('deleteCurrentTask');
    $scope.isPaused = true;
    $scope.resetTimer();
  }
  // Decrements the timer by 1 second
  const decrementTimer = () => {
    if (!$scope.isPaused) {
      $scope.timeLeft = Math.max($scope.timeLeft - 1 / 60, 0);
      // If last pomodoro, delete task
      if ($scope.timeLeft === 0 && currentPomodoros === 1 && $scope.isBreak === false) endTask();
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
});
