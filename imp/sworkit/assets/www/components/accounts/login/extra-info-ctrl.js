angular.module('swMobileApp').controller('ExtraInfoCtrl', function ($scope, $stateParams, $timeout, $translate, AppSyncService, $q, $state, $log) {
    $log.info("ExtraInfoCtrl()");
    $log.debug("$stateParams", $stateParams);

    $scope.user = PersonalData.GetUserProfile;
    if ($scope.user.birthYear == '') {
        $scope.user.birthYear = 1980;
    }
    $scope.userSettings = PersonalData.GetUserSettings;
    $scope.displayWeight = {data: 0};
    $scope.weightTypes = [{id: 0, title: 'LBS'}, {id: 1, title: 'KGS'}];
    $scope.selectedType = {data: $scope.weightTypes[$scope.userSettings.weightType]};

    $scope.convertWeight = function () {
        if ($scope.userSettings.weightType == 0) {
            $scope.displayWeight.data = $scope.userSettings.weight;
        } else {
            $scope.displayWeight.data = Math.round(($scope.userSettings.weight / 2.20462));
        }
    };

    $scope.$watch('selectedType.data', function (newValue) {
        // TODO: Is this if ever true?  Can you $watch a scope property that is an object?
        if (!isNaN(newValue.id)) {
            $scope.userSettings.weightType = newValue.id;
        }
        $scope.convertWeight();
    });

    $scope.$watch('displayWeight.data', function (newValue) {
        if ($scope.userSettings.weightType == 0) {
            $scope.userSettings.weight = newValue;
        } else {
            $scope.userSettings.weight = Math.round(newValue * 2.20462);
        }
    });

    $scope.extraInfoSubmit = function () {
        persistMultipleObjects($q, {
            'userSettings': PersonalData.GetUserSettings,
            'userProfile': PersonalData.GetUserProfile
        }, function () {
            AppSyncService.syncLocalForageObject('userProfile', null, PersonalData.GetUserProfile);
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
        $state.go('app.extra-info-goals', {isSignup: $stateParams.isSignup});
    };

    $timeout(function () {
        $scope.convertWeight();
    }, 1800)

});
