'use strict';
MyApp.controller('CommentsCtrl',
  ['$scope',
    '$q',
    '$ionicModal',
    '$timeout',
    '$ionicPopup',
    '$location',
    '$stateParams',
    '$ionicLoading',
    'SettingsService',
    '$ionicScrollDelegate',
    '$ionicPopover',
    '$rootScope',
    'CommentsService',
    'FeedService',
    'UserService',
    '$window',
    '$state',
    'IconService',
    'LoadingService',
    'PubNubServiceNew',
    '_',
    function ($scope,
              $q,
              $ionicModal,
              $timeout,
              $ionicPopup,
              $location,
              $stateParams,
              $ionicLoading,
              SettingsService,
              $ionicScrollDelegate,
              $ionicPopover,
              $rootScope,
              CommentsService,
              FeedService,
              UserService,
              $window,
              $state,
              IconService,
              LoadingService,
              PubNubServiceNew,
              _) {

      var loadingInProgress = false;

      $scope.post = {type: 'post', id: $stateParams.post_id};

      $scope.currentComment = {
        comment: '',
        pic: '',
        clear: function () {
          this.comment = '';
          this.pic = '';

          delete this.video;
          delete this.thumb;

          ta.value = '';
          hideSendBtn();
        }
      };

      $scope.isIos = ionic.Platform.isIOS();

      $scope.comments = [];

      var pubNubInstance;

      if ($stateParams.triby && $stateParams.triby.name) {
        $scope.title = $stateParams.triby.name + ' ';
      }

      $scope.currentUser = UserService.getAuthData();

      if ($scope.currentUser && !$scope.currentUser._id && $scope.currentUser.id) {
        $scope.currentUser._id = $scope.currentUser.id;
      }

      if (!$scope.currentUser.pic) {
        UserService.getUser().then(function (data) {
          $scope.currentUser = data.data.user;
        });
      }

      $scope.$on('$ionicView.enter', function () {
        initPubNub();
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.disableScroll(true);
        }
      });

      $scope.$on('$ionicView.leave', function () {
        destroyPubNub();
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.close();
        }
      });

      var removedMemberListener = $rootScope.$on('removed_from_tribe', function(message, messageData) {
        console.log('removed_from_tribe: comCtrl', arguments);

        if(messageData.tribeId !== $stateParams.triby._id) return;

        window.plugins.toast.showShortCenter("You have been removed from this group", function (a) {
        }, function (b) {
          alert('You have been removed from this group');
        });

        $scope.comments.length = 0;
        $state.go('app.main.home');
      });
      //if ($stateParams.comment_id) {
      //  $scope.$on('$ionicView.afterEnter', function () {
      //    initInputWatcher();
          //$location.hash('comment_' + $stateParams.comment_id);
          //$ionicScrollDelegate.$getByHandle('commentsScroll').anchorScroll();
          //$scope.ownScrollBottom();
        //});
      //}

      $scope.isMoreLoadingAllowed = true;
      $scope.isFirstLoadingDone = false;

      $scope.contextPopover = $ionicPopover.fromTemplate(
        '<ion-popover-view style="height: 121px;"><ion-content scroll="false"><div class="list">' +
        '<a class="item" ng-click="deleteContextComment()" style="color:red;text-align:center;">Take it back!</a>' +
        '<a class="item" ng-click="hideDeleteContextMenu()" style="text-align:center;">Cancel</a>' +
        '</div></ion-content></ion-popover-view>',
        {
          scope: $scope
        });

      $ionicModal.fromTemplateUrl('templates/photo_details.html', function (modal) {
        $scope.gridModal = modal;
      }, {
        scope: $scope,
        animation: 'none'
      });

      $scope.loadMoreComments = function (isFirstLoading) {
        var deferred = $q.defer();

        if(!loadingInProgress) {
          loadingInProgress = true;

          CommentsService.getComments($stateParams.post_id, {'skip': $scope.comments.length}).then(function (response) {

            if (!response || !response.data || !response.data.comments || response.data.comments.length == 0) {
              $scope.isMoreLoadingAllowed = false;

              //setLastSeenPost(response.data.count, $stateParams.post_id);
              deferred.resolve(response);
              return;
            }

            //setLastSeenPost(response.data.count, $stateParams.post_id);

            if(isFirstLoading) {
              for(var i = response.data.comments.length - 1; i > -1; i--) {
                  if(response.data.comments[i].pic) {
                    response.data.comments[i].justPostedImage = true;
                  }
              }

              $scope.comments = response.data.comments;
            } else {
              _.each(response.data.comments, function (comment) {
                $scope.comments.push(comment);
              });
            }

            if (isFirstLoading) {
              $timeout(function () {
                $ionicScrollDelegate.$getByHandle('commentsScroll').scrollBottom();
              }, 50);
            } else {
              $scope.$broadcast('scroll.refreshComplete');
            }

            loadingInProgress = false;
            deferred.resolve(response);
          }, function(err) {
            loadingInProgress = false;
            deferred.reject("Can't load comments!");
          });

          if (isFirstLoading) {
            $ionicLoading.show({
              template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
            });
          }
        } else {
          $timeout(function () {
            deferred.reject("Loading is in progress now!");
          }, 50);
        }

        return deferred.promise;
      };

      function clearScope() {
        $scope.gridModal.remove().then(function () {   //it's the most important part, do not do that in scope's destroy method if you use cached views since it might never be called !
          $scope.gridModal = null;

          $scope.comments = null;
          $scope.currentUser = null;

          $scope = null;
        });
      }

      function destroyPubNub() {
        pubNubInstance.unSubscribe('post_' + $stateParams.post_id);
        pubNubInstance.unSubscribe('post1_' + $stateParams.post_id);
        pubNubInstance.unSubscribe('post_info_' + $stateParams.post_id);
      }

      function initPubNub() {
        var authData = UserService.getAuthData();
        var receivedComentsIds = [];

        pubNubInstance = PubNubServiceNew.init(authData.id);

        pubNubInstance.subscribeToChannel('post_' + $stateParams.post_id, messageHandler);
        pubNubInstance.subscribeToChannel('post1_' + $stateParams.post_id, messageHandler);

        function messageHandler(message) {
          if (!message.type || $state.current.name !== "app.comments") {
            return;
          }

          switch (message.type) {
            case 'comment_added':
              if (_.findWhere($scope.comments, {'_id': message.comment._id}) || !message.comment._id ) {
                // prevent duplication
                break;
                return;
              }

              //additional check if we have such comment (because looks like sometime $scope.comments not updates in real time?)
              if(receivedComentsIds.indexOf(message.comment._id) !== -1) {
                break;
                return;
              } else {
                receivedComentsIds.push(message.comment._id);
              }

              var existingIndex = _.findIndex($scope.comments, function (item) {
                return item._temp_local_id === message._temp_local_id
              });
              if (existingIndex > -1) {
                if (message.comment.pic) message.comment.justPostedImage = true;
                $scope.comments[existingIndex] = message.comment;

                $scope.$apply();
                break;
              }

              //FeedService.incrementLastSeenPostCommentsCount();

              //if($scope.comments.length >= 60) {
              //  $scope.comments = $scope.comments.splice(10);
              //}

              $scope.comments.push(message.comment);

              CommentsService.setCommentAsRead(message.comment._id);

              $timeout(function () {
                $scope.ownScrollBottom();
              }, 100);
              break;

            case 'comment_removed':
              if (message.remover_id !== $scope.currentUser._id) {
                deleteComment(message.comment_id);
              }
              break;

            case 'post_removed':
              window.plugins.toast.showShortCenter("Post was removed", function (a) {
              }, function (b) {
                alert('Post was removed');
              });

              $scope.comments = [];
              $rootScope.isInCommentingMode = false;
              $state.go('app.news_feed', {triby_id: $stateParams.triby._id});
              receivedComentsIds.length = 0;

              break;
          }
        }

        pubNubInstance.subscribeToChannel('post_info_' + $stateParams.post_id, function (message) {
          if (!message.type) {
            return;
          }

          switch (message.type) {
            case 'comment_liked':
            case 'comment_disliked':
            case 'comment_hearted':
              if (message.initiator_id == $scope.currentUser._id) {
                break;
              }
              var commentIndex = _.findIndex($scope.comments, function (c) {
                return c._id == message.comment._id
              });
              if (commentIndex > -1) {
                $scope.comments[commentIndex].dislikes = message.comment.dislikes;
                $scope.comments[commentIndex].hearts = message.comment.hearts;

                $scope.$apply();
              }
              break;
          }
        });
      }

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

      $scope.showCameraPopover = function ($event, postId) {
        $rootScope.isInCommentingMode = false;
        $scope.cameraPopover.show($event);
      };

      $scope.showUploadPopover = function ($event, postId) {
        $rootScope.isInCommentingMode = false;
        $scope.uploadPopover.show($event);
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

      $scope.playVideo = function (url, e) {
        console.log('playVideo1');
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
//          VideoPlayer.play(url);
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

      $rootScope.isInCommentingMode = false;

      $scope.onContentClick = function (e) {
        if ($window.cordova
          && $window.cordova.plugins.Keyboard
        ) {
          cordova.plugins.Keyboard.close();
        }

        $scope.hidePopovers();
        $rootScope.isInCommentingMode = false;

        $ionicScrollDelegate.$getByHandle('commentsScroll').resize().then(function () {});
      };

      $scope.onTextAreaFocus = function (e) {
        $scope.hidePopovers();
        $rootScope.isInCommentingMode = true;
      };

      // workaround issue which already fixed in latest ionic version
      $scope.ownScrollBottom = function (shouldAnimate) {
        var scrollView = $ionicScrollDelegate.$getByHandle('commentsScroll').getScrollView();
        if(scrollView) {
          $ionicScrollDelegate.$getByHandle('commentsScroll').resize().then(function () {
            var max = scrollView.getScrollMax();
            scrollView.scrollTo(max.left, max.top, !!shouldAnimate);
          });
        }
      };

      $scope.showDeleteContextMenu = function (event, comment) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();

        $scope.currentContextCommentId = comment._id;
        $scope.contextPopover.show(event);
      };

      $scope.hideDeleteContextMenu = function () {
        $scope.currentContextCommentId = null;
        $scope.contextPopover.hide();
      };

      $scope.deleteContextComment = function () {
        $scope.contextPopover.hide();

        if (!$scope.currentContextCommentId) {
          return;
        }

        CommentsService.deleteComment($scope.currentContextCommentId).then(function (response) {
          if (response.data.status == 'success') {
            // remove commnt from page
            $scope.comments = _.reject($scope.comments, function (item) {
              return item._id == $scope.currentContextCommentId;
            });

            $scope.currentContextCommentId = null;
          } else {
            if (response.data.code === 403) {
              return window.plugins.toast.showShortCenter("You have not enough permissions!", function (a) {
              }, function (b) {
                alert('You have not enough permissions!');
              });
            }

            return window.plugins.toast.showShortCenter("Error during deleting comment", function (a) {
            }, function (b) {
              alert('Error during deleting comment');
            });


          }
        }, function (error) {
          window.plugins.toast.showShortCenter("Error during deleting comment", function (a) {
          }, function (b) {
            alert('Error during deleting comment');
          });
        });


      };

      $scope.iconFilter = function (array) {
        return IconService.iconFilter($scope.currentUser, array);
      };

      //function setLastSeenPost(commentsCount, id) {
      //  FeedService.setLastSeenPost({
      //    _id: id,
      //    commentsCount: commentsCount
      //  });
      //}

      //function incrementLastSeenPostCommentsCount() {
      //  FeedService.incrementLastSeenPostCommentsCount();
      //}

      function setLike(comment) {
        if (comment.likes.indexOf($scope.currentUser._id) === -1) {
          comment.likes.push($scope.currentUser._id);
          _removeData(comment, ['hearts', 'dislikes']);

          FeedService.addLike({type: 'postComments', comment_id: comment._id});
        } else {
          comment.likes.splice(_.indexOf(comment.likes, $scope.currentUser._id), 1);

          FeedService.removeLike({type: 'postComments', comment_id: comment._id});
        }
      }

      function setHeart(comment, event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();

        if (comment.hearts.indexOf($scope.currentUser._id) === -1) {
          comment.hearts.push($scope.currentUser._id);
          _removeData(comment, ['likes', 'dislikes']);

          FeedService.addHeart({type: 'postComments', comment_id: comment._id});
        } else {
          comment.hearts.splice(_.indexOf(comment.hearts, $scope.currentUser._id), 1);

          FeedService.removeHeart({type: 'postComments', comment_id: comment._id});
        }
      }

      function setDislike(comment, event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();

        if (comment.dislikes.indexOf($scope.currentUser._id) === -1) {
          comment.dislikes.push($scope.currentUser._id);
          _removeData(comment, ['likes', 'hearts']);

          FeedService.addDislike({type: 'postComments', comment_id: comment._id});
        } else {
          comment.dislikes.splice(_.indexOf(comment.dislikes, $scope.currentUser._id), 1);

          FeedService.removeDislike({type: 'postComments', comment_id: comment._id});
        }
      }

      function _removeData(comment, removeData) {
        var index;
        _.each(removeData, function (arrayName) {
          if ((index = _.indexOf(comment[arrayName], $scope.currentUser._id)) !== -1) {
            comment[arrayName].splice(index, 1);
          }
        })
      }

      /////////////////// add Comment /////////////////////////
      function addComment(isPicture) {

       $scope.currentComment.comment = ta.value;

        var commentData = {
          _temp_local_id: _get_random_id(),
          comment: $scope.currentComment.comment,
          pic: $scope.currentComment.pic,
          thumb: $scope.currentComment.thumb,
          video: $scope.currentComment.video,
          user: $scope.currentUser,
          post: $scope.post.id,
          tribe: $stateParams.triby._id
        };


        CommentsService.addComment(commentData).then(function(res){
          if (res && res.data.status === 'success') {
            var existingIndex = _.findIndex($scope.comments, function (item) {
              return item._temp_local_id === res.data.comment.tmp_local_id
            });

            if (existingIndex > -1) {
              $scope.comments[existingIndex]._id = res.data.comment._id;
              $scope.comments[existingIndex].datetime = res.data.comment.datetime || $scope.comments[existingIndex].datetime;
              $scope.$apply();
            }

          } else {
            window.plugins.toast.showShortCenter("Error sending comment", function (a) {
            }, function (b) {
              alert('Error sending comment');
            });
          }
        },function(error){
          console.error('error add comment', error);
        });

        if (isPicture) commentData.justPostedImage = true; // ?????

        _renderComment(_.clone(commentData));

        $scope.currentComment.clear();

        adjust();
      }

      function _renderComment(commentData) {

        _.extend(commentData, {
          datetime: new Date().toISOString(),
          likes: [],
          dislikes: [],
          hearts: [],
          user: {
            _id: $scope.currentUser._id,
            username: $scope.currentUser.username,
            pic: $scope.currentUser.pic
          }
        });

        //if($scope.comments.length >=60) {
        //  $scope.comments = $scope.comments.splice(10);
        //}

        $scope.comments.push(commentData);

        $scope.ownScrollBottom();
      }

      function deleteComment(commentId) {
        //FeedService.decrementLastSeenPostCommentsCount();

        $scope.$evalAsync(function () {
          $scope.comments = _.reject($scope.comments, function (item) {
            return item._id === commentId;
          });
        });
      }

      function goBack() {
        $rootScope.isInCommentingMode = false;
        $state.go('app.news_feed', {triby_id: $stateParams.triby._id});
      }

      function getAvatar(comment) {
        if ($scope.currentUser
          && comment.user && comment.user._id == $scope.currentUser._id
          && $scope.currentUser.pic) {
          // render own avatar from currentUser object
          return $scope.currentUser.pic;
        }

        if (_.isObject(comment.user) && _.isString(comment.user.pic)) {
          return comment.user.pic;
        } else {
          return 'img/default_avatar.jpg';
        }
      }

      /////////////////// upload Picture /////////////////////////
      function uploadPicture(source) {
        $scope.hidePopovers();
        $rootScope.isInCommentingMode = false;

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
            $scope.currentComment.pic = response.url_file;

            addComment(true);
            $ionicLoading.hide();

            setTimeout(function() {
              LoadingService.setPercentage(1);
            }, 400);
          } else {
            $ionicLoading.hide();

            setTimeout(function() {
              LoadingService.setPercentage(1);
            }, 400);

            window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
              console.log('toast success: ' + a)
            }, function (b) {
              alert('toast error: ' + b)
            });
          }
        }).catch(function () {
          $ionicLoading.hide();

          setTimeout(function() {
            LoadingService.setPercentage(1);
          }, 400);
        });
      }

      function uploadVideo(source) {
        $scope.hidePopovers();
        $ionicLoading.show({
          template: '<p>Uploading...</p> ' +
          '<tek-progress-bar ng-model="progressBar.val" ></tek-progress-bar>'
        });

        SettingsService.videoTo($rootScope.urlBackend + '/uploads', "POST", source).then(function (result) {
          if (result.video.status == "success") {

            $scope.currentComment.video = result.video.url_file;
            $scope.currentComment.thumb = result.thumb.url_file;

            addComment(true);
            $ionicLoading.hide();
            LoadingService.setPercentage(1);

            $timeout(function() {
              $scope.ownScrollBottom();
            }, 400);
          } else {
            $ionicLoading.hide();
            LoadingService.setPercentage(1);
            window.plugins.toast.showShortCenter("Error uploading video", function (a) {
              console.log('toast success: ' + a)
            }, function (b) {
              alert('Error uploading video');
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
      }

      $scope.loadMoreComments(true).then(function (response) {
        $ionicLoading.hide();

        if (!_.isUndefined($stateParams.triby) && !_.isUndefined($stateParams.triby.name)) {
          $scope.title = $stateParams.triby.name + ' ';
        }
        $scope.isFirstLoadingDone = true;
      }).catch(function (err) {
        console.error('loadMoreComments(true) err: ', err);
        $ionicLoading.hide();
      });

      $scope.escapeHTML = function (html) {
        return _.escape(html);
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
        $scope.selectedMessage.created_at = selected.datetime;
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

      $scope.closeModal = function () {
        $scope.gridModal.hide();
        $scope.gridModal.remove();
      };

      $scope.closeSocialModal = function closeSocial() {
        $scope.socialModal.hide();
        $scope.socialModal.remove();
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

      $scope.showHearts = function (comment) {
        if(comment.hearts.length === 0) {
          return;
        }

        $ionicLoading.show({
          template: 'Getting users'
        });

        CommentsService.getCommentHeartedUsers(comment._id)
          .then(function(response) {
            if(response && response.data && response.data.status == 'success') {
              $scope.socialPostUsers = response.data.users;
              $scope.socialPostScreenTitle = 'Hearts';

              openSocialScreen();

            } else {
              window.plugins.toast.showShortCenter("Error loading hearted users!", function (a) {
                console.log('toast success: ' + a)
              }, function (b) {
                alert('Error loading hearted users!');
              });
            }

            $ionicLoading.hide();

          }, function(err) {
            $ionicLoading.hide();
            window.plugins.toast.showShortCenter("Error loading hearted users!", function (a) {
              console.log('toast success: ' + a)
            }, function (b) {
              alert('Error loading hearted users!');
            });
          });
      };

      $scope.showDislikes = function (comment) {
        if(comment.dislikes.length === 0) {
          return;
        }

        $ionicLoading.show({
          template: 'Getting users'
        });

        CommentsService.getCommentDislikedUsers(comment._id)
          .then(function(response) {
            if(response && response.data && response.data.status == 'success') {
              $scope.socialPostUsers = response.data.users;
              $scope.socialPostScreenTitle = 'Dislikes';

              openSocialScreen();

            } else {
              window.plugins.toast.showShortCenter("Error loading disliked users!", function (a) {
                console.log('toast success: ' + a)
              }, function (b) {
                alert('Error loading disliked users!');
              });
            }

            $ionicLoading.hide();

          }, function(err) {
            $ionicLoading.hide();
            window.plugins.toast.showShortCenter("Error loading disliked users!", function (a) {
              console.log('toast success: ' + a)
            }, function (b) {
              alert('Error loading disliked users!');
            });
          });
      };

      function openSocialScreen() {
        $ionicModal.fromTemplateUrl('templates/social_modal.html', function(modal) {
          $scope.socialModal = modal;
          $scope.socialModal.show();
        }, {
          scope: $scope,
          animation: 'none'
        });
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

      /*

       */

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

      var $win = angular.element($window), forceAdjust, $mirror,sendBtn, cameraBtn, ta, adjust;

      function initInputWatcher() {
        ta = null;
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
        removedMemberListener();
        $mirror.remove();
        $win.unbind('resize', forceAdjust);
      });

      /**
       * Import to $scope
       */
      $scope.setLike = setLike;
      $scope.setHeart = setHeart;
      $scope.setDislike = setDislike;
      $scope.addComment = addComment;
      $scope.uploadPicture = uploadPicture;
      $scope.uploadVideo   = uploadVideo;
      $scope.goBack = goBack;
      $scope.getAvatar = getAvatar;
      $scope.initInputWatcher = initInputWatcher;

    }]);
