/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('znkBackButton', [
        '$ionicHistory','$analytics',
        function ($ionicHistory, $analytics) {
            return {
                template: '<button class="back-button button-clear"><i class="icon back-arrow-icon"></i></button>',
                restrict: 'E',
                replace: true,
                compile: function(element, attrs){
                    var disableBack;
                    var clickHandler = function(){
                        if(disableBack){
                            return;
                        }
                        disableBack = true;
                        $ionicHistory.goBack();

                        $analytics.eventTrack('click-go-back', {
                            category: 'click-go-back',
                            label: '' + $ionicHistory.currentStateName()
                        });
                    };

                    if(!$ionicHistory.backView()){
                        element.addClass('ng-hide');
                    }else{
                        if(!attrs.ngClick){
                            element.on('click',clickHandler);
                        }
                    }

                    function postLink(scope){
                        scope.$on('$destroy',function(){
                            element.off('click',clickHandler);
                        });
                    }

                    return {
                        postLink: postLink
                    };
                }
            };
        }
    ]);
})(angular);

