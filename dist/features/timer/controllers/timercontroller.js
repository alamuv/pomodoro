'use strict';

var timer = angular.module('timer', []);

timer.controller('timerController', function ($scope, $rootScope, $timeout) {

  $scope.showPomodoroAlert = false;
  var togglePomodoroCompleteAlert = function togglePomodoroCompleteAlert() {
    $scope.showPomodoroAlert = !$scope.showPomodoroAlert;
  };

  $scope.showCompleteAlert = false;
  var toggleTaskCompleteAlert = function toggleTaskCompleteAlert() {
    $scope.showCompleteAlert = !$scope.showCompleteAlert;
  };
  // Timer settings
  $scope.timerSettings = {
    taskTime: 25,
    breakTime: 5
  };
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
  var currentPomodoros = void 0;
  $rootScope.$on('updatePomodoros', function (event, pomodoros) {
    currentPomodoros = pomodoros;
  });

  // Toggles the timer on/off
  $scope.toggleTimer = function () {
    $scope.isPaused = !$scope.isPaused;
    decrementTimer();
  };

  // Resets timer to timerSettings.taskTime/breakTime
  $scope.resetTimer = function () {
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

  // Converts minutes to a string
  var minsToString = function minsToString() {
    var mins = Math.floor($scope.timeLeft).toString().length > 1 ? Math.floor($scope.timeLeft).toString() : '0' + Math.floor($scope.timeLeft).toString();
    $scope.minutes = mins;
  };
  // Converts seconds to a string
  var secsToString = function secsToString() {
    var secs = Math.floor(($scope.timeLeft - parseInt($scope.minutes)) * 60).toString();
    if (secs.length < 2) secs = '0' + secs;
    $scope.seconds = secs;
  };

  // Switches to break timer when pomodoros is over
  var switchToBreak = function switchToBreak() {
    $scope.timeLeft = $scope.timerSettings.breakTime;
    $scope.isBreak = true;
    $rootScope.$broadcast('reduceCurrentPomodoros');
    // Shows pomodoro complete alert box and hides it after 1500ms
    togglePomodoroCompleteAlert();
    $timeout(togglePomodoroCompleteAlert, 1500);
  };
  // Switches to pomodoro timer when break is over
  var switchToTask = function switchToTask() {
    $scope.timeLeft = $scope.timerSettings.taskTime;
    $scope.isBreak = false;
  };
  // Suspends timer when there are no more pomodoros left in the task
  var endTask = function endTask() {
    $rootScope.$broadcast('deleteCurrentTask');
    $scope.isPaused = true;
    $scope.resetTimer();
    // Shows task complete alert box and hides it after 1500ms
    toggleTaskCompleteAlert();
    $timeout(toggleTaskCompleteAlert, 1500);
  };
  // Decrements the timer by 1 second
  var decrementTimer = function decrementTimer() {
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
//# sourceMappingURL=timercontroller.js.map
