/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('triggerBlurDrv', [
        function () {
            return {
                scope:{
                    triggerBlur: '=triggerBlurDrv'
                },
                link: function (scope, element, attrs) {
                    scope.triggerBlur = function(){
                        element[0].blur();
                    };
                }
            };
        }
    ]);
})(angular);

