angular.module('swMobileApp').controller('ProgressCtrl', function ($scope, $location, $ionicPlatform, $translate, $timeout, UserService) {
    $scope.totals = {
        'totalEver': 0,
        'todayMinutes': 0,
        'todayMinutesRounded': 0,
        'todayCalories': 0,
        'weeklyMinutes': 0,
        'weeklyCalories': 0,
        'totalMonthMin': 0,
        'topMinutes': 0,
        'topCalories': 0,
        'topDayMins': '',
        'topDayCals': ''
    };
    $scope.goalSettings = UserService.getGoalSettings();
    buildStats($scope, $translate, false, $timeout);
    logActionSessionM('View Progress');
    if (device) {
        navigator.globalization.getLocaleName(
            function (returnResult) {
                var returnCountry;
                if (ionic.Platform.isAndroid()) {
                    returnCountry = returnResult.value[2];
                } else {
                    returnCountry = returnResult.value;
                }
                if (returnCountry.slice(-2).toUpperCase() == 'US') {
                    isUSA = true;
                } else {
                    isUSA = false;
                }
            },
            function (error) {
                isUSA = false;
            }
        )
    }
});
