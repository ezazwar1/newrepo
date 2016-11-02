(function (angular) {
    'use strict';

    function BaseRules(pointsForCorrectAnswer,pointsForPerfectScore){
        this.correctAnswer = pointsForCorrectAnswer;
        this.perfectScoreBonus = pointsForPerfectScore;
    }

    var expRulesConst = {};

    expRulesConst.tutorial = new BaseRules(8,8);
    expRulesConst.practice = new BaseRules(10,10);
    expRulesConst.game = new BaseRules(5,5);
    expRulesConst.drill = new BaseRules(2,2);

    expRulesConst.flashCard = {
        complete: 5
    };

    expRulesConst.exam = {};
    expRulesConst.exam.complete = 0;
    expRulesConst.exam.diagnosticComplete = 100;
    expRulesConst.exam.section = {
        complete: 30,
        perfectScoreBonus: 10,
        correctAnswer: 10
    };

    expRulesConst.daily = {};
    expRulesConst.daily.complete = 20;

    angular.module('znk.sat').constant('expRulesConst', expRulesConst);
})(angular);
