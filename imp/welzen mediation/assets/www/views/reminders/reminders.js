'use strict';

angular.module('welzen')

.controller('RemindersController', function($scope, $state){

  $scope.remindersOn = hasSetAlarm();
  var NOTIFICATION_ID = 3914;


  $scope.timePickerObject = {
    inputEpochTime: 32400,
    step: 1,
    format: 12,
    titleLabel: 'Select Reminder Time',
    setLabel: 'Set',
    closeLabel: 'Close',
    setButtonType: 'welzen-popup__cta',
    closeButtonType: 'welzen-popup__btn',
    callback: function (val) {
      timePickerCallback(val);
    }
  };

  function timePickerCallback(val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      var minutes = Math.floor(val / 60);
      var hours = Math.floor(minutes/60)
      minutes = minutes%60;
      var selectedTime = new Date();
      selectedTime.setHours(hours);
      selectedTime.setMinutes(minutes);
      cancelNotify();
      setTimeReminder(selectedTime);
      $scope.timeAlarm = formatDateHM(selectedTime.getHours(),selectedTime.getMinutes());
      notify(selectedTime);
    }
  }

  function hasSetAlarm(){
    var timer = getTimeReminder();
    if (timer !== undefined){
        $scope.timeAlarm = formatDate(timer);
        return true;
    }
    return false;
  }

  function notify(date){
    var time = date;
    if (wasExpired(time)){
      time.setDate(time.getDate() + 1);
      console.log("Date time expired. Set next day");
    }else{
      console.log("Date not expired");
    }
    console.log("Alarm notification time: " + date);
    if(window.cordova){
        cordova.plugins.notification.local.schedule({
            id:NOTIFICATION_ID,
            every: "day",
            at: time,
            message: "A gentle reminder to come back and meditate with us."
        });
      }else{
        console.warn("Notification not enabled");
      }
  }

  function wasExpired(date){
      var today = new Date();
      if (today > date){
        return true;
      }
      return false;
  }

  function cancelNotify(){
    if(window.cordova){
        cordova.plugins.notification.local.cancel(NOTIFICATION_ID, function() {
          console.info("Notification was removed");
        });
      }else{
        console.warn("Notification not enabled");
      }
  }

  function setTimeReminder(date){
    window.localStorage['welzen.reminder.time'] = date.getTime();
  }


  function getTimeReminder(){
    var timeInMill =  window.localStorage['welzen.reminder.time'];
    if (timeInMill !== undefined){
      return timeInMill;
    }
    return undefined;
  }

  function removeTimeReminder(){
    window.localStorage.removeItem('welzen.reminder.time');
  }

  function formatDate(milliseconds){
    var date = new Date();
    date.setTime(milliseconds);
    var hours   = date.getHours();
    var minutes = date.getMinutes();
    return formatDateHM(hours,minutes);
  }

  function formatDateHM(hours,minutes){
     if(minutes <=9){
        minutes = '0'+minutes;
    }
    var amPm    = (hours >= 12) ? "PM" : "AM";
    hours = ((hours + 11) % 12 + 1);
    if(hours <=9){
      hours = '0'+hours;
    }
    var show = hours + ":" + minutes  + " " + amPm;
    return show;
  }

  function getInitialDate(){
    var day = new Date();
    day.setHours(9);
    day.setMinutes(0);
    return day;
  }

  $scope.onChangeReminder = function (reminder){
    if (!reminder){
        removeTimeReminder();
        cancelNotify();
    }else{
        var initial = new getInitialDate();
        setTimeReminder(initial);
        $scope.timeAlarm = formatDate(initial.getTime());
        notify(initial);
    }
  }
   
  $scope.goBack = function() {
    $state.go('settings');  
  };

})

;
