(function (angular) {
    'use strict';

    var homeItemStatusEnum = {
        NEW: 0,
        ACTIVE: 1,
        COMPLETED: 2,
        COMING_SOON: 3
    };

    angular.module('znk.sat').constant('homeItemStatusConst', homeItemStatusEnum);

    angular.module('znk.sat').factory('HomeItemStatusEnum', [
        'EnumSrv',
        function (EnumSrv) {
            var HomeItemStatusEnum = new EnumSrv.BaseEnum([
                ['NEW', homeItemStatusEnum.NEW, 'new'],
                ['ACTIVE', homeItemStatusEnum.ACTIVE, 'active'],
                ['COMPLETED', homeItemStatusEnum.COMPLETED, 'completed'],
                ['COMING_SOON', homeItemStatusEnum.COMING_SOON, 'coming soon']
            ]);
            return HomeItemStatusEnum;
        }
    ]);
})(angular);
