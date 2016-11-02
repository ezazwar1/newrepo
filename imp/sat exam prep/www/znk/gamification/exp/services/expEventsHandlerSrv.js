(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('ExpEventsHandlerSrv', [
        '$rootScope', 'exerciseEventsConst', 'QuestionUtilsSrv', 'expRulesConst', 'ExpSrv', 'examEventsConst', 'drillEventsConst','LevelSrv',
        function ($rootScope, exerciseEventsConst, QuestionUtilsSrv, expRulesConst, ExpSrv, examEventsConst, drillEventsConst, LevelSrv) {
            var ExpEventsHandlerSrv = {};

            function baseExerciseFinishHandler(exerciseName, evt, exercise, result) {
                var questions = exercise.questions;
                var numOfCorrectAnswers = QuestionUtilsSrv.getCorrectAnswersNum(questions, result.questionResults);
                var exerciseExpRules = expRulesConst[exerciseName];
                var expWon = numOfCorrectAnswers * exerciseExpRules.correctAnswer;
                var isPerfectScore = numOfCorrectAnswers === questions.length;
                if (isPerfectScore) {
                    expWon += exerciseExpRules.perfectScoreBonus;
                }
                var setFnName = ExpSrv.getExerciseSetFnName(exerciseName);
                var setProm = ExpSrv[setFnName](exercise.id, expWon, isPerfectScore);
                setProm.then(function(expObj){
                    LevelSrv.setUserLevel(expObj);
                });
            }

            function examCompleteHandler(evt, exam) {
                var addPoints = exam.isDiagnostic ? expRulesConst.exam.diagnosticComplete : expRulesConst.exam.complete;
                var setProm = ExpSrv.setCompleteExamExp(exam.id, addPoints);
                setProm.then(function(expObj){
                    LevelSrv.setUserLevel(expObj);
                });
            }

            function flshCardsCompleteHandler() {
                var setProm = ExpSrv.setCompleteFlashCardExp(expRulesConst.flashCard.complete);
                setProm.then(function(expObj){
                    LevelSrv.setUserLevel(expObj);
                });
            }

            function examSectionFinishHandler(evt,section,result){
                if(section.isDiagnostic) return;

                var exResult =  QuestionUtilsSrv.areAllAnswersCorrect(section.questions,result.questionResults);
                var expWon = exResult.correctAnswers * expRulesConst.exam.section.correctAnswer;
                expWon += expRulesConst.exam.section.complete;
                if(exResult.allCorrect){
                    expWon += expRulesConst.exam.section.perfectScoreBonus;
                }
                var setProm = ExpSrv.setExamSectionExp(section.examId,section.order,expWon,exResult.allCorrect);
                setProm.then(function(expObj){
                    LevelSrv.setUserLevel(expObj);
                });
            }

            function dailyCompleteHandler(evt, daily) {
                var setProm = ExpSrv.setCompleteDailyExp(daily.orderId, expRulesConst.daily.complete);
                setProm.then(function(expObj){
                    LevelSrv.setUserLevel(expObj);
                });
            }

            var eventsHandlers = {
                baseExerciseFinishHandler: baseExerciseFinishHandler,
                examCompleteHandler: examCompleteHandler,
                dailyCompleteHandler: dailyCompleteHandler,
                examSectionFinishHandler: examSectionFinishHandler,
                flshCardsCompleteHandler: flshCardsCompleteHandler
            };

            var eventsArr = [];

            function addEvent(eventName, exerciseNameOrHandler) {
                var eventItem = {
                    name: eventName,
                    handler: angular.isString(exerciseNameOrHandler) ? eventsHandlers.baseExerciseFinishHandler.bind(eventsHandlers.baseExerciseFinishHandler, exerciseNameOrHandler) : exerciseNameOrHandler
                };
                eventsArr.push(eventItem);
            }

            addEvent(exerciseEventsConst.tutorial.FINISH, 'tutorial');
            addEvent(exerciseEventsConst.practice.FINISH, 'practice');
            addEvent(exerciseEventsConst.game.FINISH, 'game');
            addEvent(drillEventsConst.FINISH, 'drill');

            addEvent(exerciseEventsConst.flashCard, eventsHandlers.flshCardsCompleteHandler);

            addEvent(examEventsConst.COMPLETE, eventsHandlers.examCompleteHandler);
            addEvent(examEventsConst.SECTION_FINISH, eventsHandlers.examSectionFinishHandler);
            addEvent(exerciseEventsConst.daily.COMPLETE, eventsHandlers.dailyCompleteHandler);

            ExpEventsHandlerSrv.init = function () {
                var childScope = $rootScope.$new(true);
                eventsArr.forEach(function (event) {
                    childScope.$on(event.name, event.handler);
                });
            };

            return ExpEventsHandlerSrv;
        }
    ]);
})(angular);

