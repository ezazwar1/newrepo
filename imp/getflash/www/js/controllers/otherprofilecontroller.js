angular.module('controller.otherprofile', ['media.services', 'savedset.services'])
.controller('OtherProfileCtrl', function($stateParams, $state, $model, $scope, $ionicPlatform, Scopes, SavedSetService, $localstorage, AUTH_EVENTS, ModalLoginSignupService, ModalCreateCollectionService, ModalEditCollectionService, GENERAL_CONS, LokiDB) {

  $scope.savedSets = [];

  $scope.title = "";
  $scope.currUserID = "";
  $scope.currTabID = "";
  $scope.savedSetLoader = true;
  $scope.displaySaveSetEmpty = false;

  $scope.currProfilePicUrl = "img/profile-ph.png";
  $scope.currProfilePicUrlPH = "img/profile-ph.png";
  $scope.currFullName = "";

  $scope.totalCollection = 0;

  //pagination:
  $scope.limit = GENERAL_CONS.DEFAULTLIMIT;
  $scope.max_id = "";
  $scope.loadMore = true;

  $ionicPlatform.ready(function() {
    $scope.currUserID = $stateParams.userID;
    $scope.title = $stateParams.userName;
    $scope.currTabID = $stateParams.tabID;
    $scope.currFullName = $stateParams.userName;

    var promise = SavedSetService.loadSavedSet($scope.currUserID);
    promise.then(function(result) {
      if(result != null){
        $scope.savedSets = [];
        var feed = result.savedset;
        var profilepic = result.profilepic;
        if(profilepic != undefined && profilepic != ""){
          $scope.currProfilePicUrl = profilepic.fullurl;
        }else{
          $scope.currProfilePicUrl = GENERAL_CONS.PROFILEPHPATH;
        }

        for(var i = 0; i < feed.length; i++){
          var objToAdd = new $model.SavedSet(feed[i]._id.$oid, feed[i].userid.$oid, feed[i].setname, feed[i].createddate, feed[i].updateddate, feed[i].coverimageurl, feed[i].mediaset);
          $scope.savedSets.push(objToAdd);
        }
      }

      $scope.savedSetLoader = false;
      $scope.totalCollection = $scope.savedSets.length;
      if($scope.savedSets.length < 1){
        $scope.displaySaveSetEmpty = true;
      }
    });
  });
  
  $scope.doReloadCollection = function() {
    var promise = SavedSetService.loadSavedSet($scope.currUserID);
    promise.then(function(result) {

      if(result != null){
        $scope.savedSets = [];
        var feed = result.savedset;
        for(var i = 0; i < feed.length; i++){
          var objToAdd = new $model.SavedSet(feed[i]._id.$oid, feed[i].userid.$oid, feed[i].setname, feed[i].createddate, feed[i].updateddate, feed[i].coverimageurl, feed[i].mediaset);
          $scope.savedSets.push(objToAdd);
        }

        $scope.displaySaveSetEmpty = false;
      }else{
        $scope.displaySaveSetEmpty = true;
      }

      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.goToSavedMedia = function(setid, setname){
    if($scope.currTabID == 1){
      $state.go('tab.home-profile-media', {'setID':setid, 'setName':setname, "userID":$scope.currUserID, "tabID": $scope.currTabID});
    }else if($scope.currTabID == 2){
      $state.go('tab.discovery-profile-media', {'setID':setid, 'setName':setname, "userID":$scope.currUserID, "tabID": $scope.currTabID});
    }else if($scope.currTabID == 3){
      $state.go('tab.saved-profile-media', {'setID':setid, 'setName':setname, "userID":$scope.currUserID, "tabID": $scope.currTabID});
    }else if($scope.currTabID == 5){
      $state.go('tab.more-profile-media', {'setID':setid, 'setName':setname, "userID":$scope.currUserID, "tabID": $scope.currTabID});
    }
  };

})

.controller('OtherProfileMediaCtrl', function($stateParams, $cordovaSocialSharing, $ionicActionSheet, $ionicPopup, $rootScope, $ionicActionSheet, $ionicPopup, $state, $scope, $model, $ionicPlatform, Scopes, SavedSetService, ModalCollectionService, $localstorage, AUTH_EVENTS, ModalLoginSignupService, GENERAL_CONS, LokiDB, MediaProductService, FACEBOOK_CONFIG) {
  
  $scope.currSetId = "";
  $scope.currSetName = "";
  $scope.currUserID = "";
  $scope.currTabID = "";
  $scope.displayStyleEmpty = false;
  $scope.savedMedias = [];
  $scope.mediaFirstTimeLoader = true;

  $scope.limit = GENERAL_CONS.DEFAULTLIMIT;
  $scope.max_id = "";
  $scope.loadMore = true;

  $ionicPlatform.ready(function() {

    $scope.currSetId = $stateParams.setID;
    $scope.currSetName = $stateParams.setName;
    $scope.currUserID = $stateParams.userID;
    $scope.currTabID = $stateParams.tabID;

    var promise = SavedSetService.loadSavedSetMedias($scope.currSetId, null, null, $scope.currUserID);
    promise.then(function(result) {
      if(result != null){
        addFeed(result.data.medias);

        //manage pagination:
        managePagination(result.pagination);

        if(result.data.medias.length < 1){
          $scope.displayStyleEmpty = true;
        }else{
          $scope.displayStyleEmpty = false;
        }
      }else{
        //show no records found here
        $scope.displayStyleEmpty = true;
      }
      $scope.mediaFirstTimeLoader = false;
    });

  });

  var addFeed = function(feeds){
    for(var i = 0; i < feeds.length; i++){
      var objToAdd = new $model.SavedMedia($scope.currSetId, feeds[i].userid.$oid, feeds[i]._id.$oid, feeds[i].media.fullurl, feeds[i].fullname, feeds[i].profilepic, feeds[i].description, feeds[i].saved, feeds[i].issaved, feeds[i].savedorder, feeds[i].similarproducts, true);
        LokiDB.addSavedMedia(objToAdd);
        $scope.savedMedias.push(objToAdd);
    }
  }

  var managePagination = function(pagination){
    if(pagination != undefined){
      $scope.max_id = pagination.next_max_id;

      if($scope.max_id != ""){
        $scope.loadMore = true;
      }
    }
  }

  $scope.doLoadMore = function(){
    $scope.loadMore = false;
    if($scope.max_id != ""){
        var promise = SavedSetService.loadSavedSetMedias($scope.currSetId, $scope.max_id, $scope.limit, $scope.currUserID);
        promise.then(function(result) {
          if(result != null){
            addFeed(result.data.medias);
            managePagination(result.pagination);
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }else{
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  };

  $scope.doReloadSavedMedia = function(){
    var promise = SavedSetService.loadSavedSetMedias($scope.currSetId, null, null, $scope.currUserID);
    promise.then(function(result) {
      if(result != null){
        LokiDB.removeAllSavedMediaById($scope.currSetId);
        $scope.savedMedias = []; //reset

        if(result != null){
          addFeed(result.data.medias);

          //manage pagination:
          managePagination(result.pagination);

          if(result.data.medias.length < 1){
            $scope.displayStyleEmpty = true;
          }else{
            $scope.displayStyleEmpty = false;
          }
        }else{
          $scope.displayStyleEmpty = true;
        }
      }else{
        //show no records found here
        $scope.displayStyleEmpty = true;
      }

      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.goToProduct = function(url, mediaid, viewMore, productid, productname){
    mixpanel.track("product_click", {
      "productlink": url,
      "productname": productname,
      "productid": productid,
      "productclick_source": "Mobile"
    });

    if($scope.currTabID == 1){
      if(viewMore){
        $state.go('tab.arena-product-more', {'mediaID':mediaid});
      }else{
        window.open(url, '_blank', 'closebuttoncaption=Done,toolbarposition=top');
      }
    }else if($scope.currTabID == 2){
      if(viewMore){
        $state.go('tab.discovery-product-more', {'mediaID':mediaid});
      }else{
        window.open(url, '_blank', 'closebuttoncaption=Done,toolbarposition=top');
      }
    }else if($scope.currTabID == 3){
      if(viewMore){
        $state.go('tab.saved-product-more', {'mediaID':mediaid});
      }else{
        window.open(url, '_blank', 'closebuttoncaption=Done,toolbarposition=top');
      }
    }else if($scope.currTabID == 4){
      if(viewMore){
        $state.go('tab.notification-product-more', {'mediaID':mediaid});
      }else{
        window.open(url, '_blank', 'closebuttoncaption=Done,toolbarposition=top');
      }
    }
  }

  $scope.reportMedia = function(mediaid){
      $ionicActionSheet.show({
        buttons: [
          { text: 'This photo does not follow the contest theme' },
          { text: 'This photo shows nudity or pornography' },
          { text: 'This photo shows graphic violence' },
          { text: 'This photo contains hate messages or symbols' },
          { text: 'This photo does not belong to the poster' }
        ],
        titleText: 'Report Photo',
        destructiveText: 'Cancel',
        buttonClicked: function(index) {
          var reportId = index + 1;
          var promise = MediaProductService.reportInappropiate(reportId, null, null, mediaid);
          promise.then(function(result) {
            if(result){
              console.log("Successfully added!");
            }
          });

          $ionicPopup.alert({
                   title: 'Report Photo',
                   subTitle: 'Thank you for your report. We will remove this photo if it violates our Community Guidelines.'
          });

          return true;
        },
        destructiveButtonClicked: function() {
          return true;
        }
      });
  }

  $scope.shareMedia = function(mediaid){
    var shareLink = FACEBOOK_CONFIG.SHAREMEDIALINK.replace(/{MEDIAID}/g, mediaid);
    $cordovaSocialSharing
    .shareViaFacebook(null, null, shareLink)
    .then(function(result) {
      // Success!
    }, function(err) {});
  }

  $scope.saveOutfit = function(mediaid, index){
    ModalCollectionService
        .init($scope, $scope, null, null, mediaid, index)
        .then(function(modal) {
          modal.show();
        });
  }

});