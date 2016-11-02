'use strict';

(function(angular) {

    angular.module('znk.sat').controller('SettingsCtrl', ['$scope', 'IapSrv', 'GoBackHardwareSrv', 'MediaSrv', 'UserSettingsSrv', 'SharedModalsSrv', 'userData', 'ENV', SettingsCtrl]);
    function SettingsCtrl($scope, IapSrv, GoBackHardwareSrv, MediaSrv, UserSettingsSrv, SharedModalsSrv, userData, ENV) {
        GoBackHardwareSrv.registerGoHomeHandler();

        $scope.d = {
            soundsEnabled: userData.soundEnabled,
            expiryDate: null
        };
        $scope.settingsList = [
            { checked: true }
        ];

        var isFree = userData.iap.freeContent[ENV.firebaseAppScopeName].isFree;

        if(angular.isDefined(isFree) && isFree) {
            $scope.d.hideGetZinkerz = true;
        }

        if(userData.userProfile.provider === "facebook") {
            $scope.d.hideChangedPassword = true;
            $scope.d.isFacebook = {'border-bottom':'none'};
            $scope.d.provider = userData.userProfile.provider;
        } else {
            $scope.d.hideChangedPassword = false;
            $scope.d.provider = void(0);
        }

        if(userData.subscription){
            $scope.d.expiryDate = userData.subscription;
            if (userData.subscription){
                $scope.d.openPurchasePopUp = angular.noop;
            }
        }

        $scope.d.openPurchasePopUp = SharedModalsSrv.showIapModal.bind(SharedModalsSrv);

        $scope.toogleAppSound = function toogleAppSound(){
            MediaSrv.soundsEnabled = $scope.d.soundsEnabled;
            UserSettingsSrv.soundEnabled(!!$scope.d.soundsEnabled);
        };

        $scope.$on(IapSrv.SUBSCRIPTION_PURCHASED_EVENT,function(evt,newSubscriptionsDate){
            if(newSubscriptionsDate){
                $scope.d.expiryDate = newSubscriptionsDate;
            }
        });
    }

})(angular);

