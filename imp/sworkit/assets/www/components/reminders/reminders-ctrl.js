angular.module('swMobileApp').controller('RemindersCtrl', function ($scope, $translate) {
    $scope.$on('$ionicView.enter', function () {
        angular.element(document.getElementsByClassName('bar-header')).addClass('blue-bar');
    });
    if (isNaN(LocalData.SetReminder.daily.minutes)) {
        LocalData.SetReminder.daily.minutes = 0;
    }
    if (isNaN(LocalData.SetReminder.daily.time)) {
        LocalData.SetReminder.daily.time = 7;
    }
    if (isNaN(LocalData.SetReminder.inactivity.minutes)) {
        LocalData.SetReminder.inactivity.minutes = 0;
    }
    if (isNaN(LocalData.SetReminder.inactivity.time)) {
        LocalData.SetReminder.inactivity.time = 7;
    }
    if (isNaN(LocalData.SetReminder.inactivity.frequency)) {
        LocalData.SetReminder.inactivity.frequency = 2;
    }
    $scope.reminderText = {message: ''};
    if (device) {
        cordova.plugins.notification.local.hasPermission(function (granted) {
            if (!granted) {
                $scope.reminderText.message = $translate.instant('UPDATE_REMINDER');
            }
        });
    }

    $scope.reminderTimes = {
        selected: 7,
        times: [{id: 0, real: '12', time: '12 am', short: 'am'}, {id: 1, real: '1', time: '1 am', short: 'am'}, {
            id: 2,
            real: '2',
            time: '2 am',
            short: 'am'
        }, {id: 3, real: '3', time: '3 am', short: 'am'}, {id: 4, real: '4', time: '4 am', short: 'am'}, {
            id: 5,
            real: '5',
            time: '5 am',
            short: 'am'
        }, {id: 6, real: '6', time: '6 am', short: 'am'}, {id: 7, real: '7', time: '7 am', short: 'am'}, {
            id: 8,
            real: '8',
            time: '8 am',
            short: 'am'
        }, {id: 9, real: '9', time: '9 am', short: 'am'}, {id: 10, real: '10', time: '10 am', short: 'am'}, {
            id: 11,
            real: '11',
            time: '11 am',
            short: 'am'
        }, {id: 12, real: '12', time: '12 pm', short: 'pm'}, {id: 13, real: '1', time: '1 pm', short: 'pm'}, {
            id: 14,
            real: '2',
            time: '2 pm',
            short: 'pm'
        }, {id: 15, real: '3', time: '3 pm', short: 'pm'}, {id: 16, real: '4', time: '4 pm', short: 'pm'}, {
            id: 17,
            real: '5',
            time: '5 pm',
            short: 'pm'
        }, {id: 18, real: '6', time: '6 pm', short: 'pm'}, {id: 19, real: '7', time: '7 pm', short: 'pm'}, {
            id: 20,
            real: '8',
            time: '8 pm',
            short: 'pm'
        }, {id: 21, real: '9', time: '9 pm', short: 'pm'}, {id: 22, real: '10', time: '10 pm', short: 'pm'}, {
            id: 23,
            real: '11',
            time: '11 pm',
            short: 'pm'
        }],
        reminder: false
    };
    $scope.inactivityTimes = {
        frequency: 2,
        selected: 7,
        times: [{id: 0, real: '12', time: '12 am', short: 'am'}, {id: 1, real: '1', time: '1 am', short: 'am'}, {
            id: 2,
            real: '2',
            time: '2 am',
            short: 'am'
        }, {id: 3, real: '3', time: '3 am', short: 'am'}, {id: 4, real: '4', time: '4 am', short: 'am'}, {
            id: 5,
            real: '5',
            time: '5 am',
            short: 'am'
        }, {id: 6, real: '6', time: '6 am', short: 'am'}, {id: 7, real: '7', time: '7 am', short: 'am'}, {
            id: 8,
            real: '8',
            time: '8 am',
            short: 'am'
        }, {id: 9, real: '9', time: '9 am', short: 'am'}, {id: 10, real: '10', time: '10 am', short: 'am'}, {
            id: 11,
            real: '11',
            time: '11 am',
            short: 'am'
        }, {id: 12, real: '12', time: '12 pm', short: 'pm'}, {id: 13, real: '1', time: '1 pm', short: 'pm'}, {
            id: 14,
            real: '2',
            time: '2 pm',
            short: 'pm'
        }, {id: 15, real: '3', time: '3 pm', short: 'pm'}, {id: 16, real: '4', time: '4 pm', short: 'pm'}, {
            id: 17,
            real: '5',
            time: '5 pm',
            short: 'pm'
        }, {id: 18, real: '6', time: '6 pm', short: 'pm'}, {id: 19, real: '7', time: '7 pm', short: 'pm'}, {
            id: 20,
            real: '8',
            time: '8 pm',
            short: 'pm'
        }, {id: 21, real: '9', time: '9 pm', short: 'pm'}, {id: 22, real: '10', time: '10 pm', short: 'pm'}, {
            id: 23,
            real: '11',
            time: '11 pm',
            short: 'pm'
        }],
        reminder: false
    };
    $scope.reminderMins = getMinutesObj();
    $scope.reminderMins.selected = $scope.reminderMins.times[LocalData.SetReminder.daily.minutes];
    $scope.reminderTimes.selected = $scope.reminderTimes.times[LocalData.SetReminder.daily.time];
    $scope.reminderTimes.reminder = LocalData.SetReminder.daily.status;
    $scope.inactivityMins = getMinutesObj();
    $scope.inactivityMins.selected = $scope.inactivityMins.times[LocalData.SetReminder.inactivity.minutes];
    $scope.inactivityTimes.selected = $scope.inactivityTimes.times[LocalData.SetReminder.inactivity.time];
    $scope.inactivityTimes.reminder = LocalData.SetReminder.inactivity.status;
    $scope.inactivityTimes.frequency = LocalData.SetReminder.inactivity.frequency;
    $scope.inactivityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    if (device) {
        cordova.plugins.notification.local.cancelAll();
    }
    var newDate = new Date();
    newDate.setHours($scope.reminderTimes.selected.id);
    newDate.setMinutes($scope.reminderMins.selected.id);
    var newDate2 = new Date();
    newDate2.setHours($scope.inactivityTimes.selected.id);
    newDate2.setMinutes($scope.inactivityMins.selected.id);

    $scope.datePickerOpen = function () {
        if (device) {
            datePicker.show(
                {
                    "date": newDate,
                    "mode": "time"
                },
                function (returnDate) {
                    if (!isNaN(returnDate.getHours())) {
                        $scope.reminderTimes.selected = $scope.reminderTimes.times[returnDate.getHours()];
                        $scope.reminderMins.selected = $scope.reminderMins.times[returnDate.getMinutes()];
                        $scope.$apply();
                    }
                }
            )
        }

    };
    $scope.datePicker2Open = function () {
        if (device) {
            datePicker.show(
                {
                    "date": newDate2,
                    "mode": "time"
                },
                function (returnDate) {
                    if (!isNaN(returnDate.getHours())) {
                        $scope.inactivityTimes.selected = $scope.inactivityTimes.times[returnDate.getHours()];
                        $scope.inactivityMins.selected = $scope.inactivityMins.times[returnDate.getMinutes()];
                        $scope.$apply();
                    }
                }
            )
        }

    };

    $scope.closeScreen = function () {
        if (device) {
            LocalData.SetReminder.daily.time = $scope.reminderTimes.selected.id;
            LocalData.SetReminder.daily.minutes = $scope.reminderMins.selected.id;
            LocalData.SetReminder.daily.status = $scope.reminderTimes.reminder;
            LocalData.SetReminder.inactivity.time = $scope.inactivityTimes.selected.id;
            LocalData.SetReminder.inactivity.minutes = $scope.inactivityMins.selected.id;
            LocalData.SetReminder.inactivity.status = $scope.inactivityTimes.reminder;
            LocalData.SetReminder.inactivity.frequency = $scope.inactivityTimes.frequency;
            if (($scope.reminderTimes.reminder || $scope.inactivityTimes.reminder) && ionic.Platform.isIOS()) {
                cordova.plugins.notification.local.hasPermission(function (granted) {
                    if (!granted) {
                        cordova.plugins.notification.local.registerPermission();
                    }
                });
            }
            if ($scope.reminderTimes.reminder) {
                var dDate = new Date();
                var tDate = new Date();
                dDate.setHours($scope.reminderTimes.selected.id);
                dDate.setMinutes($scope.reminderMins.selected.id);
                dDate.setSeconds(0);
                if ($scope.reminderTimes.selected.id <= tDate.getHours() && $scope.reminderMins.selected.id <= tDate.getMinutes()) {
                    dDate.setDate(dDate.getDate() + 1);
                }
                cordova.plugins.notification.local.schedule({
                    id: 1,
                    text: $translate.instant('TIME_TO_SWORKIT'),  // The message that is displayed
                    title: $translate.instant('WORKOUT_REM'),  // The title of the message
                    at: dDate,
                    autoClear: true,
                    smallIcon: 'ic_launcher',
                    icon: 'ic_launcher',
                    every: "day" // "minute", "hour", "week", "month", "year"
                });
                cordova.plugins.notification.local.on("click", function (notification) {
                    cordova.plugins.notification.local.cancel(1);
                    var nDate = new Date();
                    var tDate = new Date();
                    nDate.setHours(LocalData.SetReminder.daily.time);
                    nDate.setMinutes(LocalData.SetReminder.daily.minutes);
                    nDate.setSeconds(0);
                    if (tDate.getHours() <= nDate.getHours() && tDate.getMinutes() <= nDate.getMinutes()) {
                        nDate.setDate(nDate.getDate() + 1);
                    }
                    $timeout(function () {
                        cordova.plugins.notification.local.schedule({
                            id: 1,
                            text: $translate.instant('TIME_TO_SWORKIT'),  // The message that is displayed
                            title: $translate.instant('WORKOUT_REM'),  // The title of the message
                            at: nDate,
                            autoClear: true,
                            smallIcon: 'ic_launcher',
                            icon: 'ic_launcher',
                            every: "day" // "minute", "hour", "week", "month", "year"
                        });
                    }, 2000);
                });
                logActionSessionM('SetReminder');
            }
            if ($scope.inactivityTimes.reminder) {
                var dDate = new Date();
                dDate.setHours($scope.inactivityTimes.selected.id);
                dDate.setMinutes($scope.inactivityMins.selected.id);
                dDate.setSeconds(0);
                dDate.setDate(dDate.getDate() + $scope.inactivityTimes.frequency);
                cordova.plugins.notification.local.schedule({
                    id: 2,
                    text: $translate.instant('TOO_LONG'),  // The message that is displayed
                    title: $translate.instant('WORKOUT_REM'),  // The title of the message
                    at: dDate,
                    autoClear: true,
                    smallIcon: 'ic_launcher',
                    icon: 'ic_launcher'
                });
                cordova.plugins.notification.local.on("click", function (notification) {
                    cordova.plugins.notification.local.cancel(2);
                    var nDate = new Date();
                    nDate.setHours(LocalData.SetReminder.inactivity.time);
                    nDate.setMinutes(LocalData.SetReminder.inactivity.minutes);
                    nDate.setSeconds(0);
                    nDate.setDate(nDate.getDate() + $scope.inactivityTimes.frequency);
                    $timeout(function () {
                        cordova.plugins.notification.local.schedule({
                            id: 2,
                            text: $translate.instant('TOO_LONG'),  // The message that is displayed
                            title: $translate.instant('WORKOUT_REM'),  // The title of the message
                            at: nDate,
                            autoClear: true,
                            smallIcon: 'ic_launcher',
                            icon: 'ic_launcher'
                        });
                    }, 2000);
                });
                logActionSessionM('SetReminder');
            }

            localforage.setItem('reminder', {
                daily: {
                    status: $scope.reminderTimes.reminder,
                    time: $scope.reminderTimes.selected.id,
                    minutes: $scope.reminderMins.selected.id
                },
                inactivity: {
                    status: $scope.inactivityTimes.reminder,
                    time: $scope.inactivityTimes.selected.id,
                    minutes: $scope.inactivityMins.selected.id,
                    frequency: $scope.inactivityTimes.frequency
                }
            });
        }
    };

    $scope.$on('$ionicView.leave', function () {
        $scope.closeScreen();
        angular.element(document.getElementsByClassName('bar-header')).removeClass('blue-bar');
    });
});
