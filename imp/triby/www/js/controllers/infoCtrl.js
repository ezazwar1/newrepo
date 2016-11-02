'use strict';
MyApp.controller('InfoCtrl', [
  '$window',
  '$timeout',
  '$state',
  '$scope',
  '$location',
  '$ionicLoading',
  '$ionicPopover',
  '$ionicPopup',
  'FeedService',
  '$rootScope',
  '$stateParams',
  'UserService',
  '_',
  function($window, $timeout, $state, $scope, $location, $ionicLoading, $ionicPopover, $ionicPopup, FeedService, $rootScope, $stateParams, UserService, _) {

  $scope.triby = {};

  if($stateParams.triby_id) {
    $scope.triby._id = $stateParams.triby_id;
  }

  if($stateParams.triby_name) {
    $scope.triby.name = $stateParams.triby_name;
  }

  $scope.currentAuthData = UserService.getAuthData();

  var removedMemberListener = $rootScope.$on('removed_from_tribe', function(message, messageData) {
    console.log('removed_from_tribe: infoctrl', arguments);

    if(messageData.tribeId !== $scope.triby._id) return;

    window.plugins.toast.showShortCenter("You have been removed from this group", function (a) {
    }, function (b) {
      alert('You have been removed from this group');
    });

    $state.go('app.main.home');
  });

  var _loadTribyData = function () {

    $ionicLoading.show({
      template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
    });

    FeedService.getTribyInfo($stateParams.triby_id).then(function(response){
      $scope.triby = response.data.tribe;
      var members = $scope.triby.members,
        memberContacts = $scope.triby.memberContacts;

      $scope.triby.users = [];

      //todo rewrite this with usage one server request!
      for(var i=0; i < members.length; i++)
        (function(member) {
          UserService.getUser(member, 'mobilenumber').then(function(response){
            if (response.data.user.status != 1) {
              var contactData = _.findWhere(memberContacts, {mobilenumber: member });
              $scope.triby.users.push({
                _id: null,
                username: (contactData.name || member),
                mobilenumber: member,
                pending: true,
                pic: contactData.pic
              });
            } else {
              $scope.triby.users.push(response.data.user)
            }
          });
        })(members[i]);
      $ionicLoading.hide();
      FeedService.setNewTriby($scope.triby);
    }, function(err) {
      $ionicLoading.hide();
      window.plugins.toast.showShortCenter("Can't get this group", function (a) {
      }, function (b) {
        alert("Can't get this group");
      });

      $state.go('app.main.home');
    });
  };

  $scope.contextPopover = $ionicPopover.fromTemplate(
    '<ion-popover-view style="height: 166px;"><ion-content scroll="false"><div class="list">' +
    '<a class="item" ng-click="makeAdminMember()" ng-if="currentContextMember._id && triby.admin_users.indexOf(currentContextMember._id) == -1" style="color:red;text-align:center;">Make Admin</a>' +
    '<span class="item" ng-if="!currentContextMember._id || triby.admin_users.indexOf(currentContextMember._id) > -1" style="color:#CECECE;text-align:center;">Make Admin</span>' +

    '<a class="item" ng-click="deleteGroupMember()" ng-if="currentContextMember.phoneNumber != currentAuthData.mobilenumber" style="color:red;text-align:center;">Remove</a>' +
    '<span class="item" ng-if="currentContextMember.phoneNumber == currentAuthData.mobilenumber" style="color:#CECECE;text-align:center;">Remove</span>' +

    '<a class="item" ng-click="hidePostContextMenu()" style="text-align:center;">Cancel</a>' +
    '</div></ion-content></ion-popover-view>',
    {
      scope: $scope
    });

  $scope.currentContextMember = null;
  $scope.showMemberContextMenu = function ($event, userId, userPhoneNumber) {

    // only admin can do it
    if($scope.triby.admin_users.indexOf($scope.currentAuthData.id) === -1) {
      return;
    }

    $scope.currentContextMember = {_id: userId, phoneNumber:userPhoneNumber};
    $scope.contextPopover.show($event);

  };

  $scope.hidePostContextMenu = function () {
    $scope.currentContextMember = null;
    $scope.contextPopover.hide();
  };

  $scope.deleteGroupMember = function () {

    $scope.contextPopover.hide();

    if (!$scope.currentContextMember) {
      return;
    }

    FeedService.deleteMember($scope.triby._id, $scope.currentContextMember).then(function (response) {
      if (response.status=='success') {
        _loadTribyData();
        $scope.currentContextMember = null;
      } else {
        window.plugins.toast.showShortCenter('Server error', function(a){}, function(b){alert('Server error')});
      }
    },function (error) {
      window.plugins.toast.showShortCenter('Server error', function(a){}, function(b){alert('Server error')});
      console.log(error);
    });
  };

  $scope.makeAdminMember = function () {

    $scope.contextPopover.hide();

    if (!$scope.currentContextMember) {
      return;
    }

    FeedService.makeAdminMember($scope.triby._id, $scope.currentContextMember._id).then(function (response) {
      if (response.status=='success') {
        _loadTribyData();
        $scope.currentContextMember = null;
      } else {
        window.plugins.toast.showShortCenter('Server error', function(a){}, function(b){alert('Server error')});
      }
    },function (error) {
      window.plugins.toast.showShortCenter('Server error', function(a){}, function(b){alert('Server error')});
      console.log(error);
    });
  };

  var _exitTriby = function(tribyId, isDeleteRequiredAlso){

    $ionicLoading.show({
      template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
    });


    FeedService.exitTriby(tribyId, isDeleteRequiredAlso).then(function(response){
      if(response.status === 'success'){

        $ionicLoading.hide();
        $state.go('app.main.home');
      }
      else {
        $ionicLoading.hide();
        window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
      }
    }, function() {
      $ionicLoading.hide();
      window.plugins.toast.showShortCenter('server error!', function(a){}, function(b){alert('server error!')});
    });
  };

  $scope.showExitConfirmPopup = function(){

    if (
        _.indexOf($scope.triby.admin_users, $scope.currentAuthData.id) == -1
      ||
        (
        $scope.triby.admin_users
        && $scope.triby.admin_users.length > 1)
    ) {
      // silent exit if it is not admin OR there other admins
      _exitTriby($scope.triby._id);
      return;
    }

    $ionicPopup.show({
      template:
        '<div class="confirmation_text_box">' +
          '<div class="instruction_text">You are single admin in this group.</div>' +
          '<div class="instruction_text">If you proceed, group will be removed.</div>' +
          '<div class="confirm_text">Are you sure?</div>' +
        '</div>',
      cssClass: 'confirmation_popup',
      scope: $scope,
      buttons: [
        { text: 'Proceed',
          type: 'button-positive',
          onTap: function(e) {
            _exitTriby($scope.triby._id, true);
          }
        },
        {
          text: 'Cancel',
          type: 'button-positive',
          onTap: function(e) {
            //nothing. just close it
          }
        }
      ]
    });
  };

  _loadTribyData();

  $scope.$on('$destroy', function() {
    $scope.contextPopover.remove();
    removedMemberListener();
  });

}]);



