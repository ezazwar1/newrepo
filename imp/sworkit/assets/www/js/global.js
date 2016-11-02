function showTimingModal($scope, $ionicModal, $timeout, WorkoutService, $q, AppSyncService, premiumTiming, parent) {
    $scope.toggleOptions = {data: true};
    $scope.premiumTiming = premiumTiming;
    $scope.androidPlatform = ionic.Platform.isAndroid();
    if (parent) {
        $scope.toggleOptions = {data: false};
    }
    var tempExerciseTime = $scope.advancedTiming.exerciseTime;
    $ionicModal.fromTemplateUrl('components/select-time/advanced-timing-modal.html', function (modal) {
        $scope.timeModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: false,
        backdropClickToClose: false
    });
    $scope.openModal = function () {
        $scope.timeModal.show();
    };
    $scope.closeModal = function () {
        TimingData.GetTimingSettings.breakFreq = parseInt(TimingData.GetTimingSettings.breakFreq);
        TimingData.GetTimingSettings.exerciseTime = parseInt(TimingData.GetTimingSettings.exerciseTime);
        TimingData.GetTimingSettings.breakTime = parseInt(TimingData.GetTimingSettings.breakTime);
        TimingData.GetTimingSettings.transitionTime = parseInt(TimingData.GetTimingSettings.transitionTime);

        if (parent && tempExerciseTime !== $scope.advancedTiming.exerciseTime) {
            var singleSeconds = $scope.advancedTiming.exerciseTime;
            if (singleSeconds > 60) {
                $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
                $scope.singleTimer.seconds = singleSeconds % 60;
            } else {
                $scope.singleTimer.minutes = 0;
                $scope.singleTimer.seconds = singleSeconds;
            }
            $scope.updateTime();
            $scope.adjustTimerMinutes();
        } else if (parent) {
            if (ionic.Platform.isAndroid() && device) {
                if ($scope.advancedTiming.autoPlay) {
                    $scope.playAndroidNativeVideo();
                } else {
                    window.plugins.NativeVideo.stop(function () {

                    });
                    angular.element(document.getElementById('video-background')).css('opacity', '1');
                }
            } else {
                WorkoutService.getUserExercises()
                    .then(function (userExercises) {
                        playInlineVideo($scope.advancedTiming.autoPlay, userExercises[$scope.currentWorkout[0]]);
                    });
            }

            persistMultipleObjects($q, {
                'timingSettings': TimingData.GetTimingSettings
            }, function () {
                // When all promises are resolved
                AppSyncService.syncLocalForageObject('timingSettings', [
                    'breakFreq',
                    'breakTime',
                    'customSet',
                    'exerciseTime',
                    'randomizationOption',
                    'restStatus',
                    'transitionTime',
                    'workoutLength',
                    'sunSalutation',
                    'fullSequence',
                    'runnerYoga',
                    'feelGoodYoga',
                    'beginnerYoga',
                    'coreYoga',
                    'toneYoga'
                ], TimingData.GetTimingSettings);
            });

            $scope.adjustTimerMinutes();
        } else {
            persistMultipleObjects($q, {
                'timingSettings': TimingData.GetTimingSettings
            }, function () {
                // When all promises are resolved
                AppSyncService.syncLocalForageObject('timingSettings', [
                    'breakFreq',
                    'breakTime',
                    'customSet',
                    'exerciseTime',
                    'randomizationOption',
                    'restStatus',
                    'transitionTime',
                    'workoutLength',
                    'sunSalutation',
                    'fullSequence',
                    'runnerYoga',
                    'feelGoodYoga',
                    'beginnerYoga',
                    'coreYoga',
                    'toneYoga'
                ], TimingData.GetTimingSettings);
            });
        }
        $scope.timeModal.hide();
        $scope.timeModal.remove();
    };
    $scope.resetDefaults = function () {
        var getAudio = TimingData.GetTimingSettings.audioOption;
        var getWarning = TimingData.GetTimingSettings.warningAudio;
        var getCountdown = TimingData.GetTimingSettings.countdownBeep;
        var getStyle = TimingData.GetTimingSettings.countdownStyle;
        var getAutoPlay = TimingData.GetTimingSettings.autoPlay;
        var getWelcome = TimingData.GetTimingSettings.welcomeAudio;
        var getAuto = TimingData.GetTimingSettings.autoStart;
        var getSun = TimingData.GetTimingSettings.sunSalutation;
        var getFull = TimingData.GetTimingSettings.fullSequence;
        var getRunner = TimingData.GetTimingSettings.runnerYoga;
        var getFeelGood = TimingData.GetTimingSettings.feelGoodYoga;
        var getBeginnerYoga = TimingData.GetTimingSettings.beginnerYoga;
        var getCoreYoga = TimingData.GetTimingSettings.coreYoga;
        var getToneYoga = TimingData.GetTimingSettings.toneYoga;
        $scope.advancedTiming = {
            "customSet": true,
            "breakFreq": 5,
            "exerciseTime": 30,
            "breakTime": 30,
            "transitionTime": 5,
            "randomizationOption": true,
            "workoutLength": 60,
            "audioOption": getAudio,
            "warningAudio": getWarning,
            "countdownBeep": getCountdown,
            "autoPlay": getAutoPlay,
            "countdownStyle": getStyle,
            "welcomeAudio": getWelcome,
            "autoStart": getAuto,
            "restStatus": true,
            "sunSalutation": getSun,
            "fullSequence": getFull,
            "runnerYoga": getRunner,
            "feelGoodYoga": getFeelGood,
            "beginnerYoga": getBeginnerYoga,
            "coreYoga": getCoreYoga,
            "toneYoga": getToneYoga
        };
        TimingData.GetTimingSettings = $scope.advancedTiming;
    };
    $scope.enableHIIT = function () {
        $scope.advancedTiming.customSet = true;
        $scope.advancedTiming.breakFreq = 0;
        $scope.advancedTiming.restStatus = false;
        $scope.advancedTiming.exerciseTime = 30;
        $scope.advancedTiming.breakTime = 0;
        $scope.advancedTiming.transitionTime = 15;
    };
    $scope.enableTabata = function () {
        $scope.advancedTiming.customSet = true;
        $scope.advancedTiming.breakFreq = 0;
        $scope.advancedTiming.restStatus = false;
        $scope.advancedTiming.exerciseTime = 20;
        $scope.advancedTiming.breakTime = 0;
        $scope.advancedTiming.transitionTime = 10;
    };
    $scope.toggleNextExercise = function () {
        localforage.setItem('userSettings', PersonalData.GetUserSettings);
    };
    $scope.$on('$ionicView.leave', function () {
        $scope.timeModal.remove();
    });
    $timeout(function () {
        $scope.openModal();
    }, 200);
}

