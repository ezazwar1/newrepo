'use strict';

(function(angular) {

    angular.module('znk.sat').controller('DailyTutorialCtrl', ['$scope', '$stateParams', 'DailySrv', 'TutorialSrv', 'ExerciseResultSrv', 'EnumSrv', 'ExerciseProgressSrv', 'PopUpSrv', 'ExerciseUtilsSrv', '$rootScope', 'exerciseEventsConst', '$q', '$ionicHistory', 'MobileSrv', 'ExpSrv', 'expRulesConst', 'ZnkModalSrv', '$timeout', DailyTutorialCtrl]);

    function DailyTutorialCtrl($scope, $stateParams, DailySrv, TutorialSrv, ExerciseResultSrv, EnumSrv, ExerciseProgressSrv, PopUpSrv, ExerciseUtilsSrv,$rootScope, exerciseEventsConst, $q, $ionicHistory, MobileSrv, ExpSrv, expRulesConst, ZnkModalSrv, $timeout) {

        var _loadingModal = ExerciseUtilsSrv.showLoadingModal();

        var _tutorial,
            _summaryModal,
            _introShowStartTime;

        $scope.d = {
            isMobile: MobileSrv.isMobile(),
            exerciseTypeId:  EnumSrv.exerciseType.tutorial.enum,
            exerciseActions: {
                hideInstructionsButton: true
            }
        };

        DailySrv.getDaily($stateParams.id).then(function (dailyOrder) {
            return TutorialSrv.get(dailyOrder.tutorial.id);
        }).then(function (tutorial) {
            $scope.d.dailyOrder = $stateParams.id;
            $scope.d.tutorial = _tutorial = tutorial;
            $scope.d.headerBarTitle = 'Workout' + $scope.d.dailyOrder + ' : ' + $scope.d.tutorial.name;
            return ExerciseResultSrv.get(EnumSrv.exerciseType.tutorial.enum, tutorial.id);
        }).then(function (tutorialResult) {
            if (angular.isUndefined(tutorialResult.exerciseId)) {
                angular.extend(tutorialResult, {
                    exerciseId:_tutorial.id,
                    exerciseTypeId: EnumSrv.exerciseType.tutorial.enum,
                    startedTime: Date.now(),
                    questionResults: _tutorial.questions.map(function(question) {
                        return {questionId: question.id};
                    })
                });
            }

            $scope.d.exerciseSettings = {
                onLastNext: handleFinish,
                onSummary: showSummary,
                showInstructions: $scope.showIntro
            };

            if (tutorialResult.isComplete) {
                $scope.d.exerciseSettings.viewMode = EnumSrv.exerciseViewMode.review.enum;
            }

            // measure the amount of time the user spent on the intro, and prevent counting that time
            if (!tutorialResult.isComplete) {
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
                name: _tutorial.name,
                content: _tutorial.content,
                questionCount: _tutorial.questions.length,
                show: true,
                buttonTitle:'NOW LET\'S TRY IT',
                onClose: function () {
                    this.show = false;
                    this.buttonTitle = 'Back To Questions';
                    tutorialResult.visitedIntro = true;
                    this.visited = true;
                    $scope.d.exerciseActions.showToolbox();
                    $scope.d.exerciseActions.hideInstructionsButton = false;
                }
            };
            $scope.d.tutorialResult = tutorialResult;
            $scope.d.questions = _tutorial.questions;
            $scope.d.results = tutorialResult.questionResults;
            $scope.d.groupData = _tutorial.questionsGroupData;

            if (tutorialResult.isComplete) {
                $scope.intro.show = false;
                showSummary(true);
            }

            _loadingModal.close();
        });

        $scope.d.isSummaryVisible = function isSummaryVisible() {
            return Boolean(_summaryModal && !_summaryModal.scope.hide);
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
            finishPromise.then(function(){
                showSummary(true);
            }).finally(function() {
                _summaryModal.scope.injections.allowContinue = true;
            });
        }

        function showSummary(disableContinue) {
            $scope.d.exerciseSettings.viewMode = EnumSrv.exerciseViewMode.review.enum;
            $scope.d.exerciseActions.hideInstructionsButton = true;
            if ($scope.d.exerciseActions && $scope.d.exerciseActions.hideToolbox) {
                $scope.d.exerciseActions.hideToolbox();
            }

            var isolatedScope = $scope.$new(true);
            _summaryModal = _summaryModal || ExerciseUtilsSrv.createSummaryModal($scope.d.tutorialResult.exerciseTypeId, isolatedScope, $scope.d.questions, $scope.d.results, $scope.d.exerciseActions, disableContinue);
            _summaryModal.show();

            ExpSrv.getTutorialExp($scope.d.tutorial.id).then(function(xpPoints){
                _summaryModal.scope.injections.exerciseArgs = {
                    xpPointsEnabled : ExpSrv.xpPointsEnabled,
                    xpPoints: xpPoints ? xpPoints.exp : 0,
                    isPerfect: xpPoints ? xpPoints.perfectScore : false,
                    perfectScore: expRulesConst.tutorial.perfectScoreBonus,
                    isDailyCompleted: $scope.d.isDailyCompleted,
                    dailyCompleteScore: expRulesConst.daily.complete
                };
            });
        }

        $scope.showIntro = function(fromUi){

            var childScope = $scope.$new(true);
            childScope.data = {
                show: $scope.intro.show,
                content: $scope.intro.content,
                name: $scope.intro.name,
                id: $scope.d.tutorial.id,
                questionCount: $scope.intro.questionCount,
                visited: $scope.d.tutorialResult.visitedIntro,
                videoType: EnumSrv.exerciseType.tutorial.enum,
                close: (function(){
                    var enabled;
                    $timeout(function(){
                        enabled = true;
                    },1000,false);

                    return function(){
                        if(enabled){
                            childScope.data.show=false;
                            childScope.close();
                        }
                    }
                })()
            };

            var modalOptions = {
                templateUrl: 'znk/exercise/templates/tutorialIntroModal.html',
                scope: childScope,
                dontCentralize: true,
                blurMainContent: true,
                wrapperClass: 'practice-instructions'
            };

            ZnkModalSrv.modal(modalOptions);
        };

        function onFinish() {
            $scope.d.tutorialResult.isComplete = true;
            $scope.d.tutorialResult.endedTime = Date.now();

            //broadcast that tutorial was finish
            $rootScope.$broadcast(exerciseEventsConst.tutorial.FINISH,$scope.d.tutorial,$scope.d.tutorialResult);

            return save($scope.d.tutorialResult).then(function() {
                return ExerciseProgressSrv.markTutorialAsCompleted(_tutorial.id);
            });
        }

        function save(exerciseResult) {
            return ExerciseUtilsSrv.updateDailyResultChild($stateParams.id, exerciseResult).then(function (dailyResults) {
                $scope.d.isDailyCompleted = dailyResults.isComplete || false;
                return exerciseResult.$save();
            });
        }

        function updateIntroTimeSpent() {
            $scope.d.tutorialResult.timeSpentIntro = ($scope.d.tutorialResult.timeSpentIntro || 0) + (Date.now() - _introShowStartTime);
        }

        var disableBack;
        $scope.goBack = function goBack() {
            if(disableBack){
                return;
            }
            disableBack = true;
            var promise = $q.when();
            if (!$scope.d.tutorialResult.isComplete) {
                if ($scope.intro.show) {
                    updateIntroTimeSpent();
                }
                promise = save($scope.d.tutorialResult);
            }
            promise.then(function(){
                $ionicHistory.goBack();
            });
        };
    }

})(angular);
