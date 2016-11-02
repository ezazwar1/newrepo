(function (angular) {
    'use strict';
    angular.module('znk.sat').factory('AppRateStatusEnum', [
        'EnumSrv',
        function (EnumSrv) {
            return new EnumSrv.BaseEnum([
                ['cancel', 1, 'cancel'],
                ['later', 2, 'later'],
                ['rate', 3, 'rate']
            ]);
        }
    ]);
})(angular);

