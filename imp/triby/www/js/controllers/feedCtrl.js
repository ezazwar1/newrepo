MyApp.controller('FeedCtrl', [
  '$q',
  '$scope',
  '$ionicModal',
  '$timeout',
  '$ionicPopup',
  '$ionicPopover',
  '$ionicScrollDelegate',
  '$location',
  '$stateParams',
  'SettingsService',
  '$rootScope',
  '$parse',
  '$sce',
  'triby',
  'FeedService',
  '$window',
  '$state',
  'UserService',
  'IconService',
  '$ionicLoading',
  '$filter',
  'LoadingService',
  'PubNubServiceNew',
  '_',
  function($q,
           $scope,
           $ionicModal,
           $timeout,
           $ionicPopup,
           $ionicPopover,
           $ionicScrollDelegate,
           $location,
           $stateParams,
           SettingsService,
           $rootScope,
           $parse,
           $sce,
           triby,
           FeedService,
           $window,
           $state,
           UserService,
           IconService,
           $ionicLoading,
           $filter,
           LoadingService,
           PubNubServiceNew,
           _) {

  try {
    cordova.plugins.Keyboard.disableScroll(true);
  } catch(err) {}

  var loadingInProgress = false,
    coloredHeart = 'img/heart.png',
    greyHeart = 'img/heart-grey.png',
    coloredDislike = 'img/hand-down.png',
    greyDislike = 'img/hand-down-grey.png',
    coloredComments = 'img/comments.png',
    greyComments = 'img/comments-grey.png';

  $scope.modalImage = {};
  $scope.gridModal = {};

  if (!$stateParams.post_id) {
    for(var i = triby.data.tribe.posts.length - 1; i > -1; i--) {
      if(triby.data.tribe.posts[i].pic || triby.data.tribe.posts[i].thumb) {
        triby.data.tribe.posts[i].justPostedImage = true;
      }
    }
  }

  if($stateParams.post_id) {
    $scope.isMoreLoadingAllowed = false;
    var isMoreLoadingAllowed = false;
  } else {
    $scope.isMoreLoadingAllowed = true;
    isMoreLoadingAllowed = true;
  }

  $scope.triby = triby.data.tribe;
  $scope.post = {
    message: "",
    image: "",
    triby: $stateParams.triby_id,
    pic: '',
    thumb: ''
  };

  $scope.isIos = ionic.Platform.isIOS();

  if (window.StatusBar) {
    StatusBar.overlaysWebView(true);
  }

  $scope.input = {
    showPostInput: false
  };

  var removedMemberListener = $rootScope.$on('removed_from_tribe', function(message, messageData) {
    console.log('removed_from_tribe: FEEDCTRL ', arguments);

    if(messageData.tribeId !== $stateParams.triby_id) return;

    $scope.tribe.posts.length = 0;
    $scope.tribe.posts = [];

    window.plugins.toast.showShortCenter("You have been removed from this group", function (a) {
    }, function (b) {
      alert('You have been removed from this group');
    });

    $state.go('app.main.home');
  });

  $timeout(function() {
    var footer = document.getElementById('feedFooter');
    var content = document.getElementById('feedContent');

    if(footer && content) {
      footer.style.bottom = 0;
    }

    if ($stateParams.post_id) {
      $location.hash('post_' + $stateParams.post_id);
      $ionicScrollDelegate.$getByHandle('scroll').anchorScroll();
    } else {
      $ionicScrollDelegate.$getByHandle('scroll').scrollBottom();
    }

    $ionicLoading.hide();
  }, 250);

  $scope.getTribyName = function() {
    return  $scope.triby.name;
  };

  FeedService.setNewTriby({
    _id: $scope.triby._id,
    members: $scope.triby.members
  });

  var pubNubInstance,
    currentAuthData = UserService.getAuthData();

  $scope.addPeople = function() {
    $state.go("app.add_members", {chatName: triby.name});

    $ionicLoading.show({
      template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
    });
  };

  $scope.currentAuthData = UserService.getAuthData();
  $scope.currentContextPostId = null;

  $scope.loadMorePosts = function(isFirstLoading) {
    var deferred = $q.defer();

    if(!loadingInProgress && isMoreLoadingAllowed) {
      loadingInProgress = true;

      FeedService.getTribyPosts($stateParams.triby_id, {'skip':$scope.triby.posts.length}).then(function(response){

        if (!response.data || !response.data.posts || response.data.posts.length == 0) {
          disableRefresher();
        }
        _.each(response.data.posts, function (post) {
          var existPostIndex =  _.findIndex($scope.triby.posts, function (item) {
            return item._id === post._id
          });
          if(existPostIndex === -1) {
            $scope.triby.posts.push(post);
          }
        });

        $scope.$broadcast('scroll.refreshComplete');

        loadingInProgress = false;
        deferred.resolve(response);
      }, function(err) {
        disableRefresher();
        $scope.$broadcast('scroll.refreshComplete');
        loadingInProgress = false;
        deferred.resolve(err);
      });
    } else {
      $timeout(function() {
        deferred.resolve('Loading is in progress now!');
        $scope.$broadcast('scroll.refreshComplete');
      }, 5);
    }

    return deferred.promise;
  };

  $scope.loadNewPosts = function() {
    var deferred = $q.defer();

    if(!loadingInProgress) {
      $ionicLoading.show({
        template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
      });

      loadingInProgress = true;

      FeedService.getTribyPosts($stateParams.triby_id, {'onlyNew': true}).then(function(response){

        var feedBox = document.getElementById('feedBox');
        if(feedBox && feedBox.classList.contains('show-load-button')) {
          feedBox.classList.remove('show-load-button');
        }

        var loadNewPosts = document.getElementById('loadNewPosts');
        if(loadNewPosts && !loadNewPosts.classList.contains('ng-hide')) {
          loadNewPosts.classList.add('ng-hide');
        }

        loadingInProgress = false;

        if (!response.data || !response.data.posts || response.data.posts.length == 0) {
          $ionicLoading.hide();

          return;
        }

        if($stateParams.post_id) {
          $scope.triby.posts = response.data.posts;
          $stateParams.post_id = false;

          if(response.data.posts && response.data.posts.length > 9) {
            $scope.isMoreLoadingAllowed = true;
            isMoreLoadingAllowed = true;
          }

        } else {
          _.each(response.data.posts, function (post) {
            var existingIndex = _.findIndex($scope.triby.posts, function (item) {
              return item._id === post._id
            });

            if(existingIndex === -1) {
              post.justPostedImage = true;
              $scope.triby.posts.push(post);
            }
          });
        }

        $timeout(function() {
          $ionicScrollDelegate.$getByHandle('scroll').scrollBottom();
          $ionicLoading.hide();
        }, 200);

        deferred.resolve(response);
      }, function(err) {
        loadingInProgress = false;

        //todo remove this after testing
        window.plugins.toast.showShortCenter(err, function (a) {
        }, function (b) {
          alert("Can't load newposts!");
        });

        $ionicLoading.hide();

        deferred.resolve(err);
      });
    } else {
      $timeout(function() {
        deferred.resolve('Loading is in progress now!');
      }, 5);
    }

    return deferred.promise;
  };

  $scope.contextPopover = $ionicPopover.fromTemplate(
    '<ion-popover-view style="height: 121px;"><ion-content scroll="false"><div class="list">' +
    '<a class="item" ng-click="deleteContextPost()" style="color:red;text-align:center;">Take it back!</a>' +
    '<a class="item" ng-click="hidePostContextMenu()" style="text-align:center;">Cancel</a>' +
    '</div></ion-content></ion-popover-view>',
    {
      scope: $scope
    });

  $scope.mediaPopover = $ionicPopover.fromTemplate(
    '<ion-popover-view style="height: 223px;"><ion-content scroll="false"><div class="list">' +
    '<a class="item" ng-click="uploadPicture(\'CAMERA\')" style="text-align:center;">Take Photo</a>' +
    '<a class="item" ng-click="uploadPicture(\'LIBRARY\')" style="text-align:center;">Photo Library</a>' +
    '<a class="item" ng-click="uploadVideo(\'CAMERA\')" style="text-align:center;">Take Video</a>' +
    '<a class="item" ng-click="hideMediaPopover()" style="color:red;text-align:center;">Cancel</a>' +
    '</div></ion-content></ion-popover-view>',
    {
      scope: $scope
    });

  $scope.showPostContextMenu = function ($event, postId) {

    var post = _.findWhere($scope.triby.posts, {'_id':postId});

    // only post author or group admin can remove post
    if (post.createdBy._id == currentAuthData.id
      || $scope.triby.admin_users.indexOf(currentAuthData.id) > -1
    ) {
      $scope.currentContextPostId = postId;
      $scope.contextPopover.show($event);
    }
  };
  $scope.hidePostContextMenu = function () {
    $scope.currentContextPostId = null;
    $scope.contextPopover.hide();
  };

  $scope.deleteContextPost = function () {

    $scope.contextPopover.hide();

    if (!$scope.currentContextPostId) {
      return;
    }

    FeedService.deletePost($scope.currentContextPostId).then(function (response) {
      if (response.status=='success') {

        // remove post from page
        $scope.triby.posts = _.reject($scope.triby.posts, function(item) {
          return item._id == $scope.currentContextPostId;
        });

        $scope.currentContextPostId = null;
      }
    },function (error) {
      console.log(error);
    });

  };

  //$ionicModal.fromTemplateUrl('templates/mural_details.html', function(modal) {
  //    $scope.gridModal = modal;
  //  }, {
  //  scope: $scope,
  //  animation: 'none'
  //});

  $scope.playVideo = function (url, e) {
    console.log('playVideo!!!!');
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
//      VideoPlayer.play(url);
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

  $scope.openModal = function(selected) {
    $scope.post = selected;
    $scope.isShowDetails = false;

    $scope.goComment = function(post, triby){
      $scope.gridModal.hide();
      $scope.gridModal.remove().then(function () {
        $scope.gridModal = {};
      });
      $state.go("app.comments",{post_id: post._id, triby: {name: $scope.triby.name, _id: $scope.triby._id}});
    };

    /////////////////// get Current User /////////////////////
    $scope.currentUser = UserService.getAuthData();
    $scope.currentUser._id =  $scope.currentUser.id;
    /////////////////// get Current User /////////////////////
    /////////////////// icon Filter /////////////////////////
    $scope.iconFilter = function(array){
      return IconService.iconFilter($scope.currentUser, array);
    };
    /////////////////// icon Filter /////////////////////////

    /////////////////// get All Currrnt Triby Post /////////////////////////
    $scope.getPost = function(){
      FeedService.getPost($scope.post._id).then(function(response){
        $scope.post = response.data.post;
      });
    };
    /////////////////// get All Current Triby Post /////////////////////////

    $scope.toggleDetails = function() {
      $scope.isShowDetails = !$scope.isShowDetails;
    };

    $timeout(function() {

      $scope.$watch('isShowDetails', function(newVal) {
        $timeout(function() {
          if (newVal) {
            $scope.$broadcast('slide:show', newVal);
          } else {
            $scope.$broadcast('slide:hide', newVal);
          }
        });
      });
    });

    $ionicModal.fromTemplateUrl('templates/mural_details.html', function(modal) {
      $scope.gridModal = modal;
      $scope.gridModal.show();
    }, {
      scope: $scope,
      animation: 'none'
    });
  };

  $scope.closeModal = function() {
    $scope.gridModal.hide();

    $scope.gridModal.remove().then(function () {   //it's the most important part, do not do that in scope's destroy method if you use cached views since it might never be called !
      $scope.gridModal = {};
    });
  };

  $scope.showHearts = function (post) {
    if(post.hearts.length === 0) {
      return;
    }

    $ionicLoading.show({
      template: 'Getting users'
    });

    FeedService.getPostHeartedUsers(post._id)
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

  $scope.showDislikes = function (post) {
    if(post.dislikes.length === 0) {
      return;
    }

    $ionicLoading.show({
      template: 'Getting users'
    });

    FeedService.getPostDislikedUsers(post._id)
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

  $scope.closeSocialModal = function closeSocial() {
    $scope.socialModal.hide();
    $scope.socialModal.remove();
  };

  $scope.showMediaPopover = function ($event) {
    $scope.mediaPopover.show($event);
  };

  $scope.hideMediaPopover = function () {
    $scope.mediaPopover.hide();
  };

  $scope.getImgSrc = function(post) {
    return post.comments_count && post.unreadComments && post.unreadComments > 0 ? coloredComments : greyComments;
  };

  $scope.getDislikeImgSrc = function(dislikes) {
    return dislikes && dislikes.length > 0 ? coloredDislike : greyDislike;
  };

  $scope.getHeartImgSrc = function(hearts) {
    return hearts && hearts.length > 0 ? coloredHeart : greyHeart;
  };

  /////////////////// get Current User /////////////////////
  $scope.currentUser = UserService.getAuthData();
  $scope.currentUser._id = $scope.currentUser.id;
  /////////////////// get Current User /////////////////////

  /////////////////// icon Filter /////////////////////////
  $scope.iconFilter = function(array){
    return IconService.iconFilter($scope.currentUser, array);
  };
  /////////////////// icon Filter /////////////////////////

  function _updateExistingPost (newPost) {
    _.each($scope.triby.posts, function (existingPost, index) {
      if (existingPost._id == newPost._id) {
        $scope.triby.posts[index].dislikes = newPost.dislikes;
        $scope.triby.posts[index].hearts = newPost.hearts;

        _showPostHeartsChanges($scope.triby.posts[index]);
        _showPostDislikesChanges($scope.triby.posts[index]);
        return;
      }
    });
  }

  /**
   * set like to triby
   * @private
   */
  function _setLike(post) {
    var data = {
      type: 'post',
      id: post._id
    };

    IconService.setLike(data, $scope.currentUser, post, function(err, response){
      if(err) console.log("like error :", err);
      else _updateExistingPost(response.data.post);
    });

    if (post.likes.indexOf($scope.currentUser._id) === -1) {
      post.likes.push($scope.currentUser._id);
      post.hearts.splice(_.indexOf(post.hearts, $scope.currentUser._id), 1);
      post.dislikes.splice(_.indexOf(post.dislikes, $scope.currentUser._id), 1);
    } else {
      post.likes.splice(_.indexOf(post.likes, $scope.currentUser._id), 1);
    }
    _updateExistingPost(post);
  }

  /**
   * set heart to triby
   * @param post
   * @param isFromModal
   * @private
   */
  function _setHeart(post, isFromModal) {
    var data = {
      type: 'post',
      id: post._id
    };
    var userDislikeIndex = null,
      userHeartIndex;

    IconService.setHeart(data, $scope.currentUser, post, function(err, response){
      if(err) console.log("like error :", err);
      //else _updateExistingPost(response.data.post);
    });

    userHeartIndex = post.hearts.indexOf($scope.currentUser._id);
    if (userHeartIndex === -1) {
      userDislikeIndex = _.indexOf(post.dislikes, $scope.currentUser._id);
      post.hearts.push($scope.currentUser._id);

      if(userDislikeIndex > -1)  post.dislikes.splice(userDislikeIndex, 1);
    } else {
      post.hearts.splice(userHeartIndex, 1);
    }

    _showPostHeartsChanges(post);
    _showPostDislikesChanges(post);

    if(isFromModal) {
      _showModalPostDislikesChanges(post);
      _showModalPostHeartsChanges(post);
    }
  }

  /**
   * set dislike to triby
   * @param post
   * @param isFromModal
   * @private
   */
  function _setDislike(post, isFromModal) {
    var data = {
      type: 'post',
      id: post._id
    };
    var userHeartIndex,
      userDislikeIndex;

    IconService.setDislike(data, $scope.currentUser, post, function(err, response){
      if(err) console.log("like error :", err);
      //else _updateExistingPost(response.data.post);
    });

    userDislikeIndex = post.dislikes.indexOf($scope.currentUser._id);
    if (userDislikeIndex === -1) {
      userHeartIndex = _.indexOf(post.hearts, $scope.currentUser._id);

      if(userHeartIndex > -1) post.hearts.splice(userDislikeIndex, 1);

      post.dislikes.push($scope.currentUser._id);
    } else {
      post.dislikes.splice(userDislikeIndex, 1);
    }

    _showPostDislikesChanges(post);
    _showPostHeartsChanges(post);

    if(isFromModal) {
      _showModalPostDislikesChanges(post);
      _showModalPostHeartsChanges(post);
    }
  }

  function resetPost(options) {
    if(options && options.fromModal) {
      document.body.classList.remove('modal-img');
    }
    if ($window.cordova
      && $window.cordova.plugins.Keyboard
    ) {
      cordova.plugins.Keyboard.close();
    }

    $scope.post = {
      message: "",
      image: "",
      triby: $stateParams.triby_id,
      pic: '',
      thumb: ''
    };

    ta.value = '';
    hideSendBtn();

    adjust();
  }

  /**
   * Send new post to channel
   * @private
   */
  function _sendPost(message, isFromModal) {
    if(isFromModal) {
      document.body.classList.remove('modal-img');
    }

    hidePostInput();

    $scope.post.message = message || ta.value;

    $ionicLoading.show({
      template: 'Posting...'
    });

    FeedService.savePost($scope.post).then(function(response){
      var savedPost;
      if(response && response.status === "success") {
        if($stateParams.post_id) {
          FeedService.getTribyPosts($stateParams.triby_id, {'skip':0}).then(function(response){

            if (!response.data || !response.data.posts || response.data.posts.length == 0) {
              $ionicLoading.hide();
              window.plugins.toast.showShortCenter("Sorry, can't load posts!", function (a) {
              }, function (b) {
                alert("Sorry, can't load posts!");
              });

              $scope.goTo('app/main/home');
              return;
            }

            for(var i = response.data.posts.length - 1; i > -1; i--) {
              if(response.data.posts[i].pic || response.data.posts[i].thumb) {
                response.data.posts[i].justPostedImage = true;
              }
            }

            $scope.isMoreLoadingAllowed = true;
            isMoreLoadingAllowed = true;


            $scope.triby.posts = response.data.posts;
            $ionicScrollDelegate.$getByHandle('scroll').scrollBottom();

            $ionicLoading.hide();

          }, function(err) {
            $ionicLoading.hide();
            window.plugins.toast.showShortCenter("Sorry, can't load posts!", function (a) {
            }, function (b) {
              alert("Sorry, can't load posts!");
            });

            $scope.goTo('app/main/home');
            return;
          });

        } else {
          savedPost = response.post;
          savedPost.createdBy =  $scope.currentUser;

          if(savedPost.pic || savedPost.thumb) {
            savedPost.justPostedImage = true;
          }

          $scope.triby.posts.push(savedPost);

          $ionicScrollDelegate.$getByHandle('scroll').scrollBottom();

          $ionicLoading.hide();
        }
      } else {
        $ionicLoading.hide();
        window.plugins.toast.showShortCenter("Error uploading post", function (a) {
          console.log('toast success: ' + a)
        }, function (b) {
          alert('Error uploading post');
        });
      }

      if ($scope.modalImage.isShown()) {
        $scope.modalImage.hide();
      }

      $stateParams.post_id = false;

      resetPost();
    }, function(err) {
      $ionicLoading.hide();
      window.plugins.toast.showShortCenter("Error uploading post", function (a) {
      }, function (b) {
        alert('Error uploading post');
      });
    });
  }
  /**
   * show input for writing new post
   */

  function showPostInput() {
    $scope.input.showPostInput = true;
    $rootScope.isInCommentingMode = true;
  }

  function hidePostInput() {
    if ($window.cordova
      && $window.cordova.plugins.Keyboard
    ) {
      cordova.plugins.Keyboard.close();
    }

    $rootScope.isInCommentingMode = false;
    $scope.input.showPostInput = false;
  }

  function openSocialScreen() {
    $ionicModal.fromTemplateUrl('templates/social_modal.html', function(modal) {
      $scope.socialModal = modal;
      $scope.socialModal.show();
    }, {
      scope: $scope,
      animation: 'none'
    });
  }

  $rootScope.isInCommentingMode = false;

  $scope.onContentClick = function (e) {
    if ($window.cordova && $window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }
    $rootScope.isInCommentingMode = false;
    $scope.hideMediaPopover();
  };

  $scope.onTextAreaFocus = function (e) {
    $rootScope.isInCommentingMode = true;
  };

  $ionicModal.fromTemplateUrl('templates/modal_image.html',{
    scope: $scope,
    animation: 'none'
  }).then(function(modal) {
    $scope.modalImage = modal;
  });

  // workaround issue which already fixed in latest ionic version
  $scope.ownScrollBottom = function(shouldAnimate) {
    $ionicScrollDelegate.$getByHandle('scroll').scrollBottom();
  };

  /**
   * Upload picture to channel
   * @param source
   * @private
   */

  function _uploadPicture(source){
    $scope.hideMediaPopover();
    $ionicLoading.show({
      template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
    });

    SettingsService.fileTo({
      serverURL: $rootScope.urlBackend + '/uploads',
      aType: "POST",
      aSource: source
    }).then(function(response){
      if(response.status == "success"){
        document.body.classList.add('modal-img');

        $ionicLoading.hide();

        setTimeout(function() {
          LoadingService.setPercentage(1);
        }, 400);

        $scope.post.image = response.url_file;
        $scope.modalImage.show();
      } else {
        $ionicLoading.hide();

        setTimeout(function() {
          LoadingService.setPercentage(1);
        }, 400);

        window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
          console.log('toast success: ' + a)
        }, function (b) {
          alert('"Error uploading picture');
        });
      }
    }).catch(function(err) {
      console.log("Error:", err);
      var errMsg;

      if(err) {
        if(typeof err === "string") {
          errMsg = err;
        } else {
          try{
            errMsg = JSON.stringify(err);
          } catch(err) {
            errMsg = err;
          }
        }
      }
      $ionicLoading.hide();

      setTimeout(function() {
        LoadingService.setPercentage(1);
      }, 400);

      if(!/Cancel/i.test(errMsg) && !/Select/i.test(errMsg)) {
        window.plugins.toast.showShortCenter("Error:" + errMsg, function (a) {

        }, function (b) {
          alert('Error: ' + errMsg);
        });
      }
    });
  }

  function _uploadVideo(source) {
    $scope.hideMediaPopover();
    $ionicLoading.show({
      template: '<p>Uploading...</p> ' +
      '<tek-progress-bar ng-model="progressBar.val" ></tek-progress-bar>'
    });

    SettingsService.videoTo($rootScope.urlBackend + '/uploads', "POST", source).then(function (result) {
      if (result.video.status == "success") {
        document.body.classList.add('modal-img');

        $ionicLoading.hide();
        LoadingService.setPercentage(1);
        $scope.post.video = result.video.url_file;
        $scope.post.thumb = result.thumb.url_file;
        $scope.modalImage.show();
      } else {
        $ionicLoading.hide();
        LoadingService.setPercentage(1);
        window.plugins.toast.showShortCenter("Error uploading video", function (a) {
          console.log('toast success: ' + a)
        }, function (b) {
          alert('Error uploading video');
        });
      }
    }).catch(function (err) {
      $ionicLoading.hide();
      LoadingService.setPercentage(1);

      if(err && err.code && err.code === 400) {
        return window.plugins.toast.showShortCenter("Sorry, you can't capture video during the call!", function (a) {
        }, function (b) {
          alert("Sorry, you can't capture video during the call!");
        });
      }
    });
  }

  function getName(post) {
    var user = post.createdBy,
      name = '';

    if (_.isObject(user)) {
      name = ('name' in user) ? user.name: user.username;

      if(name.length > 0) {
        name = $filter('limitName')(name);
      }
    }

    return name;
  }

  $scope.$on('$ionicView.enter', function(){
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.disableScroll(true);
    }
    initPubNub();
  });

  $scope.$on('$ionicView.leave', function(){
    destroyPubNub();
  });

  function clearScope() {
    if($scope.gridModal && typeof $scope.gridModal.remove == 'function') {
      $scope.gridModal.remove().then(function () {   //it's the most important part, do not do that in scope's destroy method if you use cached views since it might never be called !
        $scope.gridModal = null;

        $scope.triby.posts = null;
        $scope.post = null;
        $scope.currentUser = null;
        $scope.mediaPopover = null;
        $scope = null;
      });
    }
  }

  function destroyPubNub() {
    pubNubInstance.unSubscribe('group_' + $stateParams.triby_id);
  }

  function initPubNub() {
    var authData = UserService.getAuthData();

    /**
     * Create PubSub instance with channel and uuid.
     */
    pubNubInstance = PubNubServiceNew.init(authData.id);

    pubNubInstance.subscribeToChannel('group_' + $stateParams.triby_id, function(message) {

      console.log('pubnub>> ', message);

      if (!message.type) {
        return;
      }

      switch (message.type) {
        case 'post_comments_updated':

          //todo think about optimization this code (move ifMine to the data attr, find elem by id, doont process over all posts array)
          var postIndex = _.findIndex($scope.triby.posts, function(c){ return c._id==message.post._id});
          if (postIndex > -1 && message.initiator_id !== authData._id) {
            //FeedService.deleteTribeNotifications($stateParams.triby_id);

            $scope.triby.posts[postIndex].comments_count = message.post.comments_count;

            showPostCommentsChanges(message.post._id, message.post.comments_count);
          }
          break;

        case 'post_removed':
          var removedPostIndex = _.findIndex($scope.triby.posts, function(c){ return c._id == message.post_id});
          if (removedPostIndex > -1) {
            $scope.triby.posts.splice(removedPostIndex, 1);
            $scope.$apply();
          }

            break;

          case 'post_disliked':
          case 'post_hearted':

            if (message.initiator_id == $scope.currentUser._id || !message.post || !message.post._id) {
              break;
            }
            var postIndex = _.findIndex($scope.triby.posts, function(p){
              return p._id == message.post._id
            });
            if (postIndex > -1) {
              $scope.triby.posts[postIndex].dislikes = message.post.dislikes;
              $scope.triby.posts[postIndex].hearts = message.post.hearts;

              //check if mural details screen is shown
              if(document.getElementById('m_dislikeImg_' + message.post._id)) {
                _showModalPostDislikesChanges($scope.triby.posts[postIndex]);
                _showModalPostHeartsChanges($scope.triby.posts[postIndex]);
              }

              _showPostHeartsChanges($scope.triby.posts[postIndex]);
              _showPostDislikesChanges($scope.triby.posts[postIndex]);
          }
          break;

      }
    });
  }

  function showPostCommentsChanges(postId, commentsCount) {
    var commentsCountSpan = document.getElementById('comCount_' + postId),
      commentsImg = document.getElementById('imgComment_' + postId);

    if (commentsCountSpan) {
      if(commentsCountSpan.innerHTML == commentsCount) {
        return;
      }
      commentsCountSpan.innerHTML = commentsCount == 0 ? '' : commentsCount;
    }
    if (commentsImg && commentsCount > 0) {
      commentsImg.src = coloredComments;
    }
  }

  function _showPostHeartsChanges(post) {
    var heartImage = document.getElementById('heartImg_' + post._id),
      heartsCountSpan = document.getElementById('heartsSpan_' + post._id);

    if(post.hearts && post.hearts.length > 0) {
      heartImage.src = coloredHeart;
      heartsCountSpan.innerHTML = post.hearts.length + '';  //does it necessary to convert to string
    } else {
      heartImage.src = greyHeart;
      heartsCountSpan.innerHTML = '';
    }
  }

  function _showPostDislikesChanges(post) {
    var dislikeImage = document.getElementById('dislikeImg_' + post._id),
        dislikesCountSpan = document.getElementById('dislikesSpan_' + post._id);

    if(post.dislikes && post.dislikes.length > 0) {
      dislikeImage.src = coloredDislike;
      dislikesCountSpan.innerHTML = post.dislikes.length + '';
    } else {
      dislikeImage.src = greyDislike;
      dislikesCountSpan.innerHTML = '';
    }
  }

  function _showModalPostHeartsChanges(post) {
    var heartImage = document.getElementById('m_heartImg_' + post._id),
      heartsCountSpan = document.getElementById('m_heartsSpan_' + post._id);

    if(post.hearts && post.hearts.length > 0 && heartImage && heartsCountSpan) {
      heartImage.src = coloredHeart;
      heartsCountSpan.innerHTML = post.hearts.length + '';
    } else {
      heartImage.src = greyHeart;
      heartsCountSpan.innerHTML = '';
    }
  }

  function _showModalPostDislikesChanges(post) {
    var dislikeImage = document.getElementById('m_dislikeImg_' + post._id),
        dislikesCountSpan = document.getElementById('m_dislikesSpan_' + post._id);

    if(post.dislikes && post.dislikes.length > 0 && dislikeImage && dislikesCountSpan) {
      dislikeImage.src = coloredDislike;
      dislikesCountSpan.innerHTML = post.dislikes.length + '';
    } else {
      dislikeImage.src = greyDislike;
      dislikesCountSpan.innerHTML = '';
    }
  }

  function _goPersonalChat(partnerInfo) {
    if(!partnerInfo || partnerInfo.mobilenumber === $scope.currentUser.mobilenumber ) return;
    UserService.setPartnerData(partnerInfo);

    $state.go("app.chat", {partner_number: partnerInfo.mobilenumber});
  }

  function disableRefresher() {
    isMoreLoadingAllowed = false;
    document.getElementsByClassName('scroll-refresher')[0].innerHTML = ''
  }

  $scope.escapeHTML = function (html) {
    return _.escape(html);
  };

    //

  $scope.$on('$destroy', function() {
    removedMemberListener();

    $win.unbind('resize', forceAdjust);
    $mirror.remove();

    $scope.triby = null;
    triby = null;
  });

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

  $scope.initInputWatcher = function() {
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
  };

  $scope.goTo = function(path) {
    $rootScope.isInCommentingMode = false;

    $timeout(function() {
      $location.path(path);
    }, 150);
  };

  /**
   * Import to scope
   */

  $scope.uploadPicture = _uploadPicture;
  $scope.uploadVideo = _uploadVideo;
  $scope.sendPost      = _sendPost;
  $scope.setDislike    = _setDislike;
  $scope.setHeart      = _setHeart;
  $scope.setLike       = _setLike;
  $scope.getName       = getName;
  $scope.resetPost     = resetPost;
  $scope.showPostInput = showPostInput;
  $scope.hidePostInput = hidePostInput;
  $scope.goPersonalChat = _goPersonalChat;

}]);
