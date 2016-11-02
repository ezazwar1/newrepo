'use strict'

app.factory('instagramActivityFactory', ['$q', '$log', '$rootScope', 'timeService', 'Activity', 'instagramFactory', function($q, $log, $rootScope, timeService, Activity, instagramFactory) {

  var instagramActivityFactory = {};

  instagramActivityFactory.getInstagramActivities = function() {
    var instagramPromise = $q.defer();

    $rootScope.$on('instagramInitialized', function(event, instagramClient) {
      var allInstagramActivitiesToShow = [];
      var allInstagramActivitiesToSave = [];
      var getInstagramActivitiesPromises = [];

      angular.forEach([1,2,3,4,5], function(year) {
        var instagramPostsURI = 'v1/users/self/media/recent?min_timestamp=' + timeService.getSinceEpochTimeForYearsAgo(year) 
                                                        + '&max_timestamp=' + timeService.getUntilEpochTimeForYearsAgoWithRange(year, 14)
                                                        + '&access_token=' + $rootScope.sessionUser.get('instagramAccessToken'); 
        var getInstagramActivitiesPiecePromise = $q.defer();

        instagramClient.get(instagramPostsURI).done(function(response) {
          var data = response['data'];

          for (var index = 0; index < data.length; index++) {
            var data_object = data[index];
            var createdTime = new Date(parseInt(data_object['created_time']) * 1000);

            var message; 
            if (data_object['caption']) {
              message = data_object['caption']['text'];
            } else {
              message = null;
            }

            var activity = Activity.build({'activityType': Activity.ActivityTypeEnum.ActivityTypeInstagram,
                                           'message':message,
                                           'createdTime': createdTime,
                                           'mediaURL': data_object['images']['standard_resolution']['url'],
                                           'originalLink': data_object['link'],
                                           'forUserID': $rootScope.sessionUser.id,
                                           'forUserName': $rootScope.sessionUser.get('fullName'),
                                           'forUserProfilePictureURL': $rootScope.sessionUser.get('profilePictureURL'),
                                           'likes': 0});

            if (timeService.isEligibleToThrowbackToday(createdTime)) {
              allInstagramActivitiesToShow.push(activity);
              console.log(allInstagramActivitiesToShow);
            }
            allInstagramActivitiesToSave.push(activity);
            console.log(allInstagramActivitiesToSave);
          }
          getInstagramActivitiesPiecePromise.resolve(true);
        });

        getInstagramActivitiesPromises.push(getInstagramActivitiesPiecePromise.promise);
      });

      var getAllInstagramActivitiesPromise = $q.all(getInstagramActivitiesPromises);

      getAllInstagramActivitiesPromise.then(function(allInstagramActivities) {
        Activity.saveAllToParse(allInstagramActivitiesToSave, $rootScope.sessionUser.id);
        instagramPromise.resolve(allInstagramActivitiesToShow);
      });
    });

    return instagramPromise.promise;
  }

  return instagramActivityFactory;
}]);