(function (angular) {
    'use strict';

    function PointsMap(correctWithinAllowedTimeFrame,correctAfterAllowedTimeFrame,wrongWithinAllowedTimeFrame,wrongAfterAllowedTimeFrame){
        var PointsMap = this;

        if(angular.isDefined(correctWithinAllowedTimeFrame)){
            PointsMap.correctWithin = correctWithinAllowedTimeFrame;
        }

        if(angular.isDefined(correctAfterAllowedTimeFrame)){
            PointsMap.correctAfter= correctAfterAllowedTimeFrame;
        }

        if(angular.isDefined(wrongWithinAllowedTimeFrame)){
            PointsMap.wrongWithin = wrongWithinAllowedTimeFrame;
        }

        if(angular.isDefined(wrongAfterAllowedTimeFrame)){
            PointsMap.wrongAfter = wrongAfterAllowedTimeFrame;
        }

        PointsMap.unanswered = 0;
    }

    var diagnosticScoresConst = {
        1: new PointsMap(90,90,50,50),
        2: new PointsMap(100,100,60,60),
        3: new PointsMap(120,120,80,80),
        4: new PointsMap(140,140,100,100),
        5: new PointsMap(150,150,120,120)
    };
    angular.module('znk.sat').constant('diagnosticScoresConst', diagnosticScoresConst);

    var exerciseTypeConst = {
        tutorial: 1,
        practice: 2,
        game: 3,
        section: 4,
        drill: 5
    };

    var rawPointsConst = {};
    rawPointsConst[exerciseTypeConst.section] = rawPointsConst[exerciseTypeConst.tutorial] = rawPointsConst[exerciseTypeConst.game] = new PointsMap(1,0,-0.25,0);
    rawPointsConst[exerciseTypeConst.drill] = new PointsMap(0.2,0,-0.05,0);
    angular.module('znk.sat').constant('rawPointsConst', rawPointsConst);


    var allowedTimePerExerciseConst = {};
    allowedTimePerExerciseConst[exerciseTypeConst.section] = (8 * 60 + 20) * 1000;
    allowedTimePerExerciseConst[exerciseTypeConst.tutorial] = 6 * 60 * 1000;
    allowedTimePerExerciseConst[exerciseTypeConst.game] = 10 * 60 * 1000;
    allowedTimePerExerciseConst[exerciseTypeConst.drill] = 40 * 60 * 1000;
    angular.module('znk.sat').constant('allowedTimePerExerciseConst',allowedTimePerExerciseConst);

    var satSubjectRawScore = {
        0: 54,
        1: 67,
        2: 61
    };
    angular.module('znk.sat').constant('satSubjectRawScore',satSubjectRawScore);
})(angular);