function buildStats ($scope, $translate, isWorkout, $timeout) {
    $scope.getTotal = function () {
        window.db.transaction(
            function (transaction) {
                transaction.executeSql("SELECT SUM(minutes_completed) AS minutes FROM SworkitFree",
                    [],
                    function (tx, results) {
                        $scope.totals.totalEver = results.rows.item(0)["minutes"] || 0;
                        $scope.$apply();
                    },
                    null)
            }
        );
        window.db.transaction(
            function (transaction) {
                transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree WHERE created_on > (SELECT DATETIME('now', '-1 day')) GROUP BY strftime('%Y-%m-%d', created_on)",
                    [],
                    function (tx, results) {
                        try {
                            if (results.rows.item(0)) {
                                $scope.totals.todayMinutes = results.rows.item(results.rows.length - 1)["minutes"];
                                $scope.totals.todayMinutesRounded = Math.round($scope.totals.todayMinutes);
                                $scope.totals.todayCalories = results.rows.item(results.rows.length - 1)["calories"];
                            }
                        } catch (e) {
                            $scope.totals.todayMinutes = 0;
                            $scope.totals.todayMinutesRounded = 0;
                            $scope.totals.todayCalories = 0;
                        }
                    },
                    null)
            }
        );
        window.db.transaction(
            function (transaction) {
                transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree WHERE created_on > (SELECT DATETIME('now', '-7 day')) GROUP BY strftime('%Y-%m-%d', created_on)",
                    [],
                    function (tx, results) {
                        var dateHashMin = {};
                        var dateHashCal = {};
                        for (var i = 0; i < results.rows.length; i++) {
                            dateHashMin[results.rows.item(i)["day"]] = results.rows.item(i)["minutes"];
                            dateHashCal[results.rows.item(i)["day"]] = results.rows.item(i)["calories"];
                        }

                        $scope.graphData7Min = [];
                        $scope.graphData7Cal = [];
                        $scope.weekGoalTotal = 0;
                        $scope.weekGoalTotalRounded = 0;

                        for (var j = 0; j < 7; j++) {
                            var date = new Date();
                            date.setTime(date.getTime() - (j * 24 * 60 * 60 * 1000));

                            var day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate().toString();
                            var month = (date.getMonth() < 9) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
                            var createdOnFormat = date.getFullYear() + "-" + month + "-" + day;

                            var minutes = dateHashMin[createdOnFormat] || 0;
                            var calories = dateHashCal[createdOnFormat] || 0;

                            var displayDate = (j == 0) ? $translate.instant('TODAY') : (date.getMonth() + 1) + "." + date.getDate();

                            $scope.graphData7Min.unshift([displayDate, minutes]);
                            $scope.graphData7Cal.unshift([displayDate, calories]);
                            $scope.weekGoalTotal += minutes;
                            $scope.weekGoalTotalRounded = Math.round($scope.weekGoalTotal);
                        }
                    },
                    null)
            }
        );
        window.db.transaction(
            function (transaction) {
                transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree WHERE created_on > (SELECT DATETIME('now', '-30 day')) GROUP BY strftime('%Y-%m-%d', created_on)",
                    [],
                    function (tx, results) {
                        var totalMonthMinutes = 0;
                        dateHashMin30 = {};
                        dateHashCal30 = {};
                        for (var i = 0; i < results.rows.length; i++) {
                            dateHashMin30[results.rows.item(i)["day"]] = results.rows.item(i)["minutes"];
                            dateHashCal30[results.rows.item(i)["day"]] = results.rows.item(i)["calories"];
                        }

                        $scope.graphData30Min = [];
                        $scope.graphData30Cal = [];
                        for (var j = 0; j < 30; j++) {
                            var date = new Date();
                            date.setTime(date.getTime() - (j * 24 * 60 * 60 * 1000));

                            day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate().toString();
                            month = (date.getMonth() < 9) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
                            createdOnFormat = date.getFullYear() + "-" + month + "-" + day;

                            minutes = dateHashMin30[createdOnFormat] || 0;
                            calories = dateHashCal30[createdOnFormat] || 0;

                            displayDate = (j == 0) ? $translate.instant('TODAY') : (date.getMonth() + 1) + "." + date.getDate();
                            if (minutes > 0) {
                                totalMonthMinutes++
                            }

                            $scope.graphData30Min.unshift([displayDate, minutes]);
                            $scope.graphData30Cal.unshift([displayDate, calories]);
                        }
                        $scope.totals.totalMonthMin = totalMonthMinutes;
                    },
                    null)
            }
        );
        window.db.transaction(
            function (transaction) {
                transaction.executeSql("SELECT type, SUM(minutes_completed) AS minutes_completed FROM SworkitFree GROUP BY type",
                    [],
                    function (tx, results) {
                        if (results.rows.length === 0) {
                        }
                        else {
                            var totalMin = 0;

                            for (var i = 0; i < results.rows.length; i++) {

                                totalMin += parseFloat(results.rows.item(i)['minutes_completed']);

                            }

                            $scope.dataPie = [];

                            for (var j = 0; j < results.rows.length; j++) {

                                var a = [];
                                var typeName = $translate.instant(LocalData.GetWorkoutTypes[results.rows.item(j)['type']] && LocalData.GetWorkoutTypes[results.rows.item(j)['type']].activityNames ? LocalData.GetWorkoutTypes[results.rows.item(j)['type']].activityNames : LocalData.GetWorkoutTypes['customWorkout'].activityNames);
                                a.push({'key': typeName, 'y': results.rows.item(j)['minutes_completed']});

                                if ((results.rows.item(j)['minutes_completed']) / totalMin > 0) {
                                    $scope.dataPie.push(a[0]);
                                }

                            }

                        }

                        $scope.drawGraph();
                        $scope.$apply();
                    },
                    null)
            }
        );
        window.db.transaction(
            function (transaction) {
                transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree GROUP BY strftime('%Y-%m-%d', created_on) ORDER BY minutes DESC LIMIT 1",
                    [],
                    function (tx, results) {
                        try {
                            if (results.rows.item(0)) {
                                $scope.totals.topMinutes = results.rows.item(results.rows.length - 1)["minutes"];
                                $scope.totals.topDayMins = results.rows.item(results.rows.length - 1)["day"];
                            }
                        } catch (e) {
                            $scope.totals.topMinutes = 0;
                            $scope.totals.topDayMins = '';
                        }
                    },
                    null)
            }
        );
        window.db.transaction(
            function (transaction) {
                transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree GROUP BY strftime('%Y-%m-%d', created_on) ORDER BY calories DESC LIMIT 1",
                    [],
                    function (tx, results) {
                        try {
                            if (results.rows.item(0)) {
                                $scope.totals.topCalories = results.rows.item(results.rows.length - 1)["calories"];
                                $scope.totals.topDayCals = results.rows.item(results.rows.length - 1)["day"];
                            }
                        } catch (e) {
                            $scope.totals.topCalories = 0;
                            $scope.totals.topDayCals = '';
                        }
                        $scope.$apply();
                    },
                    null)
            }
        );
    };
    $scope.getTotal();
    $scope.weeklyMinutes = parseInt(window.localStorage.getItem('weeklyTotal'));
    $scope.drawGraph = function () {
        $scope.dailyData = [
            {
                "key": "Series1",
                "color": "#FF8614",
                "values": [
                    ["You", $scope.totals.todayMinutes],
                    ["Goal", $scope.goalSettings.dailyGoal]
                ]
            }
        ];
        $scope.weeklyData = [
            {
                "key": "Series2",
                "color": "#FF8614",
                "values": [
                    ["You", $scope.weekGoalTotal],
                    ["Goal", $scope.goalSettings.weeklyGoal]
                ]
            }
        ];
        $scope.weeklyCals = [
            {
                "key": "Series 1",
                "color": "#FF8614",
                "values": $scope.graphData7Cal
            }
        ];
        $scope.weeklyMins = [
            {
                "key": "Series 1",
                "color": "#FF8614",
                "values": $scope.graphData7Min
            }
        ];

        $scope.monthlyCals = [
            {
                "key": "Series 1",
                "color": "#FF8614",
                "values": $scope.graphData30Cal
            }
        ];

        $scope.monthlyMins = [
            {
                "key": "Series 1",
                "color": "#FF8614",
                "values": $scope.graphData30Min
            }
        ];

        $scope.showMedals();
    };

    $scope.xFunction = function () {
        return function (d) {
            return d.key;
        };
    };
    $scope.yFunction = function () {
        return function (d) {
            return d.y;
        };
    };

    $scope.descriptionFunction = function () {
        return function (d) {
            return d.key;
        }
    };

    $scope.showMedals = function () {

        if (isWorkout) {

            var autoChangeSlide = $timeout(function () {
                changeSlide();
            }, 2000);

            var changeSlide = function () {
                $scope.optionSelected.listType = 'session';
                $scope.toggleLists();
                $timeout.cancel(autoChangeSlide);
            };

            if ($scope.totals.todayMinutes >= 5 && $scope.totals.todayMinutes < 15) {
                if ($scope.totals.todayMinutes - $scope.timeToAdd <= 5) {
                    $scope.unlockedToday = false;
                } else {
                    $scope.unlockedToday = true;
                    changeSlide();
                }
                $scope.unlockMedal = 'bronze';
            } else if ($scope.totals.todayMinutes >= 15 && $scope.totals.todayMinutes < 30) {
                if ($scope.totals.todayMinutes - $scope.timeToAdd <= 15) {
                    $scope.unlockedToday = false;
                } else {
                    $scope.unlockedToday = true;
                    changeSlide();
                }
                $scope.unlockMedal = 'silver';
            } else if ($scope.totals.todayMinutes >= 30) {
                if ($scope.totals.todayMinutes - $scope.timeToAdd <= 30) {
                    $scope.unlockedToday = false;
                } else {
                    $scope.unlockedToday = true;
                    changeSlide();
                }
                $scope.unlockMedal = 'gold';
            } else {
                $scope.unlockMedal = 'effort';
                changeSlide();
                $scope.toggleLists();
            }
        }
    }
}

