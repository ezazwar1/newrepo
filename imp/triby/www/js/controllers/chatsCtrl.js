'use strict';
MyApp.controller('ChatsCtrl', function($scope, $timeout,
                                      $location, ChatService, $rootScope, $ionicLoading,  $ionicPopover,
                                      UserService, $state, _) {
  console.log("Chats Ctrl start ...");

  if (window.StatusBar) {
    StatusBar.overlaysWebView(true);
  }

  $ionicLoading.show({
    template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
  });

  if(chatRemoveListener && typeof chatRemoveListener === 'function') {
    chatRemoveListener();
  }

  var chatRemoveListener = $rootScope.$on('chat_removed', function(message, messageData) {
    console.log('chat_removed: ', arguments);

    var chatIndex = _.findIndex($scope.chats, function (item) { return item._id === messageData.chat._id});
    if (chatIndex > -1) {
      $scope.chats.splice(chatIndex, 1);
    }

  });

  var chatsNotificationListener = $rootScope.$on('chats_notification', function(message, chatId) {
    console.log('chats_notification: ', arguments);

    //if there is no such chat in scope --> get chat by id and unshift it to scope
    if (!_.findWhere($scope.chats, {'_id': chatId})) {
      updateChatInList(chatId, false);
    }

    var existingIndex = _.findIndex($scope.chats, function (item) { return item._id === chatId});
    if (existingIndex > -1) {
      updateChatInList(chatId, existingIndex);
    }

    function updateChatInList(chatId, chatListId) {
      ChatService.getChatForChatsList(chatId)
        .then(function(res) {
          if(res && res.data.status === "success" && res.data.chat ) {
            if(chatListId !== false && chatListId > -1) {
              $scope.chats[existingIndex] = res.data.chat;
            } else {
              $scope.chats.unshift(res.data.chat);
              $scope.$apply();
            }
          } else {
            window.plugins.toast.showShortCenter("Error loading chat notification", function (a) {
              console.log('toast success: ' + a)
            }, function (b) {
              alert('toast error: ' + b)
            });
          }
        })
        .catch(function(err) {
          window.plugins.toast.showShortCenter("Error loading chat notification", function (a) {
            console.log('toast success: ' + a)
          }, function (b) {
            alert('toast error: ' + b)
          });
        });
    }
  });

  $scope.deleteChatPopover = $ionicPopover.fromTemplate(
    '<ion-popover-view style="height: 121px;"><ion-content scroll="false"><div class="list">' +
    '<a class="item" ng-click="deleteContextChat()" style="color:red;text-align:center;">Delete Chat</a>' +
    '<a class="item" ng-click="hideDeleteContextMenu()" style="text-align:center;">Cancel</a>' +
    '</div></ion-content></ion-popover-view>',
    {
      scope: $scope
    });

  $scope.showDeleteContextMenu = function (event, chat) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();

    $scope.currentContextChatId = chat._id;
    $scope.deleteChatPopover.show(event);
  };

  $scope.hideDeleteContextMenu = function () {
    $scope.currentContextChatId = null;
    $scope.deleteChatPopover.hide();
  };

  $scope.deleteContextChat = function () {
    $ionicLoading.show({
      template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
    });

    var chatId = $scope.currentContextChatId;

    $scope.deleteChatPopover.hide();

    if (!chatId) {
      return;
    }

    ChatService.clearChatHistory(chatId).then(function(res) {
      if(res && res.data && res.data.status === "success") {
        var existingIndex = _.findIndex($scope.chats, function (item) { return item._id === chatId});
        if (existingIndex > -1) {
          $scope.chats.splice(existingIndex, 1);
        }
      } else {
        window.plugins.toast.showShortCenter("Error during removing chat", function (a) {
        }, function (b) {
          alert('Error during removing chat');
        });
      }

      $ionicLoading.hide();
    }, function(err) {
      window.plugins.toast.showShortCenter("Error during removing chat", function (a) {
      }, function (b) {
        alert('Error during removing chat');
      });

      $ionicLoading.hide();
    });
  };

  $scope.firstLoadingDone = false;

    $scope.userAgent = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    console.log('$scope.userAgent!!!!!!!!!!!!!!!1', $scope.userAgent);

  ChatService.getMyChats()
    .then(function(res) {
      var unreadCounter = 0;
  $scope.chats = [];

      if(res.data.status === "success") {


        $scope.chats = res.data.chats;

        console.log('$scope.chats ', $scope.chats );

        //this way will work only if we get all chats
        if(res.data.chats && res.data.chats.length > 0) {
          for(var i = 0; i < res.data.chats.length; i++) {
            if(res.data.chats[i].unread_messages && res.data.chats[i].unread_messages > 0) {
              unreadCounter = unreadCounter + res.data.chats[i].unread_messages;
            }
          }
        }

        $rootScope.unreadMessages = unreadCounter;
      } else {
        window.plugins.toast.showShortCenter("Error loading chat", function (a) {
          console.log('toast success: ' + a)
        }, function (b) {
          alert('toast error: ' + b)
        });
      }
      $scope.firstLoadingDone = true;
      $ionicLoading.hide();
    }, function(err) {
      $ionicLoading.hide();
      window.plugins.toast.showShortCenter("Error loading chat", function (a) {
        console.log('toast success: ' + a)
      }, function (b) {
        alert('toast error: ' + b)
      });
      $scope.firstLoadingDone = true;
    });

  ///////////////////// get Current User /////////////////////
  $scope.currentUser = UserService.getAuthData();

  //
  $scope.getAvatar = function(user) {
    if (_.isObject(user) && _.isString(user.pic) && user.pic.length)  {
      return user.pic;
    } else {
      return 'img/default_avatar.jpg';
    }
  };

  $scope.openChat = function(partnerInfo, unreadMessages, chatId) {
    UserService.setPartnerData(partnerInfo);
    console.log('partnerInfo', partnerInfo);
    $state.go("app.chat", {partner_number: partnerInfo.mobilenumber, unread_messages: unreadMessages, chatId: chatId});
  };

  $scope.go = function(path) {
    $location.path(path);
  };

  $scope.goBack = function() {
    $timeout(function () {
      history.back();
    }, 20);
  };

  $scope.$on('$destroy', function() {
    $scope.deleteChatPopover.remove();
    chatRemoveListener();
    chatsNotificationListener();
  });

});
