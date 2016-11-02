/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('freeTextAnswerDrv', [
        'EnumSrv', 'MediaSrv',
        function (EnumSrv, MediaSrv) {
            return {
                templateUrl: 'znk/exercise/templates/freeTextAnswerDrv.html',
                require: ['^questionDrv','^ngModel'],
                scope:{},
                link: function (scope, element, attrs, ctrls) {
                    var questionDrvCtrl = ctrls[0];
                    var ngModelCtrl = scope.ngModelCtrl = ctrls[1];

                    scope.d = {
                        showSolution: questionDrvCtrl.showSolution,
                        ngModelCtrl: ngModelCtrl
                    };

                    updateCanEdit();

                    function setCorrectnessClass(enableSound){

                        var viewMode = questionDrvCtrl.getViewMode();
                        var classToAdd;

                        if((viewMode === EnumSrv.exerciseViewMode.answerWithResult.enum && angular.isUndefined(scope.d.answer)) ||
                            viewMode === EnumSrv.exerciseViewMode.answerOnly.enum){
                            classToAdd = 'neutral';
                            scope.d.currentAnswer = ngModelCtrl.$viewValue;
                        } else {
                            var correctAnswersArr = questionDrvCtrl.question.correctAnswerText.map(function(answer){
                                return answer.content;
                            });

                            if (correctAnswersArr.indexOf(scope.d.answer) === -1) {
                                var $questionCorrectAnswer = angular.element(element[0].querySelector('.question-correct-answer'));
                                $questionCorrectAnswer.empty();
                                $questionCorrectAnswer.html(correctAnswersArr[0]);
                                if(angular.isUndefined(scope.d.answer)){
                                    classToAdd = 'not-answered';
                                }else{
                                    classToAdd = 'wrong';
                                }
                            } else {
                                classToAdd = 'correct';
                            }

                            if (viewMode === EnumSrv.exerciseViewMode.answerWithResult.enum && enableSound){
                                if (classToAdd === 'correct'){
                                    MediaSrv.playCorrectAnswerSound();
                                }
                                if (classToAdd === 'wrong'){
                                    MediaSrv.playWrongAnswerSound();
                                }
                            }
                        }

                        element.addClass(classToAdd);
                    }

                    function updateCanEdit() {
                        var viewMode = questionDrvCtrl.getViewMode();
                        scope.d.disableEdit = (viewMode === EnumSrv.exerciseViewMode.review.enum ||
                            (viewMode === EnumSrv.exerciseViewMode.answerWithResult.enum && scope.d.answer));
                    }

                    scope.d.save = function(){
                        if(!scope.d.answer){
                            return;
                        }
                        ngModelCtrl.$setViewValue(scope.d.answer);
                        setCorrectnessClass(true);
                        updateCanEdit();
                    };

                    ngModelCtrl.$render = function(){
                        scope.d.answer = ngModelCtrl.$viewValue;
                        setCorrectnessClass(false);
                        updateCanEdit();
                    };

                    scope.$on('exercise:viewModeChanged', function () {
                        updateCanEdit();
                        ngModelCtrl.$render();
                    });
                }
            };
        }
    ]);
})(angular);

