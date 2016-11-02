/**
 * attrs:
 *
 */
(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('selectAnswerDrv', [
        '$timeout', 'EnumSrv', 'MediaSrv',
        function ($timeout, EnumSrv, MediaSrv) {
            return {
                templateUrl: 'znk/exercise/templates/selectAnswerDrv.html',
                require: ['^questionDrv', '^ngModel'],
                scope: {},
                link: function (scope, element, attrs, ctrls) {
                    var questionDrvCtrl = ctrls[0];
                    var ngModelCtrl = ctrls[1];

                    var MODE_ANSWER_WITH_QUESTION = EnumSrv.exerciseViewMode.answerWithResult.enum,
                        MODE_ANSWER_ONLY = EnumSrv.exerciseViewMode.answerOnly.enum,
                        MODE_REVIEW = EnumSrv.exerciseViewMode.review.enum;

                    scope.d = {};

                    scope.d.answers = questionDrvCtrl.question.answers;

                    scope.d.showSolution = questionDrvCtrl.showSolution;

                    scope.d.getCharIndex = function (answer) {
                        var A_ASCII = 97;
                        return String.fromCharCode(A_ASCII - 1 + answer.id);
                    };

                    scope.d.tap = function (answer) {
                        var viewMode = questionDrvCtrl.getViewMode();

                        if ((!isNaN(parseInt(ngModelCtrl.$viewValue)) && viewMode === MODE_ANSWER_WITH_QUESTION) || viewMode === MODE_REVIEW) {
                            return;
                        }
                        ngModelCtrl.$setViewValue(answer.id);
                        updateAnswersFollowingSelection(viewMode);
                    };

                    function updateAnswersFollowingSelection(viewMode) {
                        var selectedAnswerId = ngModelCtrl.$viewValue;
                        var correctAnswerId = questionDrvCtrl.question.correctAnswerId;
                        var $answers = angular.element(element[0].querySelectorAll('.answer'));
                        for (var i = 0; i < $answers.length; i++) {

                            var $answerElem = angular.element($answers[i]);
                            if(!$answerElem || !$answerElem.scope || !$answerElem.scope()){
                                continue;
                            }

                            var answer = $answerElem.scope().answer;
                            var classToAdd,
                                classToRemove;

                            if (questionDrvCtrl.getViewMode() === MODE_ANSWER_ONLY) {
                                // dont show correct / wrong indication
                                classToRemove = 'answered';
                                classToAdd = selectedAnswerId === answer.id ? 'answered' : 'neutral';
                            } else {
                                // the rest of the optional states involve correct / wrong indications
                                if (angular.isUndefined(selectedAnswerId)) {
                                    // unanswered question
                                    if (questionDrvCtrl.getViewMode() === MODE_REVIEW) {
                                        classToAdd = correctAnswerId === answer.id ? 'answered-incorrect' : 'neutral';
                                    }
                                } else if (selectedAnswerId === answer.id) {
                                    // this is the selected answer
                                    classToAdd = correctAnswerId === answer.id ? 'correct' : 'wrong';
                                } else {
                                    // this is the correct answer but the user didn't select it
                                    classToAdd = answer.id === correctAnswerId ? 'answered-incorrect' : 'neutral';
                                }
                            }
                            $answerElem.removeClass(classToRemove);
                            $answerElem.addClass(classToAdd);
                            if (viewMode == MODE_ANSWER_WITH_QUESTION){
                                if (classToAdd === 'correct'){
                                    MediaSrv.playCorrectAnswerSound();
                                }
                                if (classToAdd === 'wrong'){
                                    MediaSrv.playWrongAnswerSound();
                                }
                            }
                        }
                    }

                    ngModelCtrl.$render = function () {
                        //skip one digest cycle in order to let the answers time to be compiled
                        $timeout(function(){
                            updateAnswersFollowingSelection();
                        });
                    };
                    //ng model controller render function not triggered in case render function was set
                    // after the model value was changed
                    ngModelCtrl.$render();

                    scope.$on('exercise:viewModeChanged', function () {
                        ngModelCtrl.$render();
                    });
                }
            };
        }
    ]);
})(angular);


