/**
 * attrs:
 *  questions
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('znkExercisePager', [
        '$timeout', 'EnumSrv', 'QuestionUtilsSrv', 'ZnkExerciseEvents', '$ionicScrollDelegate',
        function ($timeout, EnumSrv, QuestionUtilsSrv, ZnkExerciseEvents, $ionicScrollDelegate) {
            return {
                templateUrl: 'znk/exercise/templates/znkExercisePagerDrv.html',
                restrict: 'E',
                require: ['ngModel', '^znkExerciseDrv'],
                scope: {},
                link: {
                    pre: function (scope, element, attrs, ctrls) {
                        var ngModelCtrl = ctrls[0];
                        var znkExerciseCtrl = ctrls[1];

                        var domElement = element[0];
                        var SubjectEnum = EnumSrv.subject;
                        var exerciseViewMode = EnumSrv.exerciseViewMode;
                        var answerTypeEnum = EnumSrv.questionAnswerType;

                        scope.d = {};

                        scope.d.tap = function (index) {
                            ngModelCtrl.$setViewValue(index);
                            ngModelCtrl.$render();
                        };

                        function setPagerItemBookmarkStatus(index,status){
                            var pagerItemElement = angular.element(domElement.querySelectorAll('.pager-item')[index]);
                            if(status){
                                pagerItemElement.addClass('bookmark');
                            }else{
                                pagerItemElement.removeClass('bookmark');
                            }
                        }

                        function setPagerItemAnswerClass(index,question){
                            var userAnswer = question.__questionStatus.userAnswer;
                            if(angular.isUndefined(userAnswer)){
                                return;
                            }

                            var currViewMode = znkExerciseCtrl.getViewMode();

                            var questionType = question.answerTypeId;
                            var result = {};
                            result[questionType === answerTypeEnum.select.enum ? 'userAnswerId' : 'userAnswerText'] = userAnswer;

                            var pagerItemElement = angular.element(domElement.querySelectorAll('.pager-item')[index]);

                            pagerItemElement.removeClass('neutral correct wrong');
                            if(currViewMode === exerciseViewMode.answerOnly.enum){
                                pagerItemElement.addClass('neutral');
                                return;
                            }

                            if(QuestionUtilsSrv.isAnswerCorrect(question,result)){
                                pagerItemElement.addClass('correct');
                            }else{
                                pagerItemElement.addClass('wrong');
                            }
                        }

                        function setScroll(currentSlideDom) {
                                var delegate = $ionicScrollDelegate.$getByHandle('znk-pager');
                                var domElement = currentSlideDom[0];
                                var parent = domElement.offsetParent;
                                var res = 0;
                                if(parent){
                                    res = (domElement.offsetLeft + domElement.scrollWidth) - parent.clientWidth;
                                }

                                if (res > 0) {
                                    delegate.scrollTo(res + domElement.scrollWidth, 0, true);
                                } else {
                                    delegate.scrollTo(0, 0, true);
                                }
                        }

                        scope.$on(ZnkExerciseEvents.BOOKMARK,function(evt,question){
                            setPagerItemBookmarkStatus(question.__index,question.__questionStatus.bookmark);
                        });

                        scope.$on(ZnkExerciseEvents.QUESTION_ANSWERED,function(evt,question){
                            setPagerItemAnswerClass(question.__index,question)
                        });

                        scope.$on('exercise:viewModeChanged', function(evt,viewMode){
                            for(var i in scope.questions){
                                var question = scope.questions[i];
                                setPagerItemBookmarkStatus(i,question .__questionStatus.bookmark);
                                setPagerItemAnswerClass(i,question);
                            }
                        });

                        var watchDestroyer = scope.$parent.$watch(attrs.questions, function pagerQuestionsArrWatcher(questionsArr) {
                            if (questionsArr) {
                                watchDestroyer();
                                scope.questions = questionsArr;

                                //wait for the pager items to be rendered
                                $timeout(function () {
                                    ngModelCtrl.$render = function () {
                                        var currentSlide = +ngModelCtrl.$viewValue;
                                        if (isNaN(currentSlide)) {
                                            return;
                                        }
                                        //added in order to prevent the swipe lag
                                        $timeout(function () {
                                            var $pagerItemWithCurrentClass = angular.element(domElement.querySelectorAll('.pager-item.current'));
                                            for (var i in $pagerItemWithCurrentClass) {
                                                $pagerItemWithCurrentClass.eq(i).removeClass('current');
                                            }
                                            var pagerItemsDomElement = domElement.querySelectorAll('.pager-item');
                                            var currentSlideDom = angular.element(pagerItemsDomElement[currentSlide]);
                                            currentSlideDom.addClass('current');

                                            for(var i in scope.questions){
                                                var question = scope.questions[i];
                                                setPagerItemBookmarkStatus(i,question .__questionStatus.bookmark);
                                                setPagerItemAnswerClass(i,question);
                                            }

                                            setScroll(currentSlideDom);
                                        });
                                    };
                                    //render is not invoked for the first time
                                    ngModelCtrl.$render();
                                },false);
                            }
                        });
                    }
                }
            };
        }
    ]);
})(angular);
