(function (angular) {
    'use strict';

    var examTypeConst = {
        regular: 0,
        mini: 1,
        diagnostic: 2
    };
    angular.module('znk.sat').constant('examTypeConst', examTypeConst);

    angular.module('znk.sat').factory('ExamTypeEnum', [
        'EnumSrv',
        function (EnumSrv) {
            return new EnumSrv.BaseEnum([
                ['regular',examTypeConst.regular,'regular'],
                ['mini',examTypeConst.mini,'mini'],
                ['diagnostic',examTypeConst.diagnostic,'diagnostic']
            ]);
        }
    ]);
})(angular);

