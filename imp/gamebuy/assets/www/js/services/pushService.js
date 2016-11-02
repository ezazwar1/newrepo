angular.module('push.services', [])

.service('PushServ', function($state, $rootScope, $cordovaPush, $cordovaToast, $http, gbgConfig) {

    // Register
    this.register = function () {
        console.log("Register push notification for this device");
        var config;

        if (ionic.Platform.isAndroid()) {
            config = {
                "senderID": "643277737547"
                //"ecb": "onNotificationGCM"
            };
        }
        else if (ionic.Platform.isIOS()) {
            config = {
                "badge": true,
                "sound": true,
                "alert": true
                //"ecb":"onNotificationAPN"
            }
        }

        $cordovaPush.register(config).then(function (result) {
            console.log("Push Notification register success " + result);

            // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
            if (ionic.Platform.isIOS()) {
                storeDeviceToken("ios", result);
            }
        }, function (err) {
            console.log("Push Notification register error " + err)
        });

        this.registerPushNotificationReceived();
    };

    // Notification Received
    this.registerPushNotificationReceived = function() {
        console.log("Register push notification for this app");

        $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
            console.log("$cordovaPush:notificationReceived");
            if (ionic.Platform.isAndroid()) {
                handleAndroid(event, notification);
                $rootScope.$broadcast('pushChatReceived', notification);
            }
            else if (ionic.Platform.isIOS()) {
                handleIOS(notification);
                $rootScope.$broadcast('pushChatReceived', notification);
            }
        });
    };

    // Android Notification Received Handler
    function handleAndroid(event, notification) {
        // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
        //             via the console fields as shown.
        if (notification.event === "registered") {
            storeDeviceToken("android", notification.regid);
        }
        else if (notification.event === "message") {
            if ($state.current.name !== "tab.chats" && $state.current.name !== "chat")
                $cordovaToast.showShortCenter("You have a new chat message: \n" + notification.message);
        }
        else if (notification.event === "error") {
            $cordovaToast.showShortCenter("Push notification error event");
        }
        else {
            $cordovaToast.showShortCenter("Push notification handler - Unprocessed Event");
        }
    };

    // IOS Notification Received Handler
    function handleIOS(notification) {
        // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
        // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
        // the notification when this code runs (weird).
        if (notification.foreground == "1") {
            if (notification.badge) {
                $cordovaPush.setBadgeNumber(0).then(function (result) {
                    console.log("Set badge success " + result)
                }, function (err) {
                    console.log("Set badge error " + err)
                });
            }
            if (notification.alert) {
                if ($state.current.name !== "tab.chats" && $state.current.name !== "chat")
                    $cordovaToast.showShortCenter("You have a new chat message: \n" + notification.alert);
            }
        }
    };

    // Stores the device token in a db using node-pushserver (running locally in this case)
    // type:  Platform type (ios, android etc)
    function storeDeviceToken(type, regid) {
        console.log("storeDeviceToken called. type is "+type + " regid is " +regid);

        $http.post(gbgConfig.api_url+'gamer_push_update',{device:type, push_id:regid})
            .success(function (data, status) {
                console.log("Token stored successful");
                console.log(JSON.stringify(data));
            })
            .error(function (data, status) {
                console.log("Error storing device token." + data + " " + status)
            }
        );
    };

    // Unregister - Unregister your device token from APNS or GCM
    // Not recommended:  See http://developer.android.com/google/gcm/adv.html#unreg-why
    //                   and https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/index.html#//apple_ref/occ/instm/UIApplication/unregisterForRemoteNotifications
    //
    // ** Instead, just remove the device token from your db and stop sending notifications **
    this.unregister = function () {
        console.log("Unregister called");
        removeDeviceToken();
    };

    // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
    // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
    // time the app opens which this currently does. However in many cases you will always receive the same device token as
    // previously so multiple userids will be created with the same token unless you add code to check).
    function removeDeviceToken() {
        // var tkn = {"token": $scope.regId};
        // $http.post('http://192.168.1.16:8000/unsubscribe', JSON.stringify(tkn))
        //     .success(function (data, status) {
        //         console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
        //     })
        //     .error(function (data, status) {
        //         console.log("Error removing device token." + data + " " + status)
        //     }
        // );
    };
});
