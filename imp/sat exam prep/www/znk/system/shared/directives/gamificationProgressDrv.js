
(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('gamificationProgressDrv', ['LevelSrv', 'ExpSrv',
        function (LevelSrv, ExpSrv) {
            return {
                restrict:'A',
                templateUrl: 'znk/system/shared/templates/gamificationProgressDrv.html',
                scope: {
                    showProgressValue: '=',
                    onGameifiction: "&"
                },
                link:{
                    pre: function (scope) {

                        ExpSrv.getGamificationObj().then(function (gamificationObj) {

                            scope.gameObj = gamificationObj;

                            //@todo: ExpSrv should return defaults for Gamification... */
                            if (!scope.gameObj.exp) {
                                scope.gameObj = {
                                    exp : {
                                        total: 0
                                    }
                                }
                            }

                            if (!scope.gameObj.level) {
                                scope.gameObj.level = {
                                    name: 'Newbie'
                                }
                            }
                            /*...................................................*/

                            var totalXp = scope.gameObj.exp.total;
                            scope.gameObj.level = LevelSrv.levelByPoints(totalXp);

                            var nextLevel = LevelSrv.nextLevel(scope.gameObj.level.level,scope.gameObj.level.name,  scope.gameObj.exp.total);
                            scope.nextLevelPoints = nextLevel.points;
                            scope.nextLevelName =  nextLevel.name;

                            scope.progressWidth = ((totalXp - scope.gameObj.level.points) / (nextLevel.maxPoints - scope.gameObj.level.points) * 100);

                            scope.onGameifiction({ gameObj: scope.gameObj });

                        });
                    }
                }

            };
        }
    ]);
})(angular);

