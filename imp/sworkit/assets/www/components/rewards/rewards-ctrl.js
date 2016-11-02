angular.module('swMobileApp').controller('RewardsCtrl', function ($rootScope, $scope, UserService) {
    $scope.sessionmStatus = sessionmAvailable;
    $scope.rewardStatus = UserService.getUserSettings();
    $scope.sessionMCount = {count: false};
    $scope.$on('$ionicView.enter', function () {
        angular.element(document.getElementsByClassName('bar-header')).addClass('green-bar');
    });
    $scope.getSessionMCount = function () {
        sessionm.phonegap.getUnclaimedAchievementCount(function callback(data) {
            $scope.sessionMCount.count = (data.unclaimedAchievementCount == 0) ? false : data.unclaimedAchievementCount;
            $rootScope.mPointsTotal = data.unclaimedAchievementCount;
            $scope.$apply();
        });
    };
    if (device) {
        $scope.getSessionMCount();
        sessionm.phonegap.listenDidDismissActivity(function callback() {
            $scope.getSessionMCount();
        });
    }
    $scope.launchSessionM = function () {
        if (device) {
            sessionm.phonegap.presentActivity(2);
        }
    };
    $scope.rewardsFAQ = function () {
        window.open('http://sworkit.com/rewards', 'blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
    };
    $scope.disableRewards = function (typeReward) {
        if (typeReward == 'sessionm' && $scope.rewardStatus.mPoints == true) {
            trackEvent('More Action', 'Disable SessionM', 0);
        }
    };

    $scope.$on('$ionicView.leave', function () {
        localforage.setItem('userSettings', PersonalData.GetUserSettings);
        angular.element(document.getElementsByClassName('bar-header')).removeClass('green-bar');
    });
});
