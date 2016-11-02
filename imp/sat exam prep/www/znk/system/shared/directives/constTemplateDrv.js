/**
 * attrs:
 *  constTemplateDrv: template url
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('constTemplateDrv', [
        function () {
            return {
                templateUrl: function(element,attrs){
                    return attrs.constTemplateDrv;
                }
            };
        }
    ]);
})(angular);

