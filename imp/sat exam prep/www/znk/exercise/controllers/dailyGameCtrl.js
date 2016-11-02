'use strict';

(function(angular) {

    angular.module('znk.sat').controller('DailyGameCtrl', ['$scope', '$stateParams', 'DailySrv', 'GameSrv', 'GameRulesSrv', 'EnumSrv', 'PopUpSrv', 'ExerciseResultSrv', 'ExerciseUtilsSrv', '$timeout', '$rootScope', 'exerciseEventsConst', '$q', '$ionicHistory', 'MobileSrv', 'HomeSrv', 'ExpSrv', 'expRulesConst', DailyGameCtrl]);

    function DailyGameCtrl($scope, $stateParams, DailySrv, GameSrv, GameRulesSrv, EnumSrv, PopUpSrv, ExerciseResultSrv, ExerciseUtilsSrv, $timeout, $rootScope, exerciseEventsConst, $q, $ionicHistory, MobileSrv, HomeSrv, ExpSrv, expRulesConst) {

        var _loadingModal = ExerciseUtilsSrv.showLoadingModal();

        var _game,
            _summaryModal,
            _introShowStartTime;

        $scope.d = {
            isMobile: MobileSrv.isMobile()
        };

        DailySrv.getDaily($stateParams.id).then(function (daily) {
            return GameSrv.get(daily.game.id);
        }).then(function (game) {
            $scope.d.dailyOrder = $stateParams.id;
            $scope.d.game = _game = game;
            $scope.d.categoryId = game.categoryId;
            return ExerciseResultSrv.get(EnumSrv.exerciseType.game.enum, game.id);
        }).then(function (gameResult) {

            if (angular.isUndefined(gameResult.exerciseId)) {
                angular.extend(gameResult, {
                    exerciseId:_game.id,
                    exerciseTypeId: EnumSrv.exerciseType.game.enum,
                    startedTime: Date.now(),
                    questionResults: _game.questions.map(function(question) {
                        return {questionId: question.id};
                    })
                });
            }

            $scope.d.exerciseSettings = {
                onLastNext: handleFinish,
                onQuestionAnswered: onQuestionAnswered,
                onSummary: showSummary,
                showInstructions: function(){
                    $scope.d.exerciseActions.hideToolbox();
                    $scope.intro.show = true;
                }
            };

            // measure the amount of time the user spent on the intro, and prevent counting that time
            if (!gameResult.isComplete) {
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
                typeId: _game.typeId,
                timeLimit: _game.time,
                timeToAddOnCorrect: _game.timeToAddPerQuestion,
                questionsCount: _game.questions.length,
                show: !gameResult.isComplete,
                buttonTitle:'NOW LET\'S TRY IT',
                onClose: function () {
                    this.show = false;
                    this.buttonTitle = 'Back To Questions';
                    gameResult.visitedIntro = true;
                    this.visited = true;
                    $scope.d.exerciseActions.showToolbox();
                }
            };

            $scope.d.gameResult = gameResult;

            $scope.d.questions = _game.questions;
            $scope.d.results = gameResult.questionResults;
            $scope.d.groupData = _game.questionsGroupData;

            $scope.d.gameRules = GameRulesSrv.getRules(_game.typeId);
            angular.extend($scope.d.gameRules, {
                timeLimit: _game.time,
                timeToAddOnCorrect: _game.timeToAddPerQuestion
            });

            if (gameResult.isComplete) {
                // wait for the exercise directive to load
                $timeout(function() {
                    showSummary();
                });
            } else if ($scope.d.gameRules.hasTimeLimit) {
                $scope.$watch('d.gameResult.gameDuration', function(value) {
                    if (value === $scope.d.gameRules.timeLimit) {
                        // time's up!
                        handleTimeOver();
                    }
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
            _summaryModal = _summaryModal || ExerciseUtilsSrv.createSummaryModal($scope.d.gameResult.exerciseTypeId, isolatedScope, $scope.d.questions, $scope.d.results, $scope.d.exerciseActions, disableContinue);
            _summaryModal.show();

            ExpSrv.getGameExp($scope.d.game.id).then(function(xpPoints){
                ExpSrv.getCompleteDailyExp($scope.d.dailyOrder).then(function(completeDailyPoints){
                    _summaryModal.scope.injections.exerciseArgs = {
                        xpPointsEnabled : ExpSrv.xpPointsEnabled,
                        xpPoints: xpPoints ? xpPoints.exp : 0,
                        isPerfect: xpPoints ? xpPoints.perfectScore : false,
                        perfectScore: expRulesConst.game.perfectScoreBonus,
                        isDailyCompleted: $scope.d.isDailyCompleted,
                        dailyCompleteScore: expRulesConst.daily.complete
                    };
                });
            });
        }

        function handleTimeOver () {
            var finishPromise = onFinish();

            var popupPromise;
            if (_game.typeId === EnumSrv.gameTypes.speedRun.enum) {
                popupPromise = PopUpSrv.speedRunGameOver('Review your work');
            } else if (_game.typeId === EnumSrv.gameTypes.checkpoint.enum) {
                popupPromise = PopUpSrv.checkPointGameOver('Review your work');
            } else if (_game.typeId === EnumSrv.gameTypes.pushIt.enum) {
                popupPromise = PopUpSrv.pushItGameOver('Review your work');
            }

            return popupPromise.then(function (selectedButton) {
                if (selectedButton === 'Review your work') {
                    showSummary(true);

                    return finishPromise.finally(function() {
                        _summaryModal.scope.injections.allowContinue = true;
                    });
                }
            });
        }

        function onQuestionAnswered(index, isCorrect) {
            if (isCorrect) {
                if ($scope.d.gameRules.hasTimeLimit) {
                    $scope.d.gameRules.timeLimit += $scope.d.gameRules.timeToAddOnCorrect;
                }
            } else {
                if (_game.typeId === EnumSrv.gameTypes.perfection.enum) {
                    var finishPromise = onFinish();
                    return PopUpSrv.perfectionGameOver('Review your work').then(function (dialogResult) {
                        if (dialogResult === 'Review your work') {
                            showSummary(true);

                            return finishPromise.finally(function() {
                                _summaryModal.scope.injections.allowContinue = true;
                            });
                        }
                    });
                }
            }
        }

        function onFinish() {
            $scope.d.gameResult.isComplete = true;
            $scope.d.gameResult.endedTime = Date.now();

            //broadcast that game was finished
            $rootScope.$broadcast(exerciseEventsConst.game.FINISH, $scope.d.game, $scope.d.gameResult);

            return save($scope.d.gameResult);
        }

        function save(exerciseResult) {
            return ExerciseUtilsSrv.updateDailyResultChild($stateParams.id, exerciseResult).then(function (dailyResults) {
                $scope.d.isDailyCompleted = dailyResults.isComplete || false;
                return exerciseResult.$save();
            });
        }

        function updateIntroTimeSpent() {
            $scope.d.gameResult.timeSpentIntro = ($scope.d.gameResult.timeSpentIntro || 0) + (Date.now() - _introShowStartTime);
        }

        var disableBack;
        $scope.goBack = function goBack() {
            if(disableBack){
                return;
            }
            disableBack = true;
            var promise = $q.when();
            if (!$scope.d.gameResult.isComplete) {
                if ($scope.intro.show) {
                    updateIntroTimeSpent();
                }
                promise = save($scope.d.gameResult);
            }
            promise.then(function(){
                $ionicHistory.goBack();
            });
        };
    }

})(angular);
