'use strict';

app.factory('Event', [
  '$rootScope',
  '$window',
  '$timeout',
  'Session',
  'PubNub',
  'CONFIG',
function($rootScope, $window, $timeout, Session, PubNub, CONFIG) {

  PubNub.init({
    publish_key: CONFIG.publish_key,
    subscribe_key: CONFIG.subscribe_key,
    secret_key: CONFIG.secret_key,
    ssl: true
  });

  var Event = {
    registerNotify: function(){
        if ($window.cordova) {
            console.log('[Event] registerNotify');
            $window.cordova.plugins.WorkNinjaExt.registerRemoteNotifications();
        }
    } ,
    locationManagerRegister: function(){
        if ($window.cordova) {
            console.log('[Event] locationManagerRegister');
            $window.cordova.plugins.WorkNinjaExt.locationManagerRegister();
        }
    } ,
    subscribe: function() {
      if (Session.currentUser) {
        var channels = PubNub.ngListChannels();
        var subscribed = _.find(channels, function(c) {return c === Session.currentUser.channel_id});
        if (subscribed) {
          console.log('[Event] already subscribed to ' + Session.currentUser.channel_id);
        }
        else {
          //_.each(channels, function(c) {
          //  console.log('[Event] unsubscribing from ' + c);
          //  PubNub.ngUnsubscribe(c);
          //});
          Event.unsubscribeAll();
          console.log('[Event] subscribing to ' + Session.currentUser.channel_id);
          PubNub.ngSubscribe({
            channel: Session.currentUser.channel_id,
            callback: function (message, envelope, channel) {
              console.log('[Event] ' + message.event + ': ' + JSON.stringify(message.data));
              $rootScope.$broadcast('event:' + message.event, message.data);
            }
          });
          if ($window.cordova) {

            $window.cordova.plugins.WorkNinjaExt.enableRemoteNotifications({
              channel: Session.currentUser.channel_id
            });
          }
        }
      }
    },

    unsubscribe: function() {
      if (Session.currentUser) {
        var channels = PubNub.ngListChannels();
        var subscribed = _.find(channels, function(c) {return c === Session.currentUser.channel_id});
        if (!subscribed) {
          console.log('[Event] already unsubscribed from ' + Session.currentUser.channel_id);
        }
        else {
          console.log('[Event] unsubscribing from ' + Session.currentUser.channel_id);
          PubNub.ngUnsubscribe({
            channel: Session.currentUser.channel_id
          });
          if ($window.cordova) {
            $window.cordova.plugins.WorkNinjaExt.disableRemoteNotifications({
              channel: Session.currentUser.channel_id
            });
          }
        }
      }
    },

    unsubscribeAll: function() {
      var channels = PubNub.ngListChannels();
      _.each(channels, function(c) {
        console.log('[Event] unsubscribing from ' + c);
        PubNub.ngUnsubscribe({channel: c});
        if ($window.cordova) {
          $window.cordova.plugins.WorkNinjaExt.disableRemoteNotifications({
            channel: c
          });
        }
      });
    }
  };

  // unsubscribe on logout
  $rootScope.$on('event:auth-logoutComplete', function() {
    Event.unsubscribeAll();
  });

  return Event;

}]);
