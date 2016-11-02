angular.module('controller.saved', ['item.services'])
.controller('SavedCtrl', function($stateParams, $state, $model, $scope, $ionicPlatform, Scopes, ItemGroupService, $localstorage, AUTH_EVENTS, ModalLoginSignupService, ModalCreateCollectionService, ModalEditCollectionService, GENERAL_CONS, LokiDB, Greetings) {

  //store scope:
  Scopes.store('SavedCtrl', $scope);

  $scope.itemGroups = [];
  $scope.title = "<div class='short-logo'><img src='img/logo-short.png' /> MY SAVED ITEM</div>";
  $scope.itemGroupLoader = true;
  $scope.displayItemGroupEmpty = false;

  $scope.currProfilePicUrl = "img/profile-ph.png";
  $scope.currProfilePicUrlPH = "img/profile-ph.png";
  $scope.currFullName = "";

  $scope.loaderID = "";
  $scope.totalCollection = 0;

  $scope.greetingMessage = "";
  $scope.greetings = "";
  $scope.greetingImg = "";

  $scope.isLoggedin = false;
  $scope.currUserId = "";

  //pagination:
  $scope.limit = GENERAL_CONS.DEFAULTLIMIT;
  $scope.max_id = "";
  $scope.loadMore = true;
  $scope.backToHome = true;

  $scope.$on('$ionicView.beforeEnter', function() {
    $localstorage.set(GENERAL_CONS.TABACTIVE, 3);

    if(!$localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
      ModalLoginSignupService
      .init($scope, false)
      .then(function(modal) {
        modal.show();
      });
    }else{
      mixpanel.track("view_my_collection");
      $scope.isLoggedin = true;
    }

    //first time load:
    if($localstorage.get(AUTH_EVENTS.FIRSTTIMELOADSAVED) == 1){
      console.log("firsttime load saved");
      LokiDB.getItemGroup().then(function(itemgroup){
        var promise = ItemGroupService.loadItemGroup("");
        promise.then(function(result){
          LokiDB.removeAllItemGroup();
          if(result != null){
            $localstorage.set(AUTH_EVENTS.CURRFASHNAME, result.fullname);
            if(result.profilepic != undefined){
              $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, result.profilepic.fullurl);
            }else{
              $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, GENERAL_CONS.PROFILEPHPATH);
            }
            
            var feed = result.itemgroup;
            for(var i = 0; i < feed.length; i++){
              var objToAdd = new $model.ItemGroup(feed[i]);
              LokiDB.addItemGroup(objToAdd);
            }

            $scope.loaderID = "";
            $scope.currFullName = $localstorage.get(AUTH_EVENTS.CURRFASHNAME);
            $scope.currProfilePicUrl = $localstorage.get(AUTH_EVENTS.CURRPROFILEPIC);

            $scope.currUserId = $localstorage.get(AUTH_EVENTS.CURRFASHID);

            //get from DB:
            $scope.itemGroups = LokiDB.findItemGroupByUser($scope.currUserId);

            $scope.itemGroupLoader = false;
            $scope.totalCollection = $scope.itemGroups.length;
            if($scope.itemGroups.length < 1){
              $scope.displayItemGroupEmpty = true;
            }else{
              $scope.displayItemGroupEmpty = false;
            }
          }else{
            $scope.itemGroupLoader = false;
            $scope.displayItemGroupEmpty = true;
          }
        });
      });
      $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADSAVED, 0);
    }else{
      if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
        //get from DB:
        $scope.currUserId = $localstorage.get(AUTH_EVENTS.CURRFASHID);
        $scope.itemGroups = LokiDB.findItemGroupByUser($scope.currUserId);
        $scope.currFullName = $localstorage.get(AUTH_EVENTS.CURRFASHNAME);

        $scope.itemGroupLoader = false;
        $scope.totalCollection = $scope.itemGroups.length;
        if($scope.itemGroups.length < 1){
          $scope.displayItemGroupEmpty = true;
        }
      }
    }

    var greeting = Greetings.get();
    if(greeting == "EV"){
      $scope.greetings = "GOOD EVENING";
      $scope.greetingMessage = Greetings.evening();
      $scope.greetingIcon = "<div class='ion-ios-cloudy-night-outline'></div>";
    }else if(greeting == "AF"){
      $scope.greetings = "GOOD AFTERNOON";
      $scope.greetingMessage = Greetings.afternoon();
      $scope.greetingIcon = "<div class='ion-ios-sunny-outline'></div>";
    }else{
      $scope.greetings = "GOOD MORNING";
      $scope.greetingMessage = Greetings.morning();
      $scope.greetingIcon = "<div class='ion-ios-partlysunny-outline'></div>";
    }

  });

  $scope.goToItemSaved = function(groupid, groupname){
    $state.go('tab.item-saved', {'groupID':groupid, 'groupName':groupname});
  };

  $scope.doReloadCollection = function() {
    var promise = ItemGroupService.loadItemGroup($scope.loaderID);
    promise.then(function(result) {
      if(result != null){
        LokiDB.removeAllItemGroup();
        $scope.itemGroups = [];
        var feed = result.itemgroup;
        for(var i = 0; i < feed.length; i++){
          var objToAdd = new $model.ItemGroup(feed[i]);
          LokiDB.addItemGroup(objToAdd);
          $scope.itemGroups.push(objToAdd);
        }
      }

      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.createCollection = function(){
    ModalCreateCollectionService
    .init($scope)
    .then(function(modal){
      modal.show();
    });
  };

  $scope.editCollection = function(groupid, groupname){
    ModalEditCollectionService
    .init($scope, groupid, groupname)
    .then(function(modal){
      modal.show();
    });
  };

})
.controller('ItemSavedCtrl', function($stateParams, $cordovaClipboard, $cordovaSocialSharing, $ionicActionSheet, $ionicPopup, $rootScope, $ionicActionSheet, $ionicPopup, $state, $scope, $model, $ionicPlatform, Scopes, ItemGroupService, ModalCollectionService, $localstorage, AUTH_EVENTS, ModalLoginSignupService, GENERAL_CONS, LokiDB, FACEBOOK_CONFIG) {
  
  $scope.currGroupId = "";
  $scope.currGroupName = "";
  $scope.displayStyleEmpty = false;
  $scope.savedItems = [];
  $scope.itemFirstTimeLoader = true;

  $scope.limit = GENERAL_CONS.DEFAULTLIMIT;
  $scope.max_id = "";
  $scope.loadMore = true;

  $ionicPlatform.ready(function() {
    $scope.currGroupId = $stateParams.groupID;
    $scope.currGroupName = $stateParams.groupName;
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    var itemsaved = LokiDB.findItemSavedById($scope.currGroupId);
    if(itemsaved.length < 1){
      var promise = ItemGroupService.loadMyGroupItems($scope.currGroupId);
      promise.then(function(result) {
        if(result != null){
          addFeed(result.data.items);

          //manage pagination:
          managePagination(result.pagination);

          if(result.data.items.length < 1){
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
    }else{
      $scope.savedItems = itemsaved;
      $scope.itemFirstTimeLoader = false;
    }
  });

  var addFeed = function(feeds){
    for(var i = 0; i < feeds.length; i++){
      var objToAdd = new $model.ItemSaved($scope.currGroupId, feeds[i]);
        LokiDB.addItemSaved(objToAdd);
        $scope.savedItems.push(objToAdd);
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
        var promise = ItemGroupService.loadMyGroupItems($scope.currGroupId, $scope.max_id, $scope.limit);
        promise.then(function(result) {
          if(result != null){
            addFeed(result.data.items);
            managePagination(result.pagination);
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }else{
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  };

  $scope.doReloadItemSaved = function(){
    var promise = ItemGroupService.loadMyGroupItems($scope.currGroupId);
    promise.then(function(result) {
      if(result != null){
        LokiDB.removeAllItemSavedById($scope.currGroupId);
        $scope.savedItems = []; //reset

        if(result != null){
          addFeed(result.data.items);

          //manage pagination:
          managePagination(result.pagination);

          if(result.data.items.length < 1){
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

  $scope.goToZoomIn = function(groupid, itemid){
    $state.go('tab.item-saved-detail', {"groupID":groupid, "itemID":itemid});
  }

})
.controller('ItemSavedDetailCtrl', function($ionicHistory, $stateParams, $cordovaClipboard, $cordovaSocialSharing, $ionicActionSheet, $ionicPopup, $rootScope, $ionicActionSheet, $ionicPopup, $state, $scope, $model, $ionicPlatform, Scopes, ItemGroupService, ItemProductService, ModalCollectionService, $localstorage, AUTH_EVENTS, ModalLoginSignupService, GENERAL_CONS, LokiDB, ItemService, FACEBOOK_CONFIG, ionicToast) {
  
  $scope.currGroupId = "";
  $scope.currItemId = "";
  $scope.item = null;

  $ionicPlatform.ready(function() {
    $scope.currGroupId = $stateParams.groupID;
    $scope.currItemId = $stateParams.itemID;

    var itemSaved = LokiDB.findItemSavedByGroupIdAndItemId($scope.currGroupId, $scope.currItemId);
    $scope.item = itemSaved.item;
  });

  $scope.shareItem = function(itemid){
    var shareLink = FACEBOOK_CONFIG.SHAREITEMLINK.replace(/{ITEMID}/g, itemid);
    $cordovaSocialSharing
    .share(null, null, null, shareLink)
    .then(function(result) {
    }, function(err) {
    });
  }

  $scope.editItem = function(itemid){
    $ionicActionSheet.show({
      buttons: [
        { text: '<i class="ion-trash-a"></i> Delete Outfit' },
        { text: '<i class="ion-image"></i> Make cover photo' }
      ],
      titleText: 'Options',
      destructiveText: 'Cancel',
      buttonClicked: function(index) {
        if(index == 0){
          //remove the outfit first:
          LokiDB.removeItemSavedById($scope.currGroupId, itemid);
          var items = LokiDB.findItemSavedById($scope.currGroupId);
          $scope.savedItems = [];
          $scope.savedItems = items;

          var promise = ItemGroupService.removeItemGroupItem($scope.currGroupId, itemid);
          promise.then(function(result) {
            if(result){
              ionicToast.show('Removed', 'top', false, 1500);
              $ionicHistory.goBack(-1);
            }else{
              console.log('failed to remove item!');
            }
          });
        }else{
          var promise = ItemGroupService.updateCoverPhoto($scope.currGroupId, itemid);
          promise.then(function(result) {
            if(result != null){
              //toast:
              ionicToast.show('Cover Photo Updated', 'top', false, 1500);

              //update parent cover:
              var newCover = result.coverimageurl;
              $parentScope = Scopes.get('SavedCtrl');
              var itemGroup = LokiDB.findItemGroupById($scope.currGroupId);
              console.log(newCover);
              itemGroup.coverImageUrl = newCover;
              LokiDB.updateItemGroup(itemGroup);

              $parentScope.itemGroups = [];
              var currUserId = $localstorage.get(AUTH_EVENTS.CURRFASHID);
              var newItemGroup = LokiDB.findItemGroupByUser(currUserId);
              $parentScope.itemGroups = newItemGroup;
            }else{
              console.log('failed to remove!');
            }
          });
        }

        return true;
      },
      destructiveButtonClicked: function() {
        return true;
      }
    });
  }

  $scope.reportItem = function(itemid){
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
        var promise = ItemService.reportInappropiate(reportId, itemid);
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

  $scope.goToProduct = function(url, productid, productname){
    mixpanel.track("product_click", {
      "productlink": url,
      "productname": productname,
      "productid": productid,
      "productclick_source": "Mobile"
    });

    window.open(url, '_system', 'closebuttoncaption=Done,toolbarposition=top');
  }

  $scope.goToSingleProduct = function(singleproduct){
    if(singleproduct != null && singleproduct != undefined){
      mixpanel.track("product_click", {
          "productlink": singleproduct.productUrl,
          "productname": singleproduct.productName,
          "productid": singleproduct.productId,
          "productclick_source": "Mobile"
        });

        window.open(singleproduct.productUrl, '_system', 'closebuttoncaption=Done,toolbarposition=top');
    }
  }

  $scope.saveStyle = function(itemid) {
    ModalCollectionService
      .init($scope, Scopes.get('SavedCtrl'), itemid)
      .then(function(modal) {
        modal.show();
      });
  };

  $scope.goToProductViewMore = function(itemid){
    mixpanel.track("product_view_more", {
      "itemid": itemid
    });

    $state.go('tab.item-saved-product-more', {'itemID':itemid});
  }

});

