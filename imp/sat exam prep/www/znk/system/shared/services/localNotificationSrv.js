(function (angular,ionic) {
    'use strict';

    angular.module('znk.sat').factory('LocalNotificationSrv', [ '$window', 'UserProfileSrv',
        function ($window, UserProfileSrv) {

            var appName = '';

            var LocalNotificationSrv = {
                notificationEnabled: true
            };

            LocalNotificationSrv.enableNotifications = function enableNotifications(shouldEnable){
                LocalNotificationSrv.notificationEnabled = shouldEnable;
            };

            LocalNotificationSrv.initNotification = function(){

                if ($window.plugin && $window.plugin.notification && $window.plugin.notification.local){
                    $window.plugin.notification.local.clearAll();
                }

                LocalNotificationSrv.setNotification();
            };

           LocalNotificationSrv.setNotification = function setNotification(){

                if (!LocalNotificationSrv){
                    return;
                }

                if ($window.plugin && $window.plugin.notification && $window.plugin.notification.local){

                    var todayMidnight = new Date();
                    todayMidnight.setHours(24,0,0,0);
                    var nextTwoDaysFivePM = new Date(todayMidnight);
                    nextTwoDaysFivePM.setHours(todayMidnight.getHours() + 65);
                    var nextWeekFivePM = new Date(todayMidnight);
                    nextWeekFivePM.setHours(todayMidnight.getHours() + 161);

                    var getUserProfileProm = UserProfileSrv.get();
                    getUserProfileProm.then(function(userProfile){
                        //Debug purposes
                        // var today = new Date();
                        // var nextTwoDaysFivePM = new Date(today);
                        // nextTwoDaysFivePM.setMinutes(today.getMinutes() + 2);
                        // var nextWeekFivePM = new Date(today);
                        // nextWeekFivePM.setMinutes(today.getMinutes() + 5);

                        var userName='';
                        if (userProfile.nickname){
                            userName = (userProfile.nickname + ', ');
                        }
                        var displayMsg = userName + 'You should get ready for your SAT. Let\'s go!';

                        $window.plugin.notification.local.schedule({
                            id:     10,
                            title:  appName,  // The title of the message
                            text:   displayMsg,  // The message that is displayed
                            at:     nextTwoDaysFivePM    // This expects a date object
                        });
                        $window.plugin.notification.local.schedule({
                            id:     11,
                            title:  appName,  // The title of the message
                            text:   displayMsg,  // The message that is displayed
                            at:     nextWeekFivePM    // This expects a date object
                        });
                    });
                }
           };

            return LocalNotificationSrv;
        }
    ]);
})(angular,ionic);
