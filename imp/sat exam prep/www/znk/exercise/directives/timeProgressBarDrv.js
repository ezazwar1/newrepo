/**
 *  attrs:
 *      length: total time.
 *      play: if true then timer start to count , stop when changed back to false.
 *      ng-model: time passed.
 */

'use strict';

(function (angular) {
    angular.module('znk.sat').directive('timeProgressBarDrv', [
        '$interval',
        function ($interval) {
            return {
                templateUrl: 'znk/exercise/templates/timeProgressBarDrv.html',
                require: 'ngModel',
                scope:{
                    length: '&',
                    play: '&'
                },
                link: function (scope, element, attrs, ngModelCtrl) {
                    var intervalTime = 1000;

                    scope.d = {
                        left: 0
                    };

                    ngModelCtrl.$render = function(){
                        var totalTime = scope.length();
                        var passedTime = +ngModelCtrl.$viewValue;
                        scope.d.left = Math.min(100,Math.floor((passedTime / totalTime) * 100));
                        updateTimeStatusClass();
                    };

                    attrs.$addClass('green');

                    var intervalProm;
                    function stopTimer(){
                        $interval.cancel(intervalProm);
                    }

                    function updateTimeStatusClass(){
                        attrs.$removeClass('green orange red');
                        if(scope.d.left < 51){
                            attrs.$addClass('green');
                            return;
                        }
                        if(scope.d.left < 86){
                            attrs.$addClass('orange');
                            return;
                        }
                        attrs.$addClass('red');
                    }
                    scope.$watch('play()',function(newVal){
                        if(newVal){
                           intervalProm = $interval(function tick(){
                               ngModelCtrl.$setViewValue((+ngModelCtrl.$viewValue || 0) + intervalTime);
                               var totalTime = +scope.length();
                               var passedTimePercent = Math.floor((+ngModelCtrl.$viewValue/totalTime) * 100);
                               scope.d.animationDuration = (totalTime/100)/1000;
                               scope.d.left = Math.min(100,passedTimePercent);
                               updateTimeStatusClass();

                               if(scope.d.left === 100){
                                   stopTimer();
                               }
                            },intervalTime);
                        }else{
                            stopTimer();
                        }
                    });

                    scope.$on('$destroy',function(){
                        stopTimer();
                    });
                }
            };
        }
    ]);
})(angular);

