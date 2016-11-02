'use strict';

(function(angular) {

    angular.module('znk.sat').controller('DailyPracticeCtrl', ['$scope', '$stateParams', 'DailyOrderSrv', 'PracticeSrv', 'EnumSrv', 'ExerciseResultSrv', 'PopUpSrv', 'ExerciseUtilsSrv', '$timeout', '$rootScope', 'exerciseEventsConst', '$q', '$ionicHistory', 'HomeSrv', 'ExpSrv', 'expRulesConst', DailyPracticeCtrl]);

    function DailyPracticeCtrl($scope, $stateParams, DailyOrderSrv, PracticeSrv, EnumSrv, ExerciseResultSrv, PopUpSrv, ExerciseUtilsSrv, $timeout, $rootScope, exerciseEventsConst, $q, $ionicHistory, HomeSrv, ExpSrv, expRulesConst) {

        var _loadingModal = ExerciseUtilsSrv.showLoadingModal();

        var _practice,
            _summaryModal,
            _introShowStartTime;

        $scope.d = {};

        DailyOrderSrv.get($stateParams.id).then(function (dailyOrder) {
            return PracticeSrv.getPersonalizedPracticeQuestions(dailyOrder.practiceId);
        }).then(function (practice) {
            $scope.d.dailyOrder = $stateParams.id;
            $scope.d.practice = _practice = practice;
            return ExerciseResultSrv.get(EnumSrv.exerciseType.practice.enum, practice.id);
        }).then(function (practiceResult) {

            if (angular.isUndefined(practiceResult.exerciseId)) {
                angular.extend(practiceResult, {
                    exerciseId:_practice.id,
                    exerciseTypeId: EnumSrv.exerciseType.practice.enum,
                    startedTime: Date.now(),
                    questionResults: _practice.questions.map(function(question) {
                        return {questionId: question.id};
                    })
                });
            }

            $scope.d.exerciseSettings = {
                onLastNext: handleFinish,
                onSummary: showSummary,
                showInstructions: function(){
                    $scope.d.exerciseActions.hideToolbox();
                    $scope.intro.show = true;
                }
            };

            // measure the amount of time the user spent on the intro, and prevent counting that time
            if (!practiceResult.isComplete) {
                $scope.$watch('intro.show', function (value) {
                    if (angular.isUndefined(value)) {
                        return;
                    }

                    if (value) {
                        $scope.d.exerciseSettings.stopTime = true;
                        _introShowStartTime = Date.now();

                        // if this happens 'too fast' then ZnkExerciseDrv won't have time to populate exerciseActions
                        // this will only happed on the initial load, so we don't care because it shouldn't show anyway
                        if ($scope.d.exerciseActions && $scope.d.exerciseActions.hideToolbox) {
                            $scope.d.exerciseActions.hideToolbox();
                        }
                    } else {
                        $scope.d.exerciseActions.showToolbox();
                        $scope.d.exerciseSettings.stopTime = false;
                        if (angular.isDefined(_introShowStartTime)) {
                            updateIntroTimeSpent();
                        }
                    }
                });
            }

            $scope.intro = {
                subjectId: _practice.subjectId,
                questionCount: _practice.questions.length,
                show: !practiceResult.isComplete,
                buttonTitle:'NOW LET\'S TRY IT',
                onClose: function () {
                    this.show = false;
                    this.buttonTitle = 'Back To Questions';
                    practiceResult.visitedIntro = true;
                    this.visited = true;
                    $scope.d.exerciseActions.showToolbox();
                }
            };

            $scope.d.practiceResult = practiceResult;

            $scope.d.questions = _practice.questions;
            $scope.d.results = practiceResult.questionResults;
            $scope.d.groupData = _practice.questionsGroupData;

            if (practiceResult.isComplete) {
                // wait for the exercise directive to load
                $timeout(function() {
                    showSummary();
                });
            }

            _loadingModal.close();
        });

        $scope.d.isSummaryVisible = function isSummaryVisible() {
            return _summaryModal && !_summaryModal.scope.hide;
        };

        function handleFinish(unansweredCount) {
            if (unansweredCount) {
                var dialogOptions = ExerciseUtilsSrv.getAreYouSureDialogOptions(unansweredCount);

                PopUpSrv.genericPopup(dialogOptions).then(function () {
                    finishAndShowSummary();
                });
            } else {
                finishAndShowSummary();
            }
        }

        function finishAndShowSummary() {
            var finishPromise = onFinish();
            showSummary(true);
            finishPromise.finally(function() {
                _summaryModal.scope.injections.allowContinue = true;
            });
        }

        function showSummary(disableContinue) {
            $scope.d.exerciseSettings.viewMode = EnumSrv.exerciseViewMode.review.enum;
            $scope.d.exerciseActions.hideToolbox();

            var isolatedScope = $scope.$new(true);
            _summaryModal = _summaryModal || ExerciseUtilsSrv.createSummaryModal($scope.d.practiceResult.exerciseTypeId, isolatedScope, $scope.d.questions, $scope.d.results, $scope.d.exerciseActions, disableContinue);
            _summaryModal.show();

            ExpSrv.getPracticeExp($scope.d.practice.id).then(function(xpPoints){
                ExpSrv.getCompleteDailyExp($scope.d.dailyOrder).then(function(completeDailyPoints){
                    _summaryModal.scope.injections.exerciseArgs = {
                        xpPointsEnabled : ExpSrv.xpPointsEnabled,
                        xpPoints: xpPoints ? xpPoints.exp : 0,
                        isPerfect: xpPoints ? xpPoints.perfectScore : false,
                        perfectScore: expRulesConst.practice.perfectScoreBonus,
                        dailyComplete: completeDailyPoints ? true : false,
                        dailyCompleteScore: completeDailyPoints ? completeDailyPoints.exp : 0
                    };
                });
            });
        }

        function onFinish() {
            $scope.d.practiceResult.isComplete = true;
            $scope.d.practiceResult.endedTime = Date.now();

            //broadcast that practice was finished
            $rootScope.$broadcast(exerciseEventsConst.practice.FINISH, _practice, $scope.d.practiceResult);

            return save($scope.d.practiceResult);
        }

        function save(exerciseResult) {
            return ExerciseUtilsSrv.updateDailyResultChild($stateParams.id, exerciseResult).then(function () {
                return exerciseResult.$save();
            });
        }

        function updateIntroTimeSpent() {
            $scope.d.practiceResult.timeSpentIntro = ($scope.d.practiceResult.timeSpentIntro || 0) + (Date.now() - _introShowStartTime);
        }

        var disableBack;
        $scope.goBack = function goBack() {
            if(disableBack){
                return;
            }
            disableBack = true;
            var promise = $q.when();
            if (!$scope.d.practiceResult.isComplete) {
                if ($scope.intro.show) {
                    updateIntroTimeSpent();
                }
                promise = save($scope.d.practiceResult);
            }
            promise.then(function(){
                $ionicHistory.goBack();
            });
        };
    }

})(angular);
