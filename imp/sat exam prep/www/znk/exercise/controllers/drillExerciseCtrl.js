'use strict';

(function (angular) {

    angular.module('znk.sat').controller('DrillExerciseCtrl', ['$scope', '$state', '$q', '$stateParams', 'DrillSrv', 'ExerciseProgressSrv', 'ExerciseResultSrv', 'EnumSrv', 'PopUpSrv', 'ExerciseUtilsSrv', '$timeout', '$rootScope', 'drillEventsConst', '$ionicHistory', 'ExpSrv', 'expRulesConst', 'DailySrv', DrillExerciseCtrl]);

    function DrillExerciseCtrl($scope, $state, $q, $stateParams, DrillSrv, ExerciseProgressSrv, ExerciseResultSrv, EnumSrv, PopUpSrv, ExerciseUtilsSrv, $timeout, $rootScope, drillEventsConst, $ionicHistory, ExpSrv, expRulesConst, DailySrv) {

        var _loadingModal = ExerciseUtilsSrv.showLoadingModal(),
            _summaryModal,
            disableBack;

        $scope.d = {
            dailyOrder: $stateParams.id
        };

        DailySrv.getDaily($scope.d.dailyOrder).then(function (dailyOrder) {
            $scope.d.drillId = dailyOrder.drill.id;

            DrillSrv.markAsSeen($scope.d.drillId);

            var getDrillPromise = DrillSrv.get($scope.d.drillId);
            var getResultPromise = ExerciseResultSrv.get(EnumSrv.exerciseType.drill.enum, $scope.d.drillId);
            $scope.d.setTitleProm = getResultPromise;

            $q.all([getDrillPromise, getResultPromise]).then(function (resolvedArr) {
                var drill = resolvedArr[0],
                    drillResult = resolvedArr[1];

                $scope.d.drill = drill;

                if (angular.isUndefined(drillResult.exerciseId)) {
                    angular.extend(drillResult, {
                        exerciseId: drill.id,
                        exerciseTypeId: EnumSrv.exerciseType.drill.enum,
                        startedTime: Date.now(),
                        questionResults: drill.questions.map(function (question) {
                            return { questionId: question.id };
                        })
                    });
                }

                $scope.d.drillResult = drillResult;

                $scope.d.results = drillResult.questionResults;
                $scope.d.questions = drill.questions;
                $scope.d.groupData = drill.questionsGroupData;

                $scope.d.exerciseSettings = {
                    onLastNext: handleFinish,
                    onSummary: showSummary
                };

                // TODO: perhaps we should watch until: (scope.d.exerciseSettings.loaded === true) as an indication for the directive being fully loaded
                if (drillResult.isComplete) {
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
                $timeout(function(){
                    _loadingModal.close();
                },500);
            });
        });

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
            finishPromise.then(function() {
                showSummary(true);
            }).finally(function() {
                _summaryModal.scope.injections.allowContinue = true;
            });
        }

        function showSummary(disableContinue) {
            $scope.d.exerciseSettings.viewMode = EnumSrv.exerciseViewMode.review.enum;
            $scope.d.exerciseActions.hideToolbox();

            var isolatedScope = $scope.$new(true);
            _summaryModal = _summaryModal || ExerciseUtilsSrv.createSummaryModal($scope.d.drillResult.exerciseTypeId, isolatedScope, $scope.d.questions, $scope.d.results, $scope.d.exerciseActions, disableContinue);
            _summaryModal.show();
            ExpSrv.getDrillExp($scope.d.drill.id).then(function(xpPoints){
                _summaryModal.scope.injections.exerciseArgs = {
                    xpPointsEnabled : ExpSrv.xpPointsEnabled,
                    xpPoints: xpPoints ? xpPoints.exp : 0,
                    isPerfect: xpPoints ? xpPoints.perfectScore : false,
                    perfectScore: expRulesConst.drill.perfectScoreBonus,
                    isDailyCompleted: $scope.d.isDailyCompleted,
                    dailyCompleteScore: expRulesConst.daily.complete
                };
            });
        }

        function onFinish() {
            var drillResult = $scope.d.drillResult;

            drillResult.isComplete = true;
            drillResult.endedTime = Date.now();

            //broadcast that drill was finish
            $rootScope.$broadcast(drillEventsConst.FINISH,$scope.d.drill,$scope.d.drillResult);



            return save(drillResult).then(function() {
                //mark drill as completed
                return ExerciseProgressSrv.markDrillAsCompleted(drillResult.exerciseId);
            });
        }

        function save(exerciseResult) {
            return ExerciseUtilsSrv.updateDailyResultChild($scope.d.dailyOrder, exerciseResult).then(function (dailyResults) {
                $scope.d.isDailyCompleted = dailyResults.isComplete || false;
                return exerciseResult.$save();
            });
        }

        $scope.d.isSummaryVisible = function isSummaryVisible() {
            return _summaryModal && !_summaryModal.scope.hide;
        };

        $scope.goBack = function goBack() {
            if(disableBack){
                return;
            }
            disableBack = true;
            var promise = $q.when();
            if (!$scope.d.drillResult.isComplete) {
                promise = save($scope.d.drillResult);
            }
            promise.then(function(){
                $ionicHistory.goBack();
            });
        };
    }

})(angular);
