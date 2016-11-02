'use strict';
MyApp.controller('MuralCtrl', function($window, $scope, $timeout, $ionicPopup, $location, $ionicModal, $stateParams,
                                       FeedService, UserService, $state, $rootScope, $ionicScrollDelegate, $filter, IconService, _) {

    var coloredHeart = 'img/heart.png',
      greyHeart = 'img/heart-grey.png',
      coloredDislike = 'img/hand-down.png',
      greyDislike = 'img/hand-down-grey.png',
      coloredComments = 'img/comments.png',
      greyComments = 'img/comments-grey.png';

    $scope.triby_posts = [];
    $scope.triby = null;

    $scope.tribyName = $stateParams.triby_name;

    FeedService.getTriby($stateParams.triby_id, {image_only:true}).then(function(response){
      console.log(response.data);
        $scope.triby = response.data.tribe;

        $scope.triby_posts = $filter('orderBy')(response.data.tribe.posts.filter(function(post){
          if(post.pic){
            return post;
          }
        }), 'date');

        $timeout(function() {
          ownScrollBottom();
        }, 200);
    }, function(err) {
      window.plugins.toast.showShortCenter("Can't get the pictures!", function (a) {
      }, function (b) {
        alert("Can't get the pictures!");
      });

      $state.go('app.main.home');
    });

    $ionicModal.fromTemplateUrl('templates/mural_details.html', function(modal) {
            $scope.gridModal = modal;
        },
        {
            scope: $scope,
            animation: 'none'
     });

    var removedMemberListener = $rootScope.$on('removed_from_tribe', function(message, messageData) {
      console.log('removed_from_tribe: muralctrl', arguments);

      if(messageData.tribeId !== $stateParams.triby_id) return;

      window.plugins.toast.showShortCenter("You have been removed from this group", function (a) {
      }, function (b) {
        alert('You have been removed from this group');
      });

      $state.go('app.main.home');
    });

    $scope.getTribyName = function() {
      return  'Gallery';
    };

    $scope.getImgSrc = function(post) {
      return post && post.comments_count && post.unreadComments ? coloredComments : greyComments;
    };

    $scope.getDislikeImgSrc = function(dislikes) {
      return dislikes && dislikes.length > 0 ? coloredDislike : greyDislike;
    };

    $scope.getHeartImgSrc = function(hearts) {
      return hearts && hearts.length > 0 ? coloredHeart : greyHeart;
    };

    $scope.openModal = function(selected) {
        $scope.post = selected;
        $scope.isShowDetails = false;

        $scope.goComment = function(post, triby){
          $scope.gridModal.hide();
          $scope.gridModal.remove().then(function () {
            $scope.gridModal = null;
          });

          $state.go("app.comments",{post_id: post._id, triby: triby});
        };

        /////////////////// get Current User /////////////////////
        UserService.getUser().then(function(data){
            console.log("get user .... :", data);
            $scope.currentUser = data.data.user;
        });
        /////////////////// get Current User /////////////////////
        /////////////////// icon Filter /////////////////////////
        $scope.iconFilter = function(array){
            return IconService.iconFilter($scope.currentUser, array);
        };
        /////////////////// icon Filter /////////////////////////

        /////////////////// get All Currrnt Triby Post /////////////////////////
        $scope.getPost = function(){
            FeedService.getPost($scope.post._id).then(function(response){
                console.log("get All Currrnt Triby Post :", response.data.post);
                $scope.post = response.data.post;
            });
        };
        /////////////////// get All Currrnt Triby Post /////////////////////////

        $scope.toggleDetails = function() {
          $scope.isShowDetails = !$scope.isShowDetails;
        };

        $scope.escapeHTML = function (html) {
            return _.escape(html);
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

        function _updateExistingPost (newPost) {
            _.each($scope.triby.posts, function (existingPost, index) {
                if (existingPost._id == newPost._id) {
                    $scope.triby.posts[index].likes = newPost.likes;
                    $scope.triby.posts[index].dislikes = newPost.dislikes;
                    $scope.triby.posts[index].hearts = newPost.hearts;
                    return;
                }
            });
        }

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
        $scope.gridModal = null;
      });
    };

  $scope.setHeart = function(post, isFromModal) {
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

    _showModalPostDislikesChanges(post);
    _showModalPostHeartsChanges(post);

  };

  $scope.setDislike = function(post, isFromModal) {
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

    _showModalPostDislikesChanges(post);
    _showModalPostHeartsChanges(post);
  };

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

  function ownScrollBottom() {
    $ionicScrollDelegate.$getByHandle('scroll').scrollBottom();
  }

  $scope.$on('$destroy', function() {
    removedMemberListener();
  });
});

