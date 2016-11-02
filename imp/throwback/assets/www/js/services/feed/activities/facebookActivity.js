
app.factory('facebookActivityFactory', ['$http', '$q', '$log', '$rootScope', 'timeService', 'Activity', 'facebook', 'imageFactory', 'authenticationFactory', function($http, $q, $log, $rootScope, timeService, Activity, facebook, imageFactory, authenticationFactory) {

  var facebookActivityFactory = {};

  facebookActivityFactory.getFacebookActivities = function() {

    var getFacebookActivitiesPromise = $q.defer();

    authenticationFactory.getFacebookSessionToken().then(function(fb_session_token) {
      var facebookRequestPromises = [];

      for (var year = 1; year < 6; year++) {
        var allFacebookActivities = [];
        var postsRequestURI = 'https://graph.facebook.com/me/posts?since=' + timeService.getSinceEpochTimeForYearsAgo(year) 
                                                 + '&until=' 
                                                 + timeService.getUntilEpochTimeForYearsAgoWithRange(year, 20)
                                                 + '&limit=200'
                                                 + '&access_token=' + fb_session_token;

        facebookRequestPromises.push(createFacebookActivityPromise(postsRequestURI));
      }

      return $q.all(facebookRequestPromises);
    },
    function(error) {
      getFacebookActivitiesPromise.reject(error);
    }).then(function(facebookRequestsResponses) {
      return parseFacebookRequestResponses(facebookRequestsResponses);
    },
    function(error) {
      getFacebookActivitiesPromise.reject(error);
    }).then(function(parse_response) {
      var facebook_activities_to_save = parse_response[0];
      var facebook_activities_to_show = parse_response[1];

      Activity.saveAllToParse(facebook_activities_to_save, $rootScope.sessionUser.id);
      getFacebookActivitiesPromise.resolve(facebook_activities_to_show);
    },
    function(error) {
      getFacebookActivitiesPromise.reject(error);
    });

    return getFacebookActivitiesPromise.promise;
  }

  function createFacebookActivityPromise(facebook_request_uri) {
    var facebookRequestPromise = $q.defer();

    var start_time = new Date().getTime();

    $http({
      method:'GET',
      url:facebook_request_uri
    }).
    success(function(data, status, headers, config) {
      var end_time = new Date().getTime();
      //console.log(end_time - start_time);
      facebookRequestPromise.resolve(data);
    }).
    error(function(data, status, headers, config) {
      console.log(data);
      facebookRequestPromise.reject(data);
    });

    return facebookRequestPromise.promise;
  }

  function parseFacebookRequestResponses(facebook_request_responses) {
    var parseFacebookRequestResponsesPromise = $q.defer();

    var allFacebookActivitiesToSave = [];
    var allFacebookActivitiesToShow = [];

    var validFacebookActivities = [];

    // extract all the facebook data objects from the responses

    var mostRecentActivityDate;

    for (var fbIndex = 0; fbIndex < facebook_request_responses.length; fbIndex++) {
        var response = facebook_request_responses[fbIndex];

        if (response && !response.error) {
          console.log(response);
          var data = response['data'];
          var valid_data = [];

          for (var index = 0; index < data.length; index++)  {
            var data_object = data[index];

            if (isValidFacebookActivity(data_object)) {
              valid_data.push(data_object);
            }
          }

          console.log(valid_data);
          validFacebookActivities.push.apply(validFacebookActivities, valid_data);
        } else {
          console.log(response.error);
        }
    }

    console.log(validFacebookActivities.length);

    var getImagePromises = [];
    // for data objects with images check to see if we have valid images (image exists, has usable resolution)
    for (var fb_object_index = 0; fb_object_index < validFacebookActivities.length; fb_object_index++) {
      var facebook_object = validFacebookActivities[fb_object_index];

      var image_url = facebook_object['picture'];

      if (image_url) {
        // facebook_object is picture so parse for image
        getImagePromises.push(getImageFromFacebookObject(facebook_object));
      } else {
        // facebook_object is not a picture so store it
        createActivityFromFacebookObject(allFacebookActivitiesToSave, 
                                         allFacebookActivitiesToShow, 
                                         facebook_object, null);
      }
    }

    $q.all(getImagePromises).then(function(imageResponses) {
      for (var imageIndex = 0; imageIndex < imageResponses.length; imageIndex++) {
        var imageResponse = imageResponses[imageIndex];
        console.log(imageResponse);

        if (imageResponse) {

          if (imageResponse instanceof Array) {
            console.log('handling reponse from getImageFromFacebookPostRequest');
            // handle response from getImageFromFacebookPostRequest
            var facebook_object = imageResponse[0];
            var image_url = imageResponse[1]['source'];

            createActivityFromFacebookObject(allFacebookActivitiesToSave,
                                             allFacebookActivitiesToShow,
                                             facebook_object,
                                             image_url);
          } else {
            // handle response from getImageFromFacebookObject
            createActivityFromFacebookObject(allFacebookActivitiesToSave,
                                             allFacebookActivitiesToShow,
                                             imageResponse,
                                             null);
          }
        }
      }

      var parseFacebookRequestResponse = [];
      parseFacebookRequestResponse.push(allFacebookActivitiesToSave);
      parseFacebookRequestResponse.push(allFacebookActivitiesToShow);

      parseFacebookRequestResponsesPromise.resolve(parseFacebookRequestResponse);
    });

    return parseFacebookRequestResponsesPromise.promise;
  }

  function getImageFromFacebookObject(facebook_object) {
    var getImageFromFacebookObjectPromise = $q.defer();

    var media_url = getMediaURLFromFacebookImageURL(facebook_object['picture']);

    imageFactory.isValidImage(media_url).then(function(isValidImage) {
      if (isValidImage) {
        getImageFromFacebookObjectPromise.resolve(facebook_object);
      } else {
        // make post request to get high resolution image
        var post_object_id = facebook_object['object_id'];
        if (post_object_id) {
          return getImageFromFacebookPostRequest(facebook_object);
        } else {
          getImageFromFacebookObjectPromise.resolve(false);
        }
      }
    }).then(function(fb_object_and_media_url_from_post_request) {
      getImageFromFacebookObjectPromise.resolve(fb_object_and_media_url_from_post_request);
    });

    return getImageFromFacebookObjectPromise.promise;
  }

  function getImageFromFacebookPostRequest(facebook_object) {
    var post_object_id = facebook_object['object_id'];

    var getImageFromPostObjectPromise = $q.defer();

    authenticationFactory.getFacebookSessionToken().then(function(fb_session_token) {
      var postRequestURI = 'https://graph.facebook.com/' + post_object_id 
                                                         + '?fields=images' 
                                                         + '&access_token=' 
                                                         + fb_session_token;
      $http({
        method:'GET',
        url: postRequestURI
      }).
      success(function(data, status, headers, config) {
        console.log(data);
        var image_urls = data['images'];

        // grabbing only first image for now, might need to optimize at some point
        var image_url = image_urls[0];

        var response_array = [];
        response_array.push(facebook_object);
        response_array.push(image_url);

        getImageFromPostObjectPromise.resolve(response_array);
      }).
      error(function(data, status, headers, config) {
        console.log(data);
        getImageFromPostObjectPromise.resolve(false);
      });
    },
    function(error) {
      getImageFromPostObjectPromise.resolve(false);
    });

    return getImageFromPostObjectPromise.promise;
  }

  function createActivityFromFacebookObject(facebook_activities_to_save, facebook_activities_to_show, facebook_object, media_url) {
   var createdTime = new Date(facebook_object['created_time'].replace(/\+0000/, 'Z')); // this is so hacky
   //createdTime = new Date(1281261356 * 1000);

   if (!media_url) {
    var media_url = getMediaURLFromFacebookImageURL(facebook_object['picture']);
   }

   var activity = Activity.build({'activityType': Activity.ActivityTypeEnum.ActivityTypeFacebook,
                                  'message': facebook_object['message'],
                                  'createdTime': createdTime,
                                  'mediaURL': media_url,
                                  'originalLink': getOriginalLinkFromFacebookPostObject(facebook_object),
                                  'forUserID': $rootScope.sessionUser.id,
                                  'forUserName': $rootScope.sessionUser.get('fullName'),
                                  'forUserProfilePictureURL': $rootScope.sessionUser.get('profilePictureURL'),
                                  'likes': 0});

   facebook_activities_to_save.push(activity);

   if (timeService.isEligibleToThrowbackToday(createdTime)) {
    facebook_activities_to_show.push(activity);
   }
  }

  function isValidFacebookActivity(data_object) {
    var facebookActivityType = data_object['type'];
    var facebookActivityStatusType = data_object['status_type'];

    if (facebookActivityType != 'status' && 
        facebookActivityType != 'link' &&
        facebookActivityType != 'photo') {
      return false;
    }

    if (!facebookActivityStatusType) {
      return false;
    }

    if (facebookActivityStatusType != 'mobile_status_update' && 
        facebookActivityStatusType != 'shared_story' &&
        facebookActivityStatusType != 'added_photos') {
        facebookActivityStatusType != 'tagged_in_photo'
        return false;
    }

    return true;
  }

  function getMediaURLFromFacebookImageURL(image_url) {
    if (image_url) {
      if (image_url.indexOf('.jpg?') > -1) {
        return image_url;
      }
      if (image_url.indexOf('/s130x130') > -1) {
        image_url = image_url.replace(/\/s130x130/, '');
      }
      if (image_url.indexOf('/p130x130') > -1) {
        image_url = image_url.replace(/\/s130x130/, '');
      }
      if (image_url.indexOf('_s.jpg') > -1) {
        image_url = image_url.replace(/_s.jpg/, '_o.jpg');
      }
      if (image_url.indexOf('_n.jpg') > -1) {
        image_url = image_url.replace(/_n.jpg/, '_o.jpg');
      }
      return image_url;
    }
    return null;
  }

  function getOriginalLinkFromFacebookPostObject(data_object) {
    var baseURL = 'https://www.facebook.com/';
    var userAndPostID = data_object['id'];
    var userID = userAndPostID.split('_')[0];
    var postID = userAndPostID.split('_')[1];

    return baseURL + userID + '/posts/' + postID;
  }

  return facebookActivityFactory;
}]);