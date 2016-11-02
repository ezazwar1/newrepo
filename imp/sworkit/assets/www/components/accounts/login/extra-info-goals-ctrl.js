angular.module('swMobileApp').controller('ExtraInfoGoalsCtrl', function ($scope, $stateParams, $timeout, $translate, $state, AppSyncService, AccessService, AccountsService, WorkoutService, $q, $log) {
    $log.info("ExtraInfoGoalsCtrl()");
    $log.debug("$stateParams", $stateParams);

    $scope.user = PersonalData.GetUserProfile;

    $scope.goalList = [
        {short: "GOAL_HEALTH", checked: false},
        {short: "GOAL_LOSE", checked: false},
        {short: "GOAL_BUILD", checked: false},
        {short: "GOAL_TONE", checked: false},
        {short: "GOAL_SPORTS", hecked: false},
        {short: "GOAL_FLEXIBILITY", checked: false},
        {short: "GOAL_INJURY", checked: false}
    ];

    $scope.getGoals = function (goalArray, callback) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.then(function () {
                $scope.user.goals = [];
                angular.forEach(goalArray, function (value, key) {
                    if (value.checked) {
                        $scope.user.goals.push(value.short);
                    }
                });
            })
            .then(function () {
                callback();
            });
        deferred.resolve();
    };

    $scope.updateCheckedGoals = function () {
        angular.forEach($scope.user.goals, function (value, key) {
            angular.forEach($scope.goalList, function (_value, _key) {
                if (_value.short == value) {
                    _value.checked = true;
                }
            });
        });
    };

    $scope.extraInfoSubmit = function () {
        $scope.getGoals($scope.goalList, function () {
            persistMultipleObjects($q, {
                'userProfile': PersonalData.GetUserProfile
            }, function () {
                AppSyncService.syncLocalForageObject('userProfile', null, PersonalData.GetUserProfile);
            });
            AccessService.isActiveSubscription()
                .then(function (isActiveSubscription) {
                    if ($stateParams.isSignup && !isActiveSubscription) {
                        $state.go('app.user-tier');
                        AccountsService.addNewUserToQueue();
                    } else if (isActiveSubscription) {
                        WorkoutService.unlockForSubscription()
                            .then(WorkoutService.manageDownloads);
                        $state.go('app.home');
                    } else {
                        $state.go('app.home');
                    }
                });
        });
    };

    $timeout(function () {
        $scope.updateCheckedGoals();
    }, 1000)

});
