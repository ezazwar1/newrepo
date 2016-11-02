'use strict';

app.controller('StaffProfileController', [
  '$scope',
  '$rootScope',
  '$state',
  '$window',
  '$timeout',
  'Auth',
  'Tracker',
  'Session',
  'Location',
  'staff',
function($scope, $rootScope, $state, $window, $timeout, Auth, Tracker, Session, Location, staff) {

  
  console.log(staff);
  $scope.staff = staff;
  if ($scope.staff._original === undefined) {
    $scope.staff._original = angular.copy($scope.staff);
  }
  $scope.inSetup = !$scope.staff.isSetupComplete();
  // $scope.inSetup = true;
  $scope.session = Session;
  
  $scope.profileActive = true;
  $scope.settingsActive = false;
  
  $scope.selectProfile = function() {
    $scope.profileActive = true;
    $scope.settingsActive = false;
  };
  
  $scope.selectSettings = function() {
    $scope.profileActive = false;
    $scope.settingsActive = true;
  };

  $scope.title = function() {
    if ($scope.inSetup)
      return "Welcome";
    else
      return "Profile";
  };

  $scope.updateTitle = function() {
    if ($scope.inSetup)
      return "Next";
    else
      return "Update";
  };

  $scope.canUpdate = function() {
    if ($scope.staff.profile.about === null) {
      return false;
    } else {
      return true;
    }
    
  };

  $scope.goMain = function() {
    if ($scope.staff._original !== undefined) {
      angular.copy($scope.staff._original, $scope.staff);
      delete $scope.staff._original;
    }
    $rootScope.clearHistory();
    $state.go('app.staff.main');
  };

  $scope.update = function() {
    $scope.staff.use_availability_zones = true;

    if($scope.staff.role_ids === undefined) {
        $scope.staff.role_ids = [0];
    };
    $scope.staff.$update().then(function() {
      delete $scope.staff._original;
      $rootScope.clearHistory();
      $state.go('app.staff.main');
      if (!$scope.inSetup) {
        //toast update complete
        $scope.showToast("Your profile is updated")
      }
    });
  };


  $scope.getProfilePic = function() {
    try {
      if($scope.staff.picture_original_url === undefined) {
        return 'img/ninja-160x160.png';
      } else {
        return $scope.staff.picture_original_url;
      }
    } catch (e) {
      return 'img/ninja-160x160.png';
    }
    
    
  };

  $scope.editProfilePicture = function() {
    function onSuccess(imageData) {
      $scope.$apply(function() {
        $scope.staff.picture_url = 'data:image/jpeg;base64,' + imageData;
        // template uses picture_thumb_url, fake it for display
        $scope.staff.picture_original_url = $scope.staff.picture_url;
      });
    }

    function onFail(message) {
      $scope.showAlert('Camera', message);
    }

    navigator.camera.getPicture(onSuccess, onFail, {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 600,
      targetHeigth: 200,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      cameraDirection: Camera.Direction.BACK
    });
  };

  $scope.toggleSmsNotifications = function() {
    $scope.staff.sms_notifications = !$scope.staff.sms_notifications;
    console.log($scope.staff.sms_notifications);
  };

  $scope.toggleBatterySavingMode = function() {
    Session.batterySavingMode = !Session.batterySavingMode;
    console.log(Session.batterySavingMode);
    Location.stopReporting();
    Location.startReporting();
  };

  $scope.logout = function() {
    $scope.showConfirmation(
      null,
      'Are you sure you want to sign out?',
      function() {
        $scope.$on('event:auth-logoutComplete', function() {
          $scope.hideProgressIndicator();
          $rootScope.clearHistory();
          $state.go('splash');
        });
        Tracker.trackLogout(function() {
          $scope.showProgressIndicator();
          Auth.logout();
        });
      });
  };

  $scope.taFocus = function() {
    $window.scrollTo(0,0);
  };

  $scope.taBlur = function() {
    $window.scrollTo(0,0);
  };

}]);
