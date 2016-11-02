
'use strict';

app.controller('CustomerWorkplaceController', [
  '$scope',
  '$rootScope',
  '$state',
  '$timeout',
  '$window',
  'Auth',
  'Tracker',
  'Customer',
  'customer',
  'toaster',
  'Session',
  'Manager',
function($scope, $rootScope, $state, $timeout, $window, Auth, Tracker, Customer, customer, toaster, Session, Manager) {
  $scope.workplaceIdList = [];

  $scope.customer = customer;
  if ($scope.customer._original === undefined) {
    $scope.customer._original = angular.copy($scope.customer);
  }

  $scope.currentUser = Session.currentUser;
  console.log($scope.currentUser);

  $scope.workplaceIdList = $scope.currentUser.workplace_ids;

  Customer.getWorkplaces({customerId: customer.id},function(data) {
    $scope.workplaceList = data;
  });

  $scope.getManagerDetails = function() {
     console.log('Trying to get manager');
      Manager.get({
          managerId: Session.currentUser.id
      }, function(d) {
          $scope.is_admin = d.customer_admin;
      }, function (err) {
        console.log(err);
      });
  };

  $scope.getManagerDetails();
  $scope.workplacesActive = true;
  $scope.profileActive = false;

  $scope.setActiveWorkplace = function(n) {
    customer.active_workplace = n;
    $rootScope.clearHistory();
    $state.go('app.customer.main');
  };

  $scope.selectWorkplaces = function() {
    $scope.workplacesActive = true;
    $scope.profileActive = false;
  };

  $scope.selectProfile = function() {
    $scope.workplacesActive = false;
    $scope.profileActive = true;
  };

  $scope.title = function() {
    if ($scope.inSetup)
      return "Welcome";
    else
      return "Profile";
  };

  $scope.updateTitle = function() {
      return "Update";
  };

  $scope.canUpdate = function() {
    return $scope.customer.isSetupComplete();
  };

  $scope.goMain = function() {
    if ($scope.customer._original !== undefined) {
      angular.copy($scope.customer._original, $scope.customer);
      delete $scope.customer._original;
    }
    $rootScope.clearHistory();
    $state.go('app.customer.main');
  };


  $scope.editLogoPicture = function() {
        function onSuccess(imageData) {
            $scope.$apply(function() {
                $scope.customer.picture_url = 'data:image/jpeg;base64,' + imageData;
                // template uses picture_thumb_url, fake it for display
                $scope.customer.picture_thumb_url = $scope.customer.picture_url;
            });
        }

        function onFail(message) {
            $scope.showAlert('Camera', message);
        }

        navigator.camera.getPicture(onSuccess, onFail, {
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 600,
            targetHeigth: 600,
            correctOrientation: true,
            saveToPhotoAlbum: false,
            cameraDirection: Camera.Direction.BACK
        });
    };

    $scope.getProfilePic = function() {
      try {
        if($scope.customer.workplace.picture_url === undefined) {
          return 'img/ninja-160x160.png';
        } else {
          return $scope.customer.workplace.picture_url;
        }
      } catch (e) {
        return 'img/ninja-160x160.png';
      }
    };

    $scope.editWorkplacePicture = function() {
        function onSuccess(imageData) {
            $scope.$apply(function() {
                $scope.customer.workplace.picture_url = 'data:image/jpeg;base64,' + imageData;
                // template uses picture_thumb_url, fake it for display
                $scope.customer.workplace.picture_thumb_url = $scope.customer.workplace.picture_url;
            });
        }

        function onFail(message) {
            $scope.showAlert('Camera', message);
        }

        navigator.camera.getPicture(onSuccess, onFail, {
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 600,
            targetHeigth: 600,
            correctOrientation: true,
            saveToPhotoAlbum: false,
            cameraDirection: Camera.Direction.BACK
        });
    };


  $scope.isSetupComplete = function() {
      try {
          return !_.isBlank($scope.currentUser.first_name);
      } catch (e) {
           return true;
      }

    }

  $scope.logout = function() {
    $scope.showConfirmation(
      null,
      'Would you like to sign out?',
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

  // toast notifications

  $scope.showToast = function(message) {
    $timeout(function() {
      toaster.pop('info', null, message, 7000);
    }, 1000);
  };

  $scope.update = function() {

    $scope.currentUser.name = $scope.currentUser.first_name + ' ' + $scope.currentUser.last_name;
    $scope.currentUser.workplace_ids = $scope.workplaceIdList;
    Manager.update({managerId: $scope.currentUser.id}, $scope.currentUser, function (data) {
        $scope.currentUser.first_name = data.first_name;
        $scope.currentUser.last_name = data.last_name;
        $scope.currentUser.mobile = data.mobile;
        $scope.currentUser.single_access_token = Session.currentUser.single_access_token;
        Session.currentUser = $scope.currentUser;
        $scope.showToast('Update Successful!');

    });
  };

  $scope.taFocus = function() {
    $window.scrollTo(0,0);
  };

  $scope.taBlur = function() {
    $window.scrollTo(0,0);
  };

  $scope.inSetup = !$scope.isSetupComplete();

}]);
