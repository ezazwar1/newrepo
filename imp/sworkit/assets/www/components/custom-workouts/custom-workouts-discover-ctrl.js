angular.module('swMobileApp').controller('WorkoutCustomDiscoverCtrl', function ($rootScope, $scope, $location, $translate, $ionicPopup, $ionicSideMenuDelegate, $http, $timeout, UserService, WorkoutService, AppSyncService, AccessService, WorkoutPreviewService, $window, FirebaseService, swAnalytics, $log) {

    $scope.init = function () {
        $scope.discoverWorkouts = [];
        $scope.showUnableToConnect = false;
        $scope.customWorkouts = UserService.getCustomWorkoutList();
        $scope.numberOfAllowedCustomWorkouts = 3;
        $scope.getWorkouts();
        AccessService.isPremiumUser()
            .then(function (isPremiumUser) {
                $scope.isPremiumCustomsUnlocked = isPremiumUser;
            });
        AccessService.knownLegacyBasicAccess()
            .then(function (legacyBasicAccess) {
                $scope.isLegacyBasicAccessRestricted = legacyBasicAccess && (legacyBasicAccess >= 1);
                if ($scope.isLegacyBasicAccessRestricted) {
                    $scope.numberOfAllowedCustomWorkouts = 1;
                }
            });
        $ionicSideMenuDelegate.canDragContent(false);
        $scope.view = {
            showPreviewOption: false
        };
    };

    $scope.getWorkouts = function () {
        $http.get('http://sworkitapi.herokuapp.com/workouts/discover?language=' + PersonalData.GetUserSettings.preferredLanguage).then(function (resp) {
            $scope.discoverWorkouts = resp.data.items;
            $log.info('$scope.discoverWorkouts', $scope.discoverWorkouts);
        }, function (err) {
            $scope.showUnableToConnect = true;
            $log.info('Unable to connect to sworkitapi.herokuapp.com for discoverWorkouts', err);
        });
    };

    $scope.addCustomWorkout = function (selectedWorkout, seriesName) {
        swAnalytics.trackEvent('discover-workouts', 'add-workout-unlocked', selectedWorkout.name);
        swAnalytics.trackEvent('discover-workouts', 'add-workout-series-unlocked', seriesName);
        if ((PersonalData.GetCustomWorkouts.savedWorkouts.length < $scope.numberOfAllowedCustomWorkouts || $scope.isPremiumCustomsUnlocked)) {
            $window.justAddedAWorkout = true;
            PersonalData.GetCustomWorkouts.savedWorkouts.push({
                "name": selectedWorkout.name,
                "workout": selectedWorkout.workout,
                "activityWeight": selectedWorkout.activityWeight,
                "activityMFP": selectedWorkout.activityMFP,
                "description": selectedWorkout.description,
                "googleActivity": selectedWorkout.googleActivity,
                "sessionMActivity": selectedWorkout.sessionMActivity,
                "appleActivityHK": selectedWorkout.appleActivityHK,
                "humanAPIActivity": selectedWorkout.humanAPIActivity,
                "isYogaSequence": selectedWorkout.isYogaSequence,
                "poseLength": selectedWorkout.isYogaSequence
            });
            localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
            $location.path('/app/custom');
        } else {
            var upgradePopup = $ionicPopup.confirm({
                title: $translate.instant("INSTALL"),
                template: '<p class="padding">' + $translate.instant("REPLACE_CUSTOM") + '<a ng-click="upgradeToPremium()">' + $translate.instant("WANT_UPGRADE") + '</a></p>',
                okType: 'premium-blue-primary',
                okText: $translate.instant('OK_INSTALL'),
                cancelText: $translate.instant('CANCEL_SM'),
                cancelType: 'premium-blue-secondary-clear',
                cssClass: 'replace-custom-popup',
                scope: $scope
            });

            upgradePopup.then(function (res) {
                if (res) {
                    $window.justAddedAWorkout = true;
                    var syncId = PersonalData.GetCustomWorkouts.savedWorkouts[0].$id || false;
                    PersonalData.GetCustomWorkouts.savedWorkouts.splice(0, 1);
                    PersonalData.GetCustomWorkouts.savedWorkouts.push({
                        "name": selectedWorkout.name,
                        "workout": selectedWorkout.workout,
                        "activityWeight": selectedWorkout.activityWeight,
                        "activityMFP": selectedWorkout.activityMFP,
                        "description": selectedWorkout.description,
                        "googleActivity": selectedWorkout.googleActivity,
                        "sessionMActivity": selectedWorkout.sessionMActivity,
                        "appleActivityHK": selectedWorkout.appleActivityHK,
                        "humanAPIActivity": selectedWorkout.humanAPIActivity,
                        "isYogaSequence": selectedWorkout.isYogaSequence,
                        "poseLength": selectedWorkout.isYogaSequence
                    });
                    localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                    if (FirebaseService.authData) {
                        if (syncId) {
                            AppSyncService.remoteDeleteFromLocalForageCustomWorkouts(syncId);
                        }
                    }
                    trackEvent('Download Custom', selectedWorkout.name, 0);
                    $location.path('/app/custom');
                }
            });

            $scope.upgradeToPremium = function () {
                upgradePopup.close();
                $rootScope.showPremium('unlimited custom');
            };
        }
        if ($window.device) {
            FiksuTrackingManager.uploadPurchase(FiksuTrackingManager.PurchaseEvent.Event3, 0, "USD");
        }
    };

    $scope.warnPremiumOnly = function (selectedWorkout, seriesName) {
        swAnalytics.trackEvent('discover-workouts', 'add-workout-locked', selectedWorkout.name);
        swAnalytics.trackEvent('discover-workouts', 'add-workout-series-locked', seriesName);
        var premiumOnlyPopup = $ionicPopup.confirm({
            title: $translate.instant("PREMIUM_WORKOUT"),
            template: '<p class="padding">' + $translate.instant("PREMIUM_ONLY") + '</p>',
            okType: 'premium-blue-primary',
            okText: $translate.instant('LEARNMORE'),
            cancelText: $translate.instant('CANCEL_SM'),
            cancelType: 'premium-blue-secondary-clear',
            cssClass: 'replace-custom-popup',
            scope: $scope
        });

        premiumOnlyPopup.then( function(res) {
            if (res) {
                premiumOnlyPopup.close();
                $rootScope.showPremium('Discover');
            }
        });
    };

    $scope.shareCustomWorkout = function (selectedWorkout) {
        var workoutMessage = $translate.instant('THIS') + ' ' + $translate.instant(selectedWorkout.name) + ' ' + $translate.instant('WORKOUT_AWESOME');
        if ($window.device) {
            var options = {
                message: workoutMessage,
                subject: $translate.instant('CHECK_OUT'),
                url: selectedWorkout.shareUrl,
                chooserTitle: $translate.instant('SHARE_W')
            };
            window.plugins.socialsharing.shareWithOptions(options, function () {
                $log.info('socialshare success: ', options);
                swAnalytics.trackEvent('kpi', 'referral', 'workout-custom-discover-send');
                trackEvent('Discover Workout Shared', selectedWorkout.name, 0);
            }, function (error) {
                $log.warn('socialshare error: ', error);
            });
        } else {
            console.log('Share: ' + selectedWorkout.shareUrl)
        }
    };

    $scope.showWorkoutPreview = function (selectedWorkout) {
        WorkoutPreviewService.show(selectedWorkout);
    };

    $scope.$on('$ionicView.enter', function () {
        swAnalytics.trackEvent('discover-workouts', 'full-list');
    });

    $scope.$on('$ionicView.leave', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.init();
});
