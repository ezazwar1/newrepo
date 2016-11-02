angular.module('shared.modalprofile', ['ionic'])
.service('ModalUpdateProfilePicService', function($ionicModal, $jrCrop, $model, $cordovaImagePicker, $ionicPopup, $ionicPlatform, $localstorage, $rootScope, $http, $q, $ionicModal, $helper, LokiDB, AUTH_EVENTS, AuthService) {

  var init = function($scope){
    var promise;
    $parentScope = $scope;
    $scope = $rootScope.$new();

    $scope.croppedImage = "";

    //submission field:
    $scope.fileKey = "";
    $scope.folderPath = "";
    $scope.description = "";

    $scope.getImageGallery = function() {      
      var options = {
          maximumImagesCount: 1,
          width: 600,
          height: 600,
          quality: 80
      };

      $cordovaImagePicker.getPictures(options).then(function (results) {
          if(results.length > 0){
            console.log('Image URI: ' + results[0]);
            $jrCrop.crop({
                url: results[0],
                width: 250,
                height: 250
            }).then(function(canvas) {
                $helper.showLoader();

                // success!
                var image = canvas.toDataURL();
                $scope.croppedImage = image;

                //check IOS / Android:
                if(ionic.Platform.isIOS()){
                  var promise = AuthService.doUploadImageProfileIOS(image);
                  promise.then(function(result) {
                    $helper.hideLoader();
                    if(result != null){

                      //prepare data for submission:
                      $parentScope.profilepic = result.imageurl;
                      $scope.modal.hide();
                    }else{
                      //popup upload failed
                      $ionicPopup.alert({
                         title: 'Upload Picture',
                         subTitle: 'Failed to upload image',
                      });
                    }
                  });
                }else{
                  //process in background;
                  var promise = AuthService.doUploadImageProfile(image);
                  promise.then(function(result) {
                    $helper.hideLoader();
                    if(result != null){

                      //prepare data for submission:
                      $parentScope.profilepic = result.imageurl;
                      $scope.modal.hide();
                    }else{
                      //popup upload failed
                      $ionicPopup.alert({
                         title: 'Upload Picture',
                         subTitle: 'Failed to upload image',
                      });
                    }
                  });
                }

            }, function() {});
          }
      }, function(error) {
          console.log('Error: ' + JSON.stringify(error));
      });
    };

    promise = $ionicModal.fromTemplateUrl('templates/shared/updateprofilepictemplate.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      return modal;
    });

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    return promise;
  }

  return {
    init: init
  }
})

.service('ModalUpdateProfilePhoneService', function($ionicModal, $model, $ionicPopup, $ionicPlatform, $localstorage, $rootScope, $http, $q, $ionicModal, $helper, LokiDB, AUTH_EVENTS, AuthService) {

  var init = function($scope){
    var promise;
    $parentScope = $scope;
    $scope = $scope || $rootScope.$new();

    $scope.blockSubmit = false;
    $scope.allowToSubmit = false;
    $scope.user = {
      phone: '',
      code: '+65'
    }

    promise = $ionicModal.fromTemplateUrl('templates/shared/phone-modal.html', {
      scope: $scope,
      animation: 'fade-in'
    }).then(function(modal){
      $scope.modal = modal;
      return modal;
    });

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.onPhoneChanged = function(){
      if($scope.user.phone.trim() == "" || isNaN($scope.user.phone)){
        $scope.allowToSubmit = false;
      }else{
        $scope.allowToSubmit = true;
      }
    };

    $scope.doSubmit = function(){
      if($scope.allowToSubmit && !$scope.blockSubmit){
        $scope.blockSubmit = true;
        var mobile = $scope.user.code + $scope.user.phone;
        var promise = AuthService.doUpdatePhone(mobile);
        promise.then(function(result) {
          if(result != null){
            $localstorage.set(AUTH_EVENTS.CURRMOBILE, mobile);

            //submit:
            $parentScope.claimPrize(true, $parentScope.prizeId);
            $scope.modal.hide();
          }else{
            //popup upload failed
            $ionicPopup.alert({
               title: 'Update Mobile',
               subTitle: 'Failed to update phone number',
            });
          }
        });
      }
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    return promise;
  }

  return {
    init: init
  }
});