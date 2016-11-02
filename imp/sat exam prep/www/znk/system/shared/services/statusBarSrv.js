(function (angular, ionic) {
    'use strict';

    angular.module('znk.sat').factory('StatusBarSrv', ['$window', 'MobileSrv', function ($window, MobileSrv) {

        var StatusBarSrv = {};
        var isMobile = MobileSrv.isMobile();

        StatusBarSrv.hide = function hide(){
            if ( !$window.StatusBar) {
                return;
            }

            isMobile ? ionic.Platform.fullScreen(): angular.noop;
            $window.StatusBar.styleDefault();
            $window.StatusBar.hide();
        };

        StatusBarSrv.handleStateChange = function handleStateChange(stateName){
            if ( !$window.StatusBar) {
                return;
            }

            var hideInStates = ['welcome', 'login', 'forgotPassword', 'signup'];
            if(hideInStates.indexOf(stateName) !==  -1){
                StatusBar.hide();
            }else{
                StatusBar.show();
            }
        };

        return StatusBarSrv;
    }
    ]);
})(angular, ionic);




