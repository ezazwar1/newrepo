'use strict';

(function (angular) {

    angular.module('znk.diagnostic').controller('DiagnosticExerciseCtrl', ['DiagnosticSrv', '$stateParams', 'diagnosticData', 'DiagnosticConst',
        '$timeout', 'EnumSrv', '$ionicSlideBoxDelegate', '$state', 'ScoringSrv', '$rootScope', 'examEventsConst','GoBackHardwareSrv', DiagnosticExerciseCtrl]);

    function DiagnosticExerciseCtrl(DiagnosticSrv, $stateParams, diagnosticData, DiagnosticConst, $timeout, EnumSrv, $ionicSlideBoxDelegate, $state, ScoringSrv, $rootScope, examEventsConst, GoBackHardwareSrv) {

        var vm = this;

        DiagnosticSrv.setMapQuestions(diagnosticData.exam.sections[$stateParams.subjectId].questions, $stateParams.questionId, diagnosticData.examExerciseResult.questionResults);

        GoBackHardwareSrv.registerGoHomeHandler();

        var questionsCount = 0;
        var questionDate;
        var dummySymbol = "dummySat";
        var intQuestionId = parseInt($stateParams.questionId);
        var questionPage = intQuestionId;
        var sectionSaveQuestionObj = diagnosticData.examResult.sectionSaveQuestion;
        var nextQuestion = DiagnosticSrv.getMapQuestions(false, false,
            sectionSaveQuestionObj ? sectionSaveQuestionObj[DiagnosticConst.subjects[$stateParams.subjectId].shortName] : false, intQuestionId, true);
        var saveCorrectAnswer;
        var hasAnswerd = false;
        var _section,
            _sectionResult,
            _exam,
            _examResult,
            _countdownLength = 3;

        _exam = diagnosticData.exam;
        _examResult = diagnosticData.examResult;
        _sectionResult = angular.copy(diagnosticData.examExerciseResult);
        _section = _exam.sections[$stateParams.subjectId];

        var sectionId = _exam.sections[$stateParams.subjectId].id;

        var startTime = Date.now();

        if (angular.isUndefined(_examResult.examId)) {
            angular.extend(_examResult, {
                examId: _exam.id,
                startedTime: startTime,
                sectionResults: {}
            });
        }

        var questionsArr;
        var dummyQuestion;
        var questionResultsArr;
        var dummyResult;

        nextQuestion.then(function(nextQuestion) {
            
            if(intQuestionId > 1) {
                questionsArr = [];
                questionResultsArr = [];
                for(var i = 1, ii = intQuestionId; i < ii; i++) {
                    dummyQuestion = angular.copy(nextQuestion.question);
                    dummyQuestion.id = dummySymbol + (999999999 - (500 - i));
                    questionsArr.push(dummyQuestion);
                    dummyResult = {id: dummyQuestion.id};
                    questionResultsArr.push(dummyResult);
                }
                questionsArr.push(nextQuestion.question);
                questionResultsArr.push(nextQuestion.question);
                dummyQuestion = angular.copy(nextQuestion.question);
                dummyQuestion.id = dummySymbol + 999999999;
                if(intQuestionId !== 5) {
                    questionsArr.push(dummyQuestion);
                    dummyResult = {id: dummySymbol + 999999999};
                    questionResultsArr.push(dummyResult);
                }
            } else {
                dummyQuestion = angular.copy(nextQuestion.question);
                dummyQuestion.id = dummySymbol + 999999999;
                questionsArr = [nextQuestion.question, dummyQuestion];
                dummyResult = {id: dummySymbol + 999999999};
                questionResultsArr = [nextQuestion.question, dummyResult];
            }


            if (angular.isUndefined(_sectionResult.exerciseId)) {
                angular.extend(_sectionResult, {
                    exerciseId: _section.id,
                    exerciseTypeId: EnumSrv.exerciseType.section.enum,
                    startedTime: startTime,
                    questionResults: questionResultsArr.map(function(question) {
                        return {questionId: question.id};
                    }),
                    duration: 0
                });

                _examResult.sectionResults[sectionId] = _sectionResult.$id;
            } else {
                angular.extend(_sectionResult, {
                    questionResults: questionResultsArr.map(function(question) {
                        return {questionId: question.id};
                    })
                });
            }

            _sectionResult.duration -= (_countdownLength * 1000);

            vm.d = {
                questions: questionsArr,
                examName: diagnosticData.exam.name,
                results: _sectionResult.questionResults,
                currentConst: DiagnosticConst.subjects[$stateParams.subjectId],
                exerciseSettings: {
                    onLastNext: handleFinish,
                    onNext: handleNext,
                    onQuestionAnswered: handleAnswer,
                    viewMode: EnumSrv.exerciseViewMode.answerOnly.enum,
                    toolBoxWrapperClass: "diagnostic-toolbox",
                    removePager: false,
                    noTour: true,
                    isDisable: true
                },
                subjectId: parseInt($stateParams.subjectId),
                groupData: diagnosticData.exam.sections[$stateParams.subjectId].questionsGroupData
            };

        });

        $timeout(function() {
            $ionicSlideBoxDelegate.enableSlide(false);
            questionDate =  Date.now();
            $timeout(function() {
                if(intQuestionId === 5) {
                    vm.d.exerciseActions.setSlideIndex(vm.d.questions.length - 1);
                } else {
                    vm.d.exerciseActions.setSlideIndex(vm.d.questions.length - 2);
                }
                vm.d.exerciseActions.showToolbox();
            });
        });


        function handleNext() {
            if(hasAnswerd) {
                vm.d.exerciseSettings.isDisable = true;
                var numberOfQuestionsLeft = 6 - intQuestionId;
                questionsCount = questionsCount + 1;

                if(questionsCount < numberOfQuestionsLeft) {

                    vm.d.hideExercise = true;

                    $timeout(function(){
                        questionPage = questionPage + 1;
                        var nextQuestion = DiagnosticSrv.getMapQuestions(saveCorrectAnswer, questionDate, false, questionPage);
                        nextQuestion.then(function(nextQuestion) {
                            
                            var nextQuestionCopy = angular.copy(nextQuestion.question);
                            nextQuestionCopy.id = (dummySymbol + 999999998 + questionsCount);
                            if((questionsCount + 1) === numberOfQuestionsLeft) {
                                vm.d.questions.pop();
                                vm.d.questions.push(nextQuestion.question);
                            } else {
                                vm.d.questions.pop();
                                vm.d.questions.push(nextQuestion.question);
                                vm.d.questions.push(nextQuestionCopy);
                            }
                            if((questionsCount + 1) === numberOfQuestionsLeft) {
                                vm.d.results.pop();
                                vm.d.results.push(DiagnosticSrv.setExamResults([nextQuestion.question])[0]);
                            } else {
                                vm.d.results.pop();
                                vm.d.results.push(DiagnosticSrv.setExamResults([nextQuestionCopy])[0]);
                                vm.d.results.push(DiagnosticSrv.setExamResults([nextQuestion.question])[0]);
                            }
                            vm.d.hideExercise = false;
                            vm.d.exerciseActions = null;
                            $timeout(function(){
                                $timeout(function(){
                                    hasAnswerd = false;
                                    if((questionsCount + 1) === numberOfQuestionsLeft) {
                                        vm.d.exerciseActions.setSlideIndex(vm.d.questions.length - 1);
                                    } else {
                                        vm.d.exerciseActions.setSlideIndex(vm.d.questions.length - 2);
                                    }
                                    $ionicSlideBoxDelegate.enableSlide(false);
                                    questionDate =  Date.now();
                                    vm.d.exerciseActions.showToolbox();
                                })
                            });
                        });
                    });
                }
            }
        }

        function handleAnswer(unansweredCount, isCorrect) {
            saveCorrectAnswer = isCorrect;
            hasAnswerd = true;
            vm.d.exerciseSettings.isDisable = false;
        }

        function handleFinish(unansweredCount) {
            if(hasAnswerd) {

                _sectionResult.isComplete = true;
                _sectionResult.endedTime = Date.now();
                _sectionResult.score = ScoringSrv.scoreSection(_section, _sectionResult);

                save(false);
            }
        }

        function save(notComplete, questionSave, callback) {

            var resultsCopy = angular.copy(vm.d.results);
            var questionsCopy = angular.copy(vm.d.questions);

            for(var i = resultsCopy.length -1; i >= 0 ; i--){
                if(String(resultsCopy[i].questionId).indexOf(dummySymbol) !== -1) {
                    vm.d.results.splice(i, 1);
                }
            }

            for(var a = resultsCopy.length -1; a >= 0 ; a--){
                if(String(questionsCopy[a].id).indexOf(dummySymbol) !== -1) {
                    vm.d.questions.splice(a, 1);
                }
            }

            if(angular.isUndefined(vm.d.results[vm.d.results.length - 1].isAnsweredCorrectly)) {
                questionSave = vm.d.questions[vm.d.questions.length - 1];
                vm.d.results.pop();
                vm.d.questions.pop();
            }

            if(angular.isDefined(diagnosticData.examExerciseResult.questionResults)) {
                vm.d.results = diagnosticData.examExerciseResult.questionResults.concat(vm.d.results);
            }

            angular.forEach(vm.d.results, function(results) {
                angular.forEach(diagnosticData.exam.sections[$stateParams.subjectId].questions, function(value) {
                    if(value.id === results.questionId) {
                        var isQuestion = false;
                        angular.forEach(vm.d.questions, function(question) {
                            if(question.id === value.id) {
                                isQuestion = true;
                            }
                        });

                        if(!isQuestion) {
                            vm.d.questions.push(value);
                        }
                    }
                });
            });

             _sectionResult.questionResults = angular.copy(vm.d.results);

            if(questionSave) {
                vm.d.questions.push(questionSave);
                vm.d.results.push({ questionId: questionSave.id  });
            }

            return _sectionResult.$save().then(function () {

                if(questionSave) {
                    vm.d.questions.pop();
                    vm.d.results.pop();
                }

                if(angular.isUndefined(_examResult.sectionComplete)) {

                    _examResult.sectionComplete = {
                        math:  false,
                        read:  false,
                        write: false
                    };

                }

                if(angular.isUndefined(_examResult.sectionSaveQuestion)) {

                    _examResult.sectionSaveQuestion = {
                        math:  false,
                        read:  false,
                        write: false
                    };

                }

                if(_sectionResult.questionResults.length < 5) {
                    notComplete = true;
                }

                if(!notComplete) {
                    _examResult.sectionComplete[DiagnosticConst.subjects[$stateParams.subjectId].shortName] = true;
                    _examResult.sectionSaveQuestion[DiagnosticConst.subjects[$stateParams.subjectId].shortName] = false;
                }

                if(questionSave) {
                    _examResult.sectionSaveQuestion[DiagnosticConst.subjects[$stateParams.subjectId].shortName] = questionSave;
                } else {
                    _examResult.sectionSaveQuestion[DiagnosticConst.subjects[$stateParams.subjectId].shortName] = false;
                }

                _examResult.$save().then(function() {
                    if(!notComplete) {
                        _section.questions = vm.d.questions;
                        _section.isDiagnostic = true;
                        $rootScope.$broadcast(examEventsConst.SECTION_FINISH,_section,_sectionResult, _exam);

                         if(Object.keys (_examResult.sectionComplete).length === Object.keys( _examResult.sectionResults).length){
                             _exam.isDiagnostic = true;

                             $rootScope.$broadcast(examEventsConst.COMPLETE  ,_exam);
                         }

                        $state.go("app.diagnostic", {}, {reload: true});
                    }
                    if(callback) {
                        callback();
                    }
                });
            });
        }

        var disable = false;
        vm.goBack = function() {
            if(!disable) {
                disable = true;
                var notComplete = false;
                var questionSave = false;
                _sectionResult.endedTime = Date.now();
                save(notComplete, questionSave, function() {
                    $state.go("app.home");
                });
            }
        };

    }

})(angular);
