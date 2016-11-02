'use strict'

app.factory('activityFactory', function($q, $log, $timeout, $rootScope, $http, configuration, timeService, Activity, authenticationFactory, userFactory, twitterFactory, instagramFactory,facebookActivityFactory, twitterActivityFactory, instagramActivityFactory, soundCloudActivityFactory) {

  var activityFactory = {};

  activityFactory.getActivities = function() {
    var getActivitiesPromise = $q.defer();

    var allActivities = [];

    userFactory.areThrowbacksAvailable().then(function(throwbacksAvailable) {
      return getActivitiesFromParse();
    }).then(function(activities) {
                                                                  
      for (var index = 0; index < activities.length; index++) {
        allActivities = allActivities.concat(activities[index]);
      }

      // Sorting function
      allActivities.sort(function(a, b) {
        if (a.createdTime > b.createdTime) {
          return -1;
        } else if (b.createdTime > a.createdTime) {
          return 1;
        } else {
          return 1;
        }
      });

      return userFactory.needToCreateNewThrowback();
    }).then(function(needToCreateNewThrowback) {
      if (needToCreateNewThrowback) {
        console.log('needToCreateNewThrowback: Making request to parse new Throwbacks');
        authenticationFactory.getFacebookSessionToken().then(function(fb_session_token) {
          activityFactory.parseThrowbacks($rootScope.sessionUser.id, fb_session_token);
          getActivitiesPromise.resolve(allActivities);
        });
      } else {
        console.log('needToCreateNewThrowback: lastThrowbackCreated up to date');
        getActivitiesPromise.resolve(allActivities);
      }
    }).catch(function(error) {
      getActivitiesPromise.reject(error);
    });

    return getActivitiesPromise.promise;
  }

  activityFactory.parseThrowbacks = function(user_id, access_token) {
    $http({
      method:'GET',
      url: configuration.apiBaseURL + 'parse/facebook/' + '?user_id=' + user_id
                                                        + '&fb_session_token=' + access_token
    }).
    success(function(data, status, headers, config) {
      console.log(data);
    }).
    error(function(data, status, headers, config) {
      console.log(data);
    });
  }

  // function getFolloweeActivitiesFromParse() {
  //   var getFolloweeActivitesFromParsePromise = $q.defer();
  //   var getActivitiesFromParseQueryPieces = [];

  //   var followeesQuery = $rootScope.sessionUser.relation('followees').query();

  //   followeesQuery.find().then(function(followees) {

  //     var activityQueries = [];

  //     for (var year = 1; year < 6; year++) {
  //       var followeesActivitiesQuery = new Parse.Query('Activity');
  //       followeesActivitiesQuery.containedIn('forUser', followees);
  //       followeesActivitiesQuery.greaterThanOrEqualTo('activityCreatedTime', timeService.getSinceDateForYearsAgo(year));
  //       followeesActivitiesQuery.lessThanOrEqualTo('activityCreatedTime', timeService.getUntilDateForYearsAgo(year));

  //       activityQueries.push(followeesActivitiesQuery);
  //     }

  //     var getAllActivitiesFromParseQuery = Parse.Query.or.apply(Parse.Query, activityQueries);
  //     getAllActivitiesFromParseQuery.descending('activityCreatedTime');
  //     getAllActivitiesFromParseQuery.limit = 500;
  //     getAllActivitiesFromParseQuery.include('forUser');
      
  //     getAllActivitiesFromParseQuery.find().then(function(result) {
  //       var activities = [];

  //       likeFactory.getLikesActivitiesIDs().then(function(likes_activities_ids) {
  //         for (var index = 0; index < result.length; index++) {
  //           var parse_activity_object = result[index];

  //           var activity = Activity.build({'activityType': parse_activity_object.get('activityType'),
  //                                           'message': parse_activity_object.get('message'),
  //                                           'createdTime': parse_activity_object.get('activityCreatedTime'),
  //                                           'mediaURL': parse_activity_object.get('mediaURL'),
  //                                           'originalLink': parse_activity_object.get('originalLink'),
  //                                           'forUserID': parse_activity_object.get('forUser').id,
  //                                           'forUserName': parse_activity_object.get('forUser').get('fullName'),
  //                                           'forUserProfilePictureURL': parse_activity_object.get('forUser').get('profilePictureURL'),
  //                                           'numLikes': likeFactory.parseNumLikes(parse_activity_object.get('numLikes')),
  //                                           'likedByCurrentUser': likeFactory.getLikedByCurrentUser(parse_activity_object.id, likes_activities_ids)});
  //           activity.setParseActivityID(parse_activity_object.id);
  //           activities.push(activity);
  //         }
  //         getFolloweeActivitesFromParsePromise.resolve(activities);
  //       });
  //     });
  //   });

  //   return getFolloweeActivitesFromParsePromise.promise;
  // }

  function getActivitiesFromParse() {
    var getActivitiesFromParsePromise = $q.defer();
    var getActivitiesFromParseQueryPieces = [];

    // var followeesQuery = $rootScope.sessionUser.relation('followees').query();

    // followeesQuery.find().then(function(followees) {

    //   var activityQueries = [];

    //   for (var year = 1; year < 6; year++) {
    //     var myActivitiesQuery = new Parse.Query('Activity');
    //     myActivitiesQuery.equalTo('forUser', $rootScope.sessionUser);
    //     myActivitiesQuery.greaterThanOrEqualTo('activityCreatedTime', timeService.getSinceDateForYearsAgo(year));
    //     myActivitiesQuery.lessThanOrEqualTo('activityCreatedTime', timeService.getUntilDateForYearsAgo(year));
    //     myActivitiesQuery.limit(500);

    //     activityQueries.push(myActivitiesQuery);

    //     var followeesActivitiesQuery = new Parse.Query('Activity');
    //     followeesActivitiesQuery.containedIn('forUser', followees);
    //     followeesActivitiesQuery.greaterThanOrEqualTo('activityCreatedTime', timeService.getSinceDateForYearsAgo(year));
    //     followeesActivitiesQuery.lessThanOrEqualTo('activityCreatedTime', timeService.getUntilDateForYearsAgo(year));
    //     followeesActivitiesQuery.limit(500);

    //     activityQueries.push(followeesActivitiesQuery);
    //   }

    //   var getAllActivitiesFromParseQuery = Parse.Query.or.apply(Parse.Query, activityQueries);
    //   getAllActivitiesFromParseQuery.limit(500);
    //   getAllActivitiesFromParseQuery.include('forUser');
      
    //   getAllActivitiesFromParseQuery.find().then(function(result) {
    //     var activities = [];

    //     likeFactory.getLikesActivitiesIDs().then(function(likes_activities_ids) {
    //       for (var index = 0; index < result.length; index++) {
    //         var parse_activity_object = result[index];

    //         var activity = Activity.build({'activityType': parse_activity_object.get('activityType'),
    //                                         'message': parse_activity_object.get('message'),
    //                                         'createdTime': parse_activity_object.get('activityCreatedTime'),
    //                                         'mediaURL': parse_activity_object.get('mediaURL'),
    //                                         'originalLink': parse_activity_object.get('originalLink'),
    //                                         'forUserID': parse_activity_object.get('forUser').id,
    //                                         'forUserName': parse_activity_object.get('forUser').get('fullName'),
    //                                         'forUserProfilePictureURL': parse_activity_object.get('forUser').get('profilePictureURL'),
    //                                         'numLikes': likeFactory.parseNumLikes(parse_activity_object.get('numLikes')),
    //                                         'likedByCurrentUser': likeFactory.getLikedByCurrentUser(parse_activity_object.id, likes_activities_ids)});
    //         activity.setParseActivityID(parse_activity_object.id);
    //         activities.push(activity);
    //       }
    //       getActivitiesFromParsePromise.resolve(activities);
    //     });
    //   });
    // }, function(error) {
    //   console.log(error);
    // });

    var activityQueries = [];

    var users = [];
    var teamThrowbackUser = new Parse.User();
    if (configuration.teamThrowbackObjectID) {
      teamThrowbackUser.id = configuration.teamThrowbackObjectID;
      users.push(teamThrowbackUser);
    }
    users.push($rootScope.sessionUser);

    for (var year = 1; year < 6; year++) {
      var myActivitiesQuery = new Parse.Query('Activity');
      myActivitiesQuery.containedIn('forUser', users);
      myActivitiesQuery.greaterThanOrEqualTo('activityCreatedTime', timeService.getSinceDateForYearsAgo(year));
      myActivitiesQuery.lessThanOrEqualTo('activityCreatedTime', timeService.getUntilDateForYearsAgo(year));
      myActivitiesQuery.limit(500);

      activityQueries.push(myActivitiesQuery);
    }

    var getAllActivitiesFromParseQuery = Parse.Query.or.apply(Parse.Query, activityQueries);
    getAllActivitiesFromParseQuery.limit(500);
    getAllActivitiesFromParseQuery.descending('activityCreatedTime');
    getAllActivitiesFromParseQuery.include('forUser');
    
    getAllActivitiesFromParseQuery.find().then(function(result) {
      var activities = [];

      for (var index = 0; index < result.length; index++) {
        var parse_activity_object = result[index];
        var activity = Activity.build({'activityType': parse_activity_object.get('activityType'),
                                        'message': parse_activity_object.get('message'),
                                        'createdTime': parse_activity_object.get('activityCreatedTime'),
                                        'mediaURL': parse_activity_object.get('mediaURL'),
                                        'originalLink': parse_activity_object.get('originalLink'),
                                        'forUserID': parse_activity_object.get('forUser').id,
                                        'forUserName': parse_activity_object.get('forUser').get('fullName'),
                                        'forUserProfilePictureURL': parse_activity_object.get('forUser').get('profilePictureURL'),
                                        'numLikes': 0,
                                        'likedByCurrentUser': null});
        activity.setParseActivityID(parse_activity_object.id);
        activities.push(activity);
      }
      getActivitiesFromParsePromise.resolve(activities);
    });

    return getActivitiesFromParsePromise.promise;
  }

  return activityFactory;
});