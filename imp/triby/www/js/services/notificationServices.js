'use strict';

MyApp.factory('NotificationService', function ($q,
                                               $rootScope,
                                               $http,
                                               $window,
                                               $state,
                                               $timeout,
                                               $stateParams,
                                               $ionicLoading,
                                               $ionicPlatform,
                                               ConfigService,
                                               UserService,
                                               ChatService,
                                               _) {

  var notificationServiceFactory = {};

  //$rootScope.notificationEventsCount = 0;

  var PushClient = null;

  function onPushNotificationEvent (event) {
    var tribeId;

    $rootScope.debugInfo({"m":'new event', 'd':_.pick(event, 'notification')});

    var eventUserData = null, nEvent, messageData;
    if (!_.isUndefined(event.notification.userdata) && _.isObject(event.notification.userdata)) {
      eventUserData = event.notification.userdata;
    } else if (!_.isUndefined(event.notification.u) && _.isObject(event.notification.u)) {
      eventUserData = event.notification.u;
    } else {
      console.error('Can not fetch notification userdata.');
      return;
    }

    if(event.notification.userdata.tribe && event.notification.userdata.tribe._id) {
      tribeId = event.notification.userdata.tribe._id;
    } else {
      tribeId = event.notification.userdata.tribe;
    }

    //now we have another flow for showing pushes for messages and likes (we don't use api for getting additional info) but for posts and comments old flow used
    //if we got push about personal chat
    if(event.notification.userdata.type === 'message_added') {
      nEvent = {
        number: event.notification.userdata.author_n,
        type: event.notification.userdata.type
      };

      //check if we have to show push
      if(!_isNeedShowBanner(nEvent)) {
        if(nEvent.type === 'message_added' && $state.current.name === 'app.chats' || nEvent.type === 'message_added' && $state.current.name === 'app.chat' && nEvent.number != $stateParams.partner_number) {
          _setBadge(event.notification.userdata.unread_notifications_count);
        }
        return;
      }

      //set current chat here
      UserService.setPartnerData({
        username: event.notification.userdata.name,
        _id: event.notification.userdata.user_id
      });

      messageData = {
        username: event.notification.userdata.name,
        url: 'app.chat',
        url_params: {'partner_number': event.notification.userdata.author_n }
      };

      if(ionic.Platform.isIOS()) {
        if(event.notification.aps) {
          messageData.message = removeStartColons(event.notification.aps.alert.substr(event.notification.userdata.name.length).trim())
        } else {
          messageData.message = 'message...';
        }

      } else {
        messageData.message = removeStartColons(event.notification.title.substr(event.notification.userdata.name.length).trim());
      }

      if (!_.isUndefined(event.notification.userdata)) {
        messageData.avatarSrc = _.result(event.notification.userdata, 'pic', 'img/default_avatar.jpg');
      } else {
        messageData.avatarSrc = 'img/default_avatar.jpg';
      }

      _setBadge(event.notification.userdata.unread_notifications_count);
       var userAuth = UserService.getAuthData();
      console.log('$rootScope.userAuth.mobilenumber', userAuth.mobilenumber);
      console.log('$rootScope. messageData.url_params.url_params', messageData.url_params.partner_number);

      if(userAuth.mobilenumber !== messageData.url_params.partner_number){
            return $rootScope.showNBanner(messageData);
      }
    }

    //if we got push about heart/dislike for post/comment/message
    if(['message_disliked', 'message_hearted', 'post_disliked', 'post_hearted', 'comment_disliked', 'comment_hearted'].indexOf(event.notification.userdata.type) !== -1) {
      //check if banner required
      if(['message_disliked', 'message_hearted'].indexOf(event.notification.userdata.type) !== -1) {
        if($state.params.partner_number === event.notification.userdata.author_n) {
          return;
        }
      } else if($state.params.triby && $state.params.triby._id === tribeId || $state.params.triby_id === tribeId){
        return;
      }

      nEvent = {
        number: event.notification.userdata.author_n,
        type: event.notification.userdata.type
      };

      //set current chat here
      UserService.setPartnerData({
        username: event.notification.userdata.name,
        _id: event.notification.userdata.user_id
      });

      messageData = {
        username: event.notification.userdata.name,
        message: event.notification.title,
        url: 'app.news_feed',
        url_params: {'triby_id': tribeId }
      };

      if(ionic.Platform.isIOS() && event.notification.aps) {
        messageData.message = event.notification.aps.alert;
      }

      if (!_.isUndefined(event.notification.userdata)) {
        messageData.avatarSrc = _.result(event.notification.userdata, 'pic', 'img/default_avatar.jpg');
      } else {
        messageData.avatarSrc = 'img/default_avatar.jpg';
      }
      console.log('$rootScope.showNBanner2222')
      return $rootScope.showNBanner(messageData);
    }

    if(event.notification.userdata.type === 'comment_added' || event.notification.userdata.type === 'post_added') {
        if($state.current.name == 'app.comments' && event.notification.userdata.post_id == $stateParams.post_id
          || $state.current.name === 'app.news_feed' && event.notification.userdata.tribe_id === $stateParams.triby_id
        ) {

          //setTimeout(function() {
          //  _decreaseBadge(-1);
          //}, 1000);

          //_decreaseBadge(-1);
          return;
        }
    }

    //$rootScope.$apply(function () {
    //  $rootScope.notificationEventsCount = _.result(eventUserData, 'unread_notifications_count', 0);
    //});

    _setBadge(_.result(eventUserData, 'unread_notifications_count', 0));

    if (!_.result(eventUserData, 'n_event_id')) {
      console.error('nEvent ID not found.');
      return;
    }

    _getOneNEvent(_.result(eventUserData, 'n_event_id')).then(function (nEventData) {
      if (_isNeedShowBanner(nEventData)) {
        console.log('showNBanner!!!!!!!!!!111111111111111!!!!1')
        $rootScope.showNBanner(nEventData);
      }
    },function (error) {
      console.error(error);
    });
  }

  var _isNeedShowBanner = function (nEventData) {
    // no need banner for likes
    if (
      _.indexOf(['message_disliked', 'message_hearted', 'post_liked', 'post_disliked', 'post_hearted', 'comment_liked', 'comment_disliked', 'comment_hearted'], nEventData.type) > -1
    ) {
      return false;
    }

    if(nEventData.type === 'message_added' && $state.current.name === 'app.chat' && nEventData.number == $stateParams.partner_number) {
      _decreaseBadge(-1);
      return false;
    }

    // user on the same page
    if($state.current.name == 'app.comments' && nEventData.url == 'app.news_feed' && nEventData.url_params.post_id == $stateParams.post_id
      || nEventData.type === 'message_added' && $state.current.name === 'app.chats'
      || nEventData.type === 'post_added' && $state.current.name === 'app.news_feed' && nEventData.url_params && nEventData.url_params.triby_id === $stateParams.triby_id
      //|| nEventData.type === 'message_added' && $state.current.name === 'app.chat'
    ) {
      return false;
    }

    return true;
  };

  var _isEventValid = function (event) {

    if (_.isUndefined(event.context_triby)) {
      return false;
    }

    if (_.indexOf(['comment_added','comment_liked','comment_disliked','comment_hearted'],event.type)>=0) {
      if (_.isUndefined(event.context_data)
        || _.isUndefined(event.context_data.post)
        || _.isUndefined(event.context_data.comment_id)
      ) {
        return false;
      }
    }

    return true;
  };

  var _formatNEvent = function (event) {

    var formattedEvent = {};

    if (!_.isUndefined(event.initiator_user)) {
      formattedEvent.avatarSrc = _.result(event.initiator_user, 'pic', 'img/default_avatar.jpg');
      formattedEvent.username = _.result(event.initiator_user, 'username', '');
    } else {
      formattedEvent.avatarSrc = 'img/default_avatar.jpg';
      formattedEvent.username = '';
    }

    formattedEvent.url = '';
    formattedEvent.url_params = {};

    switch (event.type) {
      case 'post_added':
        formattedEvent.message = 'Created a new post in ' + event.context_triby.name + '.';
        break;
      case 'post_liked':
        formattedEvent.message = 'Liked your post in ' + event.context_triby.name + '.';
        break;
      case 'post_disliked':
        formattedEvent.message = 'Disliked your post in ' + event.context_triby.name + '.';
        break;
      case 'post_hearted':
        formattedEvent.message = 'Hearted your post in ' + event.context_triby.name + '.';
        break;
      case 'user_added':
        formattedEvent.message = 'Added you in ' + event.context_triby.name + ' Triby.';
        formattedEvent.url = 'app.news_feed';
        formattedEvent.url_params = {'triby_id': event.context_triby._id};
        break;
      case 'comment_added':
        formattedEvent.message = 'Commented on your post: ' + event.context_data.comment_text;
        break;
      case 'comment_liked':
        formattedEvent.message = 'Liked your comment in ' + event.context_triby.name + '.';
        break;
      case 'comment_disliked':
        formattedEvent.message = 'Disliked your comment in ' + event.context_triby.name + '.';
        break;
      case 'comment_hearted':
        formattedEvent.message = 'Hearted your comment in ' + event.context_triby.name + '.';
        break;
      default:
        formattedEvent.message = 'DEFAULT MESSAGE, unknown type';
        break;
    }

    if (_.indexOf(['post_added','post_liked','post_disliked','post_hearted'], event.type)>=0) {
      formattedEvent.url = 'app.news_feed';
      formattedEvent.url_params = {
        'triby_id': event.context_triby && event.context_triby._id ? event.context_triby._id : event.context_triby,
        'post_id': event.context_data.post
      };
    } else if (_.indexOf(['comment_added','comment_liked','comment_disliked','comment_hearted'], event.type)>=0) {
      formattedEvent.comment_id = event.context_data.comment_id
      formattedEvent.url = 'app.news_feed';
      formattedEvent.url_params = {
        'post_id': event.context_data.post,
        'triby':event.context_triby,
        'triby_id':event.context_triby._id,
        //'comment_id':event.context_data.comment_id
      };
    }

    formattedEvent.id = event._id;
    formattedEvent.datetime = event.created_at;
    formattedEvent.type = event.type;
    formattedEvent.isViewed = event.is_viewed;

    return formattedEvent;
  };

  var _getNotificationSettings = function() {

      var deferred = $q.defer();
      var authData = UserService.getAuthData();
      $http.defaults.headers.common['Authorization'] = authData.token;

      $http.get($rootScope.urlBackend + '/notification/' + authData.id).success(function(response) {

          // Notification settings don't exists
          if (response.status === "error" && response.notification === null) {

              // Create notification settings
              var notificationData = {
                  "user_id": authData.id
              };
              $http.post($rootScope.urlBackend + '/notification', notificationData).success(function(response) {
                  deferred.resolve(response);
              }).error(function(err, status) {
                  deferred.reject(err);
              });

          } else {
              deferred.resolve(response);
          }
      }).error(function(err, status) {
          deferred.reject(err);
      });

      return deferred.promise;

  };

  var _updateNotificationSettings = function(notificationData) {

        var deferred = $q.defer();
        var authData = UserService.getAuthData();
        $http.defaults.headers.common['Authorization'] = authData.token;

        $http.put($rootScope.urlBackend + '/notification/' + authData.id, notificationData).success(function(response) {
            deferred.resolve(response);
        }).error(function(err, status) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

  var _initPushwoosh = function (callback) {
    var deferred = $q.defer();

    if (angular.isUndefined(window.cordova)) {
      deferred.reject({"type": "no_device", "message": "No device detected. Probably you are in web-browser."});
      return deferred.promise;
    }
    $rootScope.debugInfo({"m":'start registration'});

     PushClient = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

    document.removeEventListener('push-notification', onPushNotificationEvent);
    document.addEventListener('push-notification', onPushNotificationEvent);

    switch (true) {
      case $ionicPlatform.is('ios'):
        PushClient.onDeviceReady({pw_appid: ConfigService.pushwooshAppId});
        break;
      case $ionicPlatform.is('android'):
        PushClient.onDeviceReady({
          projectid: ConfigService.pushwooshGoogleProjectId,
          pw_appid: ConfigService.pushwooshAppId
        });
        break;
      default:
        deferred.reject({"type": "unknown_device", "message": "Unknown device type."});
        break;
    }

    $timeout(function() {
      //register for pushes
      PushClient.registerDevice(
        function (status) {
          var pushToken = status;

          switch (true) {
            case $ionicPlatform.is('ios'):
              $rootScope.debugInfo({"m":'register push token-ios',"d": pushToken});
              console.log('register push token: ', pushToken.deviceToken);
              deferred.resolve(pushToken.deviceToken);
              break;
            case $ionicPlatform.is('android'):
              $rootScope.debugInfo({"m":'register push token-android',"d": pushToken});
              console.log('register push token: ', pushToken);
              deferred.resolve(pushToken);
              break;
            default:
              deferred.reject({"type": "unknown_device", "message": "Unknown device type."});
              break;
          }
        },
        function (status) {
          // check for https://github.com/Pushwoosh/pushwoosh-phonegap-3.0-plugin/issues/76
          if ($ionicPlatform.is('ios') && !status) { // special case
            $rootScope.debugInfo({"m":'Early callback triggered by cordova, ignoring'});
          } else { // normal case
            $rootScope.debugInfo({"m":'failed to register!!',"d": status});
            deferred.reject({"type": "fail_on_register", "message": JSON.stringify(status)});
          }
        }
      );
    }, 50);

    return deferred.promise;
  };

  var _getNotificationEvents = function (params) {

    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;
    var formattedEvents = [];

    $http.get($rootScope.urlBackend + '/notificationevents/user/' + authData.id, {'params': params})
      .success(function (response) {
        _.each(response.notificationEvents, function (event) {
          if (_isEventValid(event)) {
            formattedEvents.push(_formatNEvent(event));
          }
        });
        deferred.resolve(formattedEvents);
      })
      .error(function (err, status) {
        deferred.reject(err);
      });

    return deferred.promise;

  };

  var _getOneNEvent = function (nEventId) {
    console.log('_getOneNEvent', _getOneNEvent);

    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.get($rootScope.urlBackend + '/notificationevents/event/' + nEventId)
      .success(function (response) {
        if (response.status=='success' && response.notificationEvent) {
          if (_isEventValid(response.notificationEvent)) {
            deferred.resolve(_formatNEvent(response.notificationEvent));
          } else {
            deferred.reject({'error':'bad formatted notification event'});
          }
        } else {
          deferred.reject({'error':'some error'});
        }
      })
      .error(function (err, status) {
        deferred.reject(err);
      });

    return deferred.promise;

  };

  var _updateUnreadNotificationsCount = function () {
    console.log('_updateUnreadNotificationsCount')
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.get($rootScope.urlBackend + '/notificationevents/unread_count/'+authData.id)
      .then(function (response) {
        if(!_.isUndefined(response.data.unread_notifications_count)) {
          //$rootScope.notificationEventsCount = response.data.unread_notifications_count;

          _setBadge(response.data.unread_notifications_count);
        }
      });
  };

  function _updateUnreadNotifications() {
      console.log('_updateUnreadNotifications')
    var deferred = $q.defer();
    var authData = _getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.get($rootScope.urlBackend + '/v2/users/me/notifications')
      .success(function (response) {

        if (response.status =='success' && response.data) {
          $rootScope.unreadGroupsNotifications = response.data.unreadGroupsNotifications;
          $rootScope.unreadMessages = response.data.unreadMessages;

          _setBadge(unreadGroupsNotifications + unreadMessages);

          deferred.resolve();
        } else {
          deferred.reject({'error':'some error'});
        }
      })
      .error(function (err, status) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  var _markAsViewed = function (notificationEventId) {
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.put($rootScope.urlBackend + '/v3/notificationevents/read_by_user/' + notificationEventId, {"user_id":authData.id})
      .then(function(response){
        if(!_.isUndefined(response.data.unread_notifications_count)) {
          //$rootScope.notificationEventsCount = response.data.unread_notifications_count;
          console.log('_setBadge!!!!11');
          _setBadge(response.data.unread_notifications_count);
        }
      }
    );
  };

  var _markAsViewedAll = function () {
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.put($rootScope.urlBackend + '/notificationevents/read_by_user/', {"user_id":authData.id})
      .then(function(response){
        if(!_.isUndefined(response.data.unread_notifications_count)) {
          //$rootScope.notificationEventsCount = response.data.unread_notifications_count;
           console.log('_setBadge444')
          _setBadge(response.data.unread_notifications_count);
        }
      }
    );
  };

  function _decreaseBadge(value) {
    if(PushClient && PushClient.addToApplicationIconBadgeNumber)
      PushClient.addToApplicationIconBadgeNumber(value);
  }

  function _setBadge(value) {
    console.log('value!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1', value)
    if(!PushClient) {
      _initPushwoosh.then(function () {
        if(PushClient && typeof PushClient.setApplicationIconBadgeNumber === 'function') {
          PushClient.setApplicationIconBadgeNumber(value);
        }
      });
    } else {
      PushClient.setApplicationIconBadgeNumber(value);
    }
  }

  function _checkBadgesConsistency() {
    if(!PushClient) {
      _initPushwoosh.then(function () {
        if(PushClient && typeof PushClient.getApplicationIconBadgeNumber === 'function') {
          PushClient.getApplicationIconBadgeNumber(compareBadgesNumbers);
        }
      });
    } else {
      PushClient.getApplicationIconBadgeNumber(compareBadgesNumbers);
    }
  }

  function compareBadgesNumbers(count) {
    if(count != $rootScope.unreadGroupsNotifications + $rootScope.unreadMessages) {
      _updateUnreadNotifications();
    }
  }

  function _updateUnreadNotifications() {
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.get($rootScope.urlBackend + '/v2/users/me/notifications', {params: {timestamp: new Date().getTime()}})
      .success(function (response) {
        if (response.status=='success' && response.data) {
          console.log(' $rootScope.unreadMessages',  $rootScope.unreadMessages);
          console.log('response.data.unreadGroupsNotifications', response.data.unreadGroupsNotifications)
          console.log('response.data.unreadMessages', response.data.unreadMessages)
          $rootScope.unreadGroupsNotifications = response.data.unreadGroupsNotifications;
          ChatService.getMyChats()
              .then(function(res) {
                var unreadCounter = 0;
            var chats = [];

                if(res.data.status === "success") {



                   var chats = res.data.chats;

                  //this way will work only if we get all chats
                  if(res.data.chats && res.data.chats.length > 0) {
                    for(var i = 0; i < res.data.chats.length; i++) {
                      if(res.data.chats[i].unread_messages && res.data.chats[i].unread_messages > 0) {
                        unreadCounter = unreadCounter + res.data.chats[i].unread_messages;
                      }
                    }
                  }

                  $rootScope.unreadMessages = unreadCounter;
                    _setBadge($rootScope.unreadMessages);
                  }
                })



//          $rootScope.unreadMessages = response.data.unreadMessages;
          console.log('$rootScope.unreadMessages ', $rootScope.unreadMessages );
           console.log('_setBadge6666')
        } else {
          deferred.reject({'error':'some error'});
        }
      })
      .error(function (err, status) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  function removeStartColons(string) {
    return string.replace(/^:/, '');
  }

    notificationServiceFactory.getNotificationSettings = _getNotificationSettings;
    notificationServiceFactory.updateNotificationSettings = _updateNotificationSettings;
    notificationServiceFactory.initPushwoosh = _initPushwoosh;
    notificationServiceFactory.getNotificationEvents = _getNotificationEvents;
    notificationServiceFactory.updateUnreadNotificationsCount = _updateUnreadNotificationsCount;
    notificationServiceFactory.markAsViewed = _markAsViewed;
    notificationServiceFactory.markAsViewedAll = _markAsViewedAll;
    notificationServiceFactory.setBadge = _setBadge;
    notificationServiceFactory.decreaseBadge = _decreaseBadge;
    notificationServiceFactory.checkBadgesConsistency = _checkBadgesConsistency;
    notificationServiceFactory.updateUnreadNotifications = _updateUnreadNotifications;

    return notificationServiceFactory;
});
