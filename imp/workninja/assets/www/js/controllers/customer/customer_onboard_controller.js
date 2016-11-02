'use strict';
app.controller('CustomerOnboardController', [
  '$rootScope',
  '$scope',
  '$state',
  '$window',
  '$timeout',
  '$ionicPopup',
  '$http',
  'Auth',
  'Tracker',
  'Session',
  'Event',
  'CONFIG',
  'customer',
  'Manager',

  function($scope, $rootScope, $state, $window, $timeout, $ionicPopup, $http, Auth, Tracker, Session, Event, CONFIG, customer, Manager) {

    $scope.customer = customer;
    $scope.user = Session.currentUser;

    if ($scope.customer._original === undefined) {
          $scope.customer._original = angular.copy($scope.customer);
    }
    $scope.inSetup = !$scope.customer.isSetupComplete();


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

    $scope.updateProfile = function() {

          $scope.customer.$update().then(function() {
              delete $scope.customer._original;
              $rootScope.clearHistory();
              if($scope.customer.picture_thumb_url === null) {
                  $scope.showMessage('Profile', "Please upload your profile pic");
                  $scope.goOnboard(4);
              }

              else {
                  $scope.goOnboard(4);
              }
          });
    };

    // $scope.updateNameMobile = function() {
    //     console.log($scope.user);
    //     var url = CONFIG.url + '/users/' + $scope.user.id;
    //
    //     $http.put(url, $scope.user).success(function () {
    //        console.log('success');
    //         $scope.goOnboard(3);
    //     });
    // };

    $scope.updateNameMobile = function() {
      $scope.user.name = $scope.user.first_name + ' ' + $scope.user.last_name;
      console.log($scope.user);
      //$scope.user.workplace_ids = $scope.workplaceIdList;
      Manager.update({managerId: $scope.user.id}, $scope.user, function (data) {
          $scope.user.first_name = data.first_name;
          $scope.user.last_name = data.last_name;
          $scope.user.mobile = data.mobile;
          $scope.user.single_access_token = Session.currentUser.single_access_token;
          Session.currentUser = $scope.user;
          $scope.goOnboard(3);
      });
    };

    $scope.showMessage = function(title, message, cb) {
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
    };

    $scope.goOnboard = function(board_num) {
        $rootScope.clearHistory();

        //android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1])

        if(ionic.Platform.isAndroid() ) {


            if(board_num==3) {
                //Event.registerNotify();
                //Event.locationManagerRegister();
                Event.subscribe();
                board_num=5;
            }
        }
        else {
            //push notification allow
            if (board_num==4 ) {
                Event.registerNotify();
            }
            else if (board_num==5 ) {
                Event.locationManagerRegister();
            }
            else if(board_num==6) {
                Event.subscribe();
            }
        }
        $state.go('app.customer.onboard'+board_num);
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

      $scope.onboard_slides = [
          {image: 'img/onboard-ctm-05-01.png', description: 'When you need staff simply \ntap \'request ninja\' and \nchoose your type of ninja'},
          {image: 'img/onboard-ctm-05-02.png', description: 'Then you just need to hold tight whilst we locate the nearest available ninja'},
          {image: 'img/onboard-ctm-05-03.png', description: 'You\'ll be notified when \nyour ninja is en route and \nyou can track their arrival'},
          {image: 'img/onboard-ctm-05-04.png', description: 'Once your ninja arrives \nthey will clock on \nand get to work!'},
          {image: 'img/onboard-ctm-05-05.png', description: 'After the shift ends, you will \nbe sent an itemised bill and \nasked to provide feedback'}
      ];
      $scope.onboard_direction = 'left';
      $scope.onboard_currentIndex = 0;

      $scope.setCurrentSlideIndex = function (index) {
          $scope.onboard_direction = (index > $scope.onboard_currentIndex) ? 'left' : 'right';
          $scope.onboard_currentIndex = index;
      };

      $scope.isCurrentSlideIndex = function (index) {
          if($scope.onboard_currentIndex> $scope.onboard_slides.length - 1) {
                                             //alert($scope.onboard_currentIndex);
              event.preventDefault();
              $scope.goOnboard(6);
              return;
          }
          return $scope.onboard_currentIndex === index;
      };

      $scope.onboard_prevSlide = function () {
        $scope.onboard_direction = 'left';
        $scope.onboard_currentIndex = ++$scope.onboard_currentIndex;
      };

      $scope.onboard_nextSlide = function () {
        $scope.onboard_direction = 'right';
        $scope.onboard_currentIndex = ($scope.onboard_currentIndex > 0) ? --$scope.onboard_currentIndex : $scope.onboard_slides.length - 1;
      };

}]);
