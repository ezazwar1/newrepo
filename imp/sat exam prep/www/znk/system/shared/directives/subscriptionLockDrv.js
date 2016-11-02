(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('subscriptionLockDrv', [
        'SharedModalsSrv',
        function (SharedModalsSrv) {
            return {
                priority: 500,
                compile: function(){
                    function preFn(scope,element,attrs){
                        function clickHandler(evt){
                            if(attrs.disabled){
                                evt.stopImmediatePropagation();
                                evt.preventDefault();
                                SharedModalsSrv.showIapModal();
                                return false;
                            }
                        }
                        element[0].addEventListener('click', clickHandler);
                        scope.$on('$destroy',function(){
                            element[0].removeEventListener('click', clickHandler);
                        });
                    }

                    return{
                        pre: preFn
                    };
                }
            };
        }
    ]);
})(angular);
