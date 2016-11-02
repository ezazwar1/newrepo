'use strict';

(function (angular) {

    angular.module('znk.sat').controller('ExamExerciseCtrl', ['$scope', '$stateParams', '$q', 'ExamSrv', 'ExamResultSrv', 'ExerciseResultSrv', 'ExerciseProgressSrv', 'ScoringSrv', 'PracticeInstructionsSrv', 'EnumSrv', 'PopUpSrv', 'ExerciseUtilsSrv', '$timeout', 'ZnkModalSrv', '$rootScope', 'examEventsConst', '$ionicHistory', 'ExpSrv', 'expRulesConst', 'StoreRateSrv','SharedModalsSrv', ExamExerciseCtrl]);

    function ExamExerciseCtrl($scope, $stateParams, $q, ExamSrv, ExamResultSrv, ExerciseResultSrv, ExerciseProgressSrv, ScoringSrv, PracticeInstructionsSrv, EnumSrv, PopUpSrv, ExerciseUtilsSrv, $timeout, ZnkModalSrv, $rootScope, examEventsConst, $ionicHistory, ExpSrv, expRulesConst, StoreRateSrv, SharedModalsSrv) {
        var _showCountdown = ($stateParams.showCountdown === 'true'),
            _countdownLength = 3,
            options = {};

        if (_showCountdown) {
            options = {
                scope: angular.extend($scope.$new(true), {
                    d: {
                        countdown: _countdownLength
                    }
                })
            };
        }

        var _spinnerModal = SharedModalsSrv.showloadingSpinnerModal();

        $scope.ui = {
            showLearn: false
        };

        $scope.d = { };

        var _section,
            _sectionResult,
            _exam,
            _examResult,
            _summaryModal;

        var promises = [ExamSrv.get($stateParams.id),
                        ExamResultSrv.get($stateParams.id),
                        ExerciseResultSrv.get(EnumSrv.exerciseType.section.enum, $stateParams.sectionId)];

        $q.all(promises).then(function(resolvedArr) {
            $scope.d.exam = _exam = resolvedArr[0];
            _examResult = resolvedArr[1];
            _sectionResult = resolvedArr[2];

            var sectionId = (parseInt($stateParams.sectionId) || _exam.sections[0].id);

            _exam.sections.every(function (element) {
                if (element.id === sectionId) {
                    $scope.d.examSection = _section = element;
                    // break the loop
                    return false;
                }

                return true;
            });
            _spinnerModal.close();
            var startTime = Date.now();

            if (angular.isUndefined(_examResult.examId)) {
                angular.extend(_examResult, {
                    examId: _exam.id,
                    startedTime: startTime,
                    sectionResults: {}
                });
            }

            PracticeInstructionsSrv.getInstructions().then(function (instructions) {
                $scope.ui.instructionsMarkup = instructions[_section.subjectId].markup;
            });

            if (angular.isUndefined(_sectionResult.exerciseId)) {
                angular.extend(_sectionResult, {
                    exerciseId: _section.id,
                    exerciseTypeId: EnumSrv.exerciseType.section.enum,
                    startedTime: startTime,
                    questionResults: _section.questions.map(function(question) {
                        return {questionId: question.id};
                    }),
                    duration: 0
                });

                _examResult.sectionResults[sectionId] = _sectionResult.$id;
            }
            $scope.d.sectionResult = _sectionResult;

            $scope.d.results = _sectionResult.questionResults;
            $scope.d.questions = _section.questions;
            $scope.d.groupData = _section.questionsGroupData;
            $scope.d.allocatedTimeMillis = _section.time;

            $scope.d.exerciseSettings = {
                onLastNext: handleFinish,
                onSummary: showSummary,
                viewMode: EnumSrv.exerciseViewMode.answerOnly.enum,
                showInstructions: $scope.showInstructions.bind($scope)
            };

            // TODO: perhaps we should watch until: (scope.d.exerciseSettings.loaded === true) as an indication for the directive being fully loaded
            if (_sectionResult.isComplete) {
                // wait for the exercise directive to load
                $timeout(function() {
                    showSummary();
                });
            } else {
                $timeout(function() {
                    if($scope.d.exerciseActions && $scope.d.exerciseActions.showToolbox){
                        $scope.d.exerciseActions.showToolbox();
                    }else{
                        $timeout(function(){
                            if($scope.d.exerciseActions && $scope.d.exerciseActions.showToolbox){
                                $scope.d.exerciseActions.showToolbox();
                            }
                        },250);
                    }

                });
            }
        });

        $scope.d.isSummaryVisible = function isSummaryVisible() {
            return Boolean(_summaryModal && !_summaryModal.scope.hide);
        };

        function handleFinish(unansweredCount) {
            var promise = $q.when('nothing');


            if (unansweredCount) {
                var dialogOptions = ExerciseUtilsSrv.getAreYouSureDialogOptions(unansweredCount);

                promise = PopUpSrv.genericPopup(dialogOptions);
            }

            return promise.then(function () {
                return finishAndShowSummary();
            });
        }

        function finishAndShowSummary() {
            var finishPromise = onFinish();
            showSummary(true);
            return finishPromise.finally(function() {
                _summaryModal.scope.injections.allowContinue = true;
            });
        }

        function showSummary(disableContinue) {
            //stop timer counting
            $scope.d.stopTimer = true;
            $scope.d.exerciseSettings.viewMode = EnumSrv.exerciseViewMode.review.enum;
            $scope.d.exerciseActions.hideToolbox();

            //build summary data
            var exerciseArgs = {
                exerciseId: $stateParams.id,
                duration:  _sectionResult.duration,
                time: $scope.d.allocatedTimeMillis,
                subjectName: EnumSrv.subject.getEnumMap()[_section.subjectId]
            };
            angular.extend(exerciseArgs, _subjectSummary());

            ExpSrv.getExamSectionExp($stateParams.id, $scope.d.examSection.order).then(function(xpPoints){
                var newPoints = 0;

                if(angular.isDefined(xpPoints)){
                    newPoints = xpPoints.exp - expRulesConst.exam.section.complete;
                    if(xpPoints.perfectScore){
                        newPoints = newPoints -  expRulesConst.exam.section.perfectScoreBonus;
                    }
                }

                var points = {
                    xpPointsEnabled : ExpSrv.xpPointsEnabled,
                    xpPoints: newPoints,
                    isPerfect: xpPoints ? xpPoints.perfectScore : false,
                    perfectScore: expRulesConst.exam.section.perfectScoreBonus,
                    completeExp: (_sectionResult.exerciseTypeId === 4) ? {
                            score: expRulesConst.exam.section.complete, text: 'section completion'
                        } : {
                            score: expRulesConst.daily.complete, text: 'workout completion'
                        }
                };

                angular.extend(exerciseArgs, points);

                var isolatedScope = $scope.$new(true);
                _summaryModal = ExerciseUtilsSrv.createSummaryModal(_sectionResult.exerciseTypeId, isolatedScope, $scope.d.questions, $scope.d.results, $scope.d.exerciseActions, disableContinue);
                _summaryModal.scope.injections.exerciseArgs = exerciseArgs;
                _summaryModal.show();
            });

            function _subjectSummary(){

                var subjectCompleted = false,
                    score;

                switch(_section.subjectId){
                    case 0:
                        subjectCompleted = _examResult.mathScore ? true : false;
                        score =_examResult.mathScore;
                        break;
                    case 1:
                        subjectCompleted = _examResult.readScore ? true : false;
                        score =_examResult.readScore;
                        break;
                    case 2:
                        subjectCompleted = _examResult.writeScore ? true : false;
                        score =_examResult.writeScore;
                        break;
                }

                return {
                    subjectCompleted:  subjectCompleted,
                    score: score
                };
            }
        }

        function onFinish() {
            //stop timer counting
            $scope.d.stopTimer = true;
            // mark the section as completed
            _sectionResult.isComplete = true;
            _sectionResult.endedTime = Date.now();
            _sectionResult.score = ScoringSrv.scoreSection(_section, _sectionResult);

            //broadcast that exam section was complete
            $rootScope.$broadcast(examEventsConst.SECTION_FINISH,$scope.d.examSection,$scope.d.sectionResult,$scope.d.exam);

            // check if (1) all sections are done, (2) an entire subject is completed
            var resultsPromiseArr = Object.keys(_examResult.sectionResults).reduce(function (prev, curr) {
                return prev.concat(ExerciseResultSrv.getByKey(_examResult.sectionResults[curr]));
            }, []);

            return $q.all(resultsPromiseArr).then(function (resultsArr) {
                var data = {
                    hasActiveSections: false,
                    subjectCompleted: true,
                    sectionsOfSameSubject: []
                };

                var resultsMap = resultsArr.reduce(function(prev, cur) {
                    prev[cur.exerciseId] = cur;
                    return prev;
                }, {});

                _exam.sections.forEach(function (curSection) {
                    var curResult = (curSection.id === _sectionResult.exerciseId ? _sectionResult : resultsMap[curSection.id]);

                    if (!curResult || !curResult.isComplete) {
                        data.hasActiveSections = true;
                    }

                    // the subject info is only stored in the section and not in the results, but the indexes are aligned so that ok
                    if (curSection.subjectId === _section.subjectId) {
                        if (!curResult || !curResult.isComplete) {
                            data.subjectCompleted = false;
                        } else {
                            data.sectionsOfSameSubject.push(curResult);
                        }
                    }
                });

                return data;
            }).then(function (data) {
                if (data.subjectCompleted) {
                    var scoresArray = data.sectionsOfSameSubject.map(function(section) {
                        return section.score;
                    });

                    // update the exam result
                    var subjectScorePropName =  ScoringSrv.getSubjectScorePropertyName(_section.subjectId);
                    return ScoringSrv.scoreSubject(_section.subjectId, scoresArray).then(function(score) {
                        _examResult[subjectScorePropName] = score;

                    }).then(function() {
                        return data;
                    });
                } else {
                    return data;
                }
            }).then(function (data) {
                // finalize exam model
                if (!data.hasActiveSections) {
                    _examResult.isComplete = true;
                    _examResult.endedTime = Date.now();
                    ExerciseProgressSrv.markExamAsCompleted(_examResult.examId);

                    //broadcast that exam was complete
                    $rootScope.$broadcast(examEventsConst.COMPLETE,$scope.d.exam);

                    //rate app
                    StoreRateSrv.rate();

                    _examResult.score = 0;
                    var scoredSections = ScoringSrv.getAllSubjectScoreSectionNames();
                    for (var subjectId in scoredSections) {
                        var subjectScoreProp = scoredSections[subjectId];
                        _examResult.score += _examResult[subjectScoreProp];
                    }
                }
            }).then(function() {
                return save();
            });
        }

        function save() {
            return _sectionResult.$save().then(function () {
                return _examResult.$save();
            });
        }

        $scope.showInstructions = function showInstructions() {
            var childScope = $scope.$new(true);
            childScope.content = $scope.ui.instructionsMarkup;

            var modalOptions = {
                templateUrl: 'znk/exercise/templates/practiceInstructions.html',
                scope: childScope,
                dontCentralize: true,
                blurMainContent: true,
                showCloseBtn: true,
                wrapperClass: 'practice-instructions'
            };

            ZnkModalSrv.modal(modalOptions);
        };

        $scope.goBack = function goBack() {
            if($scope.d.disableBack){
                return;
            }
            $scope.d.disableBack = true;
            var promise = (_sectionResult.isComplete ? $q.when() : save());
            promise.then(function(){
                $ionicHistory.goBack();
            });
        };

        var durationWatcherDestroyer = $scope.$watch('d.sectionResult.duration',function(duration){
            if(!_sectionResult){
                return;
            }else if(_sectionResult.isComplete){
                durationWatcherDestroyer();
                return;
            }

            if(duration && _section && _section.time < duration){
                durationWatcherDestroyer();
                var timesUpPopupTitle = 'Time\'s up!',
                    timesUpPopupContent = 'To best simulate a real SAT, we recommend you to finish this section at this point.If you prefer to continue and complete all the questions, you may do so.',
                    timesUpPopupFinishBtnTitle = 'Finish Section',
                    timesUpPopupContinueBtnTitle = 'Continue';
                PopUpSrv.warning(timesUpPopupTitle,timesUpPopupContent,timesUpPopupFinishBtnTitle,timesUpPopupContinueBtnTitle)
                    .promise.then(function(res){
                        finishAndShowSummary();
                    });
            }
        });
    }

})(angular);
