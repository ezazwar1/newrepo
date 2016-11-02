angular.module('starter.controllers-dash', [])

.controller('DashCtrl', function($scope, $rootScope, $interval, $ionicModal, $ionicPopup, Utils, $state, Timer, Share, History) {
    
    
    // -------------------------------------------------------------------------
    //
    // Init
    //
    // -------------------------------------------------------------------------
    
    //
    // init global variables
    var interval, incrementTimer, actions, geoCSS, metrics;
    actions         = {start: "Start", stop: "Pause"};
    metrics         = {us: "MPH", eu: "KMH"};
    
    geoCSS          = {active: "button-balanced", inactive: "button-clear"};//** not used?
    $scope.geoCSS       = geoCSS.inactive;//** not used?
    $scope.customCSS    = geoCSS.active; //** not used?
    
    $scope.action       = actions.start;
    $scope.metric       = Utils.getMetric();
    
    
    var INTERVAL_CONSTANT = 100;    // m/s
    
    // display
    $scope.timer            = "00:00:00:00";
    $scope.timerFuture      = "00:00:00:00";
    $scope.timeTravelled    = {value: "", metric: ""};
    
    // customspeeds
    $scope.inputParams = {};
    $scope.CustomSpeeds = Timer.getCustomSpeeds(); 
    
    
    
    
    // -------------------------------------------------------------------------
    //
    // Timeout Init
    //
    // -------------------------------------------------------------------------
    
        
    $scope.$on("$ionicView.enter", function (event, data) {
        
        //
        // retrieve the saved speed values
        $scope.timeOutObj = Utils.getTimeOutObj();
        setCustomSpeed($scope.timeOutObj["customSpeedIndex"], true);    console.log($scope.timeOutObj);
        
        //
        // init timer
        $scope.timer            = Utils.normalizeTimeString($scope.timeOutObj["totalTimeObj"].totalTime);
        $scope.timerFuture      = Utils.normalizeTimeString($scope.timeOutObj["totalTimeObj"].totalTimeFuture);
        $scope.timeTravelled    = Utils.normalizeTimeTravelled($scope.timeOutObj["totalTimeObj"].timeTravelled);

        // is the timer still running? if so, toggle timer
        if($scope.timeOutObj["timerState"] == "run") {
            $scope.toggleTimer();
        };

    });
    
    
    //
    // when timing out
    $rootScope.$on("rootScope:timeOutEvent", function (event, data) {   console.log("rootscope timeoutevent")
        
        // record timeout event
        if($scope.timeOutObj["timerState"] != "stop") {
            $scope.timeOutObj = Utils.startTimeOut();
        };
        
        // pause the timer
        if($scope.timeOutObj["timerState"] == "run") {
            $scope.toggleTimer();
        };
        
    })
    

    
    
    
    // -------------------------------------------------------------------------
    //
    // Modal init
    //
    // -------------------------------------------------------------------------
    
    $scope.data = {};
    
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $ionicModal.fromTemplateUrl('share-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(sharemodal) {
        $scope.sharemodal = sharemodal;
    });
    
    
    //
    //
    $scope.openModal = function() {
        
        // update formatting
        $scope.geoCSS       = geoCSS.inactive;
        $scope.customCSS    = geoCSS.active;
        $scope.metric       = Utils.getMetric(); console.log("metric", $scope.metric)
        
        // reset speed
        //Geo.resetSpeed();
        updateUserSpeed();
        
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    
    //
    //
    
    $scope.openShareModal = function() {
        $scope.data["defaultShareText"] = Utils.generateShareText(
                                                "element", 
                                                $scope.CustomSpeeds[$scope.customSpeedIndex].movementVerb, 
                                                $scope.timer, 
                                                $scope.timeTravelled.value, 
                                                $scope.timeTravelled.metric)
        $scope.sharemodal.show();
    };
    $scope.closeShareModal = function() {
        $scope.sharemodal.hide();
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
    
    
    
    
    
    
    //
    // ** not used in settings
    $scope.changeMetric = function() {
        Utils.changeMetric();
        $scope.metric = Utils.getMetric();
        updateUserSpeed();
    };
    
    
    
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    //
    // TIMER WRAPPER
    //
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    
    
    
    var geoIter = 0, geoIterConstant = 5;
    
    // test only as it is in app.js
    $scope.testTimeOut = function() {
        $rootScope.$broadcast('rootScope:timeOutEvent', {});
    };
    
    var timeDiff = 0; 
    incrementTimer = function() {

        //
        // get timeout referentials
        
        if($scope.timeOutObj["timeOutMode"]) { console.log("incrementTimer: timeOutMode true")
        
            // calculate timedifference
            timeDiff                = Timer.calculateTimeDifference($scope.timeOutObj["timeOutStartDate"]);
            
            // record end & update
            $scope.timeOutObj = Utils.endTimeOut();
            
        } else {
            timeDiff                = Timer.calculateTimeDifference();
        };
        
        
        //
        // referential observatory with constant gravity
        //console.log(totalTimeObj)
        $scope.timeOutObj["totalTimeObj"].totalTime               = $scope.timeOutObj["totalTimeObj"].totalTime + timeDiff;//timeDiff;     
        
        
        // 
        // updates speed after x iters
        if(geoIter >= geoIterConstant) {
            updateUserSpeed();
            geoIter = 0;
        } else {
            geoIter = geoIter +1
        }
        
        //
        // get new totalTimeobj
        $scope.timeOutObj["totalTimeObj"]            = Timer.calcTimeDilation($scope.userSpeed/3.6, $scope.timeOutObj["totalTimeObj"].totalTimeFuture, $scope.timeOutObj["totalTimeObj"].totalTime, timeDiff);

        //
        // format totalTimeObj
        $scope.timer            = Utils.normalizeTimeString($scope.timeOutObj["totalTimeObj"].totalTime);
        $scope.timerFuture      = Utils.normalizeTimeString($scope.timeOutObj["totalTimeObj"].totalTimeFuture);
        $scope.timeTravelled    = Utils.normalizeTimeTravelled($scope.timeOutObj["totalTimeObj"].timeTravelled);
        
        //
        // save latest totalTimeObj
        Utils.setTempTimeOutField("totalTimeObj", $scope.timeOutObj["totalTimeObj"]);
        
    };
    
    // -------------------------------------------------------------------------
    //
    // GPS
    //
    // -------------------------------------------------------------------------
    
    //
    // updates displayspeed
    function updateUserSpeed() {
        if($scope.metric == metrics.us) {
            $scope.displaySpeed = $scope.inputParams.mph;
        } else {
            $scope.displaySpeed = $scope.inputParams.kmh;
        }
        $scope.userSpeed = $scope.inputParams.kmh;
    };
    
    //
    //
    $scope.setCustomSpeed = function(index) {
        
        // pre-defined speed mode
        $scope.customSpeedMode = false;
        
        // update
        setCustomSpeed(index);
    };
    
    //
    //
    var xTempOld = {}, xTempNew = {};   $scope.customSpeedMode = false;
    function setCustomSpeed(index, initBoolean){
        
        console.log("setCustomSpeed", $scope.timeOutObj["customSpeedValue"])
        
        // change css of new
        xTempNew                       = $scope.CustomSpeeds[index];
        xTempNew.buttonCSS             = "customspeed-active";
        
        // optional: set custom speed
        if(index == $scope.CustomSpeeds.length-1) {
            $scope.customSpeedMode = true;
            
            // set temp speed
            if($scope.metric == metrics.us) {
                xTempNew.speed = Math.ceil($scope.timeOutObj["customSpeedValue"]/MPH_IN_KMH);
            } else {
                xTempNew.speed = $scope.timeOutObj["customSpeedValue"];
            }
        };
        
        // update CustomSpeeds
        $scope.CustomSpeeds[index]     = xTempNew;
        
        // change css of old
        if(initBoolean != true) {
            xTempOld                       = $scope.CustomSpeeds[$scope.customSpeedIndex];
            xTempOld.buttonCSS             = "customspeed";
            $scope.CustomSpeeds[$scope.customSpeedIndex]     = xTempOld;
        };
        
        
        // set index
        $scope.customSpeedIndex = index;
        
        // update formatting and inputs
        $scope.inputParams["speedRange"]        = $scope.CustomSpeeds[index].speed;
        $scope.inputParams                      = Utils.updateInputParams($scope.inputParams);
        
        
        // save in timeoutobj
        Utils.setTimeOutField("customSpeedIndex", $scope.customSpeedIndex)
        Utils.setTimeOutField("customSpeedValue", $scope.CustomSpeeds[index].speed)
        
        // update userspeed display
        updateUserSpeed(); //console.log("here", $scope.inputParams)

    };
    
    
    //
    // insert custom speed
    $scope.insertCustomSpeed = function() {

        // An elaborate, custom popup

        $scope.data = {wifi: $scope.displaySpeed};
        var myPopup = $ionicPopup.show({
            template: '<input type="number" ng-model="data.wifi" class="popup-input" style="height: 50px !important; font-size: 20px !important; font-weight: bold important;" min="0">',
            title: 'Set custom speed in ' + $scope.metric,
            scope: $scope,
            buttons: [
              { text: 'Cancel',
                type: "button-stable cornered"
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
                
                // update mode (handles button)
                $scope.customSpeedMode = true;
                
                // set custom speed
                $scope.timeOutObj["customSpeedValue"] = customSpeed;
                setCustomSpeed($scope.CustomSpeeds.length-1, null);
                
                // close modal
                $scope.closeModal();
                
            };
            
        });
 
    };
    
  
    
    
    //
    // GPS ** not used
    $scope.geoLatest = {};
    $scope.startGPS = function() {
        if($scope.geoCSS == geoCSS.active) {
            
            $scope.geoCSS       = geoCSS.inactive;
            $scope.customCSS    = geoCSS.active;
            
            // reset speed
            //Geo.resetSpeed();
        } else {
            $scope.geoCSS       = geoCSS.active;
            $scope.customCSS    = geoCSS.inactive;
        };
        
        // get latest speed
        updateUserSpeed()
    };
    
    

    // -------------------------------------------------------------------------
    //
    // Formatting
    //
    // -------------------------------------------------------------------------
    
    $scope.updateInputParams = function() {
        $scope.inputParams      = Utils.updateInputParams($scope.inputParams);
        if($scope.geoCSS == geoCSS.inactive) { $scope.userSpeed = $scope.inputParams.kmh}; // update geospeed
    };
    
    
    // -------------------------------------------------------------------------
    //
    // Timer handling
    //
    // -------------------------------------------------------------------------
    
    
    // button toggle
    $scope.toggleTimer = function() {
        if ($scope.action === actions.start) {
            
            // ACTION: start
            Timer.initTimeStart();
            $scope.action = actions.stop;
            interval = $interval(incrementTimer, INTERVAL_CONSTANT);
            
            // record event
            $scope.timeOutObj = Utils.setTimeOutField("timerState", "run");
            
        } else if ($scope.action === actions.stop) {

            // ACTION: pause
            Timer.initTimeStart();
            $scope.action = actions.start;
            $interval.cancel(interval);
            
            // record event
            $scope.timeOutObj = Utils.setTimeOutField("timerState", "pause");
            
        };
        console.log($scope.timeOutObj)
    };
    
  
    //
    // ACTION: stop
    $scope.resetTimer = function () {
        
        // interval handling
        $interval.cancel(interval);
        $scope.action = actions.start; //** not used?
        
        // timer display
        $scope.timer            = "00:00:00:00";
        $scope.timerFuture      = "00:00:00:00";
        $scope.timeTravelled    = {value: "", metric: ""};
        
        // record event
        $scope.timeOutObj = Utils.setTimeOutField("timerState", "stop");
    
    };
    
    

    
    //
    //
    $scope.viewHistory = function() {
        $state.go("tab.history");
    };
    
    //
    //
    $scope.viewInformation = function() {
        $state.go("information");
    };
    
    //
    //
    $scope.openLink = function(link) {
        console.log("opening link", link)
        if(link != undefined && link != ""){
            window.open(link, '_blank', 'location=yes, enableViewPortScale=yes');
        };
    };
    
    //
    //
    $scope.saveTime = function() {

        // An elaborate, custom popup
        if ($scope.timerState == "run" || $scope.timerState == "pause") {

        $scope.data = {};
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.wifi" class="popup-input">',
            title: 'Save your session <br><br> (Notes below are optional)',
            scope: $scope,
            buttons: [
              { text: 'Cancel',
                type: "button-stable cornered"
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
                History.newHistTimer($scope.timeOutObj["totalTimeObj"].totalTime, $scope.timeOutObj["totalTimeObj"].totalTimeFuture, $scope.timeOutObj["totalTimeObj"].timeTravelled, optionalNotes, $scope.customSpeedIndex);
                $scope.resetTimer();
                $scope.viewHistory();
            };
            
        });
        }
 
    };
    
    
    
    
    
    
    
    
  

})



