'use strict'

app.factory('soundCloudActivityFactory', ['$q', '$log', '$rootScope', 'timeService', 'Activity', function($q, $log, $rootScope, timeService, Activity) {

  var soundCloudActivityFactory = {};

  soundCloudActivityFactory.getSoundCloudActivities = function() {
    var soundCloudActivities = [];
    var soundCloudPromise = $q.defer();

    var currentUser = $rootScope.sessionUser;
    var token = currentUser.get('soundCloudAccessToken');

    if (currentUser && token) {
      var url = 'https://api.soundcloud.com/me/activities?oauth_token=' + token;

      $http({
        url: url, 
        method: "GET"
      }).then(function(response) {

        for (var index = 0; index < response.data.collection.length; index++) {
          var data_object = response.data.collection[index];

          if (isValidSoundCloudObject(data_object)) {
            var soundcloud_object_date = new Date(data_object['created_at']);

            for (var year = 1; year < 5; year++) {
              var sinceDate = timeService.getSinceDateForYearsAgo(year);
              var untilDate = timeService.getUntilDateForYearsAgo(year);

              if (soundcloud_object_date >= sinceDate && soundcloud_object_date <= untilDate) {
                var data = data_object['origin'];
                var mediaURL = data['uri'];
                var message = data['title'];

                var activity = Activity.build({'activityType': Activity.ActivityTypeEnum.ActivityTypeSoundCloud,
                                              'message': message,
                                              'createdTime': soundcloud_object_date,
                                              'mediaURL': mediaURL});
                
                soundCloudActivities.push(activity);

                activity.saveToParse();
              }
            }
          }
        }

        soundCloudPromise.resolve(soundCloudActivities);

      });

    } else {
      console.log("this shouldn't happen: user is not signed in");
    }

    return soundCloudPromise.promise;
  }

  function isValidSoundCloudObject(data_object) {
    var soundCloudActivityType = data_object['type'];

    if (soundCloudActivityType != 'track' && 
        soundCloudActivityType != 'playlist') {
      return false;
    }

    return true;
  }

  return soundCloudActivityFactory;
}]);