function installWorkout(workoutName, workoutList, loc, sidemenu, $translate, AccessService, FirebaseService, AppSyncService, $rootScope, $ionicPopup, $timeout) {
    AccessService.isPremiumUser().then(function (isPremiumUser) {
        AccessService.getBasicAccess()
            .then(function (legacyBasicAccess) {
                var numberOfAllowedCustomWorkouts = 3;
                var isLegacyBasicAccessRestricted = legacyBasicAccess && (legacyBasicAccess >= 1);
                if (isLegacyBasicAccessRestricted) {
                    numberOfAllowedCustomWorkouts = 1;
                }
                if (PersonalData.GetCustomWorkouts.savedWorkouts.length < numberOfAllowedCustomWorkouts || isPremiumUser) {
                    PersonalData.GetCustomWorkouts.savedWorkouts.unshift({"name": workoutName, "workout": workoutList});
                    localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                    trackEvent('URL Scheme', workoutName, 0);
                    showNotification($translate.instant('CUSTOM_ADDED'), 'button-balanced', 2000);
                    var tempLocation = loc.$$url.slice(-7) || '';
                    if (tempLocation == "/custom") {
                        loc.path('/app/home');
                        sidemenu.toggleLeft(false);
                    } else if (tempLocation !== "workout") {
                        loc.path('/app/custom');
                        sidemenu.toggleLeft(false);
                    }
                    logActionSessionM('ImportCustomWorkout');
                } else {
                    var upgradePopup = $ionicPopup.confirm({
                        title: $translate.instant("INSTALL"),
                        template: '<p class="padding">' + $translate.instant("REPLACE_CUSTOM") + '<a ng-click="upgradeToPremiumPopup()">' + $translate.instant("WANT_UPGRADE") + '</a></p>',
                        okType: 'premium-blue-primary',
                        okText: $translate.instant('OK_INSTALL'),
                        cancelText: $translate.instant('CANCEL_SM'),
                        cancelType: 'premium-blue-secondary-clear',
                        cssClass: 'replace-custom-popup'
                    });

                    upgradePopup.then(function (res) {
                        if (res) {
                            $timeout(function () {
                                angular.element(document.getElementById('item' + index)).removeClass('ion-checkmark').addClass('ion-plus');
                            }, 3000);
                            var syncId = PersonalData.GetCustomWorkouts.savedWorkouts[0].$id || false;
                            PersonalData.GetCustomWorkouts.savedWorkouts.splice(0, 1);
                            PersonalData.GetCustomWorkouts.savedWorkouts.unshift({
                                "name": workoutName,
                                "workout": workoutList
                            });
                            localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                            trackEvent('URL Scheme', workoutName, 0);
                            if (FirebaseService.authData) {
                                if (syncId) {
                                    AppSyncService.remoteDeleteFromLocalForageCustomWorkouts(syncId);
                                }
                            }
                            logActionSessionM('ImportCustomWorkout');
                            showNotification('Custom Workout Added', 'button-balanced', 2000);
                            var tempLocation = loc.$$url.slice(-7) || '';
                            if (tempLocation == "/custom") {
                                loc.path('/app/home');
                                sidemenu.toggleLeft(false);
                            } else if (tempLocation !== "workout") {
                                loc.path('/app/custom');
                                sidemenu.toggleLeft(false);
                            }
                        }
                    });

                    $rootScope.upgradeToPremiumPopup = function () {
                        upgradePopup.close();
                        $rootScope.showPremium('unlimited custom');
                    };
                }
                FiksuTrackingManager.uploadPurchase(FiksuTrackingManager.PurchaseEvent.Event3, 0, "USD");
            });
    });

}
function showNotification(message, style, duration) {
    var notifyEl = angular.element(document.getElementById('status-notification'));
    notifyEl.html('<button class="button button-full button-outline notify-style ' + style + ' fade-in-custom">' + message + '</button>');
    setTimeout(function () {
        notifyEl.html('<button class="button button-full button-outline ' + style + ' fade-out-custom">' + message + '</button>');
        notifyEl.html('');
    }, duration)
}
function getMinutesObj() {
    var minuteObj = {selected: 0, times: []};
    for (i = 0; i < 60; i++) {
        var stringNum = (i < 10) ? '0' + i : i;
        minuteObj.times.push({'id': i, 'time': stringNum});
    }
    return minuteObj;
}
function launchAppStore(button) {
    if (button == 2) {
        if (device && device.platform.toLowerCase() == 'ios') {
            window.open('http://itunes.apple.com/app/id527219710', '_system', 'location=no,AllowInlineMediaPlayback=yes');
        } else if (isAmazon()) {
            window.appAvailability.check('com.amazon.venezia', function () {
                    window.open('amzn://apps/android?p=sworkitapp.sworkit.com', '_system')
                }, function () {
                    window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=sworkitapp.sworkit.com"), '_system');
                }
            );
        } else {
            window.open('market://details?id=sworkitapp.sworkit.com', '_system');
        }
    }
}
function checkVolume() {
    var volumeNotification = angular.element(document.getElementsByClassName('volume-notification'));
    if (device) {
        // Removed for the moment while this is causing errors on Android 5.0.0
        window.plugin.volume.getVolume(function (volume) {
            if (volume < 0.05) {
                volumeNotification.addClass('animate').removeClass('flash');
                if (!ionic.Platform.isAndroid()) {
                    window.plugin.volume.setVolumeChangeCallback(function () {
                        volumeNotification.addClass('flash').removeClass('animate');
                    })
                }
                setTimeout(function () {
                    volumeNotification.addClass('flash').removeClass('animate');
                }, 4000);
            }
        });
    } else {
        volumeNotification.addClass('animate').removeClass('flash');
        setTimeout(function () {
            volumeNotification.addClass('flash').removeClass('animate');
        }, 4000);
    }
}

