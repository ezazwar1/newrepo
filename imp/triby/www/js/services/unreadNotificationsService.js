'use strict';

MyApp.service('UnreadNotificationsService', function ($http, $rootScope, $stateParams,  $state, $cordovaBadge, PubNubServiceNew, UserService, ChatService, NotificationService) {

  var UnreadNotificationsService = {},
    pubNubNotificationsInstance,
    isIos;

  function initUserNotificationsSubscriber() {
    var authData = UserService.getAuthData();

    /**
     * Create PubSub instance with channel and uuid.
     */
    pubNubNotificationsInstance = PubNubServiceNew.init(authData.id, 'unreadUserInfoInstance');

    pubNubNotificationsInstance.subscribeToChannel('unread_notifications_' + authData.id, function(message) {
      ('message!!!!!!!!!!!!!!!!!!!!!!!!!!!1', message);
      if (!message.type) {
        return;
      }

      console.log('message got in pubNubNotificationsInstance', message);
      console.log('$rootScope.unreadMessages', $rootScope.unreadMessages);


      //for updating app icon badge (when required we will use info about unread message and unread groups notifications)
      if(message.decrease_count) {
        NotificationService.decreaseBadge(-message.decrease_count)
      }
      console.log('message.type', message.type);
      switch (message.type) {
        case 'messages_notification':
          if(message.require_chats_update && $state.current.name === 'app.chats') {
            $rootScope.$emit('chats_notification', message.chat);
          }
          console.log('message.unread_messages', message.unread_messages);
          //if(message.chat === ChatService.getCurrentChat()._id) return
          //


           if($state.current.name === 'app.chats') {


             $rootScope.$apply(function() {
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
                                  NotificationService.setBadge($rootScope.unreadMessages);
                                }
                              })
                       });
                     }else {
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
                                 NotificationService.setBadge($rootScope.unreadMessages);
                               }
                             })
           }

          if(!message.decrease_count) {
            if($state.current.name === 'app.chat' && message.chat == $stateParams.chatId) {
              break;
            } else {
              NotificationService.setBadge(message.unread_messages + $rootScope.unreadGroupsNotifications);
            }
          }
          break;
        case 'groups_notification':
          if(message.event_type === 'post_added' && message.tribe && message.tribe._id === $stateParams.triby_id) {
            var feedBox = document.getElementById('feedBox');
            if(feedBox && !feedBox.classList.contains('show-load-button')) {
              feedBox.classList.add('show-load-button');
            }
            var loadNewPosts = document.getElementById('loadNewPosts');
            if(loadNewPosts && loadNewPosts.classList.contains('ng-hide')) {
              loadNewPosts.classList.remove('ng-hide');
            }
          }

          if(message.post && $stateParams.post_id === message.post && $state.current.name === 'app.comments') {
            return;
          }

          //need to update app icon badge here
          if(message.event_type === 'post_added' || message.event_type === 'comment_added') {
            NotificationService.setBadge($rootScope.unreadMessages + message.notifications);
          }

          if($state.current.name === 'app.main.home') {
            $rootScope.$emit('tribes_notification', message.tribe);
          }

          if($state.current.name === 'app.main.home' || $state.current.name === 'app.chats') {
            $rootScope.$apply(function() {
              $rootScope.unreadGroupsNotifications = message.notifications;
            });
          }else {
            $rootScope.unreadGroupsNotifications = message.notifications;
          }
          break;
        case 'groups_notification_common':
          if(message.removed_from_tribe_id) {
            $rootScope.$emit('removed_from_tribe', {tribeId: message.removed_from_tribe_id});
          }

          if(message.notifications > -1) {
            if($state.current.name === 'app.main.home' || $state.current.name === 'app.chats') {
              $rootScope.$apply(function() {
                $rootScope.unreadGroupsNotifications = message.notifications;
              });
            }else {
              $rootScope.unreadGroupsNotifications = message.notifications;
            }
          }

          if(!message.decrease_count) {
            NotificationService.setBadge($rootScope.unreadMessages + message.notifications);
          }

          break;
        case 'chat_removed':
          if($state.current.name === 'app.chats' || $state.current.name === 'app.chat') {
            $rootScope.$emit('chat_removed', message);
          }

          if($state.current.name === 'app.main.home' || $state.current.name === 'app.chats') {
            $rootScope.$apply(function() {
              $rootScope.unreadMessages = message.unreadMessages;
            });
          }else {
            $rootScope.unreadMessages = message.unreadMessages;
          }

          if(!message.decrease_count) {
            NotificationService.setBadge(message.unreadMessages + $rootScope.unreadGroupsNotifications);
          }

          break;

        case 'added_to_group':
          if($state.current.name === 'app.main.home') {
            $rootScope.$emit('added_to_group', message);
          }

          //if user was added to some group it mean that one unread notification was created, so we should update app icon badge
          if($state.current.name === 'app.chats') {
            $rootScope.$apply(function() {
              $rootScope.unreadGroupsNotifications = $rootScope.unreadGroupsNotifications + 1;
            });
          } else {
            $rootScope.unreadGroupsNotifications = $rootScope.unreadGroupsNotifications + 1;
          }
          NotificationService.decreaseBadge(1);
          break;

        default:
          break;
      }
    });
  }

  function restoreIfBroken() {
    if(!pubNubNotificationsInstance) {
      initUserNotificationsSubscriber();
    }
  }

  function initBadgeSetter() {
    if(ionic.Platform.isIOS()) {
      $cordovaBadge.promptForPermission();
      isIos = true;
    }
  }

  UnreadNotificationsService = {
    init: initUserNotificationsSubscriber,
    restoreIfBroken: restoreIfBroken,
    initBadgeSetter: initBadgeSetter
  };

  return UnreadNotificationsService;
});
