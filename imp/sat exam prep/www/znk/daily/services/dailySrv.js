(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('DailySrv', [
        'FlashcardSrv', 'DailyHelperSrv', '$q', 'ExerciseProgressSrv', 'HomeItemStatusEnum', 'exerciseEventsConst', '$rootScope', 'EnumSrv', 'DailyPersonalizationSrv', 'BonusSkillSrv', 'SubjectEnum', 'PersonalizationStatsSrv',
        function (FlashcardSrv, DailyHelperSrv, $q, ExerciseProgressSrv, HomeItemStatusEnum, exerciseEventsConst, $rootScope, EnumSrv, DailyPersonalizationSrv, BonusSkillSrv, SubjectEnum, PersonalizationStatsSrv) {
            var DailySrv = {};

            DailySrv.getDaily = function (dailyOrder) {
                var dailyIndex = dailyOrder - 1;
                return DailySrv.getAllDailies().then(function (dailies) {
                    if (dailies && dailies[dailyIndex]) {
                        return dailies[dailyIndex];
                    } else {
                        throw 'daily ' + dailyOrder + ' not started yet';
                    }
                });
            };

            var dailyExercises = ['drill', 'game', 'tutorial'];
            DailySrv.getAllDailies = function () {
                
                return DailyHelperSrv.getDailiesData().then(function (dailiesData) {
                    if (!dailiesData.dailies || !dailiesData.dailies.length) {
                        dailiesData.dailies = [{
                            dailyOrder: 1,
                            status: HomeItemStatusEnum.ACTIVE.enum
                        }];
                    }

                    var activeDailyIndex = 0;
                    for (var i in dailiesData.dailies) {
                        var daily = dailiesData.dailies[i];
                        if (daily.status === HomeItemStatusEnum.COMPLETED.enum && (i < dailiesData.dailies.length - 1)) {
                            dailyExercises.forEach(function (exerciseName) {
                                if (daily[exerciseName]) {
                                    daily[exerciseName].isCompleted = true;
                                }
                            });
                            activeDailyIndex++;
                        } else {
                            break;
                        }
                    }
                    var activeDaily = dailiesData.dailies[activeDailyIndex];

                    var exercisesSubjectSetProm = setDailyExercisesSubject(activeDaily);
                    var flashcardsSetProm = setDailyFlashcards(activeDaily);
                    return $q.all([exercisesSubjectSetProm,flashcardsSetProm]).then(function () {
                        //active daily is set again since dailiesData object might be override during the exercise and flashcards retrieve
                        var activeDailyIndex = (+activeDaily.dailyOrder) - 1;
                        dailiesData.dailies[activeDailyIndex] = activeDaily;
                        return [activeDaily, dailiesData];
                    });
                }).then(function (res) {
                    var activeDaily = res[0];
                    var dailiesData = res[1];
                    var allPromArr = [];

                    dailyExercises.forEach(function (exerciseName) {
                        if (activeDaily[exerciseName].isCompleted) {
                            allPromArr.push($q.when(activeDaily[exerciseName].isCompleted));
                        } else {
                            var isExerciseCompleteProm = DailyHelperSrv.isExerciseComplete(EnumSrv.exerciseType[exerciseName].enum, activeDaily[exerciseName].id).then(function (res) {
                                activeDaily[exerciseName].isCompleted = !!res;
                            });
                            allPromArr.push(isExerciseCompleteProm);
                        }
                    });

                    return $q.all(allPromArr).then(function () {
                        //save dailies changes
                        var saveDailiesProm = DailyHelperSrv.saveDailiesData(dailiesData);

                        //all dailies are done, So we can return the dailies
                        if (activeDaily.status === HomeItemStatusEnum.COMPLETED.enum) {
                            ExerciseProgressSrv.setActiveDaily(null);
                            return dailiesData.dailies;
                        }

                        var unfinishedExercise = dailyExercises.filter(function (exerciseName) {
                            return !activeDaily[exerciseName].isCompleted;
                        });
                        if (!unfinishedExercise.length) {
                            return saveDailiesProm.then(function () {
                                return finishDaily(activeDaily).then(function () {
                                    return DailySrv.getAllDailies();
                                }).then(function () {
                                    return DailyHelperSrv.getDailiesData();
                                }).then(function (dailiesData) {
                                    return dailiesData.dailies;
                                });
                            });
                        } else {
                            //verify the active daily status is set to active
                            activeDaily.status = HomeItemStatusEnum.ACTIVE.enum;
                            ExerciseProgressSrv.setActiveDaily(activeDaily.dailyOrder);
                            return dailiesData.dailies;
                        }
                    }).then(function (dailies) {
                        return angular.copy(dailies);
                    });
                });
            };

            DailySrv.getDailiesNum = ExerciseProgressSrv.getDailiesNum.bind(ExerciseProgressSrv);

            function finishDaily(activeDaily) {
                if (!activeDaily.drill || !activeDaily.drill.isCompleted || !activeDaily.game || !activeDaily.game.isCompleted || !activeDaily.tutorial || !activeDaily.tutorial.isCompleted) {
                    throw 'Daily ' + activeDaily.dailyOrder + ' is not completed but was requested to be set as completed';
                }
                activeDaily.status = HomeItemStatusEnum.COMPLETED.enum;
                $rootScope.$broadcast(exerciseEventsConst.daily.STATUS_CHANGED, angular.copy(activeDaily));
                return $q.all([DailyHelperSrv.getDailiesData(), DailySrv.getDailiesNum()]).then(function (resArr) {
                    var dailiesData = resArr[0];
                    var dailiesNum = resArr[1];
                    //save prev active daily changes
                    dailiesData.dailies[activeDaily.dailyOrder - 1] = activeDaily;

                    var nextDailyOrder = +(activeDaily.dailyOrder + 1);
                    //if next daily exists then just save the current daily
                    var nextDaily = dailiesData.dailies[nextDailyOrder - 1];
                    if (nextDaily) {
                        if (nextDaily.status === HomeItemStatusEnum.NEW.enum) {
                            nextDaily.status = HomeItemStatusEnum.ACTIVE.enum;
                        }
                        return DailyHelperSrv.saveDailiesData(dailiesData).then(function () {
                            return dailiesData.dailies;
                        });
                    }

                    if (nextDailyOrder <= +dailiesNum) {
                        nextDaily = {
                            dailyOrder: nextDailyOrder,
                            status: HomeItemStatusEnum.ACTIVE.enum
                        };
                        return setDailyExercisesSubject(nextDaily).then(function () {
                            dailiesData.dailies.push(nextDaily);
                            $rootScope.$broadcast(exerciseEventsConst.daily.STATUS_CHANGED, nextDaily);
                            return DailyHelperSrv.saveDailiesData(dailiesData).then(function () {
                                return dailiesData.dailies;
                            });
                        });
                    }
                    return DailyHelperSrv.saveDailiesData(dailiesData).then(function () {
                        return dailiesData.dailies;
                    });
                });
            }

            function setDailyExercisesSubject(daily) {
                //all subjects set at once so if one not exits it means all the other not exits as well
                if(!daily.tutorial){
                    if(daily.dailyOrder % 5 === 0){
                        return PersonalizationStatsSrv.getWeakestSubject().then(function(weakestSubjectId){
                            return DailyPersonalizationSrv.createPersonalizedDaily(daily.dailyOrder,weakestSubjectId).then(function(personalizedDaily){
                                angular.extend(daily,personalizedDaily);
                            });
                        })
                    }
                    return DailyPersonalizationSrv.createPersonalizedDaily(daily.dailyOrder).then(function(personalizedDaily){
                        angular.extend(daily,personalizedDaily);
                    });
                }
                return $q.when(daily);
            }

            function setDailyFlashcards(daily){
                if(!daily.flashcards){
                    //@todo(igor) flashcards generator should be moved to dedicated service
                    return BonusSkillSrv._generateBonusSkillFlashcards().then(function(flashcards){
                        daily.flashcards = flashcards;
                        daily.flashcards.subjectId = SubjectEnum.reading.enum;
                    })
                }
                return $q.when(daily);
            }

            DailySrv.isDailyFlashcardsCompleted = function(dailyOrder){
                dailyOrder = dailyOrder - 1;

                var getDailiesDataProm = DailyHelperSrv.getDailiesData();
                var getFlashcardsStatusProm = FlashcardSrv.getFlashcardsStatus();
                return $q.all([getDailiesDataProm,getFlashcardsStatusProm]).then(function(res){
                    var dailiesData = res[0];
                    var flashcardsStatus = res[1];

                    var daily = dailiesData.dailies[dailyOrder];

                    var dailyFlashcards = daily && daily.flashcards && daily.flashcards.cards;

                    if(!dailyFlashcards){
                        return false;
                    }

                    for(var i in dailyFlashcards){
                        var flashcardId = +dailyFlashcards[i];
                        
                        var flashcardStatus = flashcardsStatus[FlashcardSrv.getFlashcardStatusKeyProp(flashcardId)];
                        if(!flashcardStatus || angular.isUndefined(flashcardStatus.status)){
                            return false;
                        }
                    }

                    daily.flashcards.isCompleted = true;
                    DailyHelperSrv.saveDailiesData(dailiesData)
                    return true;
                });
            };

            return DailySrv;
        }
    ]);
})(angular);
