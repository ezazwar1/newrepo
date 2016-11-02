'use strict';

/**
* @ngdoc service
* @name starter.notificationService
* @requires $cordovaLocalNotification
* @requires $state
* @requires LOCAL_NOTIFICATIONS_ARRAY
* @requires ONESIGNAL_APP_ID
* @requires GCM_SENDER_ID
* @description
* Initializes the notification service. This will register the device for push notifications. Subscribes the 
* device for a scheduled notification with random greeting message notified in 86400000 seconds from now
*/
angular.module('starter')
    .service('notificationService', function ($cordovaLocalNotification, $state, LOCAL_NOTIFICATIONS_ARRAY, ONESIGNAL_APP_ID, GCM_SENDER_ID) {
        var scheduledNotifications = LOCAL_NOTIFICATIONS_ARRAY;

        var setScheduledNotification = function () {
            var time = 86400000;
            var rand = Math.floor(Math.random() * scheduledNotifications.length);

            $cordovaLocalNotification.schedule({
                id: 9999,
                date: new Date(new Date().getTime() + time),
                text: scheduledNotifications[rand].text,
                title: scheduledNotifications[rand].title,
                icon: "icon"
            });

        }

        var scheduleReminderNotification = function () {
            $cordovaLocalNotification.getScheduledIds().then(function (scheduledIds) {
                if (scheduledIds) {
                    $cordovaLocalNotification.cancel('9999');
                }

                setScheduledNotification();
            });
        }

        /**
         * @ngdoc function
         * @name starter.notificationService#subscribeForPush
         * @methodOf starter.notificationService
         * @kind function
         * 
         * @description
         * Initializes the notification service. This will register the device for push notifications.
         *
         */
        this.subscribeForPush = function () {
            if (window.plugins && window.plugins.OneSignal) {

                var notificationOpenedCallback = function () { };

                var iosSettings = {};
                iosSettings["kOSSettingsKeyAutoPrompt"] = true;
                iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

                window.plugins.OneSignal
                .startInit(ONESIGNAL_APP_ID, GCM_SENDER_ID)
                .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
                .iOSSettings(iosSettings)
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

                window.plugins.OneSignal.registerForPushNotifications();
                window.plugins.OneSignal.setSubscription(true);
            }
        }

        /**
         * @ngdoc function
         * @name starter.notificationService#unsubscribeFromPush
         * @methodOf starter.notificationService
         * @kind function
         * 
         * @description
         * Unsubscribes the device from push notifications and local notifications.
         *
         */
        this.unsubscribeFromPush = function () {
            if (window.plugins && window.plugins.OneSignal) {
                window.plugins.OneSignal.setSubscription(false);
            }

            $cordovaLocalNotification.cancel('9999');
        }

        /**
         * @ngdoc function
         * @name starter.notificationService#init
         * @methodOf starter.notificationService
         * @kind function
         * 
         * @description
         * Subscribes the device for a scheduled notification with random greeting message notified in 86400000 seconds from now
         *
         */
        this.init = function () {
            scheduleReminderNotification();
        }
    });