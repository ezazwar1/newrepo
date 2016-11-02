angular.module('swMobileApp').controller('WorkoutCategoryCtrl', function ($rootScope, $scope, $translate, $sce, $timeout, $location, $ionicPopup, $stateParams, WorkoutService, AccessService, FirebaseService, AppSyncService, WorkoutPreviewService, $ionicListDelegate, $log) {
    $log.info("WorkoutCategoryCtrl");

    LocalHistory.getCustomHistory.lastHomeURL = $location.$$url;
    $scope.androidPlatform = ionic.Platform.isAndroid();

    AccessService.knownLegacyBasicAccess()
        .then(function (legacyBasicAccess) {
            $scope.shouldShowLegacyBasicWorkoutsUnlocked = !legacyBasicAccess || !(legacyBasicAccess >= 1);
            $log.info('shouldShowLegacyBasicWorkoutsUnlocked', $scope.shouldShowLegacyBasicWorkoutsUnlocked);
        });

    AccessService.isKnownPremium()
        .then(function (isPremiumUser) {
            $scope.shouldShowLegacyProWorkoutsUnlocked = isPremiumUser;
            if (isPremiumUser) {
                $scope.shouldShowLegacyBasicWorkoutsUnlocked = true;
            }
            checkForCustomBrandCampaign();
        });

    AccessService.isActiveSubscription()
        .then(function (isActiveSubscription) {
            $scope.shouldShowLowImpactUnlocked = isActiveSubscription;
            if (isActiveSubscription) {
                $scope.shouldShowLegacyProWorkoutsUnlocked = true;
                $scope.shouldShowLegacyBasicWorkoutsUnlocked = true;
            }
        });

    $ionicListDelegate.canSwipeItems(false);
    $scope.data = {showInfo: false};
    $scope.timesUsedVar = parseInt(window.localStorage.getItem('timesUsed'));
    $scope.thisCategory = $stateParams.categoryId;
    $scope.categoryTitle = LocalData.GetWorkoutCategories[$stateParams.categoryId].fullName;
    $scope.categories = WorkoutService.getWorkoutsByCategoryId($stateParams.categoryId);
    $scope.legacyProCategories = WorkoutService.getWorkoutsByCategoryIdForLegacyPro($stateParams.categoryId);
    $scope.legacyBasicCategories = WorkoutService.getWorkoutsByCategoryIdForLegacyBasic($stateParams.categoryId);
    $scope.premiumCategories = WorkoutService.getWorkoutsByCategoryIdForPremium($stateParams.categoryId);
    $scope.workoutTypes = WorkoutService.getWorkoutsByType();
    $scope.showRateOption = globalRateOption;
    $scope.showShareOption = globalShareOption;
    $scope.rateAttempts = 0;
    $scope.resizeOptions = {grow: false, shrink: true, defaultSize: 18, minSize: 18, maxSize: 32};
    $scope.rateHeader = $translate.instant('ENJOYING_RATE');
    $scope.noButton = $translate.instant('NOT_REALLY');
    $scope.yesButton = $translate.instant('YES_SM') + '!';
    $scope.noTaps = true;
    $scope.yesTaps = true;
    if ($scope.showShareOption == 4) {
        $scope.rateHeader = $translate.instant('THANK_SHARE');
        $scope.noButton = $translate.instant('NO_THANKS');
        $scope.yesButton = $translate.instant('YES_SM') + '!';
    } else if ($scope.showShareOption == 8) {
        $scope.rateHeader = $translate.instant('CAT_TWITTER');
        $scope.noButton = $translate.instant('NO_THANKS');
        $scope.yesButton = $translate.instant('YES_SM') + '!';
    } else if ($scope.showShareOption == 13) {
        $scope.rateHeader = $translate.instant('CAT_FACEBOOK');
        $scope.noButton = $translate.instant('NO_THANKS');
        $scope.yesButton = $translate.instant('YES_SM') + '!';
    }
    $scope.yesOption = function () {
        if ($scope.yesTaps && $scope.noTaps && $scope.showShareOption == 4) {
            $scope.showShareOption = 5;
            globalShareOption = 5;
            localforage.setItem('ratingCategory', {
                show: false,
                past: true,
                shareCount: 5,
                sharePast: true
            }, function () {
            });
            var challengeText = $translate.instant('SHARE_THANK');
            window.plugins.socialsharing.share(challengeText, null, null, null);
            trackEvent('Dialog Request', 'Share', 0);
        } else if ($scope.yesTaps && $scope.noTaps && $scope.showShareOption == 8) {
            $scope.showShareOption = 9;
            globalShareOption = 9;
            localforage.setItem('ratingCategory', {
                show: false,
                past: true,
                shareCount: 9,
                sharePast: true
            }, function () {
            });
            window.open('http://twitter.com/sworkit', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
            trackEvent('Dialog Request', 'Follow Twitter', 0);
        } else if ($scope.yesTaps && $scope.noTaps && $scope.showShareOption == 13) {
            $scope.showShareOption = 14;
            globalShareOption = 14;
            localforage.setItem('ratingCategory', {
                show: false,
                past: true,
                shareCount: 14,
                sharePast: true
            }, function () {
            });
            window.open('http://facebook.com/SworkitApps', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
            trackEvent('Dialog Request', 'Follow Facebook', 0);
        } else if ($scope.yesTaps && $scope.noTaps) {
            $scope.yesButton = $translate.instant('OK') + '!';
            $scope.noButton = $translate.instant('NO_THANKS');
            $scope.rateHeader = $translate.instant('PLEASE_REVIEW');
            $scope.yesTaps = false;
        } else if (!$scope.noTaps) {
            globalRateOption = false;
            $scope.showRateOption = false;
            localforage.setItem('ratingCategory', {
                show: false,
                past: true,
                shareCount: 1,
                sharePast: false
            }, function () {
            });
            if (ionic.Platform.isAndroid()) {
                $scope.appVersion = '6.5.08'
            } else {
                $scope.appVersion = '4.5.3'
            }
            var premiumAccess = $scope.shouldShowLowImpactUnlocked ? 'Premium' : '';
            var userID = FirebaseService.getUserUID() ? 'User ID: ' + FirebaseService.getUserUID() : 'No UserID';
            var emailBody = "<p>" + $translate.instant('DEVICE') + ": " + device.model + "</p><p>" + $translate.instant('PLATFORM') + ": " + device.platform + " " + device.version + "- " + PersonalData.GetUserSettings.preferredLanguage + "-" + premiumAccess + "</p>" + "<p>" + $translate.instant('APP_VERSION') + ": " + $scope.appVersion + "</p><p>" + userID + "</p><p>" + $translate.instant('FEEDBACK') + ": </p>";
            cordova.plugins.email.open({
                to: ['contact@sworkit.com'],
                subject: $translate.instant('FEEDBACK') + ': Sworkit App',
                body: emailBody,
                isHtml: true
            }, function (result) {
                $log.info('EmailComposer result: ' + result);
            });
        } else {
            $timeout(function () {
                globalRateOption = false;
                $scope.showRateOption = false;
                trackEvent('Dialog Request', 'Feedback', 0);
                var volumeNotification = angular.element(document.getElementsByClassName('volume-notification'));
                var insideTextNew = $translate.instant('THANK_REVIEW');
                volumeNotification.html('<h3 class="ng-binding">' + insideTextNew + '</h3>');
                volumeNotification.addClass('animate').removeClass('flash');
                setTimeout(function () {
                    trackEvent('Dialog Request', 'Review', 0);
                    volumeNotification.addClass('flash').removeClass('animate');
                    var insideText = $translate.instant('VOLUME_REC');
                    volumeNotification.html('<h3 class="ng-binding"><span><i class="icon ion-volume-medium"></i></span>  ' + insideText + '</h3>');
                }, 4000);
                localforage.setItem('ratingCategory', {
                    show: false,
                    past: true,
                    shareCount: 1,
                    sharePast: false
                }, function () {
                    launchAppStore(2);
                });
            }, 500);
        }
    };
    $scope.noOption = function () {
        if ($scope.yesTaps && $scope.noTaps && $scope.showShareOption == 4) {
            $scope.showShareOption = 5;
            globalShareOption = 5;
            localforage.setItem('ratingCategory', {
                show: false,
                past: true,
                shareCount: 5,
                sharePast: true
            }, function () {
            });
        } else if ($scope.yesTaps && $scope.noTaps && $scope.showShareOption == 8) {
            $scope.showShareOption = 9;
            globalShareOption = 9;
            localforage.setItem('ratingCategory', {
                show: false,
                past: true,
                shareCount: 9,
                sharePast: true
            }, function () {
            });
        } else if ($scope.yesTaps && $scope.noTaps && $scope.showShareOption == 13) {
            $scope.showShareOption = 14;
            globalShareOption = 14;
            localforage.setItem('ratingCategory', {
                show: false,
                past: true,
                shareCount: 14,
                sharePast: true
            }, function () {
            });
        } else if ($scope.yesTaps && $scope.noTaps) {
            $scope.yesButton = $translate.instant('OK') + '!';
            $scope.noButton = $translate.instant('NO_THANKS');
            $scope.rateHeader = $translate.instant('LEAVE_FEEDBACK');
            $scope.noTaps = false;
        } else if (!$scope.noTaps || !$scope.yesTaps) {
            $scope.showRateOption = false;
            globalRateOption = false;
            localforage.setItem('ratingCategory', {
                show: false,
                past: true,
                shareCount: 1,
                sharePast: false
            }, function () {
            });
        } else {
            $scope.showRateOption = false;
            globalRateOption = false;
        }
    };

    $scope.selectLegacyPro = function (workoutType) {
        if (!$scope.shouldShowLegacyProWorkoutsUnlocked) {
            $rootScope.showPremium('Exclusive Workouts');
        } else {
            console.log('Selected workout path: ', '#/app/home/' + $scope.thisCategory + '/' + workoutType);
            $location.path('/app/home/' + $scope.thisCategory + '/' + workoutType);
        }
    };

    $scope.selectLegacyBasic = function (workoutType) {
        if (!$scope.shouldShowLegacyBasicWorkoutsUnlocked) {
            $rootScope.showPremium('Exclusive Workouts');
        } else {
            console.log('Selected workout path: ', '#/app/home/' + $scope.thisCategory + '/' + workoutType);
            $location.path('/app/home/' + $scope.thisCategory + '/' + workoutType);
        }
    };

    $scope.selectPremium = function (workoutType) {
        if (!$scope.shouldShowLowImpactUnlocked) {
            $rootScope.showPremium('Low-Impact Workouts');
        } else {
            console.log('Selected workout path: ', '#/app/home/' + $scope.thisCategory + '/' + workoutType);
            $location.path('/app/home/' + $scope.thisCategory + '/' + workoutType);
        }
    };

    $scope.showWorkoutInfo = function () {
        if ($scope.data.showInfo) {
            angular.element(document.getElementsByClassName('workout-item')).removeClass('edit-mode');
            angular.element(document.getElementsByClassName('item-options')).addClass('invisible');
        }
        else {
            angular.element(document.getElementsByClassName('workout-item')).addClass('edit-mode');
            angular.element(document.getElementsByClassName('item-options')).removeClass('invisible');
        }
        $scope.data.showInfo = !$scope.data.showInfo;
    };

    $scope.showWorkoutPreview = function (selectedWorkout) {
        var workoutToPreview = [];
        if (selectedWorkout.activityNames == "FULL") {
            var combinedUpperAndLower = mergeAlternating(WorkoutService.getWorkoutsByType(0)['upperBody'].exercises, WorkoutService.getWorkoutsByType(0)['lowerBody'].exercises);
            var combinedUpperAndLowerAndCore = mergeAlternating(combinedUpperAndLower, WorkoutService.getWorkoutsByType(0)['coreExercise'].exercises);
            selectedWorkout.workout = workoutToPreview.concat(combinedUpperAndLowerAndCore);
        } else {
            selectedWorkout.workout = selectedWorkout.exercises;
        }
        selectedWorkout.name = $translate.instant(selectedWorkout.activityNames);
        WorkoutPreviewService.show(selectedWorkout);
    };

    $scope.selectBranded = function (selectedWorkout) {
        if (PersonalData.GetCustomWorkouts.savedWorkouts.length < 3) {
            var hasWorkoutAlready = false;
            PersonalData.GetCustomWorkouts.savedWorkouts.forEach(function (element) {
                if (element.name == selectedWorkout.activityNames) {
                    hasWorkoutAlready = true;
                }
            });
            if (!hasWorkoutAlready) {
                PersonalData.GetCustomWorkouts.savedWorkouts.unshift({
                    "name": selectedWorkout.activityNames,
                    "workout": selectedWorkout.exercises,
                    isYogaSequence: selectedWorkout.isYogaSequence || false,
                    poseLength: selectedWorkout.poseLength || false,
                    activityWeight: selectedWorkout.activityWeight || 6,
                    activityMFP: selectedWorkout.activityMFP || "134026252709869",
                    googleActivity: selectedWorkout.googleActivity || "Custom Workout",
                    appleActivityHK: selectedWorkout.appleActivityHK || "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: selectedWorkout.humanAPIActivity || "circuit_training"
                });
                localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts)
                    .then(function () {
                        AppSyncService.syncLocalForageCustomWorkouts();
                    })
            }
        }
        LocalData.GetWorkoutTypes.customWorkout = {
            id: 100,
            activityNames: selectedWorkout.activityNames,
            exercises: selectedWorkout.exercises,
            customData: selectedWorkout,
            activityWeight: selectedWorkout.activityWeight || 6,
            activityMFP: selectedWorkout.activityMFP || "134026252709869",
            googleActivity: selectedWorkout.googleActivity || "Custom Workout",
            appleActivityHK: selectedWorkout.appleActivityHK || "HKWorkoutActivityTypeCrossTraining",
            humanAPIActivity: selectedWorkout.humanAPIActivity || "circuit_training"
        };
        $location.path('/app/home/2/customWorkout');
    };

    function checkForCustomBrandCampaign() {
        if (globalSworkitAds.isCustomBrandRunning) {
            $scope.customBrandBackground = globalSworkitAds.customBrandExperience.categoryHeaders[LocalData.GetWorkoutCategories[$stateParams.categoryId].fullName.toLowerCase()] || false;
            if ($scope.customBrandBackground) {
                $scope.customBrandBackground = "url('" + globalSworkitAds.customBrandExperience.categoryHeaders[LocalData.GetWorkoutCategories[$stateParams.categoryId].fullName.toLowerCase()] + "')";
                $timeout(function () {
                    $scope.customBrandedWorkouts = globalSworkitAds.customBrandExperience.brandedWorkouts;
                });
            }
        } else {
            $scope.customBrandBackground = false;
        }
    }

});
