angular.module('swMobileApp').controller('HomeCtrl', function ($rootScope, $scope, $timeout, $ionicSideMenuDelegate, $location, $translate, $ionicPopup, $ionicModal, $stateParams, UserService, WorkoutService, AccessService, $log) {
    $log.info("HomeCtrl");

    $scope.init = function () {
        LocalHistory.getCustomHistory.lastHomeURL = $location.$$url;
        $scope.title = "<img src='img/sworkit_logo.png'/>";
        $scope.timesUsedVar = parseInt(window.localStorage.getItem('timesUsed'));
        $scope.rewardSettings = UserService.getUserSettings();
        if ($scope.rewardSettings.preferredLanguage == undefined) {
            localforage.getItem('userSettings', function (result) {
                if (result !== null) {
                    $translate.use(result.preferredLanguage);
                }
            })
        }
        $scope.quickImage = {img: 'quick-' + $translate.instant('LANGUAGE')};
        $rootScope.showPointsBadge = false;
        $rootScope.mPointsTotal = 0;
        $scope.rateAttempts = 0;
        $scope.customPromoText = globalSworkitAds.customWorkoutText || false;
        $scope.homeLoaded = false;
        var timeoutToWaitForLoadStoredDataButNoGuarantee = 2500;
        $timeout(function () {
            $scope.rewardSettings = UserService.getUserSettings();
            if ($scope.rewardSettings.mPoints && device && $rootScope.sessionMAvailable) {
                sessionm.phonegap.getUnclaimedAchievementCount(function callback(data) {
                    $rootScope.showPointsBadge = data.unclaimedAchievementCount > 0;
                    $rootScope.mPointsTotal = data.unclaimedAchievementCount;
                });
            } else {
                $rootScope.showPointsBadge = false;
            }
            $scope.launchPopups();
            $scope.customPromoText = globalSworkitAds.customWorkoutText || false;
        }, timeoutToWaitForLoadStoredDataButNoGuarantee);
    };

    $scope.launchPopups = function () {
        if (globalNew310Option) {
            $scope.choosePopup();
            globalNew310Option = false;
            localforage.setItem('new310Home', false);
        } else if (globalRemindOption) {
            globalRemindOption = false;
            localforage.setItem('remindHome', {show: false, past: true}, function () {
                var pDate = new Date();
                var pHour = (pDate.getHours() > 12) ? pDate.getHours() - 12 : pDate.getHours();
                var ampm = (pDate.getHours() > 11) ? $translate.instant('PM') : $translate.instant('AM');
                var pMinute = (pDate.getMinutes() < 10) ? "0" + pDate.getMinutes() : pDate.getMinutes();
                var timeString = pHour + ':' + pMinute + ' ' + ampm;
                if (!LocalData.SetReminder.daily.status) {
                    $timeout(function () {
                        $ionicPopup.confirm({
                            title: $translate.instant('DAILY'),
                            template: '<p class="padding">' + $translate.instant('REMINDER_SET') + ' ' + timeString + '. ' + $translate.instant('REMINDER_CONT') + '</p>',
                            okType: 'energized',
                            okText: $translate.instant('OK'),
                            cancelText: $translate.instant('OPTIONS')
                        })
                            .then(function (res) {
                            var dDate = new Date();
                            dDate.setSeconds(0);
                            dDate.setDate(dDate.getDate() + 1);
                            LocalData.SetReminder.daily.time = dDate.getHours();
                            LocalData.SetReminder.daily.minutes = dDate.getMinutes();
                            LocalData.SetReminder.daily.status = true;
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
                            localforage.setItem('reminder', {
                                daily: {
                                    status: true,
                                    time: dDate.getHours(),
                                    minutes: dDate.getMinutes()
                                },
                                inactivity: {
                                    status: LocalData.SetReminder.inactivity.status,
                                    time: LocalData.SetReminder.inactivity.time,
                                    minutes: LocalData.SetReminder.inactivity.minutes,
                                    frequency: LocalData.SetReminder.inactivity.frequency
                                }
                            });
                            if (res) {
                                if (ionic.Platform.isIOS()) {
                                    cordova.plugins.notification.local.hasPermission(function (granted) {
                                        if (!granted) {
                                            cordova.plugins.notification.local.registerPermission();
                                        }
                                    });
                                }
                            }
                            if (!res) {
                                $location.path('/app/reminders');
                                $ionicSideMenuDelegate.toggleLeft(false);
                            }
                        })
                    }, 200)
                }
            })
        }
    };
    $scope.whatsNewPopup = function () {
        //Removing What's New Popup
        //$scope.whatsNewPopup();
    };

    $scope.choosePopup = function () {
        $scope.androidPlatform = ionic.Platform.isAndroid();
        $scope.whatsNewPopup();
    };

    $scope.activateSelection = function () {
        if (ionic.Platform.isAndroid()) {
            //angular.element(document.getElementById(tag)).addClass('activated');
        }
    };

    $scope.$on('$ionicView.afterEnter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
        if (globalFirstLoad) {
            globalFirstLoad = false;
            $scope.isPremiumUser = false;

            var timeToWaitForUserAccountToBeSetupBeforeTryingAnimationToAvoidRenderingIssues = 2000;
            $timeout(function () {
                //Commenting this out to remove animation of Fit in 5 Workout button to see if it effects usage
                //$scope.homeLoaded = true;
                setPremiumAndCustomBrand();
            }, timeToWaitForUserAccountToBeSetupBeforeTryingAnimationToAvoidRenderingIssues);
        } else {
            setPremiumAndCustomBrand();
        }
    });

    $scope.init();

    var setPremiumAndCustomBrand = function () {
        AccessService.isPremiumUser()
            .then(function (isPremiumUser) {
            $scope.isPremiumUser = isPremiumUser;
            $scope.isCustomBrandRunning = globalSworkitAds.isCustomBrandRunning;
            $scope.mainScreenBranding = globalSworkitAds.customBrandExperience.mainScreenBranding;
            if ($scope.isCustomBrandRunning && !isPremiumUser && $window.device) {
                window.analytics.addCustomDimension('2', globalSworkitAds.customBrandExperience.campaignName);
                $log.info('tracking custom GA dimension');
            }
        });
    }

});
