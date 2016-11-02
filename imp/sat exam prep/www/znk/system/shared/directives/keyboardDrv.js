'use strict';

(function (angular) {
    angular.module('znk.sat').directive('keyboardDrv', [ '$window',

        function ($window) {
            return {
                link: function (scope, element, attrs) {

                    $window.addEventListener('native.showkeyboard', keyboardShowHandler);

                    $window.addEventListener('native.hidekeyboard', keyboardHideHandler);

                    function keyboardShowHandler(e){
                        if(!angular.element(element).hasClass('device-keyboard-open')){
                            angular.element(element).addClass('device-keyboard-open');
                        }
                    }

                    function keyboardHideHandler(e){
                        if(angular.element(element).hasClass('device-keyboard-open')){
                            angular.element(element).removeClass('device-keyboard-open');
                        }
                    }

                    scope.$on('$destroy',function(){
                        $window.removeEventListener ('native.showkeyboard', keyboardShowHandler);
                        $window.removeEventListener ('native.hidekeyboard', keyboardHideHandler);
                    });

                }
            };
        }
    ]);
})(angular);

