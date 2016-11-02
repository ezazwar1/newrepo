
(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('znkProgressDrv', [
        function () {
            return {
                restrict:'A',
                templateUrl: 'znk/system/shared/templates/znkProgressDrv.html',
                scope: {
                    progressWidth: '@',
                    progressValue: '@',
                    showProgressValue: '@',
                    showProgressBubble: '&'
                }
            };
        }
    ]);
})(angular);

