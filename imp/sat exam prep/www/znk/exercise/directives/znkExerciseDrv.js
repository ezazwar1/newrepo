/**
 * attrs:
 *  question
 *  ngModel: results arr
 *  settings:
 *      onNext
 *      onLastNext
 *      onQuestionAnswered
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('znkExerciseDrv', [
        'EnumSrv', 'ExerciseUtilsSrv','$location','$analytics', 'MediaSrv', 'HintSrv', 'ZnkExerciseEvents',
        function (EnumSrv, ExerciseUtilsSrv, $location, $analytics, MediaSrv, HintSrv, ZnkExerciseEvents) {
            return {
                templateUrl: 'znk/exercise/templates/znkExerciseDrv.html',
                require: 'ngModel',
                scope: {
                    questionsGetter: '&questions',
                    articlesGetter: '&articles',
                    settings: '=',
                    actions: '=',
                    subjectId: '='
                },
                controller: ['$scope', function($scope) {
                    var _this = this;

                    _this.settings = $scope.settings;

                    this.getViewMode = function(){
                        return $scope.settings.viewMode;
                    };
                }],
                link: function (scope, element, attrs, ngModelCtrl) {
                    if(angular.isUndefined(scope.settings.noTour)) {
                        HintSrv.triggerQuestionTournHint();
                    }
                    var questionAnswersToOneObjectfmtr = {},
                        lastTimeSnapshot = Date.now(),
                        allQuestionWithAnswersArr;

                    var defaultSettings = {
                        onNext: function(){ scope.d.currentSlide++; },
                        onLastNext: angular.noop,
                        onSummary: angular.noop,
                        onQuestionAnswered: angular.noop,
                        viewMode: EnumSrv.exerciseViewMode.answerWithResult.enum,
                        toolBoxWrapperClass: '',
                        removePager: true,
                        isDisable: false
                    };

                    var mergedSettings = angular.extend(defaultSettings, scope.settings || {});
                    angular.extend(scope.settings, mergedSettings);

                    scope.actions = scope.actions || {};
                    scope.actions.setSlideIndex = setSlideIndex;
                    scope.soundsEnabled = MediaSrv.soundsEnabled;

                    var toolBoxModalInstance;
                    scope.actions.showToolbox = function showToolbox() {
                        if (!toolBoxModalInstance) {
                            toolBoxModalInstance = ExerciseUtilsSrv.openExerciseToolBoxModal(scope.$new(true),mergedSettings.toolBoxWrapperClass);
                            toolBoxModalInstance.scope.injections = toolBoxModalInstance.scope.injections || {};
                            toolBoxModalInstance.scope.injections.exerciseTypeId = scope.d.questionsWithAnswers.length ? scope.d.questionsWithAnswers[0].parentTypeId : null;
                        }

                        if(!toolBoxModalInstance.scope.injections.bookmarkCurrentQuestion){
                            toolBoxModalInstance.scope.injections.bookmarkCurrentQuestion = scope.d.bookmarkCurrentQuestion.bind(scope.d);
                        }

                        if(!toolBoxModalInstance.scope.injections.hidePager){
                            toolBoxModalInstance.scope.injections.hidePager = function(hide){
                                scope.d.hidePager = hide;
                            };
                        }

                        if(scope.settings.showInstructions && !toolBoxModalInstance.scope.injections.showInstructions){
                            toolBoxModalInstance.scope.injections.showInstructions = scope.settings.showInstructions;
                        }

                        if (!toolBoxModalInstance.scope.injections.hideInstructionsButton) {
                            toolBoxModalInstance.scope.injections.hideInstructionsButton = function hideInstructionsButton(hide) {
                                scope.settings.hideInstructionsButton = hide;
                            };
                        }

                        toolBoxModalInstance.scope.injections.subjectId = scope.subjectId;
                        toolBoxModalInstance.scope.injections.blackboardData = scope.d.questionsWithAnswers[scope.d.currentSlide].__blackboardData;
                        toolBoxModalInstance.scope.injections.questionsWithAnswers = scope.d.questionsWithAnswers;
                        toolBoxModalInstance.show();
                    };

                    scope.actions.hideToolbox = function hideToolbox() {
                        if (toolBoxModalInstance) {
                            toolBoxModalInstance.hide();
                        }
                    };

                    scope.actions.currentSlide = function(){
                        return scope.d.currentSlide;
                    };

                    var articlesMap = scope.articlesGetter().reduce(function (prev, article) {
                        prev[article.id] = article;
                        return prev;
                    }, {});

                    scope.d = {
                        currentSlide: 0,
                        answeredCount: 0,
                        reviewModeId: EnumSrv.exerciseViewMode.review.enum,
                        hidePager: mergedSettings.hidePager,
                        removePager: mergedSettings.removePager,
                        isDisable: mergedSettings.isDisable
                    };

                    questionAnswersToOneObjectfmtr.formatter = function(answers){
                        if(!answers){
                            answers = [];
                        }
                        var answersMap = {};
                        answers.forEach(function(answer){
                            answersMap[answer.questionId] = answer;
                        });

                        var questions = scope.questionsGetter() || [];

                        var questionsWithAnswers = questions.map(function(question, index){
                            var questionCopy = angular.copy(question);
                            var answer = answersMap[questionCopy.id];

                            questionCopy.__index = index;
                            questionCopy.__questionStatus = {};
                            if(!angular.isUndefined(answer.userAnswerId) || !angular.isUndefined(answer.userAnswerText)){
                                questionCopy.__questionStatus.userAnswer = (questionCopy.answerTypeId === 0) ? answer.userAnswerId : answer.userAnswerText;//@todo(igor) we really need to save the answer in different properties depend on the answer type ??
                            }
                            questionCopy.__blackboardData = answer.blackboardData || {};
                            questionCopy.__timeSpent = answer.timeSpent || 0;

                            if(answer.bookmark){
                                questionCopy.__questionStatus.bookmark = answer.bookmark;
                            }

                            if(angular.isDefined(question.groupDataId)){
                                questionCopy.__article = articlesMap[question.groupDataId];
                            }

                            if(angular.isDefined(answer.answerWithinTime)){
                                questionCopy.__questionStatus.answerWithinTime = answer.answerWithinTime;
                            }

                            if(angular.isDefined(answer.answerAfterTime)){
                                questionCopy.__questionStatus.answerAfterTime = answer.answerAfterTime;
                            }

                            return questionCopy;
                        });
                        return questionsWithAnswers;
                    };
                    ngModelCtrl.$formatters.push(questionAnswersToOneObjectfmtr.formatter);

                    questionAnswersToOneObjectfmtr.parser = function(questionsWithAnswersArr){
                        scope.d.answeredCount = 0;

                        questionsWithAnswersArr.forEach(function(questionWithAnswer, index){
                            if(angular.isUndefined(questionWithAnswer.__questionStatus)){
                                return;
                            }

                            var answer = {
                                questionId: questionWithAnswer.id,
                                //blackboardData: questionWithAnswer.__blackboardData,
                                timeSpent: questionWithAnswer.__timeSpent,
                                isAnsweredCorrectly: ngModelCtrl.$modelValue[index] && ngModelCtrl.$modelValue[index].isAnsweredCorrectly,
                                difficulty: questionWithAnswer.difficulty
                            };

                            if (angular.isDefined(questionWithAnswer.__questionStatus.userAnswer)) {
                                answer[questionWithAnswer.answerTypeId === 0 ? 'userAnswerId' : 'userAnswerText'] = questionWithAnswer.__questionStatus.userAnswer;
                                scope.d.answeredCount++;
                                //add is user answered correctly property to result object
                                if(angular.isUndefined(answer.isAnsweredCorrectly)){
                                    if(questionWithAnswer.answerTypeId === 0){
                                        answer.isAnsweredCorrectly = questionWithAnswer.correctAnswerId === answer.userAnswerId;
                                    }else{
                                        var correctAnswersArr = questionWithAnswer.correctAnswerText.map(function(answer){
                                            return answer.content;
                                        });
                                        answer.isAnsweredCorrectly = correctAnswersArr.indexOf(answer.userAnswerText) !== -1;
                                    }
                                }
                            }

                            if(questionWithAnswer.__questionStatus.bookmark){
                                answer.bookmark = true;
                            }

                            if(angular.isDefined(questionWithAnswer.__questionStatus.answerWithinTime)){
                                answer.answerWithinTime = questionWithAnswer.__questionStatus.answerWithinTime;
                            }

                            if(angular.isDefined(questionWithAnswer.__questionStatus.answerAfterTime)){
                                answer.answerAfterTime = questionWithAnswer.__questionStatus.answerAfterTime;
                            }

                            for(var prop in answer){
                                if(angular.isUndefined(answer[prop]) || answer[prop] === null){
                                    delete answer[prop];
                                }
                            }
                            ngModelCtrl.$modelValue[index] = answer;
                        });

                        return ngModelCtrl.$modelValue;
                    };
                    ngModelCtrl.$parsers.push(questionAnswersToOneObjectfmtr.parser);

                    ngModelCtrl.$render = function(){
                        render(ngModelCtrl.$viewValue);
                    };

                    function render(viewValue) {
                        allQuestionWithAnswersArr = viewValue;
                        scope.d.questionsWithAnswers = allQuestionWithAnswersArr;
                    }

                    scope.$watch('settings.viewMode', function (value) {
                        if (value === EnumSrv.exerciseViewMode.review.enum) {
                            var newViewValue = questionAnswersToOneObjectfmtr.formatter(ngModelCtrl.$modelValue);
                            render(newViewValue);
                        }

                        scope.$broadcast('exercise:viewModeChanged', {viewMode: value});
                    });

                    function getCurrentQuestion(){
                        return scope.d.questionsWithAnswers[scope.d.currentSlide];
                    }
                    scope.d.questionAnswered = function(question){
                        scope.$broadcast(ZnkExerciseEvents.QUESTION_ANSWERED,getCurrentQuestion());
                        setViewValue(scope.d.questionsWithAnswers);

                        var userAnswer = question.__questionStatus.userAnswer;

                        var isCorrect;
                        if (question.answerTypeId === 0) {
                            isCorrect = (userAnswer === question.correctAnswerId);
                        } else {
                            isCorrect = question.correctAnswerText.some(function(item) {
                                return item.content === userAnswer;
                            });
                        }

                        scope.settings.onQuestionAnswered(scope.d.currentSlide, isCorrect);
                    };

                    scope.d.bookmarkCurrentQuestion = function(){
                        var questionIndex = scope.d.currentSlide;
                        var questionStatus = scope.d.questionsWithAnswers[questionIndex].__questionStatus;
                        questionStatus.bookmark = !questionStatus.bookmark;
                        scope.$broadcast(ZnkExerciseEvents.BOOKMARK,getCurrentQuestion());
                        setViewValue(scope.d.questionsWithAnswers);
                    };

                    scope.d.next = function(){
                        var questionIndex = scope.d.currentSlide;
                        var lastQuestion =allQuestionWithAnswersArr[allQuestionWithAnswersArr.length - 1];
                        if(lastQuestion !== scope.d.questionsWithAnswers[questionIndex] && scope.d.answeredCount !== scope.d.questionsWithAnswers.length){
                            scope.settings.onNext();
                        }else{
                            var unansweredCount = scope.d.questionsWithAnswers.filter(function (question) {
                                return (angular.isUndefined(question.__questionStatus) || angular.isUndefined(question.__questionStatus.userAnswer));
                            }).length;

                            updateTimeSpentOnQuestion(scope.d.currentSlide);
                            setViewValue(scope.d.questionsWithAnswers);
                            scope.settings.onLastNext(unansweredCount);
                        }
                    };

                    function setSlideIndex(index) {
                        scope.d.currentSlide = index;
                    }

                    function updateTimeSpentOnQuestion(questionIndex) {
                        if (scope.settings.stopTime) {
                            return;
                        }

                        var newTimeSnapshot = Date.now();
                        var questionModel = scope.d.questionsWithAnswers[questionIndex];

                        questionModel.__timeSpent = (questionModel.__timeSpent || 0) + (newTimeSnapshot - lastTimeSnapshot);
                        lastTimeSnapshot = newTimeSnapshot;
                    }

                    function setViewValue(newValue) {
                        ngModelCtrl.$setViewValue(angular.copy(newValue));
                    }

                    scope.$watch('d.currentSlide', function(value, oldValue) {
                        if (toolBoxModalInstance) {
                            toolBoxModalInstance.scope.injections.blackboardData = scope.d.questionsWithAnswers[value].__blackboardData;
                            toolBoxModalInstance.scope.injections.currQuestionIndex = value;
                        }

                        if (scope.settings.viewMode !== EnumSrv.exerciseViewMode.review.enum) {
                            updateTimeSpentOnQuestion(oldValue);
                        }

                        var url = $location.url() + '/' + scope.d.questionsWithAnswers[value].id;
                        $analytics.pageTrack(url);
                    });

                    scope.$watch('settings.stopTime', function(stopTime) {
                        if (stopTime) {
                            updateTimeSpentOnQuestion(scope.d.currentSlide);
                        } else {
                            lastTimeSnapshot = Date.now();
                        }
                    });

                    scope.$watch('settings.isDisable', function(val) {
                         scope.d.isDisable = val;
                    });

                    scope.$on('$stateChangeStart',function(){
                        updateTimeSpentOnQuestion(scope.d.currentSlide);
                        setViewValue(scope.d.questionsWithAnswers);

                        if (toolBoxModalInstance) {
                            toolBoxModalInstance.close();
                        }
                    });
                }
            };
        }
    ]);
})(angular);

