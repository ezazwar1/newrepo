app.factory('Activity', function($rootScope, $q) {

    function Activity(activityType, message, createdTime, mediaURL, originalLink, forUserID, forUserName, forUserProfilePictureURL, numLikes, likedByCurrentUser) {
      this.activityType = activityType;
      this.message = message;
      this.createdTime = createdTime;
      this.mediaURL = mediaURL;
      this.originalLink = originalLink;
      this.forUserID = forUserID;
      this.forUserName = forUserName;
      this.forUserProfilePictureURL = forUserProfilePictureURL;
      this.parseActivityID = null;
      this.numLikes = numLikes;
      this.likedByCurrentUser = likedByCurrentUser;
    }
    
    var ActivityTypeEnum = {
        ActivityTypeFacebook: 0,
        ActivityTypeTwitter: 1,
        ActivityTypeInstagram: 2,
        ActivityTypeSoundCloud: 3,
        ActivityTypeConnect: 4,
        ActivityTypeAd: 5,
        ActivityTypeEmptyFeed: 6,
    };

    Activity.ActivityTypeEnum = angular.copy(ActivityTypeEnum);
   
    Activity.build = function(data) {
      return new Activity(
        data.activityType,
        data.message,
        data.createdTime,
        data.mediaURL,
        data.originalLink,
        data.forUserID,
        data.forUserName,
        data.forUserProfilePictureURL,
        data.numLikes,
        data.likedByCurrentUser
      );
    }

    Activity.saveAllToParse = function(parseActivities, forUser) {
      var chunk = 25;
      for (var i = 0; i < parseActivities.length; i += chunk) {
          var end;
          if ( (i + chunk) > parseActivities.length) {
            end = parseActivities.length + 1;
          } else {
            end = i + chunk;
          }

          parseActivitiesChunk = parseActivities.slice(i, end);
          
          var activitiesToSave = [];
          for (var index = 0; index < parseActivitiesChunk.length; index++) {
            var clientActivity = parseActivitiesChunk[index];
            var clientActivityObject = clientActivity.toJSONObject();
            activitiesToSave.push(clientActivityObject);
          }

          var start_time = new Date().getTime();
          Parse.Cloud.run('addAllActivities', {'activitiesToSave': activitiesToSave,
                                               'forUser': forUser}).then(function(response) {
              var end_time = new Date().getTime();

              console.log('Sucessfully saved activities on Parse.');
              //console.log(end_time - start_time);
          })
      }
    }

    Activity.prototype.toJSONObject = function() {
      return {'activityType': this.activityType,
              'message': this.message,
              'createdTime': this.createdTime,
              'mediaURL': this.mediaURL,
              'originalLink': this.originalLink};
    }

    Activity.prototype.setParseActivityID = function(parseActivityID) {
      this.parseActivityID = parseActivityID;
    }

    Activity.prototype.getParseActivityID = function() {
      return this.parseActivityID;
    }

    Activity.prototype.getPrettyDate = function () {
      return moment(this.createdTime).format('MMMM DD, YYYY h:mma');
    }

    Activity.prototype.getPrettyTime = function () {
      return moment(this.createdTime).format('h:mma');
    }

    Activity.prototype.getPrettyYearsAgo = function () {
      var yearsAgo = this.getYearsAgo();

      if (yearsAgo == 0 || yearsAgo == 1) {
        return '1 Year Ago';
      } else {
        return yearsAgo + ' Years Ago';
      }
    }

    Activity.prototype.getYearsAgo = function () {
      var currentTimeYear = new Date().getFullYear();
      var createdTimeYear = this.createdTime.getFullYear();

      return currentTimeYear - createdTimeYear;
    }


    Activity.prototype.fetchParseActivity = function(parseActivityID, createdTime, activityType, message) {
      var fetchParseActivityPromise = $q.defer();
      var activityQuery = new Parse.Query('Activity');

      if (parseActivityID) {
        activityQuery.get(parseActivityID, {
          success: function(activity) {
            if (activity) {
              fetchParseActivityPromise.resolve(activity);
            } else {
              fetchParseActivityPromise.resolve(false);
            }
          },
          error: function(error) {
            console.log(error);
          }
        });
      } else {
        activityQuery.equalTo('activityCreatedTime', createdTime);
        activityQuery.equalTo('activityType', activityType);
        activityQuery.equalTo('message', message);

        activityQuery.first({
          success: function(activity) {
            if (activity) {
              fetchParseActivityPromise.resolve(activity);
            } else {
              fetchParseActivityPromise.resolve(false);
            }
          },
          error: function(error) {
            fetchParseActivityPromise.resolve(false);
          }
        });
      }

      return fetchParseActivityPromise.promise;
    }

    Activity.prototype.handleLike = function() {
      var Like = Parse.Object.extend('Like');
      var Activity = new Parse.Object.extend('Activity');

      var parseActivityID = this.parseActivityID;
      var createdTime = this.createdTime;
      var activityType = this.activityType;
      var message = this.message;

      if (this.likedByCurrentUser) {
        // Delete Like Object
        var like_object_to_delete = new Like();

        this.fetchParseActivity(parseActivityID, createdTime, activityType, message).then(function(activity) {
          if (activity) {
            var likeQuery = new Parse.Query('Like');
            likeQuery.equalTo('forActivity', activity);
            likeQuery.first({
              success: function(like_object) {
                if (like_object) {
                  like_object.destroy().then(function() {
                    activity.increment('numLikes', -1);
                    activity.save();      
                  });
                }
              }
            }); 
          }
        });

      } else {
        // Create Like Object        
        var like_object = new Like();
        var currentUser = new Parse.User();

        var fetchParseActivity = this.fetchParseActivity;

        $rootScope.sessionUser.fetch().then(function(user) {
          currentUser.id = $rootScope.sessionUser.id;
          like_object.set('byUser', currentUser);

          return fetchParseActivity(parseActivityID, createdTime, activityType, message);
        }).then(function(activity) {
          if (activity) {
            like_object.set('forActivity', activity);
            like_object.save().then(function() {
              activity.increment('numLikes');
              activity.save();
            });
          } else {
            console.log('couldnt find activity');
          }
        });
      }
    }

    return Activity;

  });
