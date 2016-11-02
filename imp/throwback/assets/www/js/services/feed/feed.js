'use strict';

app.factory('FeedService', function($q, $rootScope, userFactory) {

  var feedService = {};

  feedService.state = null;
  feedService.currentPosition = 0;
  feedService.maxPositionReached = false;

  feedService.getFeed = function() {
    var getFeedPromise = $q.defer();

    userFactory.needToRefreshFeed().then(function(refreshFeed) {
      if (refreshFeed && $rootScope.sessionUser.get('onMobile')) {
        feedService.clearFeed();
        getFeedPromise.resolve(null);
      } else {
        getFeedPromise.resolve(feedService.state);
      }
    });

    return getFeedPromise.promise;
  }

  feedService.setFeed = function (activities) {
    feedService.state = activities;
  }

  feedService.stateExists = function() {
    if (feedService.state) {
      return true;
    }
    return false;
  }

  feedService.clearFeed = function () {
    feedService.state = null;
  }

  return feedService;
});