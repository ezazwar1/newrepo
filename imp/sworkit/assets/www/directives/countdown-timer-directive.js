angular.module('swMobileApp').directive('countDown', function () {
    return {
        restrict: 'A',
        scope: {
            endTime: "="
        },
        controller: function ($scope, $element, $attrs, $interval, $log) {
            var endTime = new Date($scope.endTime) || false;
            var thenMoment = moment(endTime);
            var countDownTimer;
            $scope.timeUnits = {};

            $scope.showCountdown = false;

            if (!isNaN(endTime)) {
                countDownTimer = $interval(function() {
                    updateCountDown(moment().utc());
                }, 1000);
                $scope.showCountdown = true;
            } else {
                $log.info('count-down hidden, no valid endTime');
            }

            function updateCountDown (nowMoment) {
                $scope.timeUnits.days = thenMoment.diff(nowMoment, 'days');
                $scope.timeUnits.hours = thenMoment.diff(nowMoment, 'hours') - (24 * $scope.timeUnits.days);
                $scope.timeUnits.minutes = thenMoment.diff(nowMoment, 'minutes') - (1440 * $scope.timeUnits.days) -  (60 * $scope.timeUnits.hours);
                $scope.timeUnits.seconds = thenMoment.diff(nowMoment, 'seconds') - (86400 * $scope.timeUnits.days) -  (3600 * $scope.timeUnits.hours) -  (60 * $scope.timeUnits.minutes);
                if (thenMoment.diff(nowMoment) < 0) {
                    $scope.showCountdown = false;
                    $log.info('countdown over');
                    stopCountdown();
                }
            }

            function stopCountdown () {
                if (countDownTimer) {
                    $interval.cancel(countDownTimer);
                    countDownTimer = undefined;
                }
            }

            $scope.$on('$destroy', function() {
                stopCountdown();
            });

        },
        template: '<div class="countdown-time-outer" ng-if="showCountdown"><div class="countdown-time"><p class="countdown-unit">{{timeUnits.days}}</p><p translate>DAYS</p></div><div class="countdown-time"><p class="countdown-unit">{{timeUnits.hours}}</p><p translate>HOURS</p></div><div class="countdown-time"><p class="countdown-unit">{{timeUnits.minutes}}</p><p translate>MINUTES_BG</p></div><div class="countdown-time"><p class="countdown-unit seconds-unit">{{timeUnits.seconds}}</p><p translate>EX_SEC</p></div></div>'
    }
});