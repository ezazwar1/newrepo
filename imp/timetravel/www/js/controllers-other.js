angular.module('starter.controllers-other', [])


.controller('AccountCtrl', function($scope, Variables) {

    //
    //
    $scope.Metric = Variables.Metric;


    
    $scope.changeMetric = function() {
        Variables.changeMetric();
    };
    
    $scope.openLink = function(link) {
        console.log("opening link", link)
        if(link != undefined && link != ""){
            window.open(link, '_blank', 'location=yes, enableViewPortScale=yes');
        };
    };
})




// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
//
// 
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

.controller('HistoryCtrl', function(
    $scope, $state, History, $ionicPopup, Utils, $ionicListDelegate, $ionicModal, Share, Timer, Variables) {
    
    
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    $scope.data = {};
    
    $scope.openLink = function(link) {
        console.log("opening link", link)
        if(link != undefined && link != ""){
            window.open(link, '_blank', 'location=yes, enableViewPortScale=yes');
        };
    };
    
    $ionicModal.fromTemplateUrl('share-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(sharemodal) {
        $scope.sharemodal = sharemodal;
    });
    $scope.openShareModal = function(shareType, index) {
        
        var currentIndex        = $scope.HistTimers.length-index-1;
        var currentHistTimer    = $scope.HistTimers[currentIndex];
        
        console.log(shareType)
        
        switch (shareType) {
            case "element":
                //
                $scope.data["defaultShareText"] = Utils.generateShareText(
                                                "element", 
                                                $scope.TransModes[currentHistTimer.transModeIndex].movementVerb, 
                                                currentHistTimer.totalTime, 
                                                currentHistTimer["totalTimeTravelled"].value, 
                                                currentHistTimer["totalTimeTravelled"].metric_large)
                break
            case "total":
                //
                $scope.data["defaultShareText"] = Utils.generateShareText(
                                                "total", 
                                                null, 
                                                null, 
                                                $scope.histTimerTotal.value, 
                                                $scope.histTimerTotal.metric_large)
                break
        }
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
    
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    
    
    $scope.$on("$ionicView.enter", function (event, data) {
        refreshView();
    });
  
    function refreshView() {
        
        $scope.HistTimers       = History.getHistTimers(); 
        $scope.histTimerTotal   = Utils.normalizeTimeTravelled(History.getTotalHistTimers()); 
        $scope.TransModes       = Variables.TransModes;
        
    };
    
    
    //Utils.normalizeTimeString(totalTimeObj.totalTimeFuture);

    
    $scope.goBack = function() {
        $state.go("dash");
    };
    
    $scope.clearHistTimer = function() {
        // prompt

        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete all saved timers',
         cancelType: "button-light cornered",
         okType: "button-energized cornered"
       });
       confirmPopup.then(function(res) {
         if(res) {
           History.clearHistTimer();
            refreshView();
         } else {
           console.log('You are not sure');
         }
       });
       
    };
    
    $scope.deleteHistTimer = function(TID) {
        
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete saved timer',
         cancelType: "button-light cornered",
         okType: "button-energized cornered"
       });
       confirmPopup.then(function(res) {
         if(res) {
           History.deleteHistTimer(TID);
            refreshView();  
         } else {
           console.log('You are not sure');
         }
       });
   
        
    };
    
    $scope.editNotesTimer = function(index) {
        
        // 
        // reverse index
        var currentIndex = $scope.HistTimers.length-index-1;
        
        // An elaborate, custom popup
        var TID = $scope.HistTimers[currentIndex].TID;
        
        $scope.data = {wifi: $scope.HistTimers[currentIndex].notes};
        
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.wifi" class="popup-input">',
            title: 'Add notes to your session (optional)',
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
                History.editNotesTimer(TID, optionalNotes);
                refreshView();
            };
            
        });
        
    };
    
    
    $scope.closeOptionButtons = function() {
        $ionicListDelegate.closeOptionButtons();
    };
})

