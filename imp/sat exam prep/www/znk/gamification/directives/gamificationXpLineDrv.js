'use strict';

(function (angular) {

    angular.module('znk.sat').directive({ gamificationXpLineDrv : ['GamificationXpLineSrv', gamificationXpLineDrv] });

    function gamificationXpLineDrv(GamificationXpLineSrv) {
        return {
            restrict: 'A',
            scope: {
                gamification: '='
            },
            templateUrl: 'znk/gamification/templates/gamificationXpLineDrv.html',
            link:  function(scope) {

               var watcher = scope.$watch('gamification', function(val) {
                    if(angular.isDefined(val)) {
                        start(val);
                        watcher();
                    }
                });


                function start(val) {
                    scope.current = val;
                    scope.gamificationArr = GamificationXpLineSrv.get();
                }
            }
        };
    }


})(angular);
