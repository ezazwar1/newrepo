angular.module('swMobileApp').controller('SettingsAudioCtrl', function ($scope, $translate, UserService, $window) {
    $scope.timeSettings = UserService.getTimingIntervals();
    $scope.audioSettings = UserService.getAudioSettings();
    $scope.data = {showInfo: false};
    if (ionic.Platform.isAndroid()) {
        $scope.androidPlatform = true;
    } else {
        $scope.androidPlatform = false;
    }
    $scope.changeAudio = function (value) {
        switch (value) {
            case 0:
                $scope.audioSettings.ignoreDuck = false;
                $scope.audioSettings.duckEverything = false;
                $scope.audioSettings.duckOnce = true;
                break;
            case 1:
                $scope.audioSettings.duckOnce = false;
                $scope.audioSettings.duckEverything = false;
                $scope.audioSettings.ignoreDuck = true;
                break;
            default:
                $scope.audioSettings.duckOnce = false;
                $scope.audioSettings.ignoreDuck = false;
                $scope.audioSettings.duckEverything = true;
        }
    }
    $scope.$on('$ionicView.leave', function () {
        localforage.setItem('backgroundAudio', PersonalData.GetAudioSettings);
        if ($window.device) {
            LowLatencyAudio.turnOffAudioDuck(PersonalData.GetAudioSettings.duckOnce.toString());
        }
    });
});
