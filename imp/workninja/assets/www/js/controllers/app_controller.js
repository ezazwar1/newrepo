/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';

app.controller('AppController', [
  '$rootScope',
  '$scope',
  '$state',
  '$ionicLoading',
  '$ionicPopup',
  '$timeout',
  '$window',
  'toaster',
  'CONFIG',
  'Session',
  'Auth',
  'Location',
  'Manager',
function($rootScope, $scope, $state, $ionicLoading, $ionicPopup, $timeout, $window, toaster, CONFIG, Session, Auth, Location, Manager) {

  $scope.currentUser = Session.currentUser;
  $scope.picture_url = 'img/placeholder.png';
  $scope.is_admin = false;


  $scope.getManagerDetails = function () {
    Manager.get({managerId: Session.currentUser.id}, function (d) {
        $scope.is_admin = d.customer_admin;
    }, function (response) {
      console.log(response);
    });
  };


  if($scope.currentUser.isCustomer) {
    $scope.getManagerDetails();
  }

  $rootScope.setCurrentUser = function(user) {
    console.log(user);
    $scope.currentUser = user;
  }
 
  $rootScope.setCustomer = function(customer) { 
      try {
        if(customer.picture_thumb_url !== undefined){
          $scope.picture_url = customer.picture_thumb_url;
        } 
        $scope.business_name = customer.workplace.name;
      } catch (e) {
        $scope.picture_url = 'img/placeholder.png';
      }     
  };

  $rootScope.showProgressIndicator = function(message) {
    $ionicLoading.show({
      template: message || '<i class="fa fa-refresh fa-spin"/>',
      noBackdrop: true,
      delay: 0
    });
  };

  $rootScope.hideProgressIndicator = function() {
    $ionicLoading.hide();
  };
  
  $rootScope.$on('hideIndicator', function() {
    $ionicLoading.hide();
  });

  $scope.support = function() {
    $window.location.href = "mailto:support@workninja.com";
  };

  $scope.openCustomerProfile = function() {
    $state.go('app.customer.workplace');
  };

  $scope.$on('event:loadingStarted', function() {
    $ionicLoading.show({
      template: '<i class="fa fa-refresh fa-spin"></i>',
      noBackdrop: true,
      delay: 300
    });
  });

  $scope.$on('event:loadingFinished', function() {
    $ionicLoading.hide();
  });

  $scope.$on('event:session_closed', function(event, data) {
    $scope.showAlert('Sorry', 'This session was closed because you logged in from another phone');
    $scope.$on('event:auth-logoutComplete', function() {
      $rootScope.clearHistory();
      $state.go('splash');
    });
    Auth.logout();
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

  // warn user when app goes offline
  $scope.$on('event:app-offline', function() {
    if (!$scope.offlinePopup) {
      $timeout(function() {
        $scope.offlinePopup = $ionicPopup.alert({
          template: 'You are currently offline, please make sure you have internet connection',
          title: 'Warning',
          okText: 'OK',
          okType: 'button-assertive'
        });
        $scope.offlinePopup.then(function() {
          delete $scope.offlinePopup;
        });
      });
    }
  });

  $scope.$on('event:app-online', function() {
    if ($scope.offlinePopup) {
      $timeout(function() {
        $scope.offlinePopup.close();
        delete $scope.offlinePopup;
      });
    }
  });

  // alert/confirmation popup helpers

  $scope.showAlert = function(title, message, cb) {
    if (!$scope.popup) {
      $scope.popup = $ionicPopup.alert({
        template: message,
        title: title,
        okText: 'OK',
        okType: 'button-assertive'
      });
      $scope.popup.then(function() {
        if (cb) cb();
        delete $scope.popup;
      });
    }
  };

  $scope.showConfirmation = function(title, message, confirmed, rejected) {
    if (!$scope.popup) {
      $scope.popup = $ionicPopup.confirm({
        template: message,
        title: title,
        okText: 'YES',
        okType: 'button-assertive',
        cancelText: 'NO',
        cancelType: 'button-assertive'
      });
      $scope.popup.then(function(result) {
        if (result) {
          (confirmed || function() {})();
        }
        else {
          (rejected || function() {})();
        }
        delete $scope.popup;
      });
    }
  };

   $scope.showTransportMode = function(staff) {
    if (!$scope.popup) {
      $scope.popup = $ionicPopup.confirm({
        template: "How you rollin' today?",
        title: "",
        okText: 'WALKING',
        okType: 'button-assertive',
        cancelText: 'CAR',
        cancelType: 'button-assertive'
      });
      $scope.popup.then(function(result) {
        if (result) {
          staff.isTransportWalking;
          $scope.showToast('walking today, thanks!');
        }
        else {
          //car
          staff.isTransportDriving;
          $scope.showToast('driving today, thanks!');
        }
        delete $scope.popup;
        

      });
    }
  };

  $scope.hidePopup = function() {
    if ($scope.popup) {
      $scope.popup.close();
      delete $scope.popup;
    }
  };

  // toast notifications

  $scope.showToast = function(message) {
    $timeout(function() {
      toaster.pop('info', null, message, 7000);
    }, 1000);
  };

}]);
