'use strict';
MyApp.controller('InfoEditCtrl', function($scope, $state, $ionicHistory, $ionicLoading, FeedService, $rootScope, $stateParams, SettingsService, $timeout) {

  $scope.triby = {};
  FeedService.getTribyInfo($stateParams.triby_id).then(function(response){
    $scope.triby = response.data.tribe;

  }, function(err) {
    window.plugins.toast.showShortCenter("Can't get this group", function (a) {
    }, function (b) {
      alert("Can't get this group");
    });

    $state.go('app.main.home');
  });

  $scope.showDone = "";
  var initializing = true
  $scope.$watch("triby.name", function(newValue, oldValue) {
    if(initializing){
      $timeout(function() { initializing = false; },500);
    }
    else{
      if (newValue != oldValue) {
        $scope.showDone = "Done";
      }
    }
  });
  $scope.$watch("triby.pic", function(newValue, oldValue) {
    if(initializing){
      $timeout(function() { initializing = false; },500);
    }
    else{
      if (newValue != oldValue) {
        $scope.showDone = "Done";
      }
    }
  });

  $scope.uploadPicture = function(){
    $ionicLoading.show({
      template: 'Uploading...'
    });
    SettingsService.uploadCropImage('TRIBY', null, 'triby', true).then(function(response){

      $ionicLoading.hide();

      if(response.status == "success"){
        $scope.triby.pic = response.url_file;
      } else {
        window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
          console.log('toast success: ' + a)
        }, function (b) {
          alert('toast error: ' + b)
        });
      }

    }, function(err) {
        $ionicLoading.hide();

      window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
      }, function (b) {
        alert("Error uploading picture");
      });
    });
  };

  $scope.saveTribyInfo = function(){

    FeedService.updateTriby($scope.triby).then(function(response){
      if(response.status=="success"){
        $timeout(function(){
          $state.go('app.info', {triby_id : $scope.triby._id});
        }, 100);
      }
      else
        window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    }, function(err) {
      window.plugins.toast.showShortCenter("Server error", function (a) {
      }, function (b) {
        alert('Server error');
      });
    });
  };

  $scope.goBack = function() {
    $ionicHistory.goBack();
  }
});




