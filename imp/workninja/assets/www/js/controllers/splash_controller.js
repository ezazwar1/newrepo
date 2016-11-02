'use strict';

app.controller('SplashController', [
  '$rootScope',
  '$http',
  '$scope',
  '$state',
  '$ionicModal',
  '$ionicPopup',
  '$timeout',
  '$q',
  'Session',
  'CONFIG',
  'Event',
  function($rootScope, $http, $scope, $state, $ionicModal, $ionicPopup, $timeout, $q, Session, CONFIG, Event) {
    

    // first modal
    $ionicModal.fromTemplateUrl('templates/first.html', {
      animation: 'slide-in-up',
      focusFirstInput: false,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $rootScope.firstModal = modal;
      $timeout(function() {
        if (Session.isAuthenticated) {
          goHome();
        }
        else {
          $rootScope.$broadcast('event:auth-loginRequired');
          //$rootScope.signupModal.show();
        }
      }, 1500);
    });

    // login modal
    $ionicModal.fromTemplateUrl('templates/login.html', {
      animation: 'slide-in-up',
      focusFirstInput: false,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $rootScope.loginModal = modal;
    });

    // signup modal
    $ionicModal.fromTemplateUrl('templates/signup.html', {
      animation: 'slide-in-up',
      focusFirstInput: false,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $rootScope.signupModal = modal;
    });
    

    function goHome() {
      var currentUser = Session.currentUser;
      if (currentUser.isCustomer ) {
        //currentUser.onboarded = false;
        console.log(currentUser.onboarded);
        if (currentUser.onboarded == false) {
          try {
            $timeout(function (){
              $http.post(CONFIG.url + '/onboarding')
            .success(function(data, status, headers, config) {
              console.log('onboarding flag true');
              currentUser.onboarded = true;
              Session.currentUser = currentUser;  // save currentUser
            })
            .error(function(data, status, headers, config) {
              console.log('onboarding flag set error: ' + data + '; status: ' + status);
            });
            }, 3000);
            
          } catch (e) {
            //pass
            console.log('tried to onboard but failed');
          }
          
          $rootScope.clearHistory();
          $state.go('app.customer.onboard1');
        }
        else {
          if (ionic.Platform.isIOS()) {
            console.log("register notify and location manager!!!");
            Event.registerNotify();
            Event.locationManagerRegister();
            $timeout(function() {
              Event.subscribe();
            }, 4000);
          }
          else {
            Event.subscribe();
          }
          $rootScope.clearHistory();
          $state.go('app.customer.main');
        }
      }
      else if (currentUser.isStaff) {
        //currentUser.onboarded = false;
        if (currentUser.onboarded == false) {
          try {
            $http.post(CONFIG.url + '/onboarding')
            .success(function(data, status, headers, config) {
              console.log('onboarding flag true');
              currentUser.onboarded = true;
              Session.currentUser = currentUser;
            })
            .error(function(data, status, headers, config) {
              console.log('onboarding flag set error: ' + data + '; status: ' + status);
            });
          } catch (e) {
            //pass
            console.log(e);
          }
          
          $rootScope.clearHistory();
          $state.go('app.staff.onboard1');
        }
        else {
          if (ionic.Platform.isIOS()) {

            console.log("register notify and location manager!!!");

            Event.registerNotify();
            Event.locationManagerRegister();
            Event.subscribe();
            // $timeout(function() {
            //   Event.subscribe();
            // }, 4000);
          }
          else {
            Event.subscribe();
          }
          $rootScope.clearHistory();
          $state.go('app.staff.main');

        }
      }
      else if (currentUser.isAdmin) {
          // if (ionic.Platform.isIOS()) {
          //   console.log("register notify and location manager!!!");
          //   Event.registerNotify();
          //   Event.locationManagerRegister();
          //   $timeout(function() {
          //     Event.subscribe();
          //   }, 4000);
          // }
          // else {
          //   Event.subscribe();
          // }
          // $rootScope.clearHistory();
          // $state.go('app.customer.main');


          if (currentUser.onboarded === false) {
          try {
            $timeout(function (){
              $http.post(CONFIG.url + '/onboarding')
            .success(function(data, status, headers, config) {
              console.log('onboarding flag true');
              currentUser.onboarded = true;
              Session.currentUser = currentUser;  // save currentUser
            })
            .error(function(data, status, headers, config) {
              console.log('onboarding flag set error: ' + data + '; status: ' + status);
            });
            }, 3000);
            
          } catch (e) {
            //pass
            console.log('tried to onboard but failed');
          }
          
          $rootScope.clearHistory();
          $state.go('app.customer.onboard1');
        }
        else {
          if (ionic.Platform.isIOS()) {
            console.log("register notify and location manager!!!");
            Event.registerNotify();
            Event.locationManagerRegister();
            $timeout(function() {
              Event.subscribe();
            }, 4000);
          }
          else {
            Event.subscribe();
          }
          $rootScope.clearHistory();
          $state.go('app.customer.main');
        }




        
      } else {
        $state.go('splash');
      }
    }

    $scope.$on('event:auth-loginConfirmed', function() {
      goHome();
    });

    // responseErrorPopup to handle error broadcasts from ErrorInterceptor
    $scope.handleResponseError = function(title, message) {
      if ($scope.responseErrorPopup === undefined) {
        $scope.responseErrorPopup = $ionicPopup.alert({
          template: message,
          title: title,
          okText: 'OK',
          okType: 'button-assertive'
        }).then(function() {
          delete $scope.responseErrorPopup;
        });
      }
    };

    // warn user of connection errors
    $scope.$on('error:connection', function(event, errorInfo) {
      $scope.handleResponseError(null, errorInfo.message);
    });

  }]);
