'use strict';

(function(angular) {

    angular.module('znk.sat').factory('ExerciseUtilsSrv', ['$q', 'DailyResultSrv', 'ExerciseResultSrv', 'EnumSrv', 'ZnkModalSrv','$rootScope', 'exerciseEventsConst', 'ENV', 'StoreRateSrv', 'GoBackHardwareSrv', '$ionicScrollDelegate', 'TimelineSrv', 'MobileSrv', 'SubjectEnum', ExerciseUtilsSrv]);

    function ExerciseUtilsSrv($q, DailyResultSrv, ExerciseResultSrv, EnumSrv, ZnkModalSrv, $rootScope, exerciseEventsConst, ENV, StoreRateSrv, GoBackHardwareSrv, $ionicScrollDelegate, TimelineSrv, MobileSrv, SubjectEnum) {

        function getAreYouSureDialogOptions(unansweredCount) {
            var unansweredText = unansweredCount + ' unanswered question' + (unansweredCount > 1 ? 's' : '');

            return {
                type: 'warning',
                title: 'Done?',
                content: 'You still have ' + unansweredText + '. Are you sure you\'re done?',
                showCancelButton: true,
                cancelButtonText: 'Go Back',
                confirmButtonText: 'I\'m Sure'
            };
        }

        function areDailyPartsCompleted(dailyOrderId, partsTypeIdsArr) {
            return DailyResultSrv.get(dailyOrderId).then(function (dailyResult) {
                return partsTypeIdsArr.reduce(function (prev, cur) {
                    switch(cur) {
                        case EnumSrv.exerciseType.tutorial.enum:
                            if (dailyResult.tutorialResult) {
                                prev.push(ExerciseResultSrv.getByKey(dailyResult.tutorialResult));
                            }
                            break;
                        case EnumSrv.exerciseType.drill.enum:
                            if (dailyResult.drillResult) {
                                prev.push(ExerciseResultSrv.getByKey(dailyResult.drillResult));
                            }
                            break;
                        case EnumSrv.exerciseType.game.enum:
                            if (dailyResult.gameResult) {
                                prev.push(ExerciseResultSrv.getByKey(dailyResult.gameResult));
                            }
                            break;
                    }

                    return prev;
                }, []);
            }).then(function (exerciseResultsPromiseArr) {
                if (exerciseResultsPromiseArr.length !== partsTypeIdsArr.length) {
                    return false;
                } else {
                    return $q.all(exerciseResultsPromiseArr).then(function (resolvedResultsArr) {
                        return resolvedResultsArr.every(function (exerciseResult) {
                            return exerciseResult.isComplete;
                        });
                    });
                }
            });
        }

        function updateDailyResultChild (dailyOrderId, exerciseResult) {
            return DailyResultSrv.get(dailyOrderId).then(function (dailyResult) {

                var otherPartsTypeIdsArr = [EnumSrv.exerciseType.tutorial.enum,
                                            EnumSrv.exerciseType.drill.enum,
                                            EnumSrv.exerciseType.game.enum];

                switch(exerciseResult.exerciseTypeId) {
                    case EnumSrv.exerciseType.tutorial.enum:
                        dailyResult.tutorialResult = exerciseResult.$id;
                        otherPartsTypeIdsArr.splice(otherPartsTypeIdsArr.indexOf(EnumSrv.exerciseType.tutorial.enum), 1);
                        break;
                    case EnumSrv.exerciseType.drill.enum:
                        dailyResult.drillResult = exerciseResult.$id;
                        otherPartsTypeIdsArr.splice(otherPartsTypeIdsArr.indexOf(EnumSrv.exerciseType.drill.enum), 1);
                        break;
                    case EnumSrv.exerciseType.game.enum:
                        dailyResult.gameResult = exerciseResult.$id;
                        otherPartsTypeIdsArr.splice(otherPartsTypeIdsArr.indexOf(EnumSrv.exerciseType.game.enum), 1);
                        break;
                }

                if (angular.isUndefined(dailyResult.dailyOrderId)) {
                    angular.extend((dailyResult), {
                        dailyOrderId: dailyOrderId,
                        startedTime: Date.now()
                    });
                }

                return areDailyPartsCompleted(dailyOrderId, otherPartsTypeIdsArr).then(function (areOtherPartsDone) {

                    if (areOtherPartsDone && exerciseResult.isComplete) {
                        dailyResult.isComplete = true;
                        dailyResult.endedTime = Date.now();

                        //broadcast that daily was complete
                        $rootScope.$broadcast(exerciseEventsConst.daily.COMPLETE,{orderId: +dailyOrderId},dailyResult);

                        if(+dailyOrderId === 3){
                            StoreRateSrv.rate();
                        }
                    }

                    return dailyResult;
                });
            }).then(function (dailyResult) {
                return dailyResult.$save();
            });
        }

        function createSummaryModal(exerciseTypeId, newScope, questions, results, exerciseActions, disableContinue) {

            var options = {
                dontCentralize: true,
                templateUrl: 'znk/exercise/templates/summary.html',
                scope: newScope,
                ctrl: 'SummaryCtrl',
                hideBackdrop: true
            };

            var modal = ZnkModalSrv.modal(options);
            var isMobile = MobileSrv.isMobile();
            var subjectId = questions[0].subjectId;
            var exerciseId = questions[0].parentId;

            TimelineSrv.getEstimatedScores(exerciseId, subjectId).then(function(estimatedScores) {

                modal.scope.d.timeLineData = { data: estimatedScores[subjectId], id: subjectId };

                modal.scope.d.timelineSubjectTitle = (subjectId === SubjectEnum.reading.enum) ? "Reading" : SubjectEnum.getEnumMap()[subjectId];

                var optionsPerDevice = {
                    height: 150,
                    distance: 90,
                    subPoint: 25,
                    upOrDown: 75,
                    yUp: 85,
                    yDown: 35
                };

                if(!isMobile) {
                    optionsPerDevice = {
                        height: 200,
                        distance: 115,
                        upOrDown: 100,
                        subPoint: 35,
                        yUp: 95,
                        yDown: 50
                    };
                }

                modal.scope.d.options = {
                    colors: ['#75cbe8', '#f9d41b', '#ff5895'],
                    colorId: subjectId,
                    isMobile: isMobile,
                    height: optionsPerDevice.height,
                    type: 'multi',
                    isMax: true,
                    max: 800,
                    min: 200,
                    subPoint: optionsPerDevice.subPoint,
                    distance: optionsPerDevice.distance,
                    lineWidth: 2,
                    isSummery: exerciseId,
                    numbers: {
                        font: '200 12px Lato',
                        fillStyle: '#4a4a4a'
                    },
                    images: TimelineSrv.getImages(),
                    onFinish: function(obj) {

                        var summeryScore = obj.data.summeryScore;
                        var x = summeryScore.lineTo.x - 50;
                        var y = (summeryScore.lineTo.y < optionsPerDevice.upOrDown) ? summeryScore.lineTo.y + optionsPerDevice.yDown : summeryScore.lineTo.y - optionsPerDevice.yUp;
                        var angleDeg;
                        if(summeryScore.next) {
                             angleDeg = Math.atan2(summeryScore.lineTo.y - summeryScore.next.y, summeryScore.lineTo.x - summeryScore.next.x) * 180 / Math.PI;
                        }

                        if(angleDeg && angleDeg < -optionsPerDevice.upOrDown && summeryScore.lineTo.y < optionsPerDevice.upOrDown) {
                            x -= 30;
                        }

                        $ionicScrollDelegate.$getByHandle('znk-timeline').scrollTo(summeryScore.lineTo.x - 200, 0, true);

                        modal.scope.d.timelineMinMaxStyle = { 'top' : y+'px', 'left' : x+'px'};
                        modal.scope.d.timelineMinMaxText =  parseInt(summeryScore.score - 30)+' - '+parseInt(summeryScore.score + 30);

                        if(summeryScore.score > summeryScore.prev.score) {

                            modal.scope.d.timelineLineText = 'You\'re getting better!';
                            modal.scope.d.timelineLinePlus = '+'+parseInt(summeryScore.score - summeryScore.prev.score);

                        } else if(summeryScore.score < summeryScore.prev.score) {

                            modal.scope.d.timelineLineText = 'Don\'t worry, you\'ll get better!';
                            modal.scope.d.timelineLinePlus = '-'+parseInt(summeryScore.prev.score - summeryScore.score);
                            modal.scope.d.isRed = true;

                        } else if(summeryScore.score === summeryScore.prev.score) {
                            modal.scope.d.timelineLineText = 'No Change';
                        }

                    }
                };
            });

            angular.extend(newScope, {
                injections:{
                    exerciseTypeId: exerciseTypeId,
                    subjectId: subjectId,
                    questions: questions,
                    results: results,
                    allowContinue: !disableContinue
                },
                goToQuestion: function goToQuestion(index) {
                    modal.hide();
                    exerciseActions.hideInstructionsButton = false;
                    exerciseActions.setSlideIndex(index);
                    exerciseActions.showToolbox();
                }
            });

            return modal;
        }

        var toolBoxModalInstance;
        function openExerciseToolBoxModal(scope,toolboxWrapperClass){
            var modalOptions = {
                scope: scope,
                templateUrl: 'znk/exercise/templates/znkExerciseToolBoxModal.html',
                hideBackdrop: true,
                ctrl: 'ZnkExerciseToolBoxModalCtrl',
                dontCentralize: true,
                wrapperClass: 'znk-exercise-toolbox ' + toolboxWrapperClass
            };
            toolBoxModalInstance = ZnkModalSrv.modal(modalOptions);
            return toolBoxModalInstance;
        }

        function showLoadingModal(options) {

            var combinedOptions = angular.extend({
                templateUrl: 'znk/exercise/templates/loadingTemplate.html',
                ctrl: 'LoadingCtrl'
            }, options);

            return ZnkModalSrv.modal(combinedOptions);
        }

        function showWrittenSolution(solution,quid, videosArr, questionId) {
            var childScope = $rootScope.$new();
            childScope.solution = solution;
            childScope.quid = quid;
            childScope.envName = ENV.name;
            childScope.videosArr = videosArr;
            childScope.questionId = questionId;
            var options = {
                templateUrl: 'znk/system/shared/templates/writtenSolutionModal.html',
                scope: childScope,
                wrapperClass: 'written-solution',
                dontCentralize: true,
                showCloseBtn: true
            };
            var modalInstance = ZnkModalSrv.modal(options);

            GoBackHardwareSrv.registerBaseModalHandler(modalInstance);
            return modalInstance;
        }

        function showLevelChange(level) {
            var childScope = $rootScope.$new();
            childScope.level = level;
            childScope.d = {};
            childScope.d.facebookShare = {
                description : 'Hurray! I\'ve just reached the '+level.name+' level on Zinkerz SAT​ app.',
                link: 'http://zinkerz.com/sat/#zinkerz',
                picture: 'www/assets/img/share/FB_'+ level.src+'.png'
            };

            var options = {
                templateUrl: 'znk/system/shared/templates/materLevelModal.html',
                scope: childScope,
                wrapperClass: 'level-modal master-level-modal',
                dontCentralize: false,
                showCloseBtn: true
            };
            return ZnkModalSrv.modal(options);
        }


        return {
            getAreYouSureDialogOptions: getAreYouSureDialogOptions,
            updateDailyResultChild: updateDailyResultChild,
            createSummaryModal: createSummaryModal,
            openExerciseToolBoxModal: openExerciseToolBoxModal,
            showLoadingModal: showLoadingModal,
            showWrittenSolution: showWrittenSolution,
            showLevelChange: showLevelChange
        };
    }

})(angular);