var inlineVideoTimeout;
function playInlineVideo(autoState, exerciseObj) {
    if (autoState && ionic.Platform.isAndroid() && device) {
        window.plugins.html5Video.play("inlinevideo", function () {
        })
    }
    else if (autoState) {
        var videoElement = angular.element(document.getElementById('inline-video'))[0];
        videoElement.muted = true;
        videoElement.pause();
        videoElement.play();
        if (autoState && exerciseObj.videoTiming[0]) {
            inlineVideoTimeout = setTimeout(function () {
                videoElement.play();
                videoElement.pause();
            }, exerciseObj.videoTiming[0] + 1000);
        } else {
            setTimeout(function () {
                videoElement.pause();
                videoElement.play();
            }, 500);
        }
    }
}

function continueInlineVideo(autoState, exerciseObj) {
    clearTimeout(inlineVideoTimeout);
    if (autoState && ionic.Platform.isAndroid() && device) {

    }
    else if (autoState) {
        var videoElement = angular.element(document.getElementById('inline-video'))[0];
        videoElement.play();
        videoElement.muted = true;
        if (autoState && exerciseObj.videoTiming[1]) {
            inlineVideoTimeout = setTimeout(function () {
                videoElement.pause();
            }, exerciseObj.videoTiming[1] + 2000 - exerciseObj.videoTiming[0]);
        }
    }
}

function persistMultipleObjects($q, objectsByKeys, callback, timestampOverride) {
    // objectsByKeys is a map of runtime objects by localforage key

    // var qAll = {};
    var qAllPromises = {};

    Object.keys(objectsByKeys).forEach(function (key) {
        var object = objectsByKeys[key];

        var q = $q.defer();
        // qAll[key] = q;
        qAllPromises[key] = q.promise;

        persistObject($q, key, object, function () {
            q.resolve();
        }, timestampOverride);
    });

    $q.all(qAllPromises).then(function () {
        if (callback) callback();
    });

}

function persistObject($q, key, object, callback, timestampOverride) {
    localforage.getItem(key, function (localforageObject, error) {
        if (!localforageObject || !angular.equals(object, localforageObject)) {
            localforage.setItem(key, object, function () {
                var timestamp = timestampOverride || (new Date()).getTime();
                //console.log('Persisting', key, 'to localforage with timestamp', timestamp);
                qAllPromises = [];
                Object.keys(object).forEach(function (property) {
                    var q = $q.defer();
                    qAllPromises.push(q.promise);
                    localforage.setItem('sync_' + key + '.' + property, timestamp, function () {
                        q.resolve();
                    })
                });
                $q.all(qAllPromises)
                    .then(function () {
                        if (callback) callback();
                    });
            })
        } else {
            if (callback) callback();
        }
        if (error) {
            console.log('persistObject error', error);
        }
    })
}

function setupExtraData($http) {
    var c = new Date();
    var thisWeek = c.getWeek();
    var testWeek = window.localStorage.getItem('week');
    if (thisWeek != testWeek) {
        window.localStorage.setItem('weeklyTotal', 0);
        window.localStorage.setItem('week', thisWeek);
        if (PersonalData.GetUserSettings.mfpWeight) {
            getMFPWeight($http);
        } else if (PersonalData.GetUserSettings.healthKit) {
            window.plugins.healthkit.readWeight({
                    'requestWritePermission': false,
                    'unit': 'lb'
                },
                function (msg) {
                    if (!isNaN(msg)) {
                        PersonalData.GetUserSettings.weight = msg;
                    }
                },
                function () {
                }
            );
        }
    }
    window.backendVersion = 1;
    window.myObj = {};
}

