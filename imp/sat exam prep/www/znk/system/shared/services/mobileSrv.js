
(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('MobileSrv', ['$window', function ($window) {

        var MobileSrv = {};

        MobileSrv.isMobile = function isMobile() {
            return $window.innerWidth <= 567;
        };

        MobileSrv.getScreenWidth = function(){
            return $window.innerWidth;
        };
        return MobileSrv;
    }
    ]);
})(angular);
