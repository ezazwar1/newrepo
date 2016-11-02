angular.module('swMobileApp').controller('WorkoutCtrl', function ($rootScope, $scope, $ionicHistory, $stateParams, $ionicModal, $translate, $ionicPopup, $ionicPlatform, $ionicSideMenuDelegate, $http, $ionicSlideBoxDelegate, $ionicNavBarDelegate, $sce, $location, $timeout, $interval, $state, $q, WorkoutService, UserService, AppSyncService, FirebaseService, UserWorkoutService, AchievementService, MusicPlaylistsModal, AccessService, $window, CustomInterstitialModal, swAnalytics, $log) {
    $log.info("WorkoutCtrl");

    var controller = this;
    $ionicPlatform.ready(function () {
        $scope.deviceBasePath = WorkoutService.getDownloadsDirectory();
    });

    AccessService.isPremiumUser()
        .then(function (isPremiumUser) {
            // TODO: Shouldn't this be renamed to $scope.isPremiumUser? If its even really needed as a copy.
            $scope.premiumWorkoutSettings = isPremiumUser;
            $log.info('$scope.premiumWorkoutSettings: ', $scope.premiumWorkoutSettings);
            setupAds();
            initAudio();
        });

    $ionicNavBarDelegate.showBackButton(false);
    $scope.transitionStatus = false;
    $scope.isRestBreakActive = false;
    $scope.bannerAdsShowing = false;
    $scope.title = "<img src='img/sworkit_logo.png'/>";
    $scope.videoAddress = 'video/blank.mp4';
    $scope.resizeOptions = {grow: false, shrink: true, defaultSize: 30};
    $scope.dimensions = {inHeight: $window.innerHeight, inWidth: $window.innerWidth};
    $scope.isPortrait = true;
    $scope.musicAvailable = true;
    if ($window.device) {
        $window.screen.unlockOrientation();
    }
    $scope.adjustTimer = function () {
        var timerHeight = $scope.dimensions.inHeight * .25;
        if ($scope.isPortrait) {
            $scope.size = Math.min(Math.max(timerHeight * .6,
                60
            ), timerHeight * .9);
        } else {
            $scope.size = Math.min(Math.max($scope.dimensions.inHeight * .3,
                90
            ), 140);
        }

        $scope.adjustTimerMinutes();
        if ($scope.dimensions.inWidth > 415 && $scope.dimensions.inHeight > 500) {
            //TODO: this isn't really working on iPad. defaultSize not getting to auto-font-size
            $scope.resizeOptions.defaultSize = 42;
        } else {
            $scope.resizeOptions.defaultSize = 30;
        }
    };
    $scope.adjustTimerMinutes = function () {
        var adjustmentAmount = Math.max(($scope.size * .40), 35);
        if ($scope.singleTimer.minutes > 0 || $scope.advancedTiming.breakTime > 59) {
            angular.element(document.getElementById('timer-number-h1'))[0].style.fontSize = ($scope.size - 50) + 'px';
        } else {
            angular.element(document.getElementById('timer-number-h1'))[0].style.fontSize = ($scope.size - adjustmentAmount) + 'px';
        }
    };
    // workout.html used to used ng-if to determine unlocked but Android manually sizes video-background at beginning and that goes away when element becomes false
    $scope.getImageAddress = function (currentEx) {
        if (currentEx.unlocked) {
            return $scope.deviceBasePath + 'exercises/keyframe-middle/' + currentEx.image
        } else {
            return 'img/exercises/' + currentEx.image;
        }
    };
    $scope.getImageAddressNext = function (currentEx) {
        if (currentEx.unlocked) {
            return $scope.deviceBasePath + 'exercises/keyframe-first/' + currentEx.image
        } else {
            return 'img/frames/' + currentEx.image;
        }
    };
    $scope.setVideo = function () {
        var portraitMode = (ionic.viewport.orientation() == 0 || ionic.viewport.orientation() == 180);
        if (portraitMode) {
            $scope.isPortrait = true;
            $scope.dimensions.inHeight = Math.max($window.innerHeight, $window.innerWidth);
            $scope.dimensions.inWidth = Math.min($window.innerHeight, $window.innerWidth);
            $ionicNavBarDelegate.showBar(true);
            if (ionic.Platform.isIOS() && $window.device) {
                StatusBar.show()
            }
        } else {
            $scope.isPortrait = false;
            $scope.showControls = true;
            $scope.controlTimeout = $timeout(function () {
                $scope.showControls = false;
            }, 6000);
            $scope.dimensions.inWidth = Math.max($window.innerHeight, $window.innerWidth);
            $scope.dimensions.inHeight = Math.min($window.innerHeight, $window.innerWidth);
            $ionicNavBarDelegate.showBar(false);
            if (ionic.Platform.isIOS() && $window.device) {
                StatusBar.hide()
            }
        }

        $scope.adjustTimer();
        if ($scope.isRestBreakActive) {
            $scope.showMediumAds();
        }
    };
    $scope.$on("$ionicView.loaded", function(event) {
        $ionicSideMenuDelegate.canDragContent(false);
    });
    angular.element(document.querySelector("body")).addClass('workout-bar');
    $scope.direction = false;
    $scope.strokeWidth = 5;
    $scope.stroke = '#FF8614';
    $scope.background = '#EEEEEE';
    $scope.totalWidth = 100;
    $scope.counterClockwise = true;
    LocalHistory.getCustomHistory.lastHomeURL = $location.$$url;
    $scope.healthKitData = {healthKitAvailable: false, showHealthKitOption: false, healthKitStatus: ''};
    if (!ionic.Platform.isAndroid()) {
        if ($window.device) {
            $window.plugins.healthkit.available(
                function (result) {
                    if (result == true) {
                        $scope.healthKitData.healthKitAvailable = true;
                    }
                },
                function () {
                    $scope.healthKitData.healthKitAvailable = false;
                }
            );
        } else {
            //Available in browser for testing purposes
            $scope.healthKitData.healthKitAvailable = true;
        }
    } else {
        if (isAmazon()) {
            $scope.musicAvailable = false;
            window.appAvailability.check('com.spotify.music', function () {
                $scope.musicAvailable = true;
            }, function () {
            });
        }
    }
    $scope.advancedTiming = WorkoutService.getTimingIntervals();
    $scope.kindleDevice = false;
    $scope.androidHeader = function () {
        if (ionic.Platform.isAndroid()) {
            if ($window.device) {
                document.querySelectorAll("drawer")[0].attributes.candrag.value = false;
            }
            $scope.androidPlatform = true;
            $scope.iOSPlatform = false;
            angular.element(document.querySelector(".title")).addClass('no-nav');
            //$ionicNavBarDelegate.align('center');
            $scope.isKitKat = (ionic.Platform.version() >= 4.4);
            if (isKindle()) {
                $scope.kindleDevice = true;
            }
        } else {
            $scope.androidPlatform = false;
            $scope.iOSPlatform = true;
        }
    };
    $scope.androidHeader();

    $timeout(function () {
        $scope.androidHeader();
    }, 800);
    $scope.timesUsedVar = parseInt($window.localStorage.getItem('timesUsed'));
    $scope.userSettings = UserService.getUserSettings();
    $scope.googleFitSettings = UserService.getFitSettings();
    $scope.audioSettings = UserService.getAudioSettings();
    $scope.sevenTiming = WorkoutService.getSevenIntervals();
    $scope.previousExercise = false;
    $scope.endModalOpen = false;
    $scope.unloadQueue = [];
    $scope.isAutoStart = $scope.advancedTiming.autoStart;
    $scope.beginNotification = false;
    $scope.yogaSelection = false;
    $scope.helpText = false;
    $scope.changeText = false;

    var allWorkouts = WorkoutService.getWorkoutsByType();
    $scope.chosenWorkout = cloneObject(allWorkouts[$stateParams.typeId]);
    WorkoutService.getUserExercises()
        .then(function (userExercises) {
            controller.userExercises = userExercises;
            var cleanWorkout = [];
            if ($stateParams.typeId == "fullBody") {
                var combinedUpperAndLower = mergeAlternating(allWorkouts['upperBody'].exercises, allWorkouts['lowerBody'].exercises);
                var combinedUpperAndLowerAndCore = mergeAlternating(combinedUpperAndLower, allWorkouts['coreExercise'].exercises);
                $scope.chosenWorkout.exercises = cleanWorkout.concat(combinedUpperAndLowerAndCore);
            } else if ($stateParams.typeId == "anythingGoes") {
                $scope.chosenWorkout.exercises = cleanWorkout.concat(allWorkouts['upperBody'].exercises.concat(allWorkouts['lowerBody'].exercises, allWorkouts['coreExercise'].exercises, allWorkouts['stretchExercise'].exercises, allWorkouts['backStrength'].exercises, allWorkouts['cardio'].exercises, allWorkouts['pilatesWorkout'].exercises));
            }
            for (i = 0; i < $scope.chosenWorkout.exercises.length; i++) {
                if (controller.userExercises[$scope.chosenWorkout.exercises[i]] != null) {
                    cleanWorkout.push($scope.chosenWorkout.exercises[i])
                }
                if (i === $scope.chosenWorkout.exercises.length - 1) {
                    //Get workout array
                    $scope.chosenWorkout.exercises = cleanWorkout;
                    $scope.currentWorkout = [];
                    $scope.currentWorkout = $scope.currentWorkout.concat($scope.chosenWorkout.exercises);
                    if ($stateParams.typeId == "quickFive") {
                        checkVolume();
                    }
                    if ($stateParams.typeId == "quickFive") {
                        checkVolume();
                    }
                    if ($scope.currentWorkout.length == 1) {
                        $scope.currentWorkout = $scope.currentWorkout.concat($scope.currentWorkout);
                    }
                    //Randomize Workouts
                    if ($stateParams.typeId == 'headToToe' || ($stateParams.typeId == 'sevenMinute' && !$scope.sevenTiming.randomizationOptionSeven) || isYogaWorkout()) {
                    } else {
                        if ($scope.advancedTiming.randomizationOption || !$scope.advancedTiming.customSet) {
                            if ($stateParams.typeId == "upperBody") {
                                var pushupBased = ["Push-ups", "Diamond Push-ups", "Wide Arm Push-ups", "Alternating Push-up Plank", "One Arm Side Push-up", "Dive Bomber Push-ups", "Shoulder Tap Push-ups", "Spiderman Push-up", "Push-up and Rotation"];
                                var nonPushup = ["Overhead Press", "Overhead Arm Clap", "Tricep Dips", "Jumping Jacks", "Chest Expander", "T Raise", "Lying Triceps Lifts", "Reverse Plank", "Power Circles", "Wall Push-ups"];
                                //TODO:  Need to check if "Vertical Arm Rotations" exists, as in, is it downlaoded?
                                pushupBased = pushupBased.sort(function () {
                                    return 0.5 - Math.random()
                                });
                                nonPushup = nonPushup.sort(function () {
                                    return 0.5 - Math.random()
                                });
                                var mergedUpper = mergeAlternating(pushupBased, nonPushup);
                                $scope.currentWorkout = mergedUpper;
                            } else {
                                //TODO: Experiment with a warmup section of exercises
                                $scope.currentWorkout = $scope.currentWorkout.sort(function () {
                                    return 0.5 - Math.random()
                                });
                            }
                        }
                    }

                    $scope.startedWorkout = [];
                    $scope.startedWorkout = $scope.startedWorkout.concat($scope.currentWorkout);
                }
            }
            $scope.setDefaults();
        });

    $scope.hiddenURL = '';
    $scope.extraSettings = WorkoutService.getTimingIntervals();
    $scope.showTiming = function () {
        $scope.stopTimer();
        $interval.cancel($scope.transitionCountdown);
        $timeout.cancel($scope.delayStart);
        $scope.transitionStatus = false;
        $scope.timerDelay = null;
        $scope.removeBanners();
        showTimingModal($scope, $ionicModal, $timeout, WorkoutService, $q, AppSyncService, $scope.premiumWorkoutSettings, true);
    };
    $scope.calcComplete = function (lower, upper) {
        return Math.max(1 - (lower / upper), 0);
    };
    $ionicModal.fromTemplateUrl('components/workout/end-workout-modal.html', function (modal) {
        $scope.endModal = modal;
    }, {
        scope: $scope,
        animation: 'fade-implode',
        focusFirstInput: false,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    });
    $scope.listOptions = [
        {text: "MEDALS", value: 'medals'},
        {text: "SESSION", value: "session"},
        {text: "GOALS", value: "goals"}
    ];
    $scope.endWorkout = function () {
        $scope.endModalOpen = true;

        $scope.unlockMedal = false;
        $scope.unlockedToday = false;

        $scope.optionSelected = {
            listType: 'medals'
        };
        $scope.sessionSelected = true;
        $scope.toggleLists = function () {
            if ($scope.optionSelected.listType == 'medals') {
                $ionicSlideBoxDelegate.slide(0);
            } else if ($scope.optionSelected.listType == 'session') {
                $ionicSlideBoxDelegate.slide(1);
            } else {
                $ionicSlideBoxDelegate.slide(2);
            }
        };
        $scope.updatedSlider = function () {
            if ($ionicSlideBoxDelegate.currentIndex() == 0) {
                $scope.optionSelected.listType = 'medals';
            } else if ($ionicSlideBoxDelegate.currentIndex() == 1) {
                $scope.optionSelected.listType = 'session';
            } else {
                $scope.optionSelected.listType = 'goals';
            }
        };

        $scope.showWeightAdjust = globalFirstOption && PersonalData.GetUserSettings.weight == 150;
        if ($scope.isEndAdCampaign && globalSworkitAds.imageSuccess) {
            $scope.callToActionImage = cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adActionImageName;
            $scope.callToActionText = globalSworkitAds.adActionText;
            //$scope.hiddenURL = $window.open('http://sworkit.com/app', '_blank', 'hidden=yes,AllowInlineMediaPlayback=yes,toolbarposition=top');
        } else {
            $scope.callToActionImage = globalSworkitAds.adActionImage;
        }
        $scope.removeBanners();
        $scope.openModal = function () {
            $scope.stopTimer();
            $interval.cancel($scope.transitionCountdown);
            $timeout.cancel($scope.delayStart);
            $scope.transitionStatus = false;
            $timeout(function () {
                $ionicSlideBoxDelegate.update();
            }, 0);
            var mathComp = ($stateParams.timeId * 60) - ((($scope.totalTimer.minutes) * 60) + $scope.totalTimer.seconds);
            $scope.timeToAdd = Math.round((mathComp / 60) * 2) / 2.0;
            if ($stateParams.typeId == 'sevenMinute' && !$scope.workoutComplete && $stateParams.timeId % 7 == 0) {
                //Close enough
                $scope.timeToAdd = Math.round(($scope.timeToAdd - ($stateParams.timeId / 7)) * ($scope.advancedTiming.exerciseTime / 30));
                $log.info('timeToAdd sevenMinuteWorkout', $scope.timeToAdd);
            } else if (isYogaWorkout()) {
                var workoutLengthSeconds = $scope.chosenWorkout.exercises.length * PersonalData.GetUserSettings.lastRoundsLength * ($stateParams.typeId == "customWorkout" ? $scope.advancedTiming.customYoga : $scope.advancedTiming.yogaPoseLengthToChange);
                $scope.timeToAdd = Math.round(((workoutLengthSeconds / 60) - ((($scope.totalTimer.minutes) * 60) + $scope.totalTimer.seconds) / 60) * 2) / 2.0;
            }
            if ($scope.timeToAdd > 0) {
                var kilograms;
                var burnValue = $scope.chosenWorkout.activityWeight;
                kilograms = PersonalData.GetUserSettings.weight / 2.2;
                $scope.minutesCompleted = $scope.timeToAdd / 60.0;
                $scope.burn = Math.round(burnValue * kilograms * $scope.minutesCompleted);
            }
            else {
                $scope.burn = 0;
            }
            $scope.burnRounded = Math.round($scope.burn);
            $scope.timeToAddRounded = Math.round($scope.timeToAdd);
            $scope.syncStateWithWatch(false, true);
            if ($scope.burn == null) {
                $scope.burn = 0;
            }
            $scope.updateWorkoutStats();
            $scope.endModal.show();

            if (!$scope.workoutComplete && $scope.timeToAdd >= 1) {
                $timeout(function () {
                    $ionicPopup.confirm({
                            title: $translate.instant('FINISHED'),
                            cancelText: $translate.instant('CANCEL_NO'),
                            template: '<p class="padding">' + $translate.instant('FINISHED_B') + '</p>',
                            okType: 'energized',
                            okText: $translate.instant('YES_SM')
                        })
                        .then(function (res) {
                            if (res) {
                                $scope.confirmDone(false);
                            }
                        });
                }, 1000);
            } else if ($scope.workoutComplete) {
                $scope.confirmDone(true);
            }
        };
        $scope.updateWorkoutStats = function () {
            UserWorkoutService.getWorkoutsByDate()
                .then(function (workoutsByDateForStreak) {
                    $log.debug("workoutsByDateForStreak", workoutsByDateForStreak);
                    $scope.streakCount = AchievementService.getStreakCount(workoutsByDateForStreak, new Date());
                });
            var totalWeek = parseInt($window.localStorage.getItem('weeklyTotal'));
            totalWeek += $scope.timeToAdd;
            $window.localStorage.setItem('weeklyTotal', totalWeek);
            $scope.totals = {
                'totalEver': 0,
                'todayMinutes': 0,
                'todayCalories': 0,
                'weeklyMinutes': 0,
                'weeklyCalories': 0,
                'topMinutes': 0,
                'topCalories': 0,
                'topDayMins': '',
                'topDayCals': ''
            };
            $scope.goalSettings = UserService.getGoalSettings();
            $timeout(function () {
                buildStats($scope, $translate, true, $timeout);
            }, 0);
            $timeout(function () {
                $ionicSlideBoxDelegate.update();
            }, 1000);
        };
        $scope.confirmDone = function (isNormalEnd) {
            if ($window.device) {
                for (i = 0; i < $scope.unloadQueue.length; i++) {
                    LowLatencyAudio.unload($scope.unloadQueue[i]);
                }
            }
            UserWorkoutService.getWorkoutsByDate()
                .then(function (workoutLogs) {
                    if (isNormalEnd) {
                        swAnalytics.trackEvent('workout', 'duration', 'full');
                        $scope.endWorkoutAnalytics('Full Workout');
                    } else {
                        swAnalytics.trackEvent('workout', 'duration', 'partial');
                        $scope.endWorkoutAnalytics('Partial Workout');
                    }
                    $scope.workoutComplete = true;
                    var isActivationFirstWorkout = !(Object.keys(workoutLogs).length > 0);
                    $log.debug("isActivationFirstWorkout", isActivationFirstWorkout);
                    if (isActivationFirstWorkout) {
                        if (FirebaseService.authData) {
                            swAnalytics.trackEvent('kpi', 'activation', 'workout-registered');
                        } else {
                            swAnalytics.trackEvent('kpi', 'activation', 'workout-anonymous');
                        }
                    }
                    var useDevice = $window.device ? $window.device.model : 'browser';
                    var connectedApps = [];
                    if ($scope.userSettings.mfpStatus) {
                        connectedApps.push('MyFitnessPal');
                    }
                    if ($scope.userSettings.healthKit) {
                        connectedApps.push('Apple Health');
                    }
                    if ($scope.googleFitSettings.enabled) {
                        connectedApps.push('Google Fit');
                    }
                    if ($scope.userSettings.humanapiPublicToken) {
                        connectedApps.push('Human API');
                    }
                    if ($scope.userSettings.mPoints) {
                        connectedApps.push('mPoints');
                    }
                    if (PersonalData.GetUserProfile.groupCode) {
                        connectedApps.push(PersonalData.GetUserProfile.groupCode + ' Group');
                    }
                    connectedApps.push('Sworkit');
                    var heartRateData = {};
                    if ($scope.avgHeartRate > 0) {
                        heartRateData = {'average': $scope.avgHeartRate, 'peak': $scope.peakHeartRate}
                    } else {
                        heartRateData = {'average': false, 'peak': false}
                    }
                    $window.db.transaction(function (transaction) {
                            transaction.executeSql('INSERT INTO SworkitFree(created_on, minutes_completed, calories, type, utc_created, exercise_list, device_type, connected_apps, heart_rate) VALUES ((datetime("now","localtime")),?,?,?,datetime("now"),?,?,?,?)',
                                [$scope.timeToAdd, $scope.burn, $stateParams.typeId, JSON.stringify($scope.trackedExercises), useDevice, connectedApps, JSON.stringify(heartRateData)],
                                nullHandler,
                                errorHandler);
                        },
                        function onError() {
                            $log.info("tx onError");
                        },
                        function onSuccess() {
                            $log.info("tx onSuccess");
                            $scope.updateWorkoutStats();
                            if (FirebaseService.authData) {
                                AppSyncService.syncWebSqlWorkoutLog();
                            }
                        });

                });
            $scope.syncStateWithWatch(false, true);
            if ($scope.userSettings.humanapiPublicToken) {
                $scope.syncHumanAPI();
            }
            if ($window.device) {
                FiksuTrackingManager.uploadPurchase(FiksuTrackingManager.PurchaseEvent.Event2, 0, "USD");
            }
            $scope.playCongratsSound();
            if ($window.device && $scope.userSettings.mPoints) {
                var amountOfExtraTimeForBuildStatsToLikelyFinish = 2000;
                $timeout(function () {
                    $scope.endworkoutReward();
                }, amountOfExtraTimeForBuildStatsToLikelyFinish);
            }
            if ($window.device && $scope.userSettings.mfpStatus) {
                $scope.syncMFP();
            }
            if ($window.device && $scope.userSettings.healthKit) {
                $scope.syncHealthKit();
            }
            if ($window.device && $scope.googleFitSettings.enabled) {
                $scope.syncGoogleFit();
            }
            $scope.setVariables();

            $scope.showInterstitialTimeout = $timeout(function () {
                $scope.showInterstitial();
            }, globalSworkitAds.interstitialTimeoutLength)
        };
        $scope.cancelModal = function () {
            $scope.endModal.hide();
            $scope.endModalOpen = false;
            $scope.syncStateWithWatch();
            var totalWeek = parseInt($window.localStorage.getItem('weeklyTotal'));
            totalWeek -= $scope.timeToAdd;
            $window.localStorage.setItem('weeklyTotal', totalWeek);
            $scope.showBannerAds();
        };
        $scope.mainMenu = function () {
            $scope.videoAddress = 'video/blank.mp4';
            $scope.currentWorkout = $scope.startedWorkout;
            $scope.endModal.hide();
            $scope.endModalOpen = false;
            $scope.removeBanners();
            document.removeEventListener('onAdPresent', function (data) {
            });
            if ($scope.androidPlatform && $window.device) {
                window.plugins.NativeVideo.stop(function() {
                });
                if (!$scope.googleFitSettings.attempted) {
                    $scope.googleFitSettings.attempted = true;
                    localforage.setItem('googleFitStatus', PersonalData.GetGoogleFit);
                }
            }
            document.removeEventListener("pause", workoutOnPause, false);
            document.removeEventListener("resume", onResumeWorkout, false);
            $window.removeEventListener("orientationchange", orientationChange);
            //Ensure that Head to Toe does not keep randomization off for all future workouts
            if ($stateParams.typeId == 'headToToe' || $stateParams.typeId == 'sevenMinute' || isYogaWorkout()) {
                $scope.advancedTiming.randomizationOption = $scope.originalRandomization;
            }
            if ($scope.timeToAdd < 1) {
                var totalWeek = parseInt($window.localStorage.getItem('weeklyTotal'));
                totalWeek -= $scope.timeToAdd;
                $window.localStorage.setItem('weeklyTotal', totalWeek);
            } else {
                globalFirstWorkout = false;
                if ($scope.workoutComplete) {
                    $timeout.cancel($scope.showInterstitialTimeout);
                    if (!$scope.interstitialHasBeenAttempted) {
                        $scope.showInterstitial();
                    }
                }
            }
            //Ensure that Head to Toe does not keep randomization off for all future workouts
            if ($stateParams.typeId == 'headToToe') {
                $scope.advancedTiming.randomizationOption = $scope.originalRandomization;
                persistMultipleObjects($q, {
                    'timingSettings': TimingData.GetTimingSettings
                }, function () {
                    // When all promises are resolved
                    AppSyncService.syncLocalForageObject('timingSettings', [
                        'randomizationOption'
                    ], TimingData.GetTimingSettings);
                });
            }
            if ($stateParams.typeId == 'customWorkouts') {
                LocalData.GetWorkoutTypes.customWorkout = {
                    id: 13,
                    activityWeight: 6,
                    activityMFP: "134026252709869",
                    activityNames: "CUSTOM_SM",
                    icon: "fullBody.png",
                    exercises: false,
                    description: "CUSTOM_DESC",
                    googleActivity: "Custom Workout",
                    appleActivityHK: "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: "circuit_training"
                }
            }
            $scope.syncStateWithWatch(true);
            $ionicNavBarDelegate.showBackButton(true);
            $state.go('app.home');
        };

        $scope.endWorkoutAnalytics = function (mfpRegular) {
            $log.info("$scope.endWorkoutAnalytics()");
            swAnalytics.trackView('workout-end');
            if (isYogaWorkout()) {
                trackEvent('Yoga Finish', mfpRegular, $scope.timeToAdd);
            } else {
                trackEvent('Workout Finish', mfpRegular, $scope.timeToAdd);
            }
        };

        $scope.setVariables = function () {
            localforage.getItem('ratingCategory', function (result) {
                if (!result.past) {
                    globalRateOption = true;
                    localforage.setItem('ratingCategory', {show: true, past: false, shareCount: 1, sharePast: false});
                    globalShareOption = 1;
                } else {
                    if (result.shareCount) {
                        result.shareCount++
                    } else {
                        result.shareCount = 2;
                    }
                    localforage.setItem('ratingCategory', {
                        show: false,
                        past: true,
                        shareCount: result.shareCount,
                        sharePast: false
                    });
                    globalShareOption = result.shareCount;
                }
            });
            localforage.getItem('remindHome', function (result) {
                if (!result.past) {
                    globalRemindOption = true;
                    localforage.setItem('remindHome', {show: true, past: true});
                    if (!$scope.userSettings.healthKit && $scope.iOSPlatform) {
                        $scope.healthKitData.showHealthKitOption = $scope.healthKitData.healthKitAvailable;
                    }
                }
            });
        };
        $scope.endworkoutReward = function () {
            var sessionActivity = LocalData.GetWorkoutTypes[$stateParams.typeId].sessionMActivity || 'Custom Workout';
            sessionm.phonegap.logAction(sessionActivity);

            var tempTotal = $scope.totals.todayMinutes;
            if (tempTotal >= 5) {
                for (var i = 0; i < Math.floor(tempTotal / 5); i++) {
                    sessionm.phonegap.logAction('Bonus5');
                }
            }
            if (tempTotal >= 10) {
                for (var i = 0; i < Math.floor(tempTotal / 10); i++) {
                    sessionm.phonegap.logAction('Bonus10');
                }
            }
            if ($scope.timeToAdd > 30) {
                sessionm.phonegap.logAction('30 Full Minutes');
            }
            if ($scope.totals.todayMinutes > $scope.goalSettings.dailyGoal) {
                sessionm.phonegap.logAction('Daily Goal Met');
            }
            if ($scope.totals.todayMinutes > $scope.goalSettings.weeklyGoal) {
                sessionm.phonegap.logAction('Weekly Goal Met');
            }
            $window.db.transaction(
                function (transaction) {
                    transaction.executeSql("SELECT * FROM SworkitFree WHERE created_on > (SELECT DATETIME('now', '-1 day'))",
                        [],
                        function (tx, results) {
                            var workoutsToday = results.rows.length;
                            if (workoutsToday == 2) {
                                sessionm.phonegap.logAction('Double Take');
                            } else if (workoutsToday == 3) {
                                sessionm.phonegap.logAction('Triple Hit');
                            }
                        },
                        null)
                }
            );
            $timeout(function () {
                $scope.getSessionMCount();
                $scope.$apply();
            }, 3000);

        };

        $scope.$on('$ionicView.afterLeave', function () {
            $scope.endModal.remove();
        });
        $timeout(function () {
            $scope.openModal();
        }, 0);

        $scope.sessionMCount = {count: false, mPointsAvailable: $rootScope.sessionMAvailable};

        $scope.getSessionMCount = function () {
            sessionm.phonegap.getUnclaimedAchievementCount(function callback(data) {
                $scope.sessionMCount.count = (data.unclaimedAchievementCount == 0) ? false : data.unclaimedAchievementCount;
                $scope.$apply();
            });
            sessionm.phonegap.listenDidDismissActivity(function callback() {
                $scope.getSessionMCount();
            });
        };
        $scope.launchMPoints = function () {
            if ($window.device) {
                sessionm.phonegap.presentActivity(2);
            }
        };

        $scope.challengeFriend = function () {
            var challengeText = '';
            if ($stateParams.typeId == 'customWorkout' && LocalData.GetWorkoutTypes.customWorkout.customData && LocalData.GetWorkoutTypes.customWorkout.customData.socialMessage) {
                challengeText = LocalData.GetWorkoutTypes.customWorkout.customData.socialMessage;
            } else {
                challengeText = $translate.instant('I_AWESOME') + ' ' + $scope.timeToAdd + ' ' + $translate.instant('MINUTES_OF') + ' ' + $translate.instant(LocalData.GetWorkoutTypes[$stateParams.typeId].activityNames) + ' ' + $translate.instant('EX_WITH') + ' Sworkit ' + $translate.instant('HASHTAG');
            }
            if ($window.device) {
                $window.plugins.socialsharing.share(challengeText, null, null, null);
                FiksuTrackingManager.uploadPurchase(FiksuTrackingManager.PurchaseEvent.Event4, 0, "USD");
            } else {
                $log.info('$scope.challengeFriend: ', challengeText);
            }
        };

        $scope.enableHealthKit = function () {
            $scope.healthKitData.showHealthKitOption = false;
            $window.plugins.healthkit.requestAuthorization(
                {
                    'readTypes': ['HKQuantityTypeIdentifierBodyMass', 'HKQuantityTypeIdentifierHeartRate'],
                    'writeTypes': ['HKQuantityTypeIdentifierActiveEnergyBurned', 'workoutType']
                },
                function () {
                    PersonalData.GetUserSettings.healthKit = true;
                    localforage.setItem('userSettings', PersonalData.GetUserSettings);
                    $scope.syncHealthKit();
                },
                function () {
                }
            );
        };
        $scope.syncHealthKit = function () {
            var workoutHK = LocalData.GetWorkoutTypes[$stateParams.typeId].appleActivityHK || 'HKWorkoutActivityTypeCrossTraining';

            $window.plugins.healthkit.saveWorkout({
                    'activityType': workoutHK,
                    'quantityType': null,
                    'startDate': $scope.startDate,
                    'endDate': null,
                    'requestReadPermission': false,
                    'duration': $scope.minutesCompleted * 60 * 60,
                    'energy': $scope.burn,
                    'energyUnit': 'kcal',
                    'distance': null,
                    'distanceUnit': 'm'
                },
                function () {
                    $scope.healthKitData.healthKitStatus = $translate.instant('SAVED') + ' HealthKit';
                    $timeout(function () {
                        $scope.healthKitData.healthKitStatus = '';
                    }, 5000)
                },
                function (msg) {
                    //console.log('HealthKit error: ' + msg);
                }
            );

        };
        $scope.enableGoogleFit = function () {
            var infoTemplate = '<div class="end-workout-health" style="text-align: center;width:230px;margin:0 auto"><img src="img/googleFit.png" style="height:50px;display: block;margin: 10px auto;"/><div style="width:100%"><p>' + $translate.instant('GFIT_1') + '</p><p>' + $translate.instant('GFIT_2') + '</p><p style="color:#777;font-size:12px">' + $translate.instant('GFIT_3') + '</p><button class="button button-assertive" ng-click="confirmGoogleFit()" style="width:230px">{{"CONNECT_FIT" | translate}}</button></div></div>';
            $scope.googleFitPopup = $ionicPopup.show({
                title: '',
                subTitle: '',
                scope: $scope,
                template: infoTemplate,
                hardwareBackButtonClose: true,
                buttons: [
                    {text: $translate.instant('CANCEL_SM')}
                ]
            });
        };
        $scope.hideGoogleFitPopup = function () {
            $scope.googleFitPopup.close();
        };
        $scope.confirmGoogleFit = function () {
            $scope.hideGoogleFitPopup();
            $scope.googleFitSettings.enabled = true;
            $scope.googleFitSettings.attempted = true;
            $scope.syncGoogleFit();
            localforage.setItem('googleFitStatus', PersonalData.GetGoogleFit);
        };
        $scope.syncGoogleFit = function () {
            var fitnessActivity = LocalData.GetWorkoutTypes[$stateParams.typeId].googleActivity || 'CIRCUIT_TRAINING';

            $window.plugins.GoogleFit.insertSession(
                [$scope.startDate.getTime(), $scope.minutesCompleted * 60 * 60000, $translate.instant(LocalData.GetWorkoutTypes[$stateParams.typeId].activityNames), fitnessActivity, $scope.burnRounded],
                function () {
                    $scope.healthKitData.healthKitStatus = $translate.instant('SAVED') + ' Google Fit';
                    $timeout(function () {
                        $scope.healthKitData.healthKitStatus = '';
                    }, 3000)
                },
                function (result) {
                    console.log('Google Fit Fail ' + result)
                }
            )
        }
    };
    $scope.myFitnessPalRetry = true;
    $scope.syncMFP = function () {
        var dateString = $scope.startTime;
        var actionString = "log_cardio_exercise";
        var accessString = PersonalData.GetUserSettings.mfpAccessToken;
        var appID = "79656b6e6f6d";
        var exerciseID = LocalData.GetWorkoutTypes[$stateParams.typeId].activityMFP;
        var durationFloat = $scope.timeToAdd * 60000;
        var energyCalories = $scope.burn;
        var unitCountry = "US";
        var statusMessage = "burned %CALORIES% calories doing %QUANTITY% minutes of " + $translate.instant(LocalData.GetWorkoutTypes[$stateParams.typeId].activityNames) + " with Sworkit";
        //console.log('MFP Sync time: ' + $scope.startTime);
        var dataPost = JSON.stringify({
            'action': actionString,
            'access_token': accessString,
            'app_id': appID,
            'exercise_id': exerciseID,
            'duration': durationFloat,
            'energy_expended': energyCalories,
            'start_time': dateString,
            'status_update_message': statusMessage,
            'units': unitCountry
        });
        $http({
            method: 'POST',
            url: 'https://www.myfitnesspal.com/client_api/json/1.0.0?client_id=sworkit',
            data: dataPost,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function () {
                showNotification($translate.instant('MFP_SUCCESS'), 'button-calm', 4000);
            }, function () {
                if ($scope) {
                    if ($scope.myFitnessPalRetry) {
                        $scope.myFitnessPalRetry = false;
                        $timeout(function () {
                            $scope.syncMFP();
                        }, 1400);
                    } else {
                        showNotification($translate.instant('MFP_ERROR'), 'button-assertive', 4000);
                    }
                }
            })
    };

    $scope.humanapiRetry = true;
    $scope.syncHumanAPI = function () {
        var getOffset = function (jsOffset) {
            var offSet = '';
            var offSetNum = (Math.abs(jsOffset) / 60);
            offSet += (Math.abs(jsOffset) / 60);
            if (offSetNum % 1 != 0) {
                offSet = Math.floor(offSetNum)
            }
            if (offSetNum < 10) {
                offSet = '0' + offSet;
            }
            if (jsOffset > 0) {
                offSet = "-" + offSet
            } else if (jsOffset < 0) {
                offSet = "+" + offSet
            }
            if (offSetNum % 1 != 0) {
                offSet += ':30';
            } else {
                offSet += ':00';
            }
            return offSet
        };
        var startDateISO = $scope.startDate.toISOString();
        var endDate = new Date();
        var endDateISO = endDate.toISOString();
        var isoOffset = getOffset(endDate.getTimezoneOffset());
        var workoutTypeString = LocalData.GetWorkoutTypes[$stateParams.typeId].humanAPIActivity;
        var durationFloat = $scope.timeToAdd * 60;
        var energyCalories = $scope.burnRounded;
        var dataPost = {
            "startTime": startDateISO,
            "endTime": endDateISO,
            "type": workoutTypeString,
            "calories": energyCalories,
            "distance": 0,
            "steps": 0,
            "tzOffset": isoOffset,
            "duration": durationFloat,
            "externalId": PersonalData.GetUserSettings.humanapiClientUserId
        };
        $http({
            method: 'POST',
            url: 'https://api.humanapi.co/v1/human/activities',
            data: dataPost,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + PersonalData.GetUserSettings.humanapiAccessToken
            }
        })
            .then(function (resp) {
                console.log('humanapi POST response:', resp);
                //showNotification('WORKOUT SYNCED', 'button-calm', 4000);
            }, function (err) {
                if ($scope) {
                    console.log('humanapi POST error:', err);
                    if ($scope.humanapiRetry) {
                        $scope.humanapiRetry = false;
                        $timeout(function () {
                            $scope.syncHumanAPI();
                        }, 1400);
                    } else {
                        showNotification('PARTNER SYNC ERROR', 'button-assertive', 4000);
                    }
                }
            })
    };

    $ionicModal.fromTemplateUrl('components/workout/show-workout-video-modal.html', function (modal) {
        $scope.videoModal = modal;
    }, {
        scope: $scope,
        animation: 'fade-implode',
        focusFirstInput: false,
        backdropClickToClose: false,
        hardwareBackButtonClose: true
    });
    $scope.showVideo = false;
    $scope.openVideoModal = function () {
        $scope.networkConnection = navigator.onLine;
        $scope.stopTimer();
        $interval.cancel($scope.transitionCountdown);
        $timeout.cancel($scope.delayStart);
        $scope.transitionStatus = false;
        $scope.timerDelay = null;
        $scope.videoModal.show();
        if ($scope.androidPlatform && $window.device) {
            $timeout(function () {
                var videoPlayerFrame = angular.element(document.getElementById('modalvideoplayer'));
                videoPlayerFrame.css('opacity', '0.00001');
                videoPlayerFrame[0].src = 'http://m.sworkit.com/assets/exercises/Videos/' + $scope.currentExercise.video;

                videoPlayerFrame[0].addEventListener("timeupdate", function () {
                    if (videoPlayerFrame[0].duration > 0
                        && Math.round(videoPlayerFrame[0].duration) - Math.round(videoPlayerFrame[0].currentTime) == 0) {

                        //if loop atribute is set, restart video
                        if (videoPlayerFrame[0].loop) {
                            videoPlayerFrame[0].currentTime = 0;
                        }
                    }
                }, false);

                videoPlayerFrame[0].addEventListener("canplay", function () {
                    videoPlayerFrame[0].removeEventListener("canplay", this, false);
                    videoPlayerFrame[0].play();
                    videoPlayerFrame.css('opacity', '1');
                }, false);

                videoPlayerFrame[0].play();
            }, 100);
        } else {
            $scope.videoAddressModal = $scope.getVideoLocation() + $scope.currentExercise.video + '?random=1';
        }
        $scope.showVideo = true;
    };
    $scope.cancelVideoModal = function () {
        $scope.showVideo = false;
        $scope.videoModal.hide();
        // if($scope.advancedTiming.autoPlay){
        //   var videoElement = angular.element(document.getElementById('inline-video'))[0];
        //   videoElement.muted= true;
        //   videoElement.play();
        // }
    };
    $scope.$on('$ionicView.leave', function () {
        $scope.showVideo = false;
        $scope.videoModal.remove();
    });

    $scope.isPaused = function () {
        return !$scope.totalTimerRunning;
    };
    //Interval variable is 'start'
    var start;

    $scope.setMinutes = function () {
        var singleSeconds = $scope.advancedTiming.exerciseTime;
        var totalMinutes = $stateParams.timeId;
        if (singleSeconds > 60) {
            $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
            $scope.singleTimer.seconds = singleSeconds % 60;
        } else {
            $scope.singleTimer.minutes = 0;
            $scope.singleTimer.seconds = singleSeconds;
        }
        if ($stateParams.typeId == 'sevenMinute' && $stateParams.timeId % 7 == 0) {
            var mathMin = ($scope.advancedTiming.exerciseTime * 12) / 60;
            var parseMin = parseInt(mathMin);
            var mathSec = Math.round((mathMin % parseMin) * 10) / 10;
            mathSec = mathSec * 60;
            if (mathSec.toString().length == 1) {
                mathSec = "0" + mathSec;
            }
            $scope.totalTimer.seconds = parseInt(mathSec);
            $scope.totalTimer.minutes = (parseMin * $stateParams.timeId / 7);
        } else if (isYogaWorkout()) {
            var workoutLengthSeconds = $scope.chosenWorkout.exercises.length * PersonalData.GetUserSettings.lastRoundsLength * ($stateParams.typeId == "customWorkout" ? $scope.advancedTiming.customYoga : $scope.advancedTiming.yogaPoseLengthToChange);
            $scope.totalTimer.minutes = Math.floor(workoutLengthSeconds / 60);
            $scope.totalTimer.seconds = workoutLengthSeconds % 60;
        } else {
            $scope.totalTimer.minutes = totalMinutes;
            $scope.totalTimer.seconds = 0;
        }
        $scope.updateTime();
    };
    $scope.updateTime = function () {
        $scope.singleTimer.displayText = $scope.displayTime($scope.singleTimer.minutes, $scope.singleTimer.seconds);
        $scope.totalTimer.displayText = $scope.displayTime($scope.totalTimer.minutes, $scope.totalTimer.seconds);
    };
    $scope.displayTime = function (mins, secs, type) {
        if (mins > 0 && secs < 10) {
            secs = '0' + secs;
        } else if (type == 'total' && secs < 10) {
            secs = '0' + secs;
        }
        if (mins > 0 || type == 'total') {
            return mins + ":" + secs;
        } else {
            return secs;
        }
    };

    $scope.openCallToAction = function () {
        trackEvent('Ad Click', globalSworkitAds.adName, $stateParams.typeId);
        if (!$scope.workoutComplete) {
            workoutOnPause();
        }
        if (globalSworkitAds.isEndRunning && globalSworkitAds.sworkitProUpgrade) {
            if ($scope.workoutComplete) {
                $scope.mainMenu();
            } else {
                $scope.cancelModal();
            }
            $timeout(function () {
                $rootScope.showPremium(globalSworkitAds.adName);
            }, 1000)
        } else if (globalSworkitAds.isEndRunning) {
            if (ionic.Platform.isAndroid()) {
                $window.open(globalSworkitAds.adActionLink, 'blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
            } else {
                $window.open(globalSworkitAds.adActionLink, 'blank', 'location=yes,AllowInlineMediaPlayback=yes,toolbarposition=top');
            }
        }
    };

    $scope.closeEndWorkoutAd = function () {
        if ($scope.workoutComplete) {
            $scope.mainMenu();
        } else {
            $scope.cancelModal();
        }
        $timeout(function () {
            $rootScope.showPremium('Ad-free close');
        }, 1000)
    };

    $scope.getVideoLocation = function () {
        if ($scope.currentExercise.unlocked) {
            return $scope.deviceBasePath + 'exercises/video/';
        } else {
            return 'video/';
        }
    };

    $scope.getAudioLocation = function (requestedExercise) {
        if (requestedExercise.unlocked) {
            return $scope.deviceBasePath + 'exercises/audio/' + PersonalData.GetUserSettings.preferredLanguage.toLowerCase() + '/';
        } else {
            return normalAudioPath;
        }
    };

    //Set defaults each time
    $scope.setDefaults = function () {
        angular.element(document.getElementById('inline-video')).css('opacity', '0.0001');
        angular.element(document.getElementById('video-background')).css('opacity', '0.00001');
        $scope.currentExercise = controller.userExercises[$scope.currentWorkout[0]];
        $scope.currentExercise.imageAddress = $scope.getImageAddress(controller.userExercises[$scope.currentWorkout[0]]);
        $scope.nextExercise = {
            status: false,
            name: false,
            imageAddress: $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[0]]),
            unlocked: controller.userExercises[$scope.currentWorkout[0]].unlocked || false
        };
        if ($scope.androidPlatform && $window.device) {

        } else {
            $timeout(function() {
                $scope.videoAddress = $scope.getVideoLocation() + $scope.currentExercise.video;
            });
        }
        $timeout(function () {
            if ($scope.currentExercise.switchOption) {
                $scope.helpText = $translate.instant('CHANGE_SIDE');
            } else {
                $scope.helpText = false;
            }
            angular.element(document.getElementById('total-progress-bar')).addClass('started');
        }, 800);
        $scope.hasStarted = false;
        $scope.transitionsStatus = false;
        $scope.timerDelay = null;
        $scope.workoutComplete = false;
        $scope.interstitialHasBeenAttempted = false;
        $scope.numExercises = 0;
        $scope.originalRandomization = $scope.advancedTiming.randomizationOption;
        $scope.trackedExercises = [];
        $scope.heartRateSamples = [];
        if ($stateParams.typeId == 'sevenMinute') {
            $scope.advancedTiming.breakFreq = 0;
            $scope.advancedTiming.restStatus = false;
            $scope.advancedTiming.exerciseTime = $scope.sevenTiming.exerciseTimeSeven;
            $scope.advancedTiming.breakTime = 0;
            $scope.advancedTiming.transitionTime = $scope.sevenTiming.transitionTimeSeven;
            $scope.advancedTiming.randomizationOption = $scope.sevenTiming.randomizationOptionSeven;
        } else if (!$scope.premiumWorkoutSettings) {
            if ($scope.advancedTiming.transition) {
                $scope.advancedTiming.transitionTime = 5;
            } else {
                $scope.advancedTiming.transitionTime = 0;
            }
            $scope.advancedTiming.breakFreq = 5;
            $scope.advancedTiming.exerciseTime = 30;
            $scope.advancedTiming.breakTime = 30;
            $scope.advancedTiming.restStatus = true;
            $scope.advancedTiming.randomizationOption = true;
            if ($stateParams.typeId == 'headToToe' || $stateParams.typeId == 'stretchExercise') {
                $scope.advancedTiming.breakFreq = 0;
                $scope.advancedTiming.restStatus = false;
            }
        }
        if ($stateParams.typeId == 'headToToe') {
            $scope.advancedTiming.randomizationOption = false;
        }
        // Still trying to decide if we should force no break for stretching, my latest vote is yes, Ryan 12/15/15
        if ($scope.advancedTiming.breakFreq == 5 && $scope.advancedTiming.exerciseTime == 30 && $scope.advancedTiming.breakTime == 30) {
            if ($stateParams.typeId == 'headToToe' || $stateParams.typeId == 'stretchExercise' || $stateParams.typeId == "standingStretches" || $stateParams.typeId == "officeStretch") {
                $scope.advancedTiming.breakFreq = 0;
                $scope.advancedTiming.restStatus = false;
            }
        }
        if (isYogaWorkout()) {
            $scope.yogaSelection = true;
            $scope.advancedTiming.customSet = false;
            $scope.advancedTiming.breakFreq = 0;
            $scope.advancedTiming.restStatus = false;
            $scope.advancedTiming.breakTime = 0;
            $scope.advancedTiming.transitionTime = 0;
            $scope.advancedTiming.transition = false;
            $scope.advancedTiming.randomizationOption = false;
            $scope.advancedTiming.warningAudio = false;
            $scope.initYogaTiming();
        }
        $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;

        $scope.singleTimerRunning = false;
        $scope.totalTimerRunning = false;
        $scope.singleTimer = {
            time: $scope.advancedTiming.exerciseTime,
            minutes: 0,
            seconds: 0,
            displayText: '',
            status: false
        };
        $scope.totalTimer = {time: $stateParams.timeId, minutes: 0, seconds: 0, displayText: '', status: false};
        $scope.singleSecondsStart = $scope.advancedTiming.exerciseTime;
        $scope.totalSecondsStart = $stateParams.timeId;

        $scope.setMinutes();

        $scope.initWatch(function () {
                //$scope.initWatch();
                $scope.syncStateWithWatch();
            },
            function () {

            }
        );

        $timeout(function () {
            angular.element(document.getElementById('video-background')).css('opacity', '1');
            if ($scope.advancedTiming.autoPlay) {
                if (!ionic.Platform.isAndroid()) {
                    var videoFrame = angular.element(document.getElementById('inline-video'))[0];
                    var playEventListener = function () {
                        playInlineVideo($scope.advancedTiming.autoPlay, controller.userExercises[$scope.currentWorkout[0]]);
                        setTimeout(function () {
                            angular.element(document.getElementById('inline-video')).css('opacity', '1');
                        }, 500);
                        videoFrame.removeEventListener('canplaythrough', playEventListener);
                    };
                    videoFrame.addEventListener('canplaythrough', playEventListener);
                    setTimeout(function () {
                        angular.element(document.getElementById('inline-video')).css('opacity', '1');
                        $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                        $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                        $scope.$apply();
                    }, 1000);
                } else {
                    setTimeout(function () {
                        $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                        $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                    }, 500);
                }
            } else {
                setTimeout(function () {
                    angular.element(document.getElementById('inline-video')).css('opacity', '1');
                    $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                    $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                }, 500);
            }
            if ($scope.isAutoStart) {
                $scope.transitionAction(true);
            }
            if (ionic.Platform.isAndroid() && $window.device && $scope.advancedTiming.autoPlay) {
                $scope.playAndroidNativeVideo();
            }
        }, 200);


        $timeout(function () {
            $scope.setVideo();
            if (ionic.Platform.isAndroid() && $window.device && $scope.advancedTiming.autoPlay) {
                var videoBox = document.getElementById('video-background');
                var width = videoBox.clientWidth;
                var height = width * 0.563;
                var yPosition = videoBox.getBoundingClientRect().top;
                var xPosition = videoBox.getBoundingClientRect().left;
                window.plugins.NativeVideo.position(xPosition, yPosition, width, height, (function () {
                }));
            }
        }, 500);

        if ($stateParams.typeId == "customWorkout") {

        }
        var workoutTypeName = $stateParams.typeId == "customWorkout" ? $scope.chosenWorkout.activityNames : translations['EN'][$scope.chosenWorkout.activityNames];
        trackEvent('Workout Type', workoutTypeName, $stateParams.timeId);
        if ($window.device) {
            FiksuTrackingManager.uploadPurchase(FiksuTrackingManager.PurchaseEvent.Event1, 0, "USD");
        }
    };

    $scope.startTimer = function () {

        start = $interval(function () {
            if ($scope.totalTimer.seconds % 5 == 0) {
                $scope.totalWidth = 100 - (((($stateParams.timeId * 60) - ((($scope.totalTimer.minutes) * 60) + $scope.totalTimer.seconds)) / ($stateParams.timeId * 60)) * 100);
            }
            if ($scope.totalTimer.seconds == 0 && $scope.totalTimer.minutes == 0) {
                $scope.trackedExercises.push({
                    'exercise': translations['EN'][$scope.currentExercise.name],
                    'length': $scope.advancedTiming.exerciseTime
                });
                $scope.workoutComplete = true;
                $scope.endWorkout();

                $scope.singleTimer.seconds = 1;
                $scope.totalTimer.seconds = 1;
            }
            else if ($scope.totalTimer.seconds == 0 && $scope.totalTimer.minutes > 0) {
                $scope.totalTimer.seconds = 60;
                $scope.totalTimer.minutes--;
            }
            if ($scope.currentExercise.switchOption && $scope.singleTimer.seconds == (Math.round($scope.advancedTiming.exerciseTime / 2))) {
                if ($scope.currentExercise.image !== "restbreak.jpg") {
                    $scope.playSwitchSound();
                    $scope.changeText = $translate.instant('CHANGE_SIDE_SM');
                    continueInlineVideo($scope.advancedTiming.autoPlay, controller.userExercises[$scope.currentWorkout[0]]);
                }
            } else if ($scope.advancedTiming.warningAudio) {
                if ($scope.singleTimer.seconds == 11 && $scope.singleTimer.minutes == 0 && $scope.numExercises !== $scope.advancedTiming.breakFreq - 1) {
                    if ($scope.totalTimer.minutes == 0) {
                        if ($scope.totalTimer.seconds > 11) {
                            $scope.playNextWarning(controller.userExercises[$scope.currentWorkout[1]]);
                            $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                            $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                            $scope.nextExercise.status = true;
                        }
                    } else {
                        $scope.playNextWarning(controller.userExercises[$scope.currentWorkout[1]]);
                        $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                        $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                        $scope.nextExercise.status = true;
                    }
                }
            }
            if ($scope.singleTimer.seconds == 0 && $scope.singleTimer.minutes == 0) {
                $scope.numExercises++;
                if ($scope.numExercises == $scope.advancedTiming.breakFreq && $scope.advancedTiming.breakFreq !== 0 && $scope.advancedTiming.restStatus && $scope.advancedTiming.breakTime > 0) {
                    $scope.nextExercise.status = false;
                    $scope.playBreakSound();
                    $scope.showMediumAds();
                    $scope.numExercises = -1;
                    $scope.nextExercise.imageAddress = 'img/frames/restbreak.jpg';
                    $scope.nextExercise.unlocked = false;
                    $scope.helpText = false;
                    var breakText = $translate.instant('TAKE') + " " + $scope.advancedTiming.breakTime + " " + $translate.instant('SEC_BREAK');
                    if ($scope.advancedTiming.autoPlay) {
                        if (ionic.Platform.isAndroid() && $window.device) {

                        } else {
                            angular.element(document.getElementById('inline-video')).css('opacity', '0.0001');
                        }
                    }
                    $scope.currentExercise = {
                        "name": breakText,
                        "image": "restbreak.jpg",
                        "youtube": "rN6ATi7fujU",
                        "switchOption": false,
                        "video": "restbreak.mp4",
                        "category": false
                    };
                    $scope.videoAddress = 'video/restbreak.mp4';
                    $scope.currentExercise.imageAddress = 'img/frames/restbreak.jpg';
                    $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                    var videoFrame = angular.element(document.getElementById('inline-video'))[0];
                    if ($scope.advancedTiming.autoPlay) {
                        if (ionic.Platform.isAndroid() && $window.device) {
                            window.plugins.NativeVideo.setPath('restbreak.mp4', false, $scope.deviceBasePath, function() {
                                angular.element(document.getElementById('video-background')).css('opacity', '0.00001');
                                var videoBox = document.getElementById('video-background');
                                var width = videoBox.clientWidth;
                                var height = width * 0.563;
                                var yPosition = videoBox.getBoundingClientRect().top;
                                var xPosition = videoBox.getBoundingClientRect().left;
                                window.plugins.NativeVideo.position(xPosition, yPosition, width, height, (function() {
                                    window.plugins.NativeVideo.play(function() {

                                    });
                                }));
                            });
                            setTimeout(function () {
                                $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                                $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                                $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                                $scope.$apply();
                            }, 1500)
                        }
                        else {
                            clearTimeout(inlineVideoTimeout);
                            var playEventListener = function () {
                                playInlineVideo($scope.advancedTiming.autoPlay, controller.userExercises[$scope.currentWorkout[0]]);
                                $timeout(function () {
                                    $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                                    $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                                    $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                                    $scope.$apply()
                                }, 2000);
                                setTimeout(function () {
                                    angular.element(document.getElementById('inline-video')).css('opacity', '1');
                                }, 1000);
                                videoFrame.removeEventListener('canplaythrough', playEventListener);
                            };
                            videoFrame.addEventListener('canplaythrough', playEventListener);
                        }
                    } else {
                        setTimeout(function () {
                            if ($scope.numExercises == $scope.advancedTiming.breakFreq - 1 && $scope.advancedTiming.breakFreq !== 0 && $scope.advancedTiming.breakTime > 0 && $scope.advancedTiming.restStatus) {
                                $scope.nextExercise.name = $translate.instant('TAKE') + " " + $scope.advancedTiming.breakTime + " " + $translate.instant('SEC_BREAK');
                                $scope.nextExercise.imageAddress = "img/frames/restbreak.jpg";
                                $scope.nextExercise.unlocked = false;
                            } else {
                                $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                                $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                                $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                            }
                            $scope.$apply();
                        }, 500);
                    }
                    var singleSeconds = $scope.advancedTiming.breakTime;
                    if (singleSeconds > 60) {
                        $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
                        $scope.singleTimer.seconds = singleSeconds % 60;
                        if ($scope.singleTimer.seconds == 0) {
                            $scope.singleTimer.seconds = 60;
                            $scope.singleTimer.minutes--;
                        }
                    } else {
                        $scope.singleTimer.minutes = 0;
                        $scope.singleTimer.seconds = singleSeconds;
                    }
                    $scope.updateTime();
                    $scope.syncStateWithWatch();
                }
                else {
                    $scope.skipExercise();
                    $scope.singleTimer.seconds++;
                    $scope.totalTimer.seconds++;
                    if ($scope.totalTimer.seconds > 60) {
                        $scope.totalTimer.minutes++;
                        $scope.totalTimer.seconds = 1;
                    }
                }
            }
            else if ($scope.singleTimer.seconds == 4 && $scope.advancedTiming.countdownBeep && $scope.singleTimer.minutes == 0) {
                if (!$scope.yogaSelection) {
                    $scope.playCountdown();
                }
                if ($scope.numExercises == $scope.advancedTiming.breakFreq - 1 && $scope.advancedTiming.breakFreq !== 0 && $scope.advancedTiming.breakTime > 0 && $scope.advancedTiming.restStatus) {
                    $scope.nextExercise.name = $translate.instant('TAKE') + " " + $scope.advancedTiming.breakTime + " " + $translate.instant('SEC_BREAK');
                    $scope.nextExercise.imageAddress = "img/frames/restbreak.jpg";
                    $scope.nextExercise.unlocked = false;
                    $scope.nextExercise.status = true;
                }
            }
            else if ($scope.singleTimer.seconds == 0 && $scope.singleTimer.minutes > 0) {
                $scope.singleTimer.seconds = 60;
                $scope.singleTimer.minutes--;
            }
            if ($scope.singleTimer.seconds == 4 && $scope.advancedTiming.countdownBeep && $scope.singleTimer.seconds == 0 && $scope.singleTimer.minutes < 0) {
                console.log('Ryan: weird scenario commented out earier');
            }
            $scope.singleTimer.seconds--;
            $scope.totalTimer.seconds--;
            $scope.updateTime();
        }, 1000);
        $scope.singleTimer.status = true;
        $scope.totalTimer.status = true;

        //Specific actions for very first START
        if (!$scope.hasStarted) {
            if (!$scope.advancedTiming.autoStart) {
                $scope.playNextSound(controller.userExercises[$scope.currentWorkout[0]]);
            }
            $scope.isAutoStart = false;
            if ($stateParams.typeId !== 'sevenMinute' && !$scope.advancedTiming.autoStart) {
                $scope.transitionAction();
            }
            $scope.startTime = js_yyyy_mm_dd_hh_mm_ss();
            $scope.startDate = new Date();
        }
        $scope.hasStarted = true;
        $scope.syncStateWithWatch();
    };

    $scope.showBegin = function () {
        $scope.beginNotification = true;
        $scope.changeText = false;
        $timeout(function () {
            $scope.beginNotification = false;
        }, 2000)
    };

    $scope.stopTimer = function () {
        $interval.cancel(start);
        start = undefined;
        $scope.singleTimer.status = false;
        $scope.totalTimer.status = false;
    };

    $scope.toggleTimer = function () {
        $timeout.cancel($scope.delayStart);
        if ($scope.timerDelay !== null && !$scope.totalTimer.status) {
            $scope.transitionStatus = false;
            $interval.cancel($scope.transitionCountdown);
            $scope.isAutoStart = false;
            $scope.timerDelay = null;
            $scope.startTimer();
            $scope.toggleControls();
        } else if ($scope.timerDelay == null && $scope.totalTimer.status) {
            $scope.stopTimer();
        } else if ($scope.timerDelay == null && !$scope.totalTimer.status && !$scope.hasStarted) {
            $scope.startTimer();
            $scope.toggleControls();
        } else if ($scope.timerDelay == null && !$scope.totalTimer.status) {
            //Leaving this else if in case we want to have the pause always after watching video
            //$scope.transitionAction();
            $scope.startTimer();
            $scope.toggleControls();
        }
        $scope.syncStateWithWatch();
    };

    $scope.skipExercise = function (fromControl) {
        $scope.ensureBannersOn();
        if (fromControl) {
            $scope.toggleControls(true);
            $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
            $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
        }
        $scope.nextExercise.status = false;
        if ($scope.isAutoStart) {
            $timeout.cancel($scope.firstExerciseAudio);
        } else {
            $interval.cancel($scope.transitionCountdown);
            $timeout.cancel($scope.delayStart);
        }
        $scope.previousExercise = $scope.currentExercise;
        var secondsCompleted = $scope.advancedTiming.exerciseTime - (($scope.singleTimer.minutes * 60) + $scope.singleTimer.seconds);
        $scope.trackedExercises.push({
            'exercise': translations['EN'][$scope.currentExercise.name],
            'length': secondsCompleted
        });
        $scope.currentWorkout.shift();
        if ($scope.currentWorkout.length == 1) {
            $scope.lastExercise = controller.userExercises[$scope.currentWorkout[0]];
            $scope.currentWorkout.shift();
            $scope.currentWorkout = $scope.currentWorkout.concat($scope.startedWorkout);
            if ($stateParams.typeId == 'headToToe' || ($stateParams.typeId == 'sevenMinute' && !$scope.sevenTiming.randomizationOptionSeven) || isYogaWorkout()) {
            } else {
                if ($scope.advancedTiming.randomizationOption || !$scope.advancedTiming.customSet) {
                    if ($stateParams.typeId == "upperBody") {
                        var pushupBased = ["Push-ups", "Diamond Push-ups", "Wide Arm Push-ups", "Alternating Push-up Plank", "One Arm Side Push-up", "Dive Bomber Push-ups", "Shoulder Tap Push-ups", "Spiderman Push-up", "Push-up and Rotation"];
                        var nonPushup = ["Overhead Press", "Overhead Arm Clap", "Tricep Dips", "Jumping Jacks", "Chest Expander", "T Raise", "Lying Triceps Lifts", "Reverse Plank", "Power Circles", "Wall Push-ups"];
                        pushupBased = pushupBased.sort(function () {
                            return 0.5 - Math.random()
                        });
                        nonPushup = nonPushup.sort(function () {
                            return 0.5 - Math.random()
                        });
                        var mergedUpper = mergeAlternating(pushupBased, nonPushup);
                        $scope.currentWorkout = mergedUpper;
                    } else {
                        $scope.currentWorkout = $scope.currentWorkout.sort(function () {
                            return 0.5 - Math.random()
                        });
                    }
                }
            }
            $scope.currentWorkout.unshift(translations['EN'][$scope.lastExercise.name]);
            if ((!isYogaWorkout() && $scope.advancedTiming.randomizationOption) && (translations['EN'][$scope.lastExercise.name] == translations['EN'][controller.userExercises[$scope.currentWorkout[1]].name])) {
                $scope.currentWorkout.shift();
            }
        }
        $scope.currentExercise = controller.userExercises[$scope.currentWorkout[0]];
        $scope.currentExercise.imageAddress = $scope.getImageAddress(controller.userExercises[$scope.currentWorkout[0]]);

        if ($scope.androidPlatform && $window.device) {

        } else {
            angular.element(document.getElementById('inline-video')).css('opacity', '0.00001');
            setTimeout(function () {
                $scope.videoAddress = $scope.getVideoLocation() + $scope.currentExercise.video;
            }, 0);
        }

        if ($scope.advancedTiming.autoPlay) {
            var videoFrame = angular.element(document.getElementById('inline-video'))[0];
            if (ionic.Platform.isAndroid() && $window.device) {
                $scope.playAndroidNativeVideo();
                setTimeout(function () {
                    if ($scope.numExercises == $scope.advancedTiming.breakFreq - 1 && $scope.advancedTiming.breakFreq !== 0 && $scope.advancedTiming.breakTime > 0 && $scope.advancedTiming.restStatus) {
                        $scope.nextExercise.name = $translate.instant('TAKE') + " " + $scope.advancedTiming.breakTime + " " + $translate.instant('SEC_BREAK');
                        $scope.nextExercise.imageAddress = "img/frames/restbreak.jpg";
                        $scope.nextExercise.unlocked = false;
                    } else {
                        $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                        $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                        $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked;
                    }
                    $scope.$apply();
                }, 1500)
            } else {
                clearTimeout(inlineVideoTimeout);
                var playEventListener = function () {
                    playInlineVideo($scope.advancedTiming.autoPlay, controller.userExercises[$scope.currentWorkout[0]]);
                    setTimeout(function () {
                        angular.element(document.getElementById('inline-video')).css('opacity', '1');
                        if ($scope.numExercises == $scope.advancedTiming.breakFreq - 1 && $scope.advancedTiming.breakFreq !== 0 && $scope.advancedTiming.breakTime > 0 && $scope.advancedTiming.restStatus) {
                            $scope.nextExercise.name = $translate.instant('TAKE') + " " + $scope.advancedTiming.breakTime + " " + $translate.instant('SEC_BREAK');
                            $scope.nextExercise.imageAddress = "img/frames/restbreak.jpg";
                            $scope.nextExercise.unlocked = false;
                        } else {
                            $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                            $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                            $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                        }
                        $scope.$apply();
                    }, 500);
                    videoFrame.removeEventListener('canplaythrough', playEventListener);
                };
                videoFrame.addEventListener('canplaythrough', playEventListener);
                setTimeout(function () {
                    angular.element(document.getElementById('inline-video')).css('opacity', '1');
                }, 1500);
            }
        } else {
            setTimeout(function () {
                angular.element(document.getElementById('inline-video')).css('opacity', '1');
                $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
            }, 500);
        }
        var singleSeconds = $scope.advancedTiming.exerciseTime;
        if (singleSeconds > 60) {
            $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
            $scope.singleTimer.seconds = singleSeconds % 60;
        } else {
            $scope.singleTimer.minutes = 0;
            $scope.singleTimer.seconds = singleSeconds;
        }

        if ($scope.totalTimer.status && $scope.timerDelay != null) {
            $scope.transitionAction();
        } else if (!$scope.totalTimer.status && $scope.timerDelay != null && !$scope.isAutoStart) {
            $scope.transitionTimer = $scope.advancedTiming.transitionTime;
            $scope.transitionAction();
        } else if ($scope.totalTimer.status && $scope.timerDelay == null) {
            $scope.transitionTimer = $scope.advancedTiming.transitionTime;
            $scope.transitionAction();
        }

        $scope.playNextSound($scope.currentExercise);
        $scope.updateTime();
        if ($scope.currentExercise.switchOption) {
            $scope.helpText = $translate.instant('CHANGE_SIDE');
        } else {
            $scope.helpText = false;
        }
        $scope.changeText = false;
        $scope.totalWidth = 100 - (((($stateParams.timeId * 60) - ((($scope.totalTimer.minutes) * 60) + $scope.totalTimer.seconds)) / ($stateParams.timeId * 60)) * 100);

        $scope.syncStateWithWatch();
    };
    $scope.backExercise = function () {
        if ($scope.previousExercise) {
            angular.element(document.getElementById('video-background')).css('opacity', '0.00001');
            $scope.nextExercise.status = false;
            $interval.cancel($scope.transitionCountdown);
            $timeout.cancel($scope.delayStart);
            $scope.currentWorkout.unshift(translations['EN'][$scope.previousExercise.name]);
            $scope.previousExercise = false;
            $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[0]]);
            $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[0]].unlocked || false;
            $scope.currentExercise = controller.userExercises[$scope.currentWorkout[0]];
            $scope.currentExercise.imageAddress = $scope.getImageAddress(controller.userExercises[$scope.currentWorkout[0]]);
            if ($scope.androidPlatform && $window.device) {
            } else {
                $scope.videoAddress = $scope.getVideoLocation() + $scope.currentExercise.video;
            }
            var videoFrame = angular.element(document.getElementById('inline-video'))[0];
            $scope.ensureBannersOn();
            if ($scope.advancedTiming.autoPlay) {
                if (ionic.Platform.isAndroid() && $window.device) {
                    $scope.playAndroidNativeVideo();
                    setTimeout(function () {
                        if (!$scope.advancedTiming.autoPlay) {
                            angular.element(document.getElementById('video-background')).css('opacity', '1');
                        }
                        $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                        $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                        $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                        $scope.$apply();
                    }, 1500)

                } else {
                    clearTimeout(inlineVideoTimeout);
                    angular.element(document.getElementById('inline-video')).css('opacity', '0.0001');
                    var playEventListener = function () {
                        setTimeout(function () {
                            angular.element(document.getElementById('inline-video')).css('opacity', '1');
                            playInlineVideo($scope.advancedTiming.autoPlay, controller.userExercises[$scope.currentWorkout[0]]);
                            $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                            $scope.nextExercise.unlocked = controller.userExercises[$scope.currentWorkout[1]].unlocked || false;
                            $scope.nextExercise.name = controller.userExercises[$scope.currentWorkout[1]].name;
                            $scope.$apply();
                        }, 500);
                        angular.element(document.getElementById('video-background')).css('opacity', '1');
                        videoFrame.removeEventListener('canplaythrough', playEventListener);
                    };
                    videoFrame.addEventListener('canplaythrough', playEventListener);
                }
            } else {
                setTimeout(function () {
                    angular.element(document.getElementById('inline-video')).css('opacity', '1');
                    $scope.nextExercise.imageAddress = $scope.getImageAddressNext(controller.userExercises[$scope.currentWorkout[1]]);
                }, 500);
                angular.element(document.getElementById('video-background')).css('opacity', '1');
            }

            var singleSeconds = $scope.advancedTiming.exerciseTime;
            if (singleSeconds > 60) {
                $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
                $scope.singleTimer.seconds = singleSeconds % 60;
            } else {
                $scope.singleTimer.minutes = 0;
                $scope.singleTimer.seconds = singleSeconds;
            }
            if ($scope.totalTimer.status && $scope.timerDelay != null) {
                $scope.transitionAction();
            } else if (!$scope.totalTimer.status && $scope.timerDelay != null) {
                $scope.transitionTimer = $scope.advancedTiming.transitionTime;
                $scope.transitionAction();
            } else if ($scope.totalTimer.status && $scope.timerDelay == null) {
                $scope.transitionTimer = $scope.advancedTiming.transitionTime;
                $scope.transitionAction();
            }
            $scope.playNextSound($scope.currentExercise);
            $scope.updateTime();
            if ($scope.currentExercise.switchOption) {
                $scope.helpText = $translate.instant('CHANGE_SIDE');
            } else {
                $scope.helpText = false;
            }
            $scope.changeText = false;
            $scope.toggleControls(true);
        }

        $scope.syncStateWithWatch();

    };
    $scope.swipeLeftSkip = function () {
        $scope.skipExercise();
    };
    $scope.swipeRightBack = function () {
        $scope.backExercise();
    };
    $scope.$on('$ionicView.leave', function () {
        $scope.stopTimer();
        if ($scope.isEndAdCampaign && globalSworkitAds.imageSuccess) {
            //$scope.hiddenURL.close();
        }
        angular.element(document.querySelector(".title")).removeClass('no-nav');
        angular.element(document.querySelector("body")).removeClass('workout-bar');
        if ($scope.androidPlatform && $window.device) {
            document.querySelectorAll("drawer")[0].attributes.candrag.value = true;
        } else if ($window.device) {
            StatusBar.show();
        }
        if (lockOrientation()) {
            if ($window.device) {
                $window.screen.lockOrientation('portrait');
            }
        }
        $ionicNavBarDelegate.showBar(true);
        $ionicHistory.clearCache();
        localforage.getItem('timingSettings', function (result) {
            TimingData.GetTimingSettings = result
        });
        if ($window.device) {
            LowLatencyAudio.unload('ding');
            LowLatencyAudio.unload('begin');
            LowLatencyAudio.unload('switch');
            LowLatencyAudio.unload('switchding');
            LowLatencyAudio.unload('next');
            LowLatencyAudio.unload('countdown');
            LowLatencyAudio.unload('countdownVoice');
            LowLatencyAudio.unload('break');
            LowLatencyAudio.unload('congrats');
        }
    });

    //Audio section
    var basicAudioPath = 'audio/';
    var normalAudioPath;
    if (ionic.Platform.isAndroid()) {
        normalAudioPath = 'audio/';
    } else {
        normalAudioPath = 'audio/';
    }
    $scope.isAudioAvailable = PersonalData.GetLanguageSettings[$scope.userSettings.preferredLanguage];
    $scope.setAudioPaths = function () {
        if ($scope.userSettings.preferredLanguage == 'EN') {
            // Don't change paths here //
        } else if ($scope.isAudioAvailable) {
            normalAudioPath = cordova.file.dataDirectory + $scope.userSettings.preferredLanguage + '/';
            basicAudioPath = 'audio/' + $scope.userSettings.preferredLanguage + '/';
        } else if ($scope.userSettings.preferredLanguage !== 'EN') {
            basicAudioPath = 'audio/' + $scope.userSettings.preferredLanguage + '/';
        }
    };
    $scope.setAudioPaths();

    var brandedAudioTakeoverAllows = function () {
        if (globalSworkitAds.isCustomBrandRunning && globalSworkitAds.customBrandExperience.audioForBrandedWorkoutsOnly) {
            return ($stateParams.typeId == "customWorkout" && LocalData.GetWorkoutTypes.customWorkout.customData && LocalData.GetWorkoutTypes.customWorkout.customData.brandedCustomWorkout);
        } else {
            return true;
        }
        return true;
    };

    $scope.urlCounter = Math.floor(Math.random() * 100000);
    $scope.playNextSound = function (currentEx, firstAudio) {
        if ($window.device) {
            $scope.urlCounter = $scope.urlCounter + 1;
            var muteUnmute = $scope.extraSettings.audioOption;
            var exerciseNum = "exercise" + $scope.urlCounter.toString();
            var audioURL = $scope.getAudioLocation(currentEx) + currentEx.audio;
            $log.debug("playNextSound() audioURL", audioURL);
            if (!ionic.Platform.isAndroid()) {
                LowLatencyAudio.preloadAudio(exerciseNum, audioURL, 1);
                $scope.unloadQueue.unshift(exerciseNum);
            } else {
                LowLatencyAudio.preloadFX(exerciseNum, audioURL);
                $scope.unloadQueue.unshift(exerciseNum);
            }
            if (muteUnmute && $scope.isAudioAvailable) {
                $timeout(function () {
                    LowLatencyAudio.play(exerciseNum, $scope.audioSettings.duckEverything.toString());
                    $scope.unloadAudio();
                }, 300);

                if (firstAudio) {
                    $scope.isAudioAvailable = PersonalData.GetLanguageSettings[$scope.userSettings.preferredLanguage];
                    if ($scope.isAudioAvailable) {
                        $scope.setAudioPaths();
                    }
                }
            } else {
                if ($scope.yogaSelection && !firstAudio) {
                    LowLatencyAudio.play('switchding', $scope.audioSettings.duckEverything.toString());
                } else if (!firstAudio) {
                    LowLatencyAudio.play('ding', $scope.audioSettings.duckEverything.toString());
                }
                $scope.isAudioAvailable = PersonalData.GetLanguageSettings[$scope.userSettings.preferredLanguage];
                if ($scope.isAudioAvailable) {
                    $scope.setAudioPaths();
                }
                $scope.unloadAudio();
            }
        } else {
            console.log('Sound: Exercise name ');
        }

    };
    $scope.numberOfRests = 0;
    $scope.playBreakSound = function () {
        if ($window.device) {
            var muteUnmute = $scope.extraSettings.audioOption;
            if ($scope.advancedTiming.breakTime == 30) {
                LowLatencyAudio.preloadAudio('break', basicAudioPath + 'Break.mp3', 1);
                $scope.numberOfRests = 1;
            } else {
                LowLatencyAudio.preloadAudio('break', basicAudioPath + 'TakeBreak.mp3', 1);
            }
            if (muteUnmute) {
                $timeout(function () {
                    LowLatencyAudio.play('break', $scope.audioSettings.duckEverything.toString());
                }, 300);
            } else {
                LowLatencyAudio.play('ding', $scope.audioSettings.duckEverything.toString());
            }
        } else {
            console.log('Sound: take a break');
        }
        swAnalytics.trackEvent('workout', 'rest-break', $scope.advancedTiming.breakTime);
        AccessService.isPremiumUser()
            .then(function (isPremiumUser) {
                swAnalytics.trackEvent('ad-potential', 'rest-break', isPremiumUser ? 'user-premium' : 'user-free');
            });
    };
    $scope.playSwitchSound = function () {
        $scope.transitionPause();
        if ($window.device) {
            var muteUnmute = $scope.extraSettings.audioOption;
            if (muteUnmute) {
                $timeout(function () {
                    LowLatencyAudio.play('switch', $scope.audioSettings.duckEverything.toString());
                }, 300);
            }
            else {
                $timeout(function () {
                    LowLatencyAudio.play('switchding', $scope.audioSettings.duckEverything.toString());
                }, 300);
            }
        } else {
            console.log('Sound: switch sides');
        }
    };
    $scope.playNextWarning = function (currentEx) {
        if ($window.device) {
            $scope.urlCounter = $scope.urlCounter + 1;
            var exerciseNum = "exercise" + $scope.urlCounter.toString();
            var audioURL = $scope.getAudioLocation(currentEx) + currentEx.audio;
            var muteUnmute = $scope.extraSettings.audioOption;
            if (!ionic.Platform.isAndroid()) {
                LowLatencyAudio.preloadAudio(exerciseNum, audioURL, 1);
                $scope.unloadQueue.unshift(exerciseNum);
            } else {
                LowLatencyAudio.preloadFX(exerciseNum, audioURL);
                $scope.unloadQueue.unshift(exerciseNum);
            }
            if (muteUnmute && $scope.isAudioAvailable) {
                $timeout(function () {
                    LowLatencyAudio.play('next', "false");
                }, 0);
                $timeout(function () {
                    LowLatencyAudio.play(exerciseNum, $scope.audioSettings.duckEverything.toString());
                }, 1600);
            }
        } else {
            console.log('Sound: next warning');
        }
    };

    $scope.playCountdown = function () {
        if ($window.device && $scope.extraSettings.countdownStyle) {
            $timeout(function () {
                LowLatencyAudio.play('countdownVoice', "false");
            }, 300);
        } else if ($window.device) {
            $timeout(function () {
                LowLatencyAudio.play('countdown', "false");
            }, 300);
        } else {
            console.log('Sound: Countdown');
        }
    };
    $scope.playBeginSound = function () {
        $scope.showBegin();
        if ($window.device) {
            $timeout(function () {
                LowLatencyAudio.play('begin', $scope.audioSettings.duckEverything.toString());
            }, 300);
        } else {
            console.log('Sound: Begin');
        }
    };
    $scope.playCongratsSound = function () {
        if ($window.device) {
            if ($scope.isEndAudioCampaign) {
                LowLatencyAudio.preloadAudio('congrats', cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adEndAudioName, 1);
            } else {
                LowLatencyAudio.preloadAudio('congrats', basicAudioPath + 'Congrats.mp3', 1);
            }
            $timeout(function () {
                LowLatencyAudio.play('congrats', $scope.audioSettings.duckEverything.toString());
            }, 300);
        } else {
            console.log('Sound: Congrats!');
        }
    };
    $scope.unloadAudio = function () {
        $timeout(function () {
            for (i = $scope.unloadQueue.length - 1; i >= 2; i--) {
                LowLatencyAudio.unload($scope.unloadQueue[i]);
                $scope.unloadQueue.splice((i), 1);
            }
        }, 2500);
    };
    $scope.toggleAudio = function () {
        $scope.extraSettings.audioOption = !$scope.extraSettings.audioOption;
    };
    $scope.toggleControls = function (override) {
        if (!$scope.isPortrait && override) {
            $scope.showControls = true;
            $timeout.cancel($scope.controlTimeout);
        }
        else if (!$scope.isPortrait && !$scope.showControls) {
            $scope.showControls = true;
            $timeout.cancel($scope.controlTimeout);
            $scope.controlTimeout = $timeout(function () {
                $scope.showControls = true;
            }, 3000)
        } else if (!$scope.isPortrait && $scope.showControls) {
            $scope.showControls = false;
            $timeout.cancel($scope.controlTimeout);
        }
    };
    $scope.increaseTempo = function () {
        $scope.advancedTiming.exerciseTime++;
        var singleSeconds = $scope.advancedTiming.exerciseTime;
        if (singleSeconds > 60) {
            $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
            $scope.singleTimer.seconds = singleSeconds % 60;
        } else {
            $scope.singleTimer.minutes = 0;
            $scope.singleTimer.seconds = singleSeconds;
        }
        $scope.updateTime();
    };
    $scope.decreaseTempo = function () {
        if ($scope.advancedTiming.exerciseTime > 1) {
            $scope.advancedTiming.exerciseTime--;
            var singleSeconds = $scope.advancedTiming.exerciseTime;
            if (singleSeconds > 60) {
                $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
                $scope.singleTimer.seconds = singleSeconds % 60;
            } else {
                $scope.singleTimer.minutes = 0;
                $scope.singleTimer.seconds = singleSeconds;
            }
            $scope.updateTime();
        }
    };
    $scope.initYogaTiming = function () {
        if ($stateParams.typeId == 'customWorkout' && LocalData.GetWorkoutTypes.customWorkout.customData && LocalData.GetWorkoutTypes.customWorkout.customData.poseLength) {
            $scope.advancedTiming.exerciseTime = LocalData.GetWorkoutTypes.customWorkout.customData.poseLength;
        } else if (isYogaWorkout()) {
            $scope.advancedTiming.exerciseTime = $scope.advancedTiming[$stateParams.typeId];
        } else {
            $scope.advancedTiming.exerciseTime = 15;
        }
    };
    $scope.transitionAction = function (autostart, continueTimer) {
        if (autostart && !continueTimer) {
            var transitionLength = 12;
            $scope.transitionTimer = 12;
        } else if (continueTimer) {
            $timeout.cancel($scope.transitionCountdown);
        } else {
            var transitionLength = $scope.advancedTiming.transitionTime;
            $scope.transitionTimer = $scope.advancedTiming.transitionTime;
        }
        $scope.transitionCountdown = $interval(function () {
            $scope.transitionTimer--;
        }, 1000);
        if (autostart && !continueTimer) {
            $scope.timerDelay = 0;
            $scope.stopTimer();
            $scope.transitionStatus = true;
            $scope.delayStart = $timeout(function () {
                $scope.playBeginSound();
                $scope.isAutoStart = false;
                $scope.startTimer();
                $scope.timerDelay = null;
                $scope.transitionStatus = false;
                $interval.cancel($scope.transitionCountdown);
            }, 12300);
        }
        else if (transitionLength == 10 && $stateParams.typeId == 'sevenMinute') {
            $scope.timerDelay = 0;
            $scope.stopTimer();
            $scope.transitionStatus = true;
            $scope.delayStart = $timeout(function () {
                $scope.playBeginSound();
                $scope.startTimer();
                $scope.timerDelay = null;
                $scope.transitionStatus = false;
                $interval.cancel($scope.transitionCountdown);
            }, 10300);
        }
        else if (transitionLength > 0 && transitionLength <= 4) {
            $scope.timerDelay = 0;
            $scope.stopTimer();
            $scope.transitionStatus = true;
            $scope.delayStart = $timeout(function () {
                $scope.startTimer();
                $scope.timerDelay = null;
                $scope.transitionStatus = false;
                $interval.cancel($scope.transitionCountdown);
            }, transitionLength * 1000);
        }
        else if (transitionLength > 4) {
            $scope.timerDelay = 0;
            $scope.stopTimer();
            $scope.transitionStatus = true;
            $scope.delayStart = $timeout(function () {
                $scope.playBeginSound();
                $scope.startTimer();
                $scope.timerDelay = null;
                $scope.transitionStatus = false;
                $interval.cancel($scope.transitionCountdown);
            }, transitionLength * 1000);
        }
        else {
            $interval.cancel($scope.transitionCountdown);
        }
    };
    $scope.transitionPause = function () {
        if ($scope.advancedTiming.transitionTime > 0) {
            $scope.timerDelay = 0;
            $scope.stopTimer();
            $scope.transitionTimer = 5;
            $scope.transitionCountdown = $interval(function () {
                $scope.transitionTimer--;
            }, 1000);
            $scope.transitionStatus = true;
            $scope.delayStart = $timeout(function () {
                $scope.changeText = false;
                $scope.helpText = false;
                $scope.playBeginSound();
                $scope.startTimer();
                $scope.timerDelay = null;
                $scope.transitionStatus = false;
                $interval.cancel($scope.transitionCountdown);
            }, 5000);
        } else {
            $scope.timerDelay = 0;
            $scope.stopTimer();
            $scope.transitionTimer = 3;
            $scope.transitionCountdown = $interval(function () {
                $scope.transitionTimer--;
            }, 1000);
            $scope.transitionStatus = true;
            $scope.delayStart = $timeout(function () {
                $scope.changeText = false;
                $scope.helpText = false;
                $scope.playBeginSound();
                $scope.startTimer();
                $scope.timerDelay = null;
                $scope.transitionStatus = false;
                $interval.cancel($scope.transitionCountdown);
            }, 3000);
        }
    };

    if (ionic.Platform.isAndroid()) {
        var workoutBack = $ionicPlatform.registerBackButtonAction(
            function () {
                if (!$scope.endModalOpen) {
                    $scope.endWorkout();
                } else if ($scope.endModalOpen && !$scope.workoutComplete) {
                    $scope.cancelModal();
                } else if ($scope.endModalOpen && $scope.workoutComplete) {
                    $scope.mainMenu();
                }
            }, 250
        );
    }

    $scope.launchMusic = function () {
        workoutOnPause();
        $scope.removeBanners();
        MusicPlaylistsModal.show();
    };

    $scope.showInterstitial = function () {
        $log.info('$scope.showInterstitial()');
        if (globalSworkitAds.isCustomInterstitial) {
            CustomInterstitialModal.show();
            trackEvent('Custom Interstitial', globalSworkitAds.customInterstitial.customAdID, 0);
        } else if (globalSworkitAds.useAdMobInterstitial && $window.device) {
            if ($window.AdMob) $window.AdMob.prepareInterstitial({
                license: "contact@sworkit.com/748952052cd93201ac292e2578a5c96d",
                adId: admobid.interstitial,
                autoShow: true
            });
        } else if (globalSworkitAds.useMoPubInterstitial && $window.device) {
            if ($window.MoPub) $window.MoPub.prepareInterstitial({
                license: "contact@sworkit.com/9397093eceffc87679dd2c2663befdf6",
                adId: mopubid.interstitial,
                autoShow: true
            });
        }
        $scope.interstitialHasBeenAttempted = true;
    };

    $scope.showBannerAds = function () {
        if ($scope.isAdMobRunning) {
            if ($window.AdMob) {
                $window.AdMob.createBanner({
                        license: "contact@sworkit.com/748952052cd93201ac292e2578a5c96d",
                        adId: $window.admobid.banner,
                        position: $window.AdMob.AD_POSITION.BOTTOM_CENTER,
                        autoShow: true,
                        adExtras: {
                            color_bg: '#444444',
                            color_bg_top: '444444',
                            color_border: 'FF8614',
                            color_link: '000080',
                            color_text: '808080',
                            color_url: 'FF8614'
                        }
                    }
                );
                $scope.bannerAdsShowing = true;
                document.addEventListener('onAdPresent', function () {
                    workoutOnPause()
                });
            }
        } else if ($scope.isMoPubRunning) {
            if ($window.MoPub) {
                var bannerSize = ionic.Platform.isIPad() ? "LEADERBOARD" : "SMART_BANNER";
                var shouldOverlap = ionic.Platform.isAndroid() ? true : false;
                $window.MoPub.createBanner({
                    license: "contact@sworkit.com/9397093eceffc87679dd2c2663befdf6",
                    adId: $window.mopubid.banner,
                    position: 8,
                    adSize: bannerSize,
                    autoShow: true,
                    overlap: shouldOverlap
                });
                $scope.bannerAdsShowing = true;
                document.addEventListener('onAdPresent', function () {
                    workoutOnPause()
                });
            }
        }
    };

    $scope.removeBanners = function (successCallback) {
        if ($window.device && $scope.isAdMobRunning && $window.AdMob) {
            $window.AdMob.removeBanner(successCallback);
        }
        if ($window.device && $scope.isMoPubRunning && $window.MoPub) {
            $window.MoPub.removeBanner(successCallback);
        }
        $scope.bannerAdsShowing = false;
    };

    $scope.showMediumAds = function () {
        $scope.isRestBreakActive = true;
        var onCreateBannerSuccess = function () {
            // For now $timeout is providing an additional safety net for Android. Need to retry when we are seeing higher Fill Rates to see if it is truly necessary.
            $timeout(function () {
                var videoBox = document.getElementById('restrict-video');
                var videoBoxTop = videoBox.getBoundingClientRect().top;
                var videoBoxHeight = videoBox.clientHeight;
                var mediumAdTop = videoBoxHeight > 250 ? videoBoxTop + ((videoBoxHeight - 250) / 2) : ((videoBoxTop + (videoBoxHeight / 2)) - 125);
                var mediumAdLeft = ($window.innerWidth - 300) / 2;
                if (ionic.Platform.isAndroid()) {
                    mediumAdTop =  mediumAdTop * $window.devicePixelRatio;
                    mediumAdLeft =  mediumAdLeft * $window.devicePixelRatio;
                }
                $window.MoPub.showBannerAtXY(Math.floor(mediumAdLeft), Math.floor(mediumAdTop));
                if (!$scope.isAdMobRunning && !$scope.isMoPubRunning) {
                    document.addEventListener('onAdPresent', function () {
                        workoutOnPause()
                    });
                }
                $log.info('onCreateBannerSuccess x', (($window.innerWidth - 300) / 2));
                $log.info('onCreateBannerSuccess y', Math.floor(mediumAdTop));
            }, 1500);
        };
        var attemptCreateMediumBanner = function () {
            $log.info('attemptCreateMediumBanner');
            if ($scope.showRestBreakAds) {
                if ($window.MoPub) {
                    $log.info('createBanner start');
                    $window.MoPub.createBanner({
                        license: "contact@sworkit.com/9397093eceffc87679dd2c2663befdf6",
                        adId: $window.mopubid.medium,
                        adSize: 'MEDIUM_RECTANGLE',
                        autoShow: false,
                        overlap: true
                    }, onCreateBannerSuccess);
                }
            }
        };
        $scope.removeBanners(attemptCreateMediumBanner);
    };

    $scope.ensureBannersOn = function () {
        if ($scope.isRestBreakActive) {
            $scope.removeBanners(
                function() {
                    $timeout(function() {
                        $scope.showBannerAds();
                    }, 1000)
                }
            );
            $scope.isRestBreakActive = false;
        }
    };

    $scope.initWatch = function (successCallback) {
        if (!ionic.Platform.isAndroid()) {
            if ($window.device) {

                $window.plugins.sworkitapplewatch.initWatch(
                    function (command) {
                        var commandName = command['commandName'];

                        if (commandName) {
                            console.log('new command: ' + commandName);
                            swAnalytics.trackEvent(GA_EVENT_CATEGORY_WATCH_APPLE, GA_EVENT_ACTION_WATCH_COMMAND, commandName);
                            if (commandName == "init") {
                                successCallback(command);
                            }
                            else if (!$scope.endModalOpen) {
                                if (commandName == "toggleTimer") {
                                    $scope.toggleTimer();
                                }
                                else if (commandName == "skip") {
                                    $scope.skipExercise();
                                }
                                else if (commandName == "back") {
                                    $scope.backExercise();
                                }
                                /*
                                 else if (commandName == "heartRate") {
                                 var heartRate = command['heartRate'];
                                 console.log('heartRate: '+heartRate);
                                 }
                                 */
                                else if (commandName == "heartRateSamples") {
                                    $scope.heartRateSamples = $scope.heartRateSamples.concat(command['heartRateSamples']);
                                }

                            }
                        }

                    },
                    function () {
                        console.log('oh problem?!');
                    }
                );

            } else {
                //Available in browser for testing purposes
                //$scope.healthKitData.healthKitAvailable = true;
            }
        }

    };

    $scope.WorkoutState = {
        NotActive: 0,
        TransitionActive: 1,
        ExercisePlaying: 2,
        ExercisePaused: 3
    };

    $scope.avgHeartRate = 0;
    $scope.peakHeartRate = 0;

    $scope.syncStateWithWatch = function (isMainMenu, isEndModal) {

        if (!ionic.Platform.isAndroid()) {
            if ($window.device) {

                var exerciseName = "";
                var workoutState = $scope.WorkoutState.NotActive;

                if (isEndModal && $scope.heartRateSamples.length > 0) {
                    $scope.peakHeartRate = Math.round(Math.max.apply(null, $scope.heartRateSamples));
                    var rateTotal = 0;
                    for (var i = 0; i < $scope.heartRateSamples.length; i++) {
                        rateTotal += $scope.heartRateSamples[i];
                    }
                    $scope.avgHeartRate = Math.round(rateTotal / $scope.heartRateSamples.length);
                    console.log('average rate: ', $scope.avgHeartRate);
                    console.log('peak rate: ', $scope.peakHeartRate);
                }
                if ($scope.endModalOpen || isMainMenu) {
                    //hide controls...
                }
                else if (!$scope.hasStarted) {
                    workoutState = $scope.WorkoutState.TransitionActive;
                }/*
                 else if ($scope.transitionStatus) {
                 workoutState = $scope.WorkoutState.TransitionActive;
                 }*/
                else {
                    //in an exercise
                    if ($scope.totalTimer.status) {
                        //playing
                        workoutState = $scope.WorkoutState.ExercisePlaying;
                    }
                    else {
                        //paused
                        workoutState = $scope.WorkoutState.ExercisePaused;
                    }
                }

                if ($scope.currentExercise) {
                    //exerciseName = translations['EN'][$scope.currentExercise.name];
                    exerciseName = $translate.instant($scope.currentExercise.name)
                }

                $window.plugins.sworkitapplewatch.syncWorkoutState(
                    {
                        'workoutState': workoutState,
                        'exerciseName': exerciseName,
                        'hasNextExercise': $scope.nextExercise ? true : false,
                        'hasPreviousExercise': $scope.previousExercise ? true : false,
                        'workoutComplete': $scope.endModalOpen ? true : false,
                        'workoutOver': $scope.workoutComplete ? true : false,
                        'avgHeartRate': $scope.avgHeartRate,
                        'peakHeartRate': $scope.peakHeartRate,
                        'minutesComplete': $scope.timeToAddRounded ? $scope.timeToAddRounded : 0,
                        'caloriesBurned': $scope.burnRounded ? $scope.burnRounded : 0,
                        'startDate': $scope.startDate,
                    },
                    function () {
                        console.log('syncWithWatch complete!');

                    },
                    function () {
                        console.log('syncWithWatch problem?!');
                    }
                );
            } else {
                //Available in browser for testing purposes
                //$scope.healthKitData.healthKitAvailable = true;
            }
        }

    };

    var workoutOnPause = function () {
        $scope.stopTimer();
        $interval.cancel($scope.transitionCountdown);
        $timeout.cancel($scope.delayStart);
        $scope.transitionStatus = false;
        $scope.timerDelay = null;
    };

    document.addEventListener("pause", workoutOnPause, false);

    var orientationChange = function () {
        if (!$scope.isPortrait) {
            $scope.isPortrait = true;
        }
        $scope.removeBanners();
        $timeout(function () {
            $scope.setVideo();
            if (ionic.Platform.isAndroid() && $scope.advancedTiming.autoPlay) {
                $scope.playAndroidNativeVideo();
            }
            $scope.showBannerAds();
        }, 500)
    };

    var onResumeWorkout = function () {
        if (!ionic.Platform.isAndroid()) {
            clearTimeout(inlineVideoTimeout);
            playInlineVideo($scope.advancedTiming.autoPlay, controller.userExercises[$scope.currentWorkout[0]]);
        } else if ($scope.advancedTiming.autoPlay){
            $timeout(function() {
                $scope.playAndroidNativeVideo();
            }, 200)
        }
    };

    $window.addEventListener("orientationchange", orientationChange, false);
    document.addEventListener("resume", onResumeWorkout, false);

    $scope.$on('$ionicView.leave', workoutBack);

    function isYogaWorkout() {
        return (LocalData.GetWorkoutTypes[$stateParams.typeId].isYogaSequence || ($stateParams.typeId == 'customWorkout' && LocalData.GetWorkoutTypes.customWorkout.customData.isYogaSequence));
    }

    function initAudio() {
        if ($window.device) {
            LowLatencyAudio.preloadAudio('begin', basicAudioPath + 'begin.mp3', 1);
            LowLatencyAudio.preloadAudio('ding', 'audio/ding.mp3', 1);
            LowLatencyAudio.turnOffAudioDuck(PersonalData.GetAudioSettings.duckOnce.toString());
            if ($scope.isAudioCampaign && globalSworkitAds.audioSuccess && !globalFirstOption && $scope.advancedTiming.autoStart && brandedAudioTakeoverAllows()) {
                if (ionic.Platform.isAndroid()) {
                    LowLatencyAudio.preloadFX('welcomeAd', cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adRestAudioName);
                } else {
                    LowLatencyAudio.preloadAudio('welcomeAd', cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adRestAudioName, 1);
                }
                $timeout(function () {
                    LowLatencyAudio.play('welcomeAd', $scope.audioSettings.duckEverything.toString());
                }, 300);
                $timeout(function () {
                    LowLatencyAudio.unload('welcomeAd');
                    trackEvent('Ad Audio', 'campaignName', $stateParams.typeId);
                }, 15000);
                if ($scope.advancedTiming.autoStart && PersonalData.GetLanguageSettings[$scope.userSettings.preferredLanguage] && true) {
                    $scope.firstExerciseAudio = $timeout(function () {
                        $scope.playNextSound(controller.userExercises[$scope.currentWorkout[0]], true);
                    }, 9000);
                }
            } else if (TimingData.GetTimingSettings.welcomeAudio && globalFirstWorkout) {
                LowLatencyAudio.play('welcome', $scope.audioSettings.duckEverything.toString());
                $timeout(function () {
                    if ($scope.advancedTiming.autoStart && PersonalData.GetLanguageSettings[$scope.userSettings.preferredLanguage] && true) {
                        var timeoutLength = globalFirstOption ? 7000 : 4000;
                        $scope.firstExerciseAudio = $timeout(function () {
                            $scope.playNextSound(controller.userExercises[$scope.currentWorkout[0]], true);
                        }, timeoutLength);
                    }
                }, 1200)
            } else if ($scope.advancedTiming.autoStart && PersonalData.GetLanguageSettings[$scope.userSettings.preferredLanguage] && true) {
                $scope.firstExerciseAudio = $timeout(function () {
                    $scope.playNextSound(controller.userExercises[$scope.currentWorkout[0]], true);
                }, 5000);
            }
            $timeout(function () {
                LowLatencyAudio.preloadAudio('switch', basicAudioPath + 'change.mp3', 1);
                LowLatencyAudio.preloadAudio('switchding', 'audio/switch.mp3', 1);
                LowLatencyAudio.preloadAudio('next', basicAudioPath + 'Next.mp3', 1);
                LowLatencyAudio.preloadAudio('countdown', 'audio/beepsequence.mp3', 1);
                LowLatencyAudio.preloadAudio('countdownVoice', basicAudioPath + 'countdownVoice.mp3', 1);
            }, 4000)
        } else {
            if ($scope.isAudioCampaign && !globalFirstOption && $scope.advancedTiming.autoStart && brandedAudioTakeoverAllows()) {
                $log.info('Playing Welcome Ad audio');
            } else if (TimingData.GetTimingSettings.welcomeAudio) {
                $log.info('Playing normal Welcome audio');
            }
        }
    }

    $scope.playAndroidNativeVideo = function() {
        if ($scope.androidPlatform) {
            angular.element(document.getElementById('video-background')).css('opacity', '0.00001');
            var videoBox = document.getElementById('video-background');
            var width = videoBox.clientWidth;
            var height = width * 0.563;
            var yPosition = videoBox.getBoundingClientRect().top;
            var xPosition = videoBox.getBoundingClientRect().left;
            window.plugins.NativeVideo.setPath($scope.currentExercise.video, $scope.currentExercise.unlocked, $scope.deviceBasePath, function() {
                window.plugins.NativeVideo.position(xPosition, yPosition, width, height, (function () {
                    window.plugins.NativeVideo.play(function () {

                    });
                }));
            });
        }
    };

    function setupAds() {
        if (!$scope.premiumWorkoutSettings && globalSworkitAds && true) {
            $scope.isAdCampaign = globalSworkitAds.isRunning;
            $scope.isEndAdCampaign = globalSworkitAds.isEndRunning;
            $scope.isAudioCampaign = globalSworkitAds.audioRunning;
            $scope.isEndAudioCampaign = globalSworkitAds.audioEndRunning;
            $scope.isAdMobRunning = globalSworkitAds.useAdMob;
            $scope.isMoPubRunning = globalSworkitAds.useMoPub;
            $scope.showRestBreakAds = globalSworkitAds.showRestBreakAds;
        } else {
            $scope.isAdCampaign = false;
            $scope.isEndAdCampaign = false;
            $scope.isAudioCampaign = false;
            $scope.isEndAudioCampaign = false;
            $scope.isAdMobRunning = false;
            $scope.isMoPubRunning = false;
            $scope.showRestBreakAds = false;
            globalSworkitAds.useAdMobInterstitial = false;
            globalSworkitAds.useMoPubInterstitial = false;
            globalSworkitAds.isCustomInterstitial = false;
            globalSworkitAds.showRestBreakAds = false;
        }
        if ($scope.isAdCampaign && globalSworkitAds.imageSuccessWorkout) {
            $scope.workoutAdImage = cordova.file.dataDirectory + 'ads/' + globalSworkitAds.adWorkoutImageName;
        } else {
            $scope.workoutAdImage = globalSworkitAds.adWorkoutImage;
        }

        $timeout(function () {
            $scope.showBannerAds();
        }, 1500);
    }
});