function setupDatabase() {
    window.db = false;
    window.db = openDatabase('SworkitDBFree', '1.0', 'SworkitDBFree', 1048576);

    window.db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS SworkitFree(sworkit_id INTEGER NOT NULL PRIMARY KEY, created_on DATE DEFAULT NULL, minutes_completed INTEGER NOT NULL,calories INTEGER NOT NULL, type TEXT NOT NULL, utc_created DATE DEFAULT NULL, exercise_list TEXT NOT NULL DEFAULT "", sync_id TEXT DEFAULT NULL, sync_lastUpdated INTEGER DEFAULT NULL, device_type TEXT NOT NULL DEFAULT "", connected_apps TEXT NOT NULL DEFAULT "", heart_rate TEXT NOT NULL DEFAULT "")', [], window.nullHandler, window.errorHandler);
    }, window.errorHandler, window.successCallBack);

    window.errorHandler = function (transaction, error) {
        console.log('DB Error: ' + error.message + ' code: ' + error.code);
    };
    window.successCallBack = function () {
        //alert("DEBUGGING: success");
        //console.log('Data Test - Database success');
    };
    window.nullHandler = function () {
        //console.log('Data Test - Database null' );
    };
    window.db.transaction(function (tx) {
        tx.executeSql('SELECT utc_created from SworkitFree', [], window.nullHandler, addColumn);
    }, window.nullHandler, window.successCallBack);
    window.db.transaction(function (tx) {
        tx.executeSql('SELECT exercise_list from SworkitFree', [], window.nullHandler, addExerciseColumn);
    }, window.nullHandler, window.successCallBack);

    window.db.transaction(function (tx) {
        tx.executeSql('SELECT sync_id from SworkitFree', [], window.nullHandler, addSyncColumns);
    }, window.nullHandler, window.successCallBack);
    window.db.transaction(function (tx) {
        tx.executeSql('SELECT heart_rate from SworkitFree', [], window.nullHandler, addMetadataColumns);
    }, window.nullHandler, window.successCallBack);

}

var sessionmAvailable = true;
function initializeSessionM($window, $rootScope, $timeout, $log) {
    $timeout(function () {
        if ($window.sessionm) {
            $log.debug("Initialize SessionM");
            $rootScope.sessionMAvailable = true;
            if (ionic.Platform.isAndroid()) {
                $window.sessionm.phonegap.startSession('9b7155b57da13b714bdafb7ee3ff175d839a7786');
            } else {
                $window.sessionm.phonegap.startSession('c46b4d571681af4803890c8a18b71c26ce4ff3d3');
            }
            $window.sessionm.phonegap.setAutoPresentMode(true);
            $timeout(function () {
                if (PersonalData.GetUserSettings.mPoints) {
                    logActionSessionM('visit');
                    $window.sessionm.phonegap.getUnclaimedAchievementCount(function callback(data) {
                        $rootScope.showPointsBadge = (data.unclaimedAchievementCount > 0);
                        $rootScope.mPointsTotal = data.unclaimedAchievementCount;
                    });
                }
            }, 5000);
            $window.sessionm.phonegap.listenFailures(function () {
                //two variables because we prefer not to use $rootScope but it is necessary for menu
                sessionmAvailable = false;
                $rootScope.sessionMAvailable = false;
            });
        } else {
            $log.warn("Unable to initialize SessionM, due to missing $window.sessionm");
        }
    }, 4000);
}
function setWelcomeAudio() {
    var timesUsedVar = parseInt(window.localStorage.getItem('timesUsed'));
    var basicAudioPath;
    if (welcomeLoaded) {
        LowLatencyAudio.unload('welcome');
    }
    if (PersonalData.GetUserSettings.preferredLanguage == 'EN') {
        basicAudioPath = 'audio/'
    } else {
        basicAudioPath = 'audio/' + PersonalData.GetUserSettings.preferredLanguage + '/';
    }
    if (timesUsedVar == 1) {
        LowLatencyAudio.preloadAudio('welcome', basicAudioPath + 'welcome-start.mp3', 1);
        globalFirstOption = true;
    } else {
        LowLatencyAudio.preloadAudio('welcome', basicAudioPath + 'welcome-back.mp3', 1);
    }
    welcomeLoaded = true;
}
function logActionSessionM(activity) {
    if (device && PersonalData.GetUserSettings.mPoints) {
        sessionm.phonegap.logAction(activity);
    }
}
function trackEvent(action, label, value) {
    if (window.device && window.analytics) {
        var platformCategory = (device.platform.toLowerCase() == 'ios') ? 'Sworkit iOS' : 'Sworkit Google';
        window.analytics.trackEvent(platformCategory, action, label, value);
    }
}
function addColumn() {
    window.db.transaction(function (transaction) {
        transaction.executeSql('ALTER TABLE SworkitFree ADD utc_created DATE DEFAULT NULL', [], nullHandler, errorHandler);
    });
}
function addExerciseColumn() {
    window.db.transaction(function (transaction) {
        transaction.executeSql('ALTER TABLE SworkitFree ADD exercise_list TEXT NOT NULL DEFAULT ""', [], nullHandler, errorHandler);
    });
}
function addSyncColumns() {
    window.db.transaction(function (transaction) {
        transaction.executeSql('ALTER TABLE SworkitFree ADD COLUMN sync_id TEXT DEFAULT NULL', [], window.nullHandler, window.errorHandler);
    }, window.errorHandler, window.successCallBack);
    window.db.transaction(function (transaction) {
        transaction.executeSql('ALTER TABLE SworkitFree ADD COLUMN sync_lastUpdated INTEGER DEFAULT NULL', [], window.nullHandler, window.errorHandler);
    }, window.errorHandler, window.successCallBack);
    window.db.transaction(function (transaction) {
        transaction.executeSql('CREATE UNIQUE INDEX idx_sync_id ON SworkitFree (sync_id)', [], window.nullHandler, window.errorHandler);
    }, window.errorHandler, window.successCallBack);
}
function addMetadataColumns() {
    window.db.transaction(function (transaction) {
        transaction.executeSql('ALTER TABLE SworkitFree ADD device_type TEXT NOT NULL DEFAULT ""', [], nullHandler, errorHandler);
    });
    window.db.transaction(function (transaction) {
        transaction.executeSql('ALTER TABLE SworkitFree ADD connected_apps TEXT NOT NULL DEFAULT ""', [], nullHandler, errorHandler);
    });
    window.db.transaction(function (transaction) {
        transaction.executeSql('ALTER TABLE SworkitFree ADD heart_rate TEXT NOT NULL DEFAULT ""', [], nullHandler, errorHandler);
    });
}
window.downloadableWorkouts = [];
function getDownloadableWorkouts($http, caller, type) {
    $http.get('http://sworkitapi.herokuapp.com/workouts?q=featured').then(function (resp) {
        localforage.setItem('downloadableWorkouts', resp.data);
        window.downloadableWorkouts = resp.data;
        if (caller) {
            showNotification('Custom workout list updated', 'button-balanced', 1500);
        }
        getPopularWorkouts($http, type);
    }, function (err) {
        console.log('Unable to connect to sworkitapi.herokuapp.com for getDownloadableWorkouts', err);
        localforage.getItem('downloadableWorkouts', function (result) {
            if (result === null) {
                localforage.setItem('downloadableWorkouts', []);
            } else {
                window.downloadableWorkouts = result;
            }
        });
        if (caller) {
            showNotification('Unable to connect. Please try again.', 'button-assertive', 2500);
        }
    })
}
window.popularWorkouts = [];
function getPopularWorkouts($http, type) {
    $http.get('http://sworkitapi.herokuapp.com/workouts?q=popular').then(function (resp) {
        localforage.setItem('popularWorkouts', resp.data);
        window.popularWorkouts = resp.data;
        if (type == 'popular') {
            window.downloadableWorkouts = resp.data;
        }
    }, function (err) {
        console.log('Unable to connect to sworkitapi.herokuapp.com for getPopularWorkouts', err);
        localforage.getItem('popularWorkouts', function (result) {
            if (result === null) {
                localforage.setItem('popularWorkouts', []);
            } else {
                window.popularWorkouts = result;
            }
        })
    })
}

