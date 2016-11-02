'use strict';
MyApp.controller('ChatCtrl', function ($scope, $ionicModal, $timeout,
                                       $ionicPopup, $location, $cordovaCamera, $stateParams,
                                       ChatService, SettingsService, $rootScope, $ionicLoading, $q, $filter,
                                       $ionicScrollDelegate, $ionicPopover, $window, $anchorScroll, $document, $state, CommentsService,
                                       UserService, IconService, PubNubServiceNew, LoadingService, _) {
  console.log("Private ChatCtrl start ...");

  var loadingInProgress = false,
    coloredHeart = 'img/heart.png',
    greyHeart = 'img/heart-grey.png',
    coloredDislike = 'img/hand-down.png',
    greyDislike = 'img/hand-down-grey.png';

  $scope.isIos = ionic.Platform.isIOS();
  $scope.isFirstLoadingDone = false;

  $ionicLoading.show({
    template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
  });

  $scope.$on('$ionicView.leave', function () {
    ChatService.setCurrentChat({_id: null});
    destroyPubNub();
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.disableScroll(false);
    }
    //$ionicLoading.hide();
  });

  $scope.$on('$ionicView.enter', function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.disableScroll(true);
    }
  });

  //$scope.$on('$ionicView.afterEnter', function () {
  //  initInputWatcher();
  //});

  var chatRemovedListener = $rootScope.$on('chat_removed', function(message, messageData) {
    console.log('chat_removed: ', arguments);

    if(chatId === messageData.chat._id) {
      window.plugins.toast.showShortCenter("Chat history was cleared", function (a) {
      }, function (b) {
        alert('Chat history was cleared');
      });
      $scope.messages = [];
      $state.go('app.chats');
    }

  });

  $ionicModal.fromTemplateUrl('templates/photo_details.html', function (modal) {
    $scope.gridModal = modal;
  }, {
    scope: $scope,
    animation: 'none'
  });

  $scope.closeModal = function () {
    $scope.gridModal.hide();
    $scope.gridModal.remove();
  };

  $scope.isMoreLoadingAllowed = true;
  $scope.sendingMessage = false;
  $scope.isShowDetails = false;
  $scope.messages = [];
  $scope.message = '';

  var authData;
  var partnerData = UserService.getPartnerData(),
    partnerId = partnerData._id,
    chatId, pubNubInstance, pubNubInfoInstance;

  $scope.chatName = $filter('limitName')(partnerData.username) || "Chat";

  $scope.contextPopover = $ionicPopover.fromTemplate(
    '<ion-popover-view style="height: 121px;"><ion-content scroll="false"><div class="list">' +
    '<a class="item" ng-click="deleteContextMessage()" style="color:red;text-align:center;">Take it back!</a>' +
    '<a class="item" ng-click="hideDeleteContextMenu()" style="text-align:center;">Cancel</a>' +
    '</div></ion-content></ion-popover-view>',
    {
      scope: $scope
    });

  initUser();

  ChatService.getChat($stateParams.partner_number, partnerId, $stateParams.unread_messages).
    then(function (res) {
      var scrollToAnchor, unreadCounter = 0;

      if (res.data.status === "success") {
        if (res.data.chat) {
          ChatService.setCurrentChat({_id: res.data.chat._id});

          chatId = res.data.chat._id;

          if($stateParams.unread_messages) {
            for(var i = res.data.chat.messages.length - 1; i > -1; i--) {
              if(res.data.chat.messages[i].is_read === 0) {
                unreadCounter = unreadCounter + 1;

                if(res.data.chat.messages[i].pic) {
                  res.data.chat.messages[i].justPostedImage = true;
                }

                if(!scrollToAnchor) {
                  res.data.chat.messages[i].isFirstUnread = true;
                  scrollToAnchor = true;
                }
              }
            }
          }

          $scope.unreadCounter = unreadCounter;
          $scope.messages = res.data.chat.messages || [];
          $timeout(function () {
            if(scrollToAnchor) {
              $location.hash('unreadBanner');
              $ionicScrollDelegate.$getByHandle('messagesScroll').anchorScroll();
            } else {
              $ionicScrollDelegate.$getByHandle('messagesScroll').scrollBottom();
            }
          }, 250);

          //$timeout(function () {
          //  var unreadBanner = document.getElementById('unreadBanner');
          //  if( unreadBanner && unreadBanner.classList) {
          //    unreadBanner.classList.add('hide-custom');
          //  }
          //}, 30 * 1000);

          $scope.isFirstLoadingDone = true;
          initPubNub();
        }
      } else {
        window.plugins.toast.showShortCenter("Error loading chat", function (a) {
        }, function (b) {
          alert('toast error: ' + b)
        });
      }
      $ionicLoading.hide();
    }, function (err) {
      $ionicLoading.hide();
      window.plugins.toast.showShortCenter("Error loading chat", function (a) {
      }, function (b) {
        alert('toast error: ' + b)
      });
    });

  $scope.loadMoreMessages = function () {
    if(!loadingInProgress && $scope.isMoreLoadingAllowed) {
      loadingInProgress = true;
      ChatService.getMessages(chatId, {'skip': $scope.messages.length}).then(function (response) {
        if (!response.data.messages || response.data.messages.length == 0) {
          $scope.isMoreLoadingAllowed = false;
        }
        _.each(response.data.messages, function (message) {
          $scope.messages.push(message);
        });
        $scope.$broadcast('scroll.refreshComplete');

        loadingInProgress = false;

      }, function (err) {
        loadingInProgress = false;
        window.plugins.toast.showShortCenter("Error load more message", function (a) {
        }, function (b) {
          alert('toast error: ' + b)
        });
      });
    }
  };

  /*from video message brunch */
  $scope.cameraPopover = $ionicPopover.fromTemplate(
    '<ion-popover-view style="height: 170px;"><ion-content scroll="false"><div class="list">' +
    '<a class="item" ng-click="uploadPicture(\'CAMERA\')" style="text-align:center;">Take Photo</a>' +
    '<a class="item" ng-click="uploadVideo(\'CAMERA\')" style="text-align:center;">Take Video</a>' +
    '<a class="item" ng-click="hideCameraPopover()" style="color:red;text-align:center;">Cancel</a>' +
    '</div></ion-content></ion-popover-view>',
    {
      scope: $scope
    });

  $scope.uploadPopover = $ionicPopover.fromTemplate(
    '<ion-popover-view style="height: 120px;"><ion-content scroll="false"><div class="list">' +
    '<a class="item" ng-click="uploadPicture(\'LIBRARY\')" style="text-align:center;">Photo Library</a>' +
    '<a class="item" ng-click="hideUploadPopover()" style="color:red;text-align:center;">Cancel</a>' +
    '</div></ion-content></ion-popover-view>',
    {
      scope: $scope
    });

  $scope.showCameraPopover = function ($event) {
    if(cordova.plugins && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }

    $rootScope.isInCommentingMode = false;

    $timeout(function() {
      $scope.cameraPopover.show($event);
    }, 300);
  };

  $scope.showUploadPopover = function (event) {
    if(cordova.plugins && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }

    $rootScope.isInCommentingMode = false;

    $timeout(function() {
      $scope.uploadPopover.show(event);
    }, 300);
  };

  $scope.hideCameraPopover = function () {
    $scope.cameraPopover.hide();
  };

  $scope.hideUploadPopover = function () {
    $scope.uploadPopover.hide();
  };

  $scope.hidePopovers = function () {
    $scope.uploadPopover.hide();
    $scope.cameraPopover.hide();
  };

  $scope.uploadVideo = function (source) {
    console.log('source', source);
    $scope.hidePopovers();

    var message = {
      _temp_local_id: _get_random_id(),
      message: $scope.message,
      chat: chatId,
      recipientId: partnerId
    };

    $ionicLoading.show({
      template: '<p>Uploading...</p> ' +
      '<tek-progress-bar ng-model="progressBar.val" ></tek-progress-bar>'
    });

    SettingsService.videoTo($rootScope.urlBackend + '/uploads', "POST", source).then(function (response) {
      console.log("$rootScope.urlBackend + '/uploads'", $rootScope.urlBackend + '/uploads');
      if (response.video.status == "success") {
        message.video = response.video.url_file;
        message.thumb = response.thumb.url_file;
        message.user = {
          username: $scope.currentUser.username,
          pic: $scope.currentUser.pic
        };

        ChatService.addMessage(_.clone(message)).then(function (res) {
          $ionicLoading.hide();
          LoadingService.setPercentage(1);

          if (res.status != 200) {
            window.plugins.toast.showShortCenter("Error uploading video", function (a) {
            }, function (b) {
              alert('toast error: ' + b)
            });

            $scope.message = '';
            return;
          }

          message._id = res.data.message._id;
          message.created_at = res.data.message.created_at;
          message.justPostedImage = true;
          _renderVideoMessage(message);
        }, function (err) {
          $ionicLoading.hide();
          LoadingService.setPercentage(1);

          window.plugins.toast.showShortCenter("Error during saving message: " + err, function (a) {
          }, function (b) {
            alert('Error during saving message: ' + err);
          });
        });
      }
      else {
        $ionicLoading.hide();
        LoadingService.setPercentage(1);

        window.plugins.toast.showShortCenter("Error uploading video", function (a) {
        }, function (b) {
          alert('Error uploading video: ' + b)
        });
      }
    }).catch(function(err) {
        var errMessage;

        $ionicLoading.hide();
        LoadingService.setPercentage(1);

        if(err && err.code && err.code === 400) {
          return window.plugins.toast.showShortCenter("Sorry, you can't capture video during the call!", function (a) {
          }, function (b) {
            alert("Sorry, you can't capture video during the call!");
          });
        } else {
          if(err === 'Selection cancelled.' || err === 'no image selected') {
            return;
          }
          if(typeof err === 'object' && err.code === 3) {
            return
          }
        }

        errMessage = typeof err === 'object' ? JSON.stringify(err) : err;

        window.plugins.toast.showShortCenter("Error uploading video " + errMessage, function (a) {
        }, function (b) {
          alert('Error uploading video: ' + errMessage);
        });
      });
  };

  $scope.playVideo = function (url, e) {

    var nextElSub = e.currentTarget.nextElementSibling;
    if (!url) {
      window.plugins.toast.showShortCenter("Video resource is incorrect", function (a) {
      }, function (b) {
        alert('Video resource is incorrect');
      });
      return;
    }

    $ionicLoading.show({
      template: 'Opening video...'
    });

    if($scope.isIos) {
      if(e && e. currentTarget && e.currentTarget.nextElementSibling && typeof e.currentTarget.nextElementSibling.play === 'function') {
        navigator.device.capture.isCallInProgress(function(notInProgress){
          if(notInProgress) {
            nextElSub.play();
          } else {
            window.plugins.toast.showShortCenter("Sorry, you can't play video during the call!", function (a) {
            }, function (b) {
              $ionicLoading.hide();
              $timeout.cancel(hideLoadingTiomeout);

              alert("Sorry, you can't play video during the call!");
            });
          }
        }, function(err) {
          $ionicLoading.hide();
          $timeout.cancel(hideLoadingTiomeout);

          window.plugins.toast.showShortCenter("Sorry, you can't play video during the call!", function (a) {
          }, function (b) {
            $ionicLoading.hide();
            $timeout.cancel(hideLoadingTiomeout);

            alert("Sorry, you can't play video during the call!");
          });
        });
      } else {
        window.open(url, '_blank', 'location=no,closebuttoncaption=Close,toolbarposition=top');
      }

    } else {

  console.log('playVideo3');
    console.log('playVideo3 url', url);
    console.log('playVideo3 VideoPlayer', VideoPlayer);

   var options = {
                   successCallback: function() {
                       console.log("Video was closed without error.");
//                       alert('Video was closed')
                   },
                   errorCallback: function(errMsg) {
                       console.log("Error! ", errMsg);
//                       alert("Error! " + errMsg);
                   }
               };

//      VideoPlayer.play(url,options);
        window.plugins.streamingMedia.playVideo(url, options);
    }

    var hideLoadingTiomeout = $timeout(function () {
      $ionicLoading.hide();
    }, 2000);
  };

  $scope.getDislikeImgSrc = function(dislikes) {
    return dislikes && dislikes.length > 0 ? coloredDislike : greyDislike;
  };

  $scope.getHeartImgSrc = function(hearts) {
    return hearts && hearts.length > 0 ? coloredHeart : greyHeart;
  };

  $rootScope.isInCommentingMode = false;
  $scope.onTextAreaFocus = function (e) {
    $scope.hidePopovers();

    if (!$rootScope.isInCommentingMode) {
      $timeout(function () {
        $scope.ownScrollBottom(false);
      }, 200);
    }
    $rootScope.isInCommentingMode = true;
  };

  $scope.onContentClick = function (e) {
    if ($window.cordova
      && $window.cordova.plugins.Keyboard
    ) {
      cordova.plugins.Keyboard.close();
    }

    $scope.hidePopovers();
    $rootScope.isInCommentingMode = false;

    $ionicScrollDelegate.$getByHandle('messagesScroll').resize().then(function () { });
  };

  $scope.openImage = function (selected, event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if ($window.cordova && $window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }

    $rootScope.isInCommentingMode = false;
    $scope.selectedMessage = selected;
    $scope.isShowDetails = false;

    $ionicModal.fromTemplateUrl('templates/photo_details.html', function (modal) {
      $scope.gridModal = modal;
      $scope.gridModal.show();
    }, {
      scope: $scope,
      animation: 'none'
    });

  };

  $scope.toggleDetails = function () {
    $scope.isShowDetails = !$scope.isShowDetails;
  };

  $timeout(function () {
    $scope.$watch('isShowDetails', function (newVal) {
      $timeout(function () {
        if (newVal) {
          $scope.$broadcast('slide:show', newVal);
        } else {
          $scope.$broadcast('slide:hide', newVal);
        }
      });
    });
  });

  $scope.getAvatar = function (message) {
    if (_.isObject(message.user) && _.isString(message.user.pic) && message.user.pic.length) {
      return message.user.pic;
    } else {
      return 'img/default_avatar.jpg';
    }
  };

  $scope.escapeHTML = function (html) {
    return _.escape(html);
  };

  $scope.showDeleteContextMenu = function (event, message) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();

    $scope.currentContextMessageId = message._id;
    $scope.contextPopover.show(event);
  };

  $scope.hideDeleteContextMenu = function () {
    $scope.currentContextMessageId = null;
    $scope.contextPopover.hide();
  };

  $scope.deleteContextMessage = function () {
    $scope.contextPopover.hide();

    if (!$scope.currentContextMessageId) {
      return;
    }

    ChatService.deleteMessage($scope.currentContextMessageId, partnerId).then(function (response) {
      if (response.data.status == 'success') {
        // remove message from page
        $scope.messages = _.reject($scope.messages, function (item) {
          return item._id == $scope.currentContextMessageId;
        });

        $scope.currentContextMessageId = null;
      } else {
        if (response.data.code === 403) {
          return window.plugins.toast.showShortCenter("You have not enough permissions!", function (a) {
          }, function (b) {
            alert('You have not enough permissions!');
          });
        }

        return window.plugins.toast.showShortCenter("Error during deleting message", function (a) {
        }, function (b) {
          alert('Error during deleting message');
        });


      }
    }, function (error) {
      window.plugins.toast.showShortCenter("Error during deleting message", function (a) {
      }, function (b) {
        alert('Error during deleting message');
      });
    });

  };

  $scope.iconFilter = function (array) {
    return IconService.iconFilter($scope.currentUser, array);
  };

  $scope.setHeart = function (message, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();

    var heart = {
      type: 'chat_message',
      id: message._id,
      chat_id: chatId,
      partner_id: partnerId
    };

    IconService.setHeart(heart, $scope.currentUser, message, function (err, data) {
      if (err || data.status === 'error') {
        window.plugins.toast.showShortCenter("Error during updating message", function (a) {
        }, function (b) {
          alert('toast error: ' + b)
        });
        return console.log("like error :", err);
      }
    });

    if (message.hearts.indexOf($scope.currentUser._id) === -1) {
      message.hearts.push($scope.currentUser._id);
      _removeData(message, ['likes', 'dislikes']);
    } else {
      message.hearts.splice(_.indexOf(message.hearts, $scope.currentUser._id), 1);
    }

  };

  $scope.setDislike = function (message, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();

    var dislike = {
      type: 'chat_message',
      id: message._id,
      chat_id: chatId,
      partner_id: partnerId
    };

    IconService.setDislike(dislike, $scope.currentUser, message, function (err, data) {
      if (err || data.status === 'error') {
        window.plugins.toast.showShortCenter("Error during updating message", function (a) {
        }, function (b) {
          alert('toast error: ' + b)
        });
        return console.log("like error :", err);
      }

    });

    if (message.dislikes.indexOf($scope.currentUser._id) === -1) {
      message.dislikes.push($scope.currentUser._id);
      _removeData(message, ['likes', 'hearts']);
    } else {
      message.dislikes.splice(_.indexOf(message.dislikes, $scope.currentUser._id), 1);
    }
  };

  $scope.addMessage = function (form) {
    $scope.message = ta.value;

    if ($scope.sendingMessage || !$scope.message || $scope.message === '') return;

    $scope.sendingMessage = true;

    var message = {
      _temp_local_id: _get_random_id(),
      message: $scope.message,
      chat: chatId,
      recipientId: partnerId
    };

    message.user = {
      username: $scope.currentUser.username,
      pic: $scope.currentUser.pic
    };

    ChatService.addMessage(_.clone(message)).then(function (res) {
      var existingIndex;

      if (res && res.data.status === 'success') {
        existingIndex = _.findIndex($scope.messages, function (item) {
          return item._temp_local_id === res.data.message.tmp_local_id
        });

        if (existingIndex > -1) {
          $scope.messages[existingIndex]._id = res.data.message._id;
          $scope.messages[existingIndex].created_at = res.data.message.created_at || $scope.messages[existingIndex].created_at;
        }

      } else {
        window.plugins.toast.showShortCenter("Error sending message", function (a) {
        }, function (b) {
          alert('Error sending message');
        });
      }
    }, function (err) {
      //$scope.sendingMessage = false;
      window.plugins.toast.showShortCenter("Error sending message", function (a) {
      }, function (b) {
        alert('Error sending message');
      });
    });

    _renderMessage(message);
    adjust();
  };

  function clearScope() {
    $scope.gridModal.remove().then(function () {   //it's the most important part, do not do that in scope's destroy method if you use cached views since it might never be called !
      $scope.gridModal = null;

      $scope.messages = null;
      $scope.currentUser = null;
      $scope = null;
    });
  }

  function _renderMessage(messageData) {
    _.extend(messageData, {
      likes: [],
      dislikes: [],
      hearts: [],
      created_at: messageData.created_at || new Date().toISOString(),
      user: {
        _id: $scope.currentUser._id,
        username: $scope.currentUser.username,
        pic: $scope.currentUser.pic
      }
    });

    if($scope.messages.length >= 60) {
      $scope.messages = $scope.messages.splice(20);
    }

    $scope.messages.push(_.clone(messageData));
    $scope.sendingMessage = false;
    $scope.message = '';

    ta.value = '';
    hideSendBtn();

    $timeout(function () {
      $scope.ownScrollBottom();
    }, 100);
  }

  function _renderVideoMessage(messageData) {
    _.extend(messageData, {
      likes: [],
      dislikes: [],
      hearts: [],
      created_at: messageData.created_at || new Date().toISOString(),
      user: {
        _id: $scope.currentUser._id,
        username: $scope.currentUser.username,
        pic: $scope.currentUser.pic
      }
    });

    if($scope.messages.length >= 60) {
      $scope.messages = $scope.messages.splice(20);
    }

    $scope.messages.push(_.clone(messageData));
    $scope.sendingMessage = false;
    $scope.message = '';

    ta.value = '';
    hideSendBtn();

    $timeout(function() {
      $scope.ownScrollBottom();
    }, 400);
  }

  $scope.uploadPicture = function (source) {
    $rootScope.isInCommentingMode = false;
    $scope.hidePopovers();

    var message = {
      _temp_local_id: _get_random_id(),
      message: $scope.message,
      chat: chatId,
      recipientId: partnerId
    };

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i>'
    });

    SettingsService.fileTo({
        serverURL: $rootScope.urlBackend + '/uploads',
        aType: "POST",
        aSource: source,
        consumerScope: $scope
      }).then(function (response) {

      if (response.status == "success") {
        message.pic = response.url_file;
        message.user = {
          username: $scope.currentUser.username,
          pic: $scope.currentUser.pic
        };

        ChatService.addMessage(_.clone(message)).then(function (res) {
          $ionicLoading.hide();

          if (res.status != 200) {
            window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
            }, function (b) {
              alert('toast error: ' + b)
            });

            $scope.message = '';
            return;
          }

          message._id = res.data.message._id;
          message.created_at = res.data.message.created_at;
          message.justPostedImage = true;
          _renderMessage(message);

          setTimeout(function() {
            LoadingService.setPercentage(1);
          }, 400);

        }, function (err) {
          $ionicLoading.hide();
          setTimeout(function() {
            LoadingService.setPercentage(1);
          }, 400);
          window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
          }, function (b) {
            alert('toast error: ' + b)
          });
        });
      }
      else {
        $ionicLoading.hide();
        setTimeout(function() {
          LoadingService.setPercentage(1);
        }, 400);
        window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
        }, function (b) {
          alert('toast error: ' + b)
        });
      }
    }, function (err) {
      $ionicLoading.hide();
      setTimeout(function() {
        LoadingService.setPercentage(1);
      }, 400);
    });
  };

  $scope.goBack = function () {
    $timeout(function () {
      history.back();
    }, 20);
  };

  $scope.goTo = function(path) {
    $rootScope.isInCommentingMode = false;

    $timeout(function() {
      $location.path(path);
    }, 100);
  };

  // workaround issue which already fixed in latest ionic version
  $scope.ownScrollBottom = function (shouldAnimate) {
    var scrollView = $ionicScrollDelegate.$getByHandle('messagesScroll').getScrollView();
    $ionicScrollDelegate.$getByHandle('messagesScroll').resize().then(function () {
      var max = scrollView.getScrollMax();
      scrollView.scrollTo(max.left, max.top, !!shouldAnimate);
    });
  };

  function _removeData(message, removeData) {
    var index;
    _.each(removeData, function (arrayName) {
      if ((index = _.indexOf(message[arrayName], $scope.currentUser._id)) !== -1) {
        message[arrayName].splice(index, 1);
      }
    })
  }

  function setMessageAsRead(message, tempLocalId) {
    ChatService.setMessageAsRead(message._id, message.chat, tempLocalId, message.created_at, partnerId);
  }

  function destroyPubNub() {
    if (pubNubInstance && typeof pubNubInstance.unSubscribe === 'function') {
      pubNubInstance.unSubscribe('chat_' + chatId + '_' + authData.id);
    }
    if (pubNubInstance && typeof pubNubInstance.unSubscribe === 'function') {
      pubNubInstance.unSubscribe('chat_info_' + chatId + '_' + authData.id);
    }
  }

  function initPubNub() {
    authData = UserService.getAuthData();

    /**
     * Create PubSub instance with channel and uuid. Create additional channel for receiving info about reading/delivering messages
     * (one channel not able to receive all messages)
     */
    pubNubInstance = PubNubServiceNew.init(authData.id);
    //pubNubInfoInstance = PubNubServiceNew.init('chat_info_' + chatId + '_' + authData.id, authData.id);

    pubNubInstance.subscribeToChannel('chat_' + chatId + '_' + authData.id, function (message) {
      if (!message.type) {
        return;
      }

      if (message.type === 'message_added') {
        if (_.findWhere($scope.messages, {'_id': message.message._id})) {
          // prevent duplication
          return;
        }

        setMessageAsRead(message.message, message._temp_local_id);

        if($scope.messages.length >= 60) {
          $scope.messages = $scope.messages.splice(20);
        }

        $scope.messages.push(message.message);

        $timeout(function () {
          //$rootScope.unreadMessages = unreadMessagesCount;
          $scope.ownScrollBottom();
        }, 100);
        return;

      }

      if (message.type === 'messages_removed' && message.remover_id !== $scope.currentUser._id) {
        deleteMessage(message.message_id);
      }
    });

    pubNubInstance.subscribeToChannel('chat_info_' + chatId + '_' + authData.id, function (message) {
      if (!message.type) {
        return;
      }

      if (message.type === 'messages_read' && message.reader_id !== $scope.currentUser._id) {
        markMessagesAsRead(message.message_ids, message._temp_local_id);
        return;
      }

      if (message.type === 'all_messages_read' && message.reader_id !== $scope.currentUser._id) {
        markAllMessagesAsRead();
        return;
      }

      if (message.type === 'messages_delivered' && message.sender_id === $scope.currentUser._id) {
        markMessagesAsDelivered(message.message_ids, message.temp_local_id);
      }

      if (message.type === 'message_disliked' || message.type === 'message_hearted' || message.type === 'message_liked') {
        if (message.initiator_id == $scope.currentUser._id) {
          return;
        }
        var messageIndex = _.findIndex($scope.messages, function (c) {
          return c._id == message.message._id
        });
        if (messageIndex > -1) {
          $scope.messages[messageIndex].dislikes = message.message.dislikes;
          $scope.messages[messageIndex].hearts = message.message.hearts;

          $scope.$apply();
        }

        return;
      }

    });
  }

  function markMessagesAsRead(ids, tempLocalId) {
    var messagesIndexes = [],
      existingIndex, i;

    if (tempLocalId) {
      for (i = 0; i < ids.length; i++) {
        existingIndex = _.findIndex($scope.messages, function (item) {
          return item._id === ids[i] || item._id === tempLocalId
        });
        if (existingIndex > -1) {
          messagesIndexes.push(existingIndex);
        }
      }
    } else {
      for (i = 0; i < ids.length; i++) {
        existingIndex = _.findIndex($scope.messages, function (item) {
          return item._id === ids[i]
        });
        if (existingIndex > -1) {
          messagesIndexes.push(existingIndex);
        }
      }
    }

    if (messagesIndexes.length > 0) {
      setTimeout(function () {
        var lastReadMessageIndex = Math.max.apply(null, messagesIndexes);
          for (var i = 0; i <= lastReadMessageIndex; i++) {
            $scope.messages[i].is_read = 1;
            $scope.messages[i].is_delivered = 1;
          }

          $scope.$apply();
      }, 0);
    }
  }

  function markAllMessagesAsRead() {
    for (var i = 0; i < $scope.messages.length; i++) {
      if($scope.messages[i].user._id === $scope.currentUser._id) {
        $scope.messages[i].is_read = 1;
        $scope.messages[i].is_delivered = 1;
      }
    }
    $scope.$apply();
  }

  function markMessagesAsDelivered(ids, tempLocalId) {
    var messagesIndexes = [],
      existingIndex;

    if (tempLocalId) {
      for (var i = 0; i < ids.length; i++) {
        existingIndex = _.findIndex($scope.messages, function (item) {
          return item._id === ids[i] || item._temp_local_id === tempLocalId
        });
        if (existingIndex > -1) {
          messagesIndexes.push(existingIndex);
        }
      }
    } else {
      for (var j = 0; j < ids.length; j++) {
        existingIndex = _.findIndex($scope.messages, function (item) {
          return item._id === ids[j]
        });
        if (existingIndex > -1) {
          messagesIndexes.push(existingIndex);
        }
      }
    }

    if (messagesIndexes.length > 0) {
      setTimeout(function () {
        var lastReadMessageIndex = Math.max.apply(null, messagesIndexes);

        for (var i = 0; i <= lastReadMessageIndex; i++) {
          $scope.messages[i].is_delivered = 1;
        }
        $scope.$apply();
      }, 0);
    }
  }

  function deleteMessage(messageId) {
    $scope.$evalAsync(function () {
      $scope.messages = _.reject($scope.messages, function (item) {
        return item._id === messageId;
      });
    });

  }

  function initUser() {
    $scope.currentUser = UserService.getAuthData();
    $scope.currentUser._id = $scope.currentUser.id;
    if (!$scope.currentUser.pic) {
      UserService.getUser()
        .then(function (data) {
          $scope.currentUser = data.data.user;
        },
        function (err) {
          window.plugins.toast.showShortCenter("Error loading user data", function (a) {
          }, function (b) {
            alert('Error loading user data');
          });
        });
    }
  }

  function _get_random_id() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function showSendBtn() {
    if(cameraBtn) {
      cameraBtn.classList.add('ng-hide');
    }
    if(sendBtn) {
      sendBtn.classList.remove('ng-hide');
    }
  }

  function hideSendBtn() {
    if(sendBtn) {
      sendBtn.classList.add('ng-hide');
    }
    if(cameraBtn) {
      cameraBtn.classList.remove('ng-hide');
    }
  }

  /*

   */

  var $win = angular.element($window), forceAdjust, $mirror,sendBtn, cameraBtn, ta, adjust;

  $scope.initInputWatcher = initInputWatcher;

  function initInputWatcher() {
    // cache a reference to the DOM element
    ta = document.getElementById('comment-add-textarea');

    var $ta = angular.element(ta);

    sendBtn = document.getElementById('sendBtn');
    cameraBtn = document.getElementById('cameraBtn');

    // ensure the element is a textarea, and browser is capable
    if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
      return;
    }

    // set these properties before measuring dimensions
    $ta.css({
      'overflow': 'hidden',
      'overflow-y': 'hidden',
      'word-wrap': 'break-word'
    });

    // force text reflow
    var text = ta.value;
    ta.value = '';
    ta.value = text;

    var append = '',
      mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
        'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
        '-moz-box-sizing: content-box; box-sizing: content-box;' +
        'min-height: 0 !important; height: 0 !important; padding: 0;' +
        'word-wrap: break-word; border: 0;',
      taStyle = getComputedStyle(ta),
      resize = taStyle.getPropertyValue('resize'),
      borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
        taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
        taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
      boxOuter = !borderBox ? {width: 0, height: 0} : {
        width:  parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
        parseInt(taStyle.getPropertyValue('padding-right'), 10) +
        parseInt(taStyle.getPropertyValue('padding-left'), 10) +
        parseInt(taStyle.getPropertyValue('border-left-width'), 10),
        height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
        parseInt(taStyle.getPropertyValue('padding-top'), 10) +
        parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
        parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
      },
      minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
      heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
      minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
      maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
      mirrored,
      active,
      copyStyle = ['font-family',
        'font-size',
        'font-weight',
        'font-style',
        'letter-spacing',
        'line-height',
        'text-transform',
        'word-spacing',
        'text-indent'];

    $mirror = angular.element('<textarea aria-hidden="true" tabindex="-1" ' +
      'style="' + mirrorInitStyle + '"/>').data('elastic', true);

    var mirror = $mirror[0];

    // exit if elastic already applied (or is the mirror element)
    //if ($ta.data('elastic')) {
    //  return;
    //}

    // Opera returns max-height of -1 if not set
    maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

    // append mirror to the DOM
    if (mirror.parentNode !== document.body) {
      angular.element(document.body).append(mirror);
    }

    // set resize and apply elastic
    $ta.css({
      'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
    }).data('elastic', true);

    /*
     * methods
     */

    function initMirror() {
      var mirrorStyle = mirrorInitStyle;

      mirrored = ta;
      // copy the essential styles from the textarea to the mirror
      taStyle = getComputedStyle(ta);
      angular.forEach(copyStyle, function(val) {
        mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
      });
      mirror.setAttribute('style', mirrorStyle);
    }

    adjust = function adjust() {
      var taHeight,
        taComputedStyleWidth,
        mirrorHeight,
        width,
        overflow;

      if (mirrored !== ta) {
        initMirror();
      }

      // active flag prevents actions in function from calling adjust again
      if (!active) {
        active = true;

        if (ta.value) {
          showSendBtn();
        } else {
          hideSendBtn();
        }

        mirror.value = ta.value + append; // optional whitespace to improve animation
        mirror.style.overflowY = ta.style.overflowY;

        taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

        taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

        // ensure getComputedStyle has returned a readable 'used value' pixel width
        if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
          // update mirror width in case the textarea width has changed
          width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
          mirror.style.width = width + 'px';
        }

        mirrorHeight = mirror.scrollHeight;

        if (mirrorHeight > maxHeight) {
          mirrorHeight = maxHeight;
          overflow = 'scroll';
        } else if (mirrorHeight < minHeight) {
          mirrorHeight = minHeight;
        }
        mirrorHeight += boxOuter.height;
        ta.style.overflowY = overflow || 'hidden';

        if (taHeight !== mirrorHeight) {
          //$scope.$emit('elastic:resize', $ta, taHeight, mirrorHeight);
          ta.style.height = mirrorHeight + 'px';
        }

        // small delay to prevent an infinite loop
        setTimeout(function() {
          active = false;
        }, 1);

      }
    };

    forceAdjust = function forceAdjust() {
      active = false;
      adjust();
    };

    // listen
    if ('onpropertychange' in ta && 'oninput' in ta) {
      // IE9
      ta['oninput'] = ta.onkeyup = adjust;
    } else {
      ta['oninput'] = adjust;
    }

    $win.bind('resize', forceAdjust);

    $timeout(adjust);
  }

  $scope.$on('$destroy', function() {
    $scope.contextPopover.remove();
    $scope.cameraPopover.remove();
    $scope.uploadPopover.remove();
    $win.unbind('resize', forceAdjust);
    chatRemovedListener();
    $mirror.remove();
  });

});
