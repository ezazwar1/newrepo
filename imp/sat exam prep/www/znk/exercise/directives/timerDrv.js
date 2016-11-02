/**
 * attrs -
 */
'use strict';

(function(angular) {

    angular.module('znk.sat').directive('timer',[
        '$interval',
        function($interval) {

            var timerTypes = {
                countDown: 0,
                countUp: 1
            };

            function padNum(n) {
                if (n >= 10) {
                    return '' + n;
                }
                return '0' + n;
            }

            return {
                scope: {
                    play: '&',
                    isCountDown: '=',
                    timeLimit: '='
                },
                require: 'ngModel',
                template: '<i class="ion-android-stopwatch"></i><div ng-show="minutes || seconds" class="timer-view">{{minutes}}:{{seconds}}</div>',
                link: function link(scope, element, attrs, ngModelCtrl) {

                    function updateTime(currentTime){
                        scope.minutes = padNum(Math.floor((currentTime % (3600 * 1000)) / (60 * 1000)));
                        scope.seconds = padNum((currentTime % (60 * 1000)) / 1000);

                        scope.minutes = Math.max(0,scope.minutes) || 0;
                        scope.seconds = Math.max(0,scope.seconds) || 0;
                    }

                    ngModelCtrl.$render = function(){
                        var currentTime = ngModelCtrl.$viewValue;
                        if(timerType ===  timerTypes.countDown){
                            currentTime = scope.timeLimit - ngModelCtrl.$viewValue;
                        }
                        if(angular.isUndefined(currentTime) || isNaN(currentTime)){
                            return;
                        }
                        updateTime(currentTime);
                    };

                    var timerType = scope.isCountDown ? timerTypes.countDown : timerTypes.countUp;
                    var intervalHandler;
                    var INTERVAL_TIME = 1000;
                    function tick() {
                        var currentTime, duration;

                        if(timerType === timerTypes.countUp){
                            currentTime = ngModelCtrl.$viewValue;
                            currentTime += INTERVAL_TIME;
                            duration = currentTime;
                        }
                        else{
                            currentTime = scope.timeLimit - ngModelCtrl.$viewValue;
                            duration = ngModelCtrl.$viewValue + INTERVAL_TIME;
                        }

                        if(angular.isUndefined(currentTime) || isNaN(currentTime)){
                            return;
                        }

                        if(currentTime <= 0){
                            $interval.cancel(intervalHandler);
                        }

                        updateTime(currentTime);
                        ngModelCtrl.$setViewValue(duration);
                    }

                    scope.$watch('play()',function(newVal){
                        if(newVal){
                            intervalHandler = $interval(tick,INTERVAL_TIME);
                        }else{
                            if(intervalHandler){
                                $interval.cancel(intervalHandler);
                            }
                        }
                    });

                    scope.$on('$destroy', function () {
                        $interval.cancel(intervalHandler);
                    });
                }
            };
        }]);

})(angular);