var globalSworkitAds = {
    isRunning: false,
    isEndRunning: false,
    audioRunning: false,
    audioEndRunning: false,
    audioSuccess: false,
    imageSuccess: false,
    imageSuccessWorkout: false,
    isCustomInterstitial: false,
    isCustomBrandRunning: false,
    customBrandExperience: {},
    customInterstitial: {},
    liveSubscriptionPurchases: {},
    interstitialTimeoutLength: 6000,
    showRestBreakAds: false
};

var admobid = {};
if (/(android)/i.test(navigator.userAgent)) { // for android
    admobid = {
        banner: 'ca-app-pub-7066009449656600/8977655579',
        medium: 'ca-app-pub-7066009449656600/2383936371',
        interstitial: 'ca-app-pub-7066009449656600/8838054779'
    };
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
        banner: 'ca-app-pub-7066009449656600/6024189170',
        medium: 'ca-app-pub-7066009449656600/8430469977',
        interstitial: 'ca-app-pub-7066009449656600/7361321571'
    };
}
var mopubid = {};
if (/(android)/i.test(navigator.userAgent)) { // for android
    mopubid = {
        banner: 'c24139cc7cf84f55b1d5079c96772ef4',
        medium: '3b7fe9ae8ac645bf88a82fccf24f76ef',
        interstitial: 'fdeddbaff6de4029beacc5cef55c1eb2'
    };
} else if (/(ipod|iphone)/i.test(navigator.userAgent)) { // for ios
    mopubid = {
        banner: 'edb00d07e5c843f28bcaa044565a99f7',
        medium: 'ba7c53bdc5eb4614ac77c804de4510ad',
        interstitial: 'b61947d98ace42c7a64a3663e70cc279'
    };
} else if (/(ipad)/i.test(navigator.userAgent)) {
    mopubid = {
        banner: 'aa50011df48245ad9bb8fc755c504a4e',
        medium: 'ba7c53bdc5eb4614ac77c804de4510ad',
        interstitial: '5a41ff653b154412841a368ef527540f'
    };
}
function getSworkitAds($http, caller) {
    //TODO: clean up ad download directory
    return $http.get('http://sworkitads.herokuapp.com/adsLive/' + PersonalData.GetUserSettings.preferredLanguage + '?gender=' + PersonalData.GetUserProfile.gender + '&birthYear=' + PersonalData.GetUserProfile.birthYear)
        .then(function (resp) {
            globalSworkitAds = resp.data;
            if (globalSworkitAds.useMoPub) {
                globalSworkitAds.useAdMob = false;
            }
            if (globalSworkitAds.useMoPubInterstitial) {
                globalSworkitAds.useAdMobInterstitial = false;
            }
            if (globalSworkitAds.customAdID) {
                if (/(android)/i.test(navigator.userAgent)) {
                    mopubid = globalSworkitAds.customAndroidID;
                } else if (/(ipod|iphone)/i.test(navigator.userAgent)) {
                    mopubid = globalSworkitAds.customiPhoneID;
                } else if (/(ipad)/i.test(navigator.userAgent)) {
                    mopubid = globalSworkitAds.customiPadID;
                }
            }
            if (window.cordova) {
                if (globalSworkitAds.isRunning || globalSworkitAds.isEndRunning) {
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adActionImageName, function () {
                        globalSworkitAds.imageSuccess = true
                    }, function () {
                        var fileTransfer = new FileTransfer();
                        fileTransfer.download(encodeURI(globalSworkitAds.adActionImage), cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adActionImageName,
                            function () {
                                globalSworkitAds.imageSuccess = true;
                            },
                            function () {
                                globalSworkitAds.imageSuccess = false;
                            }, true);
                    });
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adWorkoutImageName, function () {
                        globalSworkitAds.imageSuccessWorkout = true
                    }, function () {
                        var fileTransfer = new FileTransfer();
                        fileTransfer.download(encodeURI(globalSworkitAds.adWorkoutImage), cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adWorkoutImageName,
                            function () {
                                globalSworkitAds.imageSuccessWorkout = true;
                            },
                            function () {
                                globalSworkitAds.imageSuccessWorkout = false;
                            }, true);
                    });
                }
                if (globalSworkitAds.audioRunning) {
                    if (caller) {
                        var fileTransfer = new FileTransfer();
                        fileTransfer.download(encodeURI(globalSworkitAds.adRestAudio), cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adRestAudioName,
                            function () {
                                globalSworkitAds.audioSuccess = true;
                            },
                            function () {
                                globalSworkitAds.audioSuccess = false;
                            }, true);
                    }
                    else {
                        window.resolveLocalFileSystemURL(cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adRestAudioName, function () {
                            globalSworkitAds.audioSuccess = true
                        }, function () {
                            var fileTransfer = new FileTransfer();
                            fileTransfer.download(encodeURI(globalSworkitAds.adRestAudio), cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adRestAudioName,
                                function () {
                                    globalSworkitAds.audioSuccess = true;
                                },
                                function () {
                                    globalSworkitAds.audioSuccess = false;
                                }, true);
                        });
                    }
                }
                if (globalSworkitAds.audioEndRunning) {
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adEndAudioName, function () {
                        globalSworkitAds.audioEndSuccess = true
                    }, function () {
                        var fileTransfer = new FileTransfer();
                        fileTransfer.download(encodeURI(globalSworkitAds.adEndAudio), cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adEndAudioName,
                            function () {
                                globalSworkitAds.audioEndSuccess = true;
                            },
                            function () {
                                globalSworkitAds.audioEndSuccess = false;
                            }, true);
                    });
                }
            }
            return globalSworkitAds;
        });
}

