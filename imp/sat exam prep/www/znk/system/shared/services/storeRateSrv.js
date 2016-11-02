(function (angular, ionic) {
    'use strict';

    angular.module('znk.sat').factory('StoreRateSrv', [
        '$window','$analytics', 'HintSrv', 'AppRateStatusEnum', '$rootScope',
        function ($window, $analytics, HintSrv, AppRateStatusEnum, $rootScope) {
            var isAndroid = ionic.Platform.isAndroid();

            var StoreRateSrv = {
                APP_RATE_EVENT: 'storeRateSrv: app rate status changed',
                enabled: true,
                appleAppId: '955488739',
                customLocale: {
                    title: 'Rate ZinkerzSAT',
                    message: 'If you enjoy using ZinkerzSAT, would you mind taking a moment to rate it? It won’t take more than a minute. Thanks for your support!',
                    cancelButtonLabel: 'No, Thanks',
                    laterButtonLabel: 'Remind Me Later',
                    rateButtonLabel: 'Rate It Now'
                }
            };

            var onRateDialogShow = function() {
                $analytics.eventTrack('AppRate', {category: 'AppRate' });
            };

            var onButtonClicked = function(buttonIndex) {
                var userSelected='';
                var appRateStatus;

                switch(buttonIndex) {
                    case AppRateStatusEnum.cancel.enum:
                        userSelected = StoreRateSrv.customLocale.cancelButtonLabel;
                        appRateStatus = AppRateStatusEnum.cancel.enum;
                        break;
                    case AppRateStatusEnum.later.enum:
                        userSelected = StoreRateSrv.customLocale.laterButtonLabel;
                        appRateStatus = AppRateStatusEnum.later.enum;
                        break;
                    default:
                        userSelected = StoreRateSrv.customLocale.rateButtonLabel;
                        appRateStatus = AppRateStatusEnum.rate.enum;
                }

                HintSrv.setHintStatus(HintSrv.APP_RATE,appRateStatus);
                $rootScope.$broadcast(StoreRateSrv.APP_RATE_EVENT,appRateStatus);

                $analytics.eventTrack('AppRate', { category: 'click', label: userSelected });
            };

            StoreRateSrv.rate = function rate(){
                if (StoreRateSrv.enabled && $window.AppRate){
                    return HintSrv.getHintStatus(HintSrv.APP_RATE,true).then(function(status){
                        if(status === AppRateStatusEnum.cancel.enum || status === AppRateStatusEnum.rate.enum){
                            return;
                        }

                        $window.AppRate.preferences.openStoreInApp = true;
                        if(isAndroid){
                            $window.AppRate.preferences.storeAppURL.android = 'market://details?id=com.zinkerz.zinkerzsat';
                        }else{
                            $window.AppRate.preferences.storeAppURL.ios = StoreRateSrv.appleAppId;
                        }
                        $window.AppRate.preferences.usesUntilPrompt = 5;
                        $window.AppRate.preferences.customLocale = StoreRateSrv.customLocale;
                        $window.AppRate.preferences.displayAppName = 'ZinkerzSAT';
                        $window.AppRate.preferences.callbacks.onRateDialogShow = onRateDialogShow;
                        $window.AppRate.preferences.callbacks.onButtonClicked = onButtonClicked;
                        $window.AppRate.preferences.promptAgainForEachNewVersion = true;
                        $window.AppRate.promptForRating(true);
                    });
                }
            };

            StoreRateSrv.getAppRateStatus = function(){
                return HintSrv.getHintStatus(HintSrv.APP_RATE,true);
            };

            return StoreRateSrv;
        }
    ]);
})(angular,ionic);
