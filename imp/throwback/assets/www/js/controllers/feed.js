controllerModule.controller('FeedCtrl', function($rootScope, $timeout, $scope, $state, $filter, $ionicLoading, $ionicPopup, $ionicViewService, $cordovaDialogs, activityFactory, Activity, visitorFactory, userFactory, authenticationFactory, shareFactory, FeedService, networkFactory, configuration) {
  
  // Clear history so user can't go back to onboarding
  $ionicViewService.clearHistory();

  authenticationFactory.isAuthenticatedOnParse().then(function(isAuthenticatedOnParse) {
    if (!isAuthenticatedOnParse) {
      // Log out if current user does not exist
      $ionicLoading.hide();
      authenticationFactory.handleLogOut();
    }
  });

  $scope.navTitle = '<img class="nav-title-img" src="img/logo.png" />';
  // $scope.infiniteScrollReady = false;

  if ($rootScope.sessionUser.get('fullName')) {
      var firstName = $rootScope.sessionUser.get('fullName').split(' ')[0];
      $scope.firstName = firstName.toUpperCase();
  } else {
    $rootScope.sessionUser.fetch().then(function(user) {
      var firstName = user.get('fullName').split(' ')[0];
      $scope.firstName = firstName.toUpperCase();
    });
  }

  // $scope.handleGoToShare = function(activity) {
  //   shareFactory.share_activity = activity;
  //   $state.go('share');
  //   visitorFactory.handleAction("feed_to_share");
  // }

  $scope.handleShare = function(activity) {
    shareFactory.share_activity = activity;

    $ionicLoading.show({
      content: 'Sharing... &nbsp;<i class="icon ion-loading-c"></i>',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    visitorFactory.handleAction("feed_share_post").then(function(action) {
      console.log(action);

      if (networkFactory.isNetworkOffline()) {
        $ionicLoading.hide();
        $cordovaDialogs.alert("Oops, this share can not be shared because there is no internet connection...", function(){}, 'Sorry');
        return;
      }

      if (!shareFactory.share_activity) {
        visitorFactory.handleAction("feed_share_post_share_activity_not_found");
        return;
      }

      var share_message = 'Exactly ' + shareFactory.share_activity.getPrettyYearsAgo() + ' today! Found this via (' + configuration.baseURL + ')'; 

      shareFactory.handleShare(share_message, true, false, false).then(function(response) {
        $ionicLoading.hide();

        $ionicPopup.alert({
          title: 'Team Throwback',
          template: '<center>Your post was shared successfully!</center>'
        });
        visitorFactory.handleAction("feed_share_post_complete");
      }, function(error) {
        $ionicLoading.hide();

        console.log(error);

        if (error == 'permissions_error') {
          $ionicPopup.alert({
            title: 'Team Throwback',
            template: '<center>We need your facebook permissions to share!</center>'
          });

          visitorFactory.handleAction("feed_share_user_decline_fb");
        } else {
          $ionicPopup.alert({
            title: 'Team Throwback',
            template: '<center>There was an error while sharing, please try again!</center>'
          });

          visitorFactory.handleAction("feed_share_post_error");
          visitorFactory.handleAction("feed_share_post_error_" + error);
          var params = {
            'message': JSON.stringify(error),
            'file': "controllers/feed.js:handleShare"
          }
          Parse.Cloud.run('sendErrorEmail', params, {
            success: function(result) {
              console.log('successfully sent email');
            },
            error: function (error) {
              console.log(error);

              var params = {
                'message': "error while sendErrorEmail ran in handleShare " + error,
                'file': "controllers/feed.js:handleShare"
              }
              Parse.Cloud.run('sendErrorEmail', params, {
                success: function(result) {
                  console.log('successfully sent email');
                },
                error: function (error) {
                  console.log(error);
                }
              });

            }
          });

        }
      });
    });
  }

  var day = new Date();
  $scope.currentDate = $filter('date')(day, 'EEE h:mma');
  day = $filter('date')(day, 'MMMM d');
  $scope.date = $filter('uppercase')(day);

  var getActivities = function() {
    console.log('getActivities');
    if (networkFactory.isNetworkOffline()) {
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
      $cordovaDialogs.alert("An internet connection wasn't found!", function(){}, 'Sorry');
      return;
    } 

    activityFactory.getActivities().then(function(getActivitiesResponse) {
      var activities = getActivitiesResponse;
      activities = removeDuplicates(activities);

      var emptyFeed = false;

      // there's no throwbacks for the day
      if (activities.length == 0) {
        emptyFeed = true;
        var emptyPlaceholderActivity = Activity.build({'activityType': Activity.ActivityTypeEnum.ActivityTypeEmptyFeed,
                                           'message':'',
                                           'createdTime': new Date(),
                                           'mediaURL': '',
                                           'forUser': '',
                                           'originalLink': ''});
        activities.unshift(emptyPlaceholderActivity);
      }

      userFactory.updateFirstTimeEmptyFeed(emptyFeed);
      
      FeedService.setFeed(activities);
      $scope.activities = activities;
      console.log('$scope.activities: ' + $scope.activities);

      $ionicLoading.hide();
      // $scope.infiniteScrollReady = true;
      // $scope.$broadcast('scroll.refreshComplete');
    }, function(error) {
      $ionicLoading.hide();
      console.log('An error has occurred while retrieving activities');
    });
  }

  var unregister = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    
    if (fromState.name === "feed") {
      if ($scope.activities) {
        FeedService.setFeed($scope.activities);
        unregister();
      }
    }

  });

  $scope.handleFeedRefresh = function() {
    FeedService.getFeed().then(function(feed) {
      if (!feed) {
        $ionicLoading.show({
          content: 'Loading Your Throwbacks... &nbsp;<i class="icon ion-loading-c"></i>',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        getActivities();
      } else {
        $scope.activities = feed;
        $ionicLoading.hide();
      }
    });

    var unregister = $rootScope.$on('refreshFeed', function(e) {
      $scope.handleFeedRefresh();
      unregister();
    });
  }

  $scope.handleFeedRefresh();
  visitorFactory.handleAction("feed");

  // $scope.isInfiniteScrollReady = function() {
  //   return $scope.infiniteScrollReady;
  // }

  // $scope.handleInfiniteScroll = function() {
  //   if ($scope.activities) {
  //     $scope.activities = $scope.activities.concat(FeedService.getFeed());

  //     if (FeedService.isMaxPositionReached()) {
  //       $scope.infiniteScrollReady = false;
  //     }
  //   }
  //   $scope.$broadcast('scroll.infiniteScrollComplete');
  // }

  function removeDuplicates(a) {
     var isAdded,
        arr = [];
    for(var i = 0; i < a.length; i++) {
        isAdded = arr.some(function(v) {
          return isEqual(v, a[i]);
        });
        if( !isAdded ) {
          arr.push(a[i]);
        }
    }
    return arr; 
  };

  function isEqual(val, val2) {
    if (val.message === val2.message && val.activityType === val2.activityType && val.originalLink === val2.originalLink) {
      return true;
    }
    return false;
  }

  $scope.navTitle = '<img class="nav-title-img" src="img/logo.png" />'
});