function getMFPWeight($http, $scope) {
    var d = new Date();
    var dateString = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    var actionString = "get_weight";
    var accessString = PersonalData.GetUserSettings.mfpAccessToken;
    var appID = "79656b6e6f6d";
    var unitType = 'US';
    //console.log('MFP Weight Sync time: ' + dateString);
    var dataPost = JSON.stringify({
        'action': actionString,
        'access_token': accessString,
        'entry_date': dateString,
        'units': unitType,
        'app_id': appID
    });
    $http({
        method: 'POST',
        url: 'https://www.myfitnesspal.com/client_api/json/1.0.0?client_id=sworkit',
        data: dataPost,
        headers: {'Content-Type': 'application/json'}
    }).then(function (resp) {
        PersonalData.GetUserSettings.mfpWeight = resp.data['updated_at'] || false;
        PersonalData.GetUserSettings.weight = resp.data['weight'] || 150;
        persistMultipleObjects({
            'userSettings': PersonalData.GetUserSettings
        }, function () {
            // When all promises are resolved
            AppSyncService.syncLocalForageObject('userSettings', [
                'lastLength',
                'mfpAccessToken',
                'mfpRefreshToken',
                'mfpStatus',
                'mfpWeight',
                'weight',
                'weightType'
            ], PersonalData.GetUserSettings);
        });
        if ($scope) {
            $scope.mfpWeightStatus.date = resp.data['updated_at'];
            $scope.mfpWeightStatus.data = true;
            $scope.convertWeight();
        }
    }, function () {
        if ($scope) {
            showNotification('Could not retreive weight.', 'button-assertive', 2000);
        }
    })
}

var deparam = function (querystring) {
    // remove any preceding url and split
    querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
    var params = {}, pair, d = decodeURIComponent, i;
    // march and parse
    for (i = querystring.length; i > 0;) {
        pair = querystring[--i].split('=');
        params[d(pair[0])] = d(pair[1]);
    }

    return params;
};//--  fn  deparam

function createDateAsUTC(now) {
    return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
}

function js_yyyy_mm_dd_hh_mm_ss() {
    var todayLocal = new Date();
    now = createDateAsUTC(todayLocal);
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    day = "" + now.getDate();
    if (day.length == 1) {
        day = "0" + day;
    }
    hour = "" + now.getHours();
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    minute = "" + now.getMinutes();
    if (minute.length == 1) {
        minute = "0" + minute;
    }
    second = "" + now.getSeconds();
    if (second.length == 1) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function checkForNotification($window, $translate) {
    if ($window.device && $window.cordova) {
        $window.cordova.plugins.notification.local.on("click", function (notification) {
            if (id == 1 || id == "1") {
                setTimeout(setupNotificationDaily($translate), 4000);
            }
        });
    }
}
function setupNotificationDaily($translate) {
    cordova.plugins.notification.local.cancel(1);
    var nDate = new Date();
    var tDate = new Date();
    nDate.setHours(LocalData.SetReminder.daily.time);
    nDate.setMinutes(LocalData.SetReminder.daily.minutes);
    nDate.setSeconds(0);
    if (tDate.getHours() <= nDate.getHours() && tDate.getMinutes() <= nDate.getMinutes()) {
        nDate.setDate(nDate.getDate() + 1);
    }
    setTimeout(function () {
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
        console.log('daily notification set for: ' + JSON.stringify(nDate));
    }, 4000);
}

function mergeAlternating(array1, array2) {
    var mergedArray = [];

    for (var i = 0, len = Math.max(array1.length, array2.length); i < len; i++) {
        if (i < array1.length) {
            mergedArray.push(array1[i]);
        }
        if (i < array2.length) {
            mergedArray.push(array2[i]);
        }
    }
    return mergedArray;
}

Date.prototype.getWeek = function () {
    var day_miliseconds = 86400000,
        onejan = new Date(this.getFullYear(), 0, 1, 0, 0, 0),
        onejan_day = (onejan.getDay() == 0) ? 7 : onejan.getDay(),
        days_for_next_monday = (8 - onejan_day),
        onejan_next_monday_time = onejan.getTime() + (days_for_next_monday * day_miliseconds),
        first_monday_year_time = (onejan_day > 1) ? onejan_next_monday_time : onejan.getTime(),
        this_date = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0),// This at 00:00:00
        this_time = this_date.getTime(),
        days_from_first_monday = Math.round(((this_time - first_monday_year_time) / day_miliseconds));

    return (days_from_first_monday >= 0 && days_from_first_monday < 364) ? Math.ceil((days_from_first_monday + 1) / 7) : 52;
};

var audioDownloadStore;
var audioErrorDownloads = [];
var audioStillErrors = [];
var totalAudioInstalled = 0;
var downloadableCategories = ['upper', 'core', 'lower', 'stretch', 'back', 'cardio', 'pilates', 'yoga'];
var audioAssetURL = "http://m.sworkit.com.s3.amazonaws.com/assets/exercises/Audio/";
var languageSelected = '';

