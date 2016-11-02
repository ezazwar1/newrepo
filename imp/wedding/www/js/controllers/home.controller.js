angular.module('home.controller', ['ngCordova','ui.router'])
.controller('HomeCtrl', function($scope,$cordovaSocialSharing,$ionicPlatform,$cordovaAppRate,$cordovaGoogleAnalytics) {
  //$scope.daysLeft = 126;





  $ionicPlatform.ready(function() {
    if (window.StatusBar) {
      $cordovaGoogleAnalytics.trackView('Home Screen');
    }

    // called when ready
    $scope.getData();

    if(window.plugin) {
      if (!window.localStorage['uses']) {
        window.localStorage['uses'] = 1;
      } else {
        window.localStorage['uses']++;
      }
      if (window.localStorage['uses'] == 7 || window.localStorage['uses'] == 15 || window.localStorage['uses'] == 30) {
        console.log('app rating');
        // AppRate.preferences.storeAppURL.ios = '770088894';
        // AppRate.preferences.storeAppURL.android = 'market://details?id=com.wedivite.app';
        // AppRate.preferences.openStoreInApp = true;
        // AppRate.promptForRating(true);
        setTimeout(function() {
          $scope.rateus.show();
        }, 5000);
        $cordovaGoogleAnalytics.trackEvent('Rating', 'Rate Popup');
        
      }
    }


    // if (window.plugin) {
    //       console.log('LOADING NOTIFICATIONS');
    //       window.plugin.notification.local.promptForPermission();
    //       window.plugin.notification.local.hasPermission(function (granted) {
    //            if (granted == false) {
    //               console.log('NO PERMISSIONS');
    //            } else {
    //               console.log('WE HAVE LOCAL NOTIFICATION PERMISSIONS');

    //               //check if we sent welcome msg already
    //               if (!window.localStorage['sentWelcomeMsg']) {


    //                   //Send welcome message 2 days after first login
    //                   var now                  = new Date().getTime(),
    //                   _60_seconds_from_now = new Date(now + 48*60*60*1000);  
    //                   _month_from_now = new Date(now + 720*60*60*1000);  
                      
    //                   window.plugin.notification.local.add({
    //                       id:      1,
    //                       title:   'How have you been?',
    //                       message: 'Did you finish customizing your invitation already?',
    //                       date:    _60_seconds_from_now
    //                   });
    //                   window.plugin.notification.local.add({
    //                       id:      2,
    //                       title:   'What about the guests?',
    //                       message: 'You should start thinking about inviting your guests!',
    //                       date:    _month_from_now
    //                   });


    //                   //Send reminder to invite guests one month after install


    //                   window.localStorage['sentWelcomeMsg'] = true;
    //               } 



    //            }
    //       });
    // }



  });


// $scope.doRefresh = function() {
//     $http.get('/new-items')
//      .success(function(newItems) {
//        $scope.items = newItems;
//      })
//      .finally(function() {
//        // Stop the ion-refresher from spinning
//        $scope.$broadcast('scroll.refreshComplete');
//      });
//   };

  // $scope.doRefresher = function() {
  //   console.log('refreshed');
    
  //   setTimeout(function() {
  //     $scope.$broadcast('scroll.refreshComplete');
  //      $scope.guestCount = 34;
  //   }, 3000);
  // };

});