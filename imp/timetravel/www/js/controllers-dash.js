angular.module('starter.controllers-dash', [])

.controller('DashCtrl', function(
    $scope, $rootScope, $interval, $state,
    $ionicModal, $ionicPopup, 
    Variables, Timer, History, Utils, Share) {
    

    //console.log(Variables.Metric)
    //Variables.changeMetric();
    //console.log(Variables.Metric)
    
    //console.log(Variables.Speed)
    //Variables.updateSpeed(3);
    //console.log(Variables.Speed)
  

    //console.log(Variables.TimerData)
    //Variables.updateTimerData("timerState", "run");
    //console.log(Variables.TimerData)
    //Variables.updateTimer(1,2,3);
    //console.log(Variables.TimerData)
    
    
    var INTERVAL_CONSTANT = 100;
    $scope.TransModes   = Variables.TransModes;
    $scope.Metric       = Variables.Metric;
    $scope.Speed        = Variables.Speed;  
    $scope.TimerData    = Variables.TimerData;
    fitTimeTravelValue();

    
    
    
    
    //
    // timeOut options:
    //
    //
    // 1    'application-dash':     user leaves the application from state dash
    //                              trigger:    timeOutMode = true
    //                                          timeOutStartDate
    //
    // 2    'application-other':    user leaves the application from any other state
    //                              trigger:    timeOutMode = true
    //
    // 3    'state-change':         user stays in the application but changes state to other
    //                              trigger:    timeOutState = true
    //                                          timeOutStartDate
    //
    
    //
    $scope.testTimeOut = function() {
        if($state.current.name == "tab.dash") {
            $rootScope.$broadcast('timeOutEvent:leaveDash', {});
        } else {
            $rootScope.$broadcast('timeOutEvent:leaveOther', {});
        }
    };
    
    $scope.$on("$ionicView.enter", function (event, data) {
        resumeDash();
    })
    $scope.$on("$ionicView.leave", function (event, data) {
        $rootScope.$broadcast('timeOutEvent:leaveDash', {});
    })
    $scope.$on("timeOutEvent:resumeDash", function (event, data) {     
        resumeDash();
    })
    $scope.$on("timeOutEvent:leaveDash", function (event, data) {     console.log("timeOutEvent:leaveDash")
        if(Variables.TimerData["timerState"] == "run") {   
            var tempDate = new Date(); tempDate = tempDate.getTime();
            Variables.updateTimerData("timeOutMode", true);
            Variables.updateTimerData("timeOutStartDate", tempDate); 
            
 
            Variables.saveTimerData();  // save timer state
            $scope.startpauseTimer();   // pause in the session but do not save in ls
            
        }
    })
    $scope.$on("timeOutEvent:leaveOther", function (event, data) {    console.log("timeOutEvent:leaveOther")
        if(Variables.TimerData["timerState"] == "run") {   
            var tempDate = new Date(); tempDate = tempDate.getTime();
            Variables.updateTimerData("timeOutMode", true);
            // timeOutStartDate already set in stateChange
            // startPauseTimer() already set in stateChange
            
            Variables.saveTimerData();  // save timer state
        }
    })
    function resumeDash() {                                          console.log("resumeDash")
        if (Variables.TimerData.timeOutMode == true) {
            // timeout has been initiated
            $scope.startpauseTimer();
        }
        else if (Variables.TimerData.timeOutMode == false && Variables.TimerData.timerState == "run") {
            // application has been turned off while still on, timeout has not been initiated
            Variables.resetTimer();
        }
    };

    
    
    
    
    //
    // -------------------------------------------------------------------------
    
    function fitTimeTravelValue() {
        if (Variables.TimerData.timerStr.timeTravelled.metric == "h:m:s:ms" ||
            Variables.TransModes[Variables.Speed.transModeIndex].text == "Light") {
                $scope.timetravelValueAdj = "timetravel-value-half"
        } else {
            $scope.timetravelValueAdj = "timetravel-value";
        };
    }
    
            
    //
    // -------------------------------------------------------------------------
    var incrementTimer, interval;
    var timeDiff, totalTimeObj;
    incrementTimer = function() {

        // retrieve the latest time difference in miliseconds
        //timeDiff = 21600*1000 http://www.emc2-explained.info/Time-Dilation-at-Low-Speeds/#.VaTXHfmqqko
        timeDiff = getTimeDiff();
        
        // css such that it fits
        fitTimeTravelValue();

        // calculate time dilation & get latest object
        totalTimeObj = Timer.calcTimeDilation(
            Variables.Speed.ms, 
            Variables.TimerData.timer.totalTimeFuture, 
            Variables.TimerData.timer.totalTime + timeDiff, 
            timeDiff);
            
            // css such that it fits
            fitTimeTravelValue();
        
            // update variables
            Variables.updateTimer(
                totalTimeObj.totalTime,
                totalTimeObj.totalTimeFuture,
                totalTimeObj.timeTravelled)
        
        
    };
    
    function getTimeDiff() {
        var tempTimeDiff = 0;
        if (Variables.TimerData.timeOutMode == true 
        &&  Variables.TimerData.timeOutStartDate != null) {
            
            // calculate the time difference
            tempTimeDiff = Timer.calculateTimeDifference(Variables.TimerData.timeOutStartDate);
            
            // end timeout
            Variables.updateTimerData("timeOutMode", false);
            Variables.updateTimerData("timeOutStartDate", null);
            
        } else {
            
            // standard treatment
            tempTimeDiff = Timer.calculateTimeDifference();
        }
        return tempTimeDiff;
    };
    
    
    //
    // -------------------------------------------------------------------------
    
    
    
    
    //
    $scope.resetTimer = function() {
        Variables.resetTimer();
        $interval.cancel(interval);
    };
    
    //
    $scope.startpauseTimer = function() {
        
        // Timer
        Variables.startpauseTimer();
        Variables.saveTimerData(); // save timer state
        
        // Interval
        if (Variables.TimerData.timerState == "run") {
            Timer.initTimeStart();
            interval = $interval(incrementTimer, INTERVAL_CONSTANT);
        } else {
            $interval.cancel(interval);
        }
        console.log("startpauseTimer", Variables.TimerData.timerState)
    };
    
    $scope.viewHistory = function() {
        $state.go("tab.history");  
    };
    
    $scope.openLink = function(link) {
        console.log("opening link", link)
        if(link != undefined && link != ""){
            window.open(link, '_blank', 'location=yes, enableViewPortScale=yes');
        };
    };
    
    
    //
    // -------------------------------------------------------------------------
    
    //
    $ionicModal.fromTemplateUrl('trans-mode-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(transModeModal) {
        $scope.transModeModal = transModeModal;
    });
    $scope.openTransModes = function() {
        $scope.transModeModal.show();
    };
    $scope.closeTransModes = function() {
        fitTimeTravelValue();
        $scope.transModeModal.hide();
    };
    

    //
    $scope.selectTransMode = function(newTransModeIndex) {
        Variables.updateSpeed(newTransModeIndex);
    };
    
    //
    $scope.setCustomSpeed = function() {
        $scope.data = {
            wifi: Variables.Speed.display, 
            updateMessage: "Input cannot exceed the speed of light and will be downscaled"};
        var myPopup = $ionicPopup.show({
            template: '<div style="width: 100%; text-align: center;">{{data.updateMessage}}</div><br><input type="number" ng-model="data.wifi" class="popup-input" style="height: 50px !important; font-size: 20px !important; font-weight: bold important;" min="0">',
            title: 'Set custom speed in ' + $scope.Metric.choice,
            scope: $scope,
            buttons: [
              { text: 'Cancel',
                type: "button-light"
              },
              {
                text: '<b>Save</b>',
                type: 'button-positive cornered',
                onTap: function(e) {
                    if (!$scope.data.wifi) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.data.wifi;
                    }
                }
              }
            ]
          });
        myPopup.then(function(customSpeed) {
            console.log('Tapped!', customSpeed);
            // success
            if(customSpeed != undefined) {
                
                // set custom speed
                Variables.updateSpeed(Variables.TransModes.length-1, customSpeed)
                
                // close modal
                $scope.closeTransModes();
                
                
            };
            
            
            
        });
    }
    
    
    //
    // -------------------------------------------------------------------------
    
    // 
    $scope.saveTime = function() {
        // An elaborate, custom popup
        if (Variables.TimerData.timerState == "run" || Variables.TimerData.timerState == "pause") {

        $scope.data = {};
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.wifi" class="popup-input">',
            title: 'Save your session <br><br> (Notes below are optional)',
            scope: $scope,
            buttons: [
              { text: 'Cancel',
                type: "button-light"
              },
              {
                text: '<b>Save</b>',
                type: 'button-positive cornered',
                onTap: function(e) {
                  if (!$scope.data.wifi) {
                    //don't allow the user to close unless he enters wifi password
                    return "";
                  } else {
                    return $scope.data.wifi;
                  }
                }
              }
            ]
          });
        myPopup.then(function(optionalNotes) {
            console.log('Tapped!', optionalNotes);
            // success
            if(optionalNotes != undefined) {
                
                History.newHistTimer(
                    Variables.TimerData.timer.totalTime, 
                    Variables.TimerData.timer.totalTimeFuture, 
                    Variables.TimerData.timer.timeTravelled, 
                    optionalNotes, 
                    Variables.Speed.transModeIndex);
                    
                if (Variables.TimerData.timerState == "run") {
                    $scope.startpauseTimer();
                } else {
                    $scope.viewHistory();
                }
                
            };
            
        });
        }
    };
    
    
    //
    // -------------------------------------------------------------------------
    
    $ionicModal.fromTemplateUrl('share-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(shareModal) {
        $scope.shareModal = shareModal;
    });
    
    $scope.openShareModal = function() {
        $scope.data = {};
        $scope.data["defaultShareText"] = Utils.generateShareText(
                "element", 
                Variables.TransModes[Variables.Speed.transModeIndex].movementVerb, 
                Variables.TimerData.timerStr.totalTime, 
                Variables.TimerData.timerStr.timeTravelled.value, 
                Variables.TimerData.timerStr.timeTravelled.metric);
        $scope.shareModal.show();
    };
    $scope.closeShareModal = function() {
        $scope.shareModal.hide();
    };
    $scope.shareTimer = function(medium) {
        
        switch (medium) {
            case "facebook":
                //
                Share.inviteFacebook(null, $scope.data["defaultShareText"]);
                break
            case "twitter":
                //
                Share.inviteTwitter(null, $scope.data["defaultShareText"]);
                break
            case "whatsapp":
                //
                Share.inviteWhatsapp(null, $scope.data["defaultShareText"]);
                break
            case "email":
                //
                Share.inviteEmail(null, $scope.data["defaultShareText"]);
                break
            default:
                //
                //
                Share.inviteGeneral(null, $scope.data["defaultShareText"]);
                break
        }
        
    };
    
    
})