var audioDownloader = {
    updateAudio: function (audioCategory) {
        this.remoteAudio = audioCategory;
        this.downloadAudio();
    },

    updateErrorAudio: function (audioCategory) {
        this.remoteAudio = audioCategory;
        this.retryErrors();
    },

    downloadAudio: function () {
        var _this = this; // for use in the callbacks

        // stop if we've processed all of the audio
        if (this.remoteAudio.length === 0) {
            audioDownloader.updateErrorAudio(audioErrorDownloads);
            return;
        }

        // get the next audio from the array
        var audioObject = this.remoteAudio.shift();
        var audioName = audioObject.audio;
        // console.log(encodeURI(audioAssetURL + audioName));
        // console.log(encodeURI(audioDownloadStore + audioName));
        window.resolveLocalFileSystemURL(audioDownloadStore + audioName, function () {
            totalAudioInstalled++;
            if (_this.remoteAudio.length === 0) {
                _this.downloadAudio();
            }
        }, function () {
            var fileTransfer = new FileTransfer();
            fileTransfer.download(encodeURI(audioAssetURL + audioName), audioDownloadStore + audioName,
                function () {
                    if (_this.remoteAudio.length === 0) {
                        totalAudioInstalled++;
                        _this.downloadAudio();
                    }
                },
                function () {
                    console.log("Error downloading 1: " + audioName);
                    audioErrorDownloads.push(audioObject);
                    if (_this.remoteAudio.length === 0) {
                        _this.downloadAudio();
                    }
                }, true);
        });
        if (_this.remoteAudio.length !== 0) {
            var audioObject2 = this.remoteAudio.shift();
            var audioName2 = audioObject2.audio;
            // console.log(encodeURI(audioAssetURL + audioName2));
            // console.log(encodeURI(audioDownloadStore + audioName2));
            window.resolveLocalFileSystemURL(audioDownloadStore + audioName2, function () {
                totalAudioInstalled++;
                _this.downloadAudio()
            }, function () {
                var fileTransfer = new FileTransfer();
                fileTransfer.download(encodeURI(audioAssetURL + audioName2), audioDownloadStore + audioName2,
                    function () {
                        console.log("Downloaded: " + audioName2);
                        totalAudioInstalled++;
                        _this.downloadAudio();
                    },
                    function () {
                        console.log("Error downloading 2: " + audioName2);
                        audioErrorDownloads.push(audioObject2);
                        _this.downloadAudio();
                    }, true);
            });
        }

    },

    countAudio: function (langSent) {
        audioDownloadStore = cordova.file.dataDirectory + langSent + '/';
        window.resolveLocalFileSystemURL(audioDownloadStore, function (entry) {
            function success(entries) {
                var i;
                var downloadCount = 0;
                for (i = 0; i < entries.length; i++) {
                    downloadCount++;
                    if (i == entries.length - 1) {
                        totalAudioInstalled = downloadCount;
                        if (downloadCount > 165) {
                            PersonalData.GetLanguageSettings = {
                                EN: true,
                                DE: false,
                                FR: false,
                                ES: false,
                                ESLA: false,
                                IT: false,
                                PT: false,
                                HI: false,
                                JA: false,
                                ZH: false,
                                KO: false,
                                RU: false,
                                TR: false
                            };
                            PersonalData.GetLanguageSettings[langSent] = true;
                            localforage.setItem('userLanguages', PersonalData.GetLanguageSettings);
                        }
                    }
                }
            }

            function fail(error) {
                alert("Failed to list directory contents: " + error.code);
            }

            // Get a directory reader
            var directoryReader = entry.createReader();

            // Get a list of all the entries in the directory
            directoryReader.readEntries(success, fail);

        }, function () {
            console.log('Failed to find directory to count from.')
        })
    },

    retryErrors: function () {
        var _this = this; // for use in the callbacks

        // stop if we've processed all of the audio
        if (this.remoteAudio.length === 0) {
            checkTotalAudioDownloads(languageSelected);
            //downloadableCategories.shift();
            if (audioStillErrors.length > 0) {
                console.log('Unable to Download all audio. Please try to finish them later.');
                audioStillErrors = [];
            } else if (downloadableCategories.length > 0) {
                //audioDownloader.updateAudio(getExercisesList(downloadableCategories[0]));
            }
            return;
        }

        // get the next audio from the array
        var audioObject3 = this.remoteAudio.shift();
        var audioName3 = audioObject3.audio;
        // console.log(encodeURI(audioAssetURL + audioName3));
        // console.log(encodeURI(audioDownloadStore + audioName3));
        window.resolveLocalFileSystemURL(audioDownloadStore + audioName3, function () {
            _this.downloadAudio()
        }, function () {
            var fileTransfer = new FileTransfer();
            fileTransfer.download(encodeURI(audioAssetURL + audioName3), audioDownloadStore + audioName3,
                function () {
                    //console.log("Downloaded: " +audioName3);
                    totalAudioInstalled++;
                    _this.retryErrors();
                },
                function () {
                    console.log("Error downloading 3: " + audioName3);
                    audioStillErrors.push(audioObject3);
                    _this.retryErrors();
                }, true);
        });

    }
};

function checkTotalAudioDownloads(useLang) {
    audioDownloader.countAudio(useLang);
    setTimeout(function () {
        return totalAudioInstalled;
    }, 1000)
}

function downloadAllExerciseAudio(language) {
    console.log("global downloadAllExerciseAudio()");
    languageSelected = language;
    audioAssetURL = "http://m.sworkit.com.s3.amazonaws.com/assets/exercises/Audio/" + languageSelected + '/';
    audioDownloadStore = cordova.file.dataDirectory + language + '/';
    totalAudioInstalled = 0;
    var getUpper = cloneObject(audioDownloader);
    var getCore = cloneObject(audioDownloader);
    var getLower = cloneObject(audioDownloader);
    var getStretch = cloneObject(audioDownloader);
    var getBack = cloneObject(audioDownloader);
    var getYoga = cloneObject(audioDownloader);
    var getPilates = cloneObject(audioDownloader);
    var getCardio = cloneObject(audioDownloader);
    var getExtras = cloneObject(audioDownloader);
    getUpper.updateAudio(getExercisesList('upper'));
    getCore.updateAudio(getExercisesList('core'));
    getLower.updateAudio(getExercisesList('lower'));
    getYoga.updateAudio(getExercisesList('yoga'));
    getPilates.updateAudio(getExercisesList('pilates'));
    getCardio.updateAudio(getExercisesList('cardio'));
    getStretch.updateAudio(getExercisesList('stretch'));
    getBack.updateAudio(getExercisesList('back'));
    getExtras.updateAudio([{"name": "Half", "audio": "Half.mp3", "category": false}]);
}

function getExercisesList(categoryName) {
    var arr = [];
    for (var exercise in exerciseObject) {
        if (exerciseObject[exercise].category == categoryName) {
            arr.push(exerciseObject[exercise])
        }
    }
    arr.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    return arr;
}

function cloneObject(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function convertImgToBase64URL(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

function onResume() {
    console.log('On Resume');
}
function onResumeIOS() {
    LowLatencyAudio.turnOffAudioDuck(PersonalData.GetAudioSettings.duckOnce.toString());
}
function onPause() {
    console.log('On Pause');
}
function lockOrientation() {
    return ionic.Platform.isIOS() && !ionic.Platform.isIPad();
}
function isAmazon() {
    var amazonDefault = false;
    var amazonDefaultReplaced = "%%IS_AMAZON%%";
    if (amazonDefaultReplaced.indexOf("%%") === -1) {
        amazonDefault = true;
    }
    return amazonDefault;
}
function isKindle() {
    if (isAmazon()) {
        var dModel = device.model;
        return (dModel == 'KFOT' || dModel == 'KFTT' || dModel == 'KFJWI' || dModel == 'KFJWA' || dModel == 'KFSOWI' || dModel == 'KFTHWI' || dModel == 'KFTHWA' || dModel == 'KFAPWI' || dModel == 'KFAPWA' || dModel == 'KFARWI' || dModel == 'KFASWI' || dModel == 'KFSAWI' || dModel == 'KFSAWA' || dModel == 'SD4930UR' || dModel == 'KFMEWI' || dModel == 'KFFOWI' || dModel == 'KFTBWI' || dModel == 'KFJWA');
    } else {
        return false;
    }
}

