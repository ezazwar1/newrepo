'use strict'

app.factory('twitterActivityFactory', ['$q', '$log', '$rootScope', 'timeService', 'Activity', 'twitterFactory', 'userFactory', function($q, $log, $rootScope, timeService, Activity, twitterFactory, userFactory) {
  var twitterActivityFactory = {};

  twitterActivityFactory.getTwitterActivities = function() {
    return getTwitterTimeline().then(function(twitter_objects) {
      var twitterActivitiesToShow = [];
      var twitterActivitiesToSave = [];

      for (var index = 0; index < twitter_objects.length - 1; index++) {
        var twitter_object = twitter_objects[index];
        var twitter_object_date = new Date(twitter_object['created_at']);

        var media_url;
        if (twitter_object['entities']['media']) {
          media_url = twitter_object['entities']['media'][0]['media_url'];
        } else {
          media_url = null;
        }

        var activity = Activity.build({'activityType': Activity.ActivityTypeEnum.ActivityTypeTwitter,
                                      'message': twitter_object['text'],
                                      'createdTime': twitter_object_date,
                                      'mediaURL': media_url,
                                      'originalLink': getOriginalLinkFromTwitterObject(twitter_object),
                                      'forUserID': $rootScope.sessionUser.id,
                                      'forUserName': $rootScope.sessionUser.get('fullName'),
                                      'forUserProfilePictureURL': $rootScope.sessionUser.get('profilePictureURL'),
                                      'likes': 0});

        if (timeService.isEligibleToThrowbackToday(twitter_object_date)) {
          twitterActivitiesToShow.push(activity);
        }

        twitterActivitiesToSave.push(activity);
      }

      Activity.saveAllToParse(twitterActivitiesToSave, $rootScope.sessionUser.id);

      var mostRecentTwitterObjectDate = new Date(twitter_objects[0]['created_at']);
      userFactory.updateMostRecentTwitterDate(mostRecentTwitterObjectDate);

      return twitterActivitiesToShow;
    });
  }

  function getTwitterTimeline() {
    var twitterTimelinePromise = $q.defer();

    $rootScope.$on('twitterInitialized', function(event, twitterClient) {
      getTwitterTimelinePiece(0, [], twitterTimelinePromise, twitterClient);
    });

    return twitterTimelinePromise.promise;
  }

  function getTwitterTimelinePiece(max_id, tweet_objects, twitterTimelinePromise, twitterClient) {
    var tweet_objects = tweet_objects;

    var userTimelineRequestURI;
    if (max_id == 0) {
      userTimelineRequestURI = '1.1/statuses/user_timeline.json?' + 'count=100';
    } else {
      userTimelineRequestURI = '1.1/statuses/user_timeline.json?' + 'count=100' + '&max_id=' + max_id;
    }

    twitterClient.get(userTimelineRequestURI).done(function(response) {
      if (response.length == 1) {
        twitterTimelinePromise.resolve(tweet_objects);
        return;
      }

      var last_tweet_object = response[response.length - 1];
      var last_tweet_object_date = new Date(last_tweet_object['created_at']);

      var mostRecentTweetDate = $rootScope.sessionUser.get('mostRecentTweetDate');
      if (mostRecentTweetDate && (last_tweet_object_date < mostRecentTweetDate) ) {
        twitterTimelinePromise.resolve(tweet_objects.concat(response));
        return;
      }

      var new_max_id = last_tweet_object['id_str'];

      getTwitterTimelinePiece(new_max_id, tweet_objects.concat(response), twitterTimelinePromise, twitterClient);
    });
  }

  function getOriginalLinkFromTwitterObject(data_object) {
    var baseURL = 'http://www.twitter.com/';
    var username = data_object['user']['screen_name'];
    var tweet_id = data_object['id_str'];

    return baseURL + username + '/status/' + tweet_id; 
  }

  return twitterActivityFactory;
}]);