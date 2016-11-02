'use strict';

(function (angular) {
    angular.module('znk.sat').directive('disableClickDrv', [
        function () {
            return {
                priority: 200,
                link: {
                    pre: function (scope, element, attrs) {
                        function clickHandler(evt){
                            if(attrs.disabled){
                                evt.stopImmediatePropagation();
                                evt.preventDefault();
                                return false;
                            }
                        }
                        var eventName = 'click';
                        element[0].addEventListener (eventName, clickHandler);
                        scope.$on('$destroy',function(){
                            element[0].removeEventListener (eventName, clickHandler);
                        });
                    }
                }
            };
        }
    ]);
})(angular);
