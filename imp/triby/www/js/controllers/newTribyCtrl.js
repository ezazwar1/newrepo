'use strict';
MyApp.controller('NewTribyCtrl', [
  '$scope',
  '$ionicModal',
  '$timeout',
  '$ionicPopup',
  '$location',
  '$ionicLoading',
  '$ionicPlatform',
  'SettingsService',
  'FeedService',
  '$rootScope',
  '$window',
  '$state',
  function($scope, $ionicModal, $timeout, $ionicPopup, $location, $ionicLoading, $ionicPlatform, SettingsService, FeedService, $rootScope, $window, $state) {

  $scope.triby = {
    pic : 'img/add_photo.png',
    name : '',
    members : []
  }

  $scope.uploadPicture = function(){
    $ionicLoading.show({
      template: 'Uploading...'
    });
    SettingsService.uploadCropImage('TRIBY', null, 'triby', true).then(function(response){

      $ionicLoading.hide();
      if(response.status == "success"){
        $scope.triby.pic = response.url_file;
      }
      else {
        window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
          console.log('toast success: ' + a)
        }, function (b) {
          alert('toast error: ' + b)
        });
      }
    }, function(err) {
        $ionicLoading.hide();
    });
  };

  $scope.nextStep = function(){
    $ionicLoading.show({
      template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
    });

    FeedService.setNewTriby($scope.triby);
    $timeout(function () {
      $state.go("app.add_people");
    }, 100);
  }
}]);
