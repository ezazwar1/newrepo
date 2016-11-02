/**
 * attrs:
 */

(function (angular,ionic) {
    'use strict';

    angular.module('znk.sat').directive('triggerGestureDrv', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var bindedObj = scope.$eval(attrs.triggerGestureDrv + '=' + attrs.triggerGestureDrv + '|| {}');
                    bindedObj.triggerGesture = function triggerGesture() {
                        ionic.EventController.trigger(attrs.evtType,{target: element[0]},true,true);
                    };
                }
            };
        }
    ]);
})(angular,ionic);

