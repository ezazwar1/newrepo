/**
 * attrs:
 */

(function (angular, ionic) {
    'use strict';

    angular.module('znk.sat').directive('swipeCardOnClickDrv', [
        function () {
            return {
                templateUrl: '',
                link: function (scope, element, attrs) {
                    function clickHandler(){
                        var domElement = document.querySelector('[flashcard-swipe-drv]');
                        ionic.EventController.trigger('swipe' + attrs.direction,{
                            target: domElement,
                            gesture:{
                                left:1
                            }
                        });
                    }
                    element.on('click',clickHandler);

                    scope.$on('$destory',function(){
                        element.off('click',clickHandler);
                    });
                }
            };
        }
    ]);
})(angular,ionic);

