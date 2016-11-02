angular.module('shared.modalcollection', ['ionic', 'itemgroup.services', 'ionic-toast'])
.service('ModalCollectionService', function($ionicModal, $model, $ionicPopup, $localstorage, $rootScope, $http, $q, $ionicModal, $helper, LokiDB, AUTH_EVENTS, ItemGroupService, ModalUnlockPromoService, ionicToast) {

  var init = function($scope, $parentScope, itemid, index){
    var promise;
    $scope = $scope || $rootScope.$new();

    $scope.itemGroupItems = [];
    $scope.displayCreateNew = false;
    $scope.itemId = itemid;
    $scope.itemGroupModel = {
      groupName: ""
    };
    $scope.allowToSave = false;
    $scope.working = false;
    $scope.theBottom = "40px";
    $scope.currIndex = index;

    $scope.currUserId = $localstorage.get(AUTH_EVENTS.CURRFASHID);
    //get from DB:
    $scope.itemGroupItems = LokiDB.findItemGroupByUser($scope.currUserId);

    promise = $ionicModal.fromTemplateUrl('templates/shared/manage-collection.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      return modal;
    });

    $scope.doSave = function(){
      if($scope.allowToSave && !$scope.working){
        $scope.working = true;
        var promise = ItemGroupService.createItemGroup($scope.itemGroupModel.groupName, $scope.itemId);
        promise.then(function(result) {
          //update data here
          if(result != null){
            ionicToast.show('Style Saved', 'top', false, 1500);

            mixpanel.track("save_collection", {
              "groupname": $scope.itemGroupModel.groupName,
              "itemid": $scope.itemId
            });

            if(result.isinsert == 1){
              //remove existing:
              LokiDB.removeAllItemGroupByUser($scope.currUserId);
              var feed = result.itemgroup;
              for(var i = 0; i < feed.length; i++){
                var objToAdd = new $model.ItemGroup(feed[i]);
                LokiDB.addItemGroup(objToAdd);
              }

              if($scope.itemId !== undefined && $scope.itemId != null){
                if($parentScope.itemGroups == undefined){
                  var savedList = result.saved;
                  if($scope.currIndex !== undefined && $scope.currIndex != null){
                    $parentScope.savedMedias[$scope.currIndex].itemIsSaved = true;
                    $parentScope.savedMedias[$scope.currIndex].isShowSaved = true;
                    $parentScope.savedMedias[$scope.currIndex].itemSavedCount = savedList.length;
                  }else{
                    LokiDB.removeItemById($scope.itemId);
                    $parentScope.item.itemIsSaved = true;
                    $parentScope.item.isShowSaved = true;
                    $parentScope.item.itemSavedCount = savedList.length;
                    LokiDB.addItem($parentScope.item);
                  }
                }else{
                  //from media saved:
                  $parentScope.itemGroups = [];
                  var newItemGroups = LokiDB.findItemGroupByUser($scope.currUserId);
                  $parentScope.itemGroups = newItemGroups;
                }
              }
                
              /*if(result.showpromo){
                //get from DB:
                var contest = LokiDB.findContest($scope.contestId);
                if(contest != null){
                  var currenttime = (new Date()).getTime();
                  if(currenttime < contest.promoExpireDate){
                    ModalUnlockPromoService
                    .init($scope, contest.campaignText, false, false)
                    .then(function(modal) {
                      modal.show();
                    });
                  }
                }
              }*/
            }

            //close modal:
            $scope.modal.hide();
            $scope.working = false;
          }else{
            $ionicPopup.alert({
               title: 'New Collection',
               subTitle: 'Failed to create new collection'
            });
          }
        });
      }
    };

    $scope.doSaveToCollection = function(itemgroupid, groupname){ 
      $helper.showLoader();
      var promise = ItemGroupService.updateItemGroup(itemgroupid, groupname, $scope.itemId);
      promise.then(function(result) {
        //update data here
        if(result != null){
          mixpanel.track("save_collection", {
            "groupname": groupname,
            "itemid": $scope.itemId
          });

          if(result.meta.code == "212"){
            $ionicPopup.alert({
               title: 'Update Collection',
               subTitle: "This style is already in " + setname
            });
          }else{
            ionicToast.show('STYLE SAVED', 'top', false, 1500);

            if(result.data.isinsert == 0){
              //update itemGroup:
              var currItemGroup = LokiDB.findItemGroupById(itemgroupid);
              currItemGroup.totalOutFit = currItemGroup.totalOutFit + 1;
              LokiDB.updateItemGroup(currItemGroup);

              if($scope.itemId !== undefined && $scope.itemId != null){
                if($parentScope.savedSets == undefined){
                  var savedList = result.data.saved;
                  if($scope.currIndex !== undefined && $scope.currIndex != null){
                    $parentScope.savedMedias[$scope.currIndex].itemIsSaved = true;
                    $parentScope.savedMedias[$scope.currIndex].isShowSaved = true;
                    $parentScope.savedMedias[$scope.currIndex].itemSavedCount = savedList.length;
                  }else{
                    LokiDB.removeItemById($scope.itemId);
                    $parentScope.item.itemIsSaved = true;
                    $parentScope.item.isShowSaved = true;
                    $parentScope.item.itemSavedCount = savedList.length;
                    LokiDB.addItem($parentScope.item);
                  }
                }else{
                  //from media saved:
                  $parentScope.itemGroups = [];
                  var newItemGroups = LokiDB.findItemGroupByUser($scope.currUserId);
                  $parentScope.itemGroups = newItemGroups;
                }
              }

              /*if(result.showpromo){
                //get from DB:
                var contest = LokiDB.findContest($scope.contestId);
                if(contest != null){
                  var currenttime = (new Date()).getTime();
                  if(currenttime < contest.promoExpireDate){
                    ModalUnlockPromoService
                    .init($scope, contest.campaignText, false, false)
                    .then(function(modal) {
                      modal.show();
                    });
                  }
                }
              }*/

            }
          }

          //close modal:
          $helper.hideLoader();
          $scope.modal.hide();
        }else{
          $helper.hideLoader();
          $ionicPopup.alert({
             title: 'Update Collection',
             subTitle: 'Unable to add to collection'
          });
        }
      });
    };

    $scope.onSetNameChanged = function(){
      if($scope.itemGroupModel.groupName.trim() == ""){
        $scope.allowToSave = false;
      }else{
        $scope.allowToSave = true;
      }
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.changeDisplay = function(val) {
      if(val == 1){
        $scope.displayCreateNew = true;
      }else{
        $scope.displayCreateNew = false;
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
})

.service('ModalCreateCollectionService', function($ionicModal, $model, $ionicPopup, $localstorage, $rootScope, $http, $q, $ionicModal, $helper, LokiDB, AUTH_EVENTS, ItemGroupService, ionicToast) {
  
  var init = function($scope){
    var promise;
    $parentScope = $scope;
    $scope = $scope || $rootScope.$new();

    $scope.currUserId = $localstorage.get(AUTH_EVENTS.CURRFASHID);
    $scope.itemGroupModel = {
      groupName: ""
    };
    $scope.allowToSave = false;
    $scope.working = false;

    promise = $ionicModal.fromTemplateUrl('templates/shared/create-collection.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      return modal;
    });

    $scope.doCreate = function(){
      if($scope.allowToSave && !$scope.working){
        $scope.working = true;
        var promise = ItemGroupService.createItemGroupName($scope.itemGroupModel.groupName);
        promise.then(function(result) {
          //update data here
          if(result != null){
            ionicToast.show('CREATED', 'top', false, 1500);

            if(result.isinsert == 1){
              //remove existing:
              LokiDB.removeAllItemGroupByUser($scope.currUserId);
              $parentScope.itemGroups = [];
              var feed = result.itemgroup;
              for(var i = 0; i < feed.length; i++){
                var objToAdd = new $model.ItemGroup(feed[i]);
                LokiDB.addItemGroup(objToAdd);
                $parentScope.itemGroups.push(objToAdd);
              }
            }
            
            //close modal:
            $scope.modal.hide();
            $scope.working = false;
          }else{
            $ionicPopup.alert({
               title: 'New Collection',
               subTitle: 'Failed to create new collection'
            });
          }
        });
      }
    };

    $scope.onSetNameChanged = function(){
      if($scope.itemGroupModel.groupName.trim() == ""){
        $scope.allowToSave = false;
      }else{
        $scope.allowToSave = true;
      }
    };

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

.service('ModalEditCollectionService', function($ionicModal, $model, $ionicPopup, $localstorage, $rootScope, $http, $q, $ionicModal, $helper, LokiDB, AUTH_EVENTS, ItemGroupService, ionicToast) {
  
  var init = function($scope, groupid, groupname){
    var promise;
    $parentScope = $scope;
    $scope = $scope || $rootScope.$new();

    $scope.currUserId = $localstorage.get(AUTH_EVENTS.CURRFASHID);
    $scope.itemGroupModel = {
      groupName: ""
    };

    $scope.currGroupId = groupid;
    $scope.currGroupName = groupname;
    $scope.displayRename = false;
    $scope.allowToSave = false;
    $scope.working = false;

    promise = $ionicModal.fromTemplateUrl('templates/shared/edit-collection.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      return modal;
    });

    $scope.doUpdate = function(){
      if($scope.allowToSave && !$scope.working){
        $scope.working = true;
        var promise = ItemGroupService.updateItemGroupName($scope.currGroupId, $scope.itemGroupModel.groupName);
        promise.then(function(result) {
          //update data here
          if(result != null){
            ionicToast.show('UPDATED', 'top', false, 1500);

            if(result.isinsert == 0){
              //remove existing:
              var itemgroup = LokiDB.findItemGroupById($scope.currGroupId);
              itemgroup.groupName = $scope.itemGroupModel.groupName
              LokiDB.updateItemGroup(itemgroup);

              $parentScope.itemGroups = [];
              $parentScope.itemGroups = LokiDB.findItemGroupByUser($scope.currUserId);
            }
            
            //close modal:
            $scope.modal.hide();
            $scope.working = false;
          }else{
            $ionicPopup.alert({
               title: 'Update Collection',
               subTitle: 'Failed to create new collection'
            });
          }
        });
      }
    };

    $scope.doRemove = function(){
      var confirmPopup = $ionicPopup.confirm({
         title: 'Delete Collection',
         template: 'Delete this collection?',
         okText: 'YES',
         cancelText: 'CANCEL'
      });
      confirmPopup.then(function(res) {
        if(res){
          var promise = ItemGroupService.removeItemGroup($scope.currGroupId);
          promise.then(function(result){
            //update data here
            if(result){
              //remove:
              LokiDB.removeAllItemGroupById($scope.currGroupId);

              $parentScope.itemGroups = [];
              $parentScope.itemGroups = LokiDB.findItemGroupByUser($scope.currUserId);

              $scope.modal.hide();
            }else{
              $ionicPopup.alert({
                 title: 'Delete Collection',
                 subTitle: 'Failed to remove this collection'
              });
            }
          });
        }
      });
    };

    $scope.onSetNameChanged = function(){
      if($scope.itemGroupModel.groupName.trim() == ""){
        $scope.allowToSave = false;
      }else{
        $scope.allowToSave = true;
      }
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.changeDisplay = function(val) {
      if(val == 1){
        $scope.displayRename = true;
      }else{
        $scope.displayRename = false;
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