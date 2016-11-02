angular.module('swMobileApp').controller('WorkoutTimeCtrl', function ($rootScope, $scope, $stateParams, $location, $translate, $timeout, $ionicModal, $ionicPopup, $ionicPopover, $q, MusicPlaylistsModal, WorkoutService, UserService, AppSyncService, AccessService) {
    LocalHistory.getCustomHistory.lastHomeURL = $location.$$url;

    AccessService.isPremiumUser()
        .then(function (isPremiumUser) {
            $scope.premiumTimingUnlocked = isPremiumUser;
        });

    $scope.Math = Math;
    $scope.adjustTimer = function () {
        var contentWidth = angular.element(document.getElementById('time-screen')).prop('offsetWidth');
        var screenHeight = window.innerHeight;
        $scope.size = Math.min(contentWidth * .75, screenHeight * .4);
        if ($scope.yogaSelection) {
            angular.element(document.getElementById('round-selection'))[0].style.fontSize = ($scope.size * .40) + 'px';
            angular.element(document.getElementById('round-selection'))[0].style.height = ($scope.size * .42) + 'px';
            angular.element(document.getElementById('timer-rounds'))[0].style.fontSize = ($scope.size * .08) + 'px';
            angular.element(document.getElementById('minus-button-rounds'))[0].style.marginRight = ($scope.size / 2.1 - 35) + 'px';
            angular.element(document.getElementById('plus-button-rounds'))[0].style.marginLeft = ($scope.size / 2.1 - 35) + 'px';
        } else {
            angular.element(document.getElementById('minute-selection'))[0].style.fontSize = ($scope.size * .40) + 'px';
            angular.element(document.getElementById('minute-selection'))[0].style.height = ($scope.size * .42) + 'px';
            angular.element(document.getElementById('timer-minutes'))[0].style.fontSize = ($scope.size * .08) + 'px';
            angular.element(document.getElementById('minus-button'))[0].style.marginRight = ($scope.size / 2.1 - 35) + 'px';
            angular.element(document.getElementById('plus-button'))[0].style.marginLeft = ($scope.size / 2.1 - 35) + 'px';
        }

        $scope.areaWidth = contentWidth - 40;
        $scope.areaHeight = $scope.size;
    };

    $scope.thisType = WorkoutService.getTypeName($stateParams.typeId);
    $scope.categoryTitle = LocalData.GetWorkoutCategories[$stateParams.categoryId].fullName;
    $scope.chosenWorkoutExercises = WorkoutService.getWorkoutsByType()[$stateParams.typeId].exercises;
    if ($stateParams.typeId == "customWorkout") {
        $scope.categoryTitle = "STRENGTH";
    }
    $scope.typeName = $stateParams.typeId;
    $scope.advancedTiming = WorkoutService.getTimingIntervals();
    $scope.yogaSelection = false;
    $scope.isCustomYoga = false;
    if (LocalData.GetWorkoutTypes[$stateParams.typeId].isYogaSequence && $stateParams.typeId !== 'customWorkout') {
        $scope.yogaSelection = true;
        $scope.advancedTiming.yogaPoseLengthToChange = $scope.advancedTiming[$stateParams.typeId];
    } else if ($stateParams.typeId == 'customWorkout' && LocalData.GetWorkoutTypes.customWorkout.customData.isYogaSequence){
        $scope.yogaSelection = true;
        $scope.isCustomYoga = true;
        $scope.advancedTiming.customYoga = LocalData.GetWorkoutTypes.customWorkout.customData.poseLength;
    }
    $timeout(function () {
        $scope.adjustTimer();
    }, 0);
    $scope.userSettings = UserService.getUserSettings();
    $scope.timeSelected = {minutes: $scope.userSettings.lastLength};
    $scope.roundsSelected = {rounds: $scope.userSettings.lastRoundsLength || 2};
    $scope.workoutLength = {mins: '', secs: ''};
    $scope.scopeFirstOption = ($scope.userSettings.timerTaps < 2);
    $scope.musicAvailable = true;
    if (ionic.Platform.isAndroid() && device) {
        $scope.androidPlatform = true;
        if (isAmazon()) {
            $scope.musicAvailable = false;
            window.appAvailability.check('com.spotify.music', function () {
                $scope.musicAvailable = true;
            }, function () {
            });
        }
    } else {
        $scope.androidPlatform = false;
    }

    $scope.isToolTipTime = false;
    $scope.musicText = "Listen to motivating " + $translate.instant($scope.categoryTitle).toLowerCase() + " music";

    $scope.defaultAdd = 5;
    $scope.sevenTiming = WorkoutService.getSevenIntervals();
    $scope.sevenMinuteSelection = false;

    if ($stateParams.typeId == 'sevenMinute') {
        $scope.minuteArray = [7, 14, 21, 28, 35, 42, 49, 56];
        $scope.sevenMinuteSelection = true;
        $scope.defaultAdd = 7;
        $scope.timeSelected.minutes = 7;
    } else if ($scope.yogaSelection) {
        $scope.minuteArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.defaultAdd = 1;
    } else {
        $scope.minuteArray = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
    }
    $scope.returnX = function (mins) {
        if ($scope.yogaSelection) {
            return (($scope.areaWidth / 2) + (($scope.size / 2) * (Math.cos(((mins - 15) * 30) * Math.PI / 180))) - ($scope.size / 8));
        } else {
            return (($scope.areaWidth / 2) + (($scope.size / 2) * (Math.cos(((mins - 15) * 6) * Math.PI / 180))) - ($scope.size / 8));
        }
    };
    $scope.returnY = function (mins) {
        if ($scope.yogaSelection) {
            return (($scope.areaHeight / 2) + (($scope.size / 2) * (Math.sin(((mins - 15) * 30) * Math.PI / 180))) - ($scope.size / 8));
        } else {
            return (($scope.areaHeight / 2) + (($scope.size / 2) * (Math.sin(((mins - 15) * 6) * Math.PI / 180))) - ($scope.size / 8));
        }
    };
    $scope.setMinuteTime = function (num) {
        $scope.scopeFirstOption = false;
        $scope.userSettings.timerTaps++;
        if ($scope.yogaSelection) {
            $scope.roundsSelected.rounds = num;
            calcTotalLength();
        } else {
            $scope.timeSelected.minutes = num;
        }
    };
    $scope.decreaseTime = function () {
        if ($scope.timeSelected.minutes > $scope.defaultAdd && !$scope.yogaSelection && true) {
            $scope.timeSelected.minutes = $scope.timeSelected.minutes - $scope.defaultAdd;
        } else if ($scope.roundsSelected.rounds > 1 && $scope.yogaSelection && true){
            $scope.roundsSelected.rounds--;
            calcTotalLength();
        }
    };
    $scope.increaseTime = function () {
        if ($scope.timeSelected.minutes < 60 && !$scope.yogaSelection && true) {
            $scope.timeSelected.minutes = $scope.timeSelected.minutes + $scope.defaultAdd;
        } else if ($scope.roundsSelected.rounds < 12 && $scope.yogaSelection){
            $scope.roundsSelected.rounds++;
            calcTotalLength();
        }
    };
    $scope.showTiming = function () {
        $scope.advancedTiming.customSet = true;
        showTimingModal($scope, $ionicModal, $timeout, WorkoutService, $q, AppSyncService, $scope.premiumTimingUnlocked);
    };
    $scope.customLength = function () {
        $timeout(function () {
            if ($scope.yogaSelection) {
                angular.element(document.getElementById('round-selection'))[0].focus();
            } else {
                angular.element(document.getElementById('minute-selection'))[0].focus();
            }
        }, 200);
        if ($scope.androidPlatform) {
            cordova.plugins.Keyboard.show();
        }
    };
    $scope.clearTime = function () {
        $scope.timeSelected.minutes = '';
        $scope.roundsSelected.rounds = '';
    };
    $scope.calcComplete = function () {
        if ($scope.yogaSelection) {
            return Math.max(1 - ($scope.roundsSelected.rounds / 12.00000001), 0);
        } else {
            return Math.max(1 - ($scope.timeSelected.minutes / 60.00000001), 0);
        }
    };
    $scope.beginWorkout = function () {
        $scope.persistTimingData();
    };
    $scope.validateTime = function () {
        if ($scope.yogaSelection && true && $scope.roundsSelected.rounds < 1 || $scope.roundsSelected.rounds > 100 || $scope.roundsSelected.rounds == '') {
            $scope.roundsSelected.rounds = $scope.userSettings.lastRoundsLength || 2;
            calcTotalLength();
        }
        else if (!$scope.yogaSelection && ($scope.timeSelected.minutes < 1 || $scope.timeSelected.minutes > 1000 || $scope.timeSelected.minutes == '') && true) {
            $scope.timeSelected.minutes = $scope.defaultAdd;
        }
        if ($scope.androidPlatform) {
            cordova.plugins.Keyboard.close();
        }
    };
    $scope.validatePoseLength = function () {
        calcTotalLength();
    };
    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler() {
        if (isNaN($scope.timeSelected.minutes) && !$scope.yogaSelection && true) {
            $scope.timeSelected.minutes = $scope.defaultAdd;
            $scope.$apply();
        } else if (isNaN($scope.roundsSelected.rounds) && $scope.yogaSelection && true) {
            $scope.timeSelected.minutes = $scope.defaultAdd;
            $scope.$apply();
        }
    }

    $scope.launchMusic = function () {
        MusicPlaylistsModal.show();
    };

    var orientationTimeChange = function () {
        $timeout(function () {
            $scope.adjustTimer();
        }, 500)
    };

    function calcTotalLength() {
        if ($scope.yogaSelection) {
            var workoutLengthSeconds = $scope.chosenWorkoutExercises.length * $scope.roundsSelected.rounds * ($stateParams.typeId == "customWorkout" ? $scope.advancedTiming.customYoga : $scope.advancedTiming.yogaPoseLengthToChange);
            $scope.workoutLength.mins = Math.floor(workoutLengthSeconds / 60);
            $scope.workoutLength.secs = workoutLengthSeconds % 60;
        }
    };

    $scope.persistTimingData = function () {
        if ($scope.sevenMinuteSelection) {
            TimingData.GetSevenMinuteSettings.randomizationOptionSeven = $scope.sevenTiming.randomizationOptionSeven;
            persistMultipleObjects($q, {
                'timingSevenSettings': TimingData.GetSevenMinuteSettings
            }, function () {
                // When all promises are resolved
                AppSyncService.syncLocalForageObject('timingSevenSettings', null, TimingData.GetSevenMinuteSettings);
                $location.path('/app/home/' + $stateParams.categoryId + '/' + $stateParams.typeId + '/' + $scope.timeSelected.minutes + '/workout');
            });
        } else {
            PersonalData.GetUserSettings.lastLength = $scope.timeSelected.minutes;
            var settingsToSync = ['lastLength'];
            if ($scope.yogaSelection) {
                PersonalData.GetUserSettings.lastRoundsLength = $scope.roundsSelected.rounds;
                settingsToSync.push('lastRoundsLength');
            }

            var propertiesToSync;

            if ($scope.yogaSelection && $stateParams.typeId !== 'customWorkout') {
                TimingData.GetTimingSettings[$stateParams.typeId] = $scope.advancedTiming.yogaPoseLengthToChange;
                propertiesToSync = [
                    $stateParams.typeId
                ]

            } else if ($scope.premiumTimingUnlocked) {
                propertiesToSync = [
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
                ]
            } else {
                propertiesToSync = [
                    'transitionTime',
                    'sunSalutation',
                    'fullSequence',
                    'runnerYoga',
                    'feelGoodYoga',
                    'beginnerYoga',
                    'coreYoga',
                    'toneYoga'
                ]
            }

            persistMultipleObjects($q, {
                'userSettings': PersonalData.GetUserSettings,
                'timingSettings': TimingData.GetTimingSettings
            }, function () {
                // When all promises are resolved
                AppSyncService.syncLocalForageObject('timingSettings', propertiesToSync, TimingData.GetTimingSettings);
                AppSyncService.syncLocalForageObject('userSettings', settingsToSync, PersonalData.GetUserSettings);
                var workoutMinutes = $scope.yogaSelection ? $scope.workoutLength.mins : $scope.timeSelected.minutes
                $location.path('/app/home/' + $stateParams.categoryId + '/' + $stateParams.typeId + '/' + workoutMinutes + '/workout');
            });

        }
    };
    window.addEventListener("orientationchange", orientationTimeChange, false);

    $scope.$on('$ionicView.beforeLeave', function () {
        window.removeEventListener('native.keyboardhide', $scope.keyboardHideHandler);
        window.removeEventListener("orientationchange", orientationTimeChange, false);
    });

    $scope.$on('$ionicView.enter', function () {
        if ($scope.userSettings.showAudioTip && !isAmazon() && globalFirstLoad && true) {
            $scope.userSettings.showAudioTip = false;
            if (PersonalData.GetUserSettings.preferredLanguage == 'EN') {
                $scope.isToolTipTime = true;
                $timeout(function () {
                    $scope.isToolTipTime = false;
                }, 4000)
            }
        } else {
            $timeout(function () {
                checkVolume();
            }, 1000);
        }
        calcTotalLength();
    });
});
