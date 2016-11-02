angular.module('shared.modaljoincontest', ['ionic'])
.service('ModalJoinContestService', function($ionicModal, $jrCrop, $model, $cordovaImagePicker, $ionicPopup, $ionicPlatform, $localstorage, $rootScope, $http, $q, $ionicModal, $helper, LokiDB, AUTH_EVENTS, ArticleService, ModalUnlockPromoService) {

  var init = function($scope, articleid){
    var promise;
    $scope = $scope || $rootScope.$new();

    $scope.isCompletion = false;
    $scope.croppedImage = "";
    $scope.articleId = articleid;
    $scope.blockDone = true;

    //submission field:
    $scope.fileKey = "";
    $scope.folderPath = "";
    $scope.contestant = {
      description: ""
    }

    $scope.getImageGallery = function() {      
      var options = {
          maximumImagesCount: 1,
          width: 800,
          height: 800,
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
                // success!
                var image = canvas.toDataURL();
                $scope.isCompletion = true;
                $scope.croppedImage = image;

                //process in background;
                //check IOS / Android:
                if(ionic.Platform.isIOS()){
                  var promise = ArticleService.uploadImageContestIOS($scope.articleId, image);
                  promise.then(function(result) {
                    if(result != null){
                      $scope.blockDone = false;

                      //prepare data for submission:
                      $scope.fileKey = result.filekey;
                      $scope.folderPath = result.folderpath;
                    }else{
                      //popup upload failed
                      $ionicPopup.alert({
                         title: 'Contest Submission',
                         subTitle: 'Failed to upload image',
                      });
                    }
                  });
                }else{
                  //android:
                  var promise = TransactionService.uploadImageContest($scope.articleId, image);
                  promise.then(function(result) {
                    if(result != null){
                      $scope.blockDone = false;

                      //prepare data for submission:
                      $scope.fileKey = result.filekey;
                      $scope.folderPath = result.folderpath;
                    }else{
                      //popup upload failed
                      $ionicPopup.alert({
                         title: 'Contest Submission',
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

    promise = $ionicModal.fromTemplateUrl('templates/shared/join-contest.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      return modal;
    });

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.submitCompletion = function() {
      $helper.showLoader();
      var promise = ArticleService.joinContest($scope.articleId, $scope.contestant.description, $scope.fileKey, $scope.folderPath);
      promise.then(function(result) {
        $helper.hideLoader();
        if(result != null){
          if(result.promotion != null && result.promotion != undefined){
            var campaigntext = result.promotion.promotext;

            //display
            ModalUnlockPromoService
            .init($scope, campaigntext, false, true)
            .then(function(modal) {
              modal.show();
            });
          }

          //update all current transaction and detail:
          $scope.updateLayoutAfterJoined();

          $scope.modal.hide();
        }else{
          //popup upload failed
          $ionicPopup.alert({
             title: 'Contest Submission',
             subTitle: 'Failed to join the contest',
          });
        }
      });
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