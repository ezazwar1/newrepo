/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('esExerciseTimeDrv', [
        'allowedTimePerExerciseConst', 'ExerciseAnswerStatusEnum',
        function (allowedTimePerExerciseConst, ExerciseAnswerStatusEnum) {
            function convertSimpleAnswerToAnswerStatusEnum(answer) {
                switch (answer) {
                    case true:
                        return ExerciseAnswerStatusEnum.correct.enum;
                    case false:
                        return ExerciseAnswerStatusEnum.wrong.enum;
                    default :
                        return ExerciseAnswerStatusEnum.unanswered.enum;
                }
            }

            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    function parser(results) {

                        if (!parser.allowedTimeForExercise) {

                            var questions = scope.$eval(attrs.questions);
                            var exerciseType;

                            if(questions.length > 0) {
                                exerciseType =  questions[0].parentTypeId;
                                parser.allowedTimeForExercise = allowedTimePerExerciseConst[exerciseType];
                            }

                        }

                        var timeSpent = results.reduce(function (prev, curr) {
                            return prev + curr.timeSpent;
                        }, 0);

                        results.forEach(function (result) {
                            if(!result.__questionStatus){
                                result.__questionStatus = {};
                            }
                            var currAnswerStatus = convertSimpleAnswerToAnswerStatusEnum(result.isAnsweredCorrectly);
                            if (timeSpent > parser.allowedTimeForExercise) {
                                if (angular.isDefined(result.answerAfterTime) || result.answerWithinTime !== currAnswerStatus) {
                                    result.answerAfterTime = currAnswerStatus;
                                }
                            }else{
                                result.answerWithinTime = currAnswerStatus;
                            }
                        });

                        return results;
                    }

                    ngModelCtrl.$parsers.push(parser);
                }
            };
        }
    ]);
})(angular);
