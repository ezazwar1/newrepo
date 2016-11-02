(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('DailyPersonalizationSrv', [
        'DailyPersonalizationHelperSrv', 'ExerciseTypeEnum', 'SubjectEnum', '$q', 'PersonalizationStatsSrv', 'OfflineContentSrv',
        function (DailyPersonalizationHelperSrv, ExerciseTypeEnum, SubjectEnum, $q, PersonalizationStatsSrv, OfflineContentSrv) {
            DailyPersonalizationHelperSrv.getGeneralStrategyTutsNum();
            var SUBJECT_ENUM_ARR = SubjectEnum.getEnumArr();
            var SUBJECTS_NUM = SUBJECT_ENUM_ARR.length;

            var DailyPersonalizationSrv = {};

            function _getSubjectsAvailablePerExercise(dailyOrder){
                var getAvailableSubjectsForTutProm;
                return DailyPersonalizationHelperSrv.getGeneralStrategyTutsNum().then(function(gsTutNum){
                    if(dailyOrder <= gsTutNum){
                        getAvailableSubjectsForTutProm = DailyPersonalizationHelperSrv.getAvailableGSTutorialsBySubject().then(function(availGSTutBySubject){
                            var availSubjects = [];
                            for(var subjectId in availGSTutBySubject){
                                var availGSTutSubjects = availGSTutBySubject[subjectId];
                                if(availGSTutSubjects.length){
                                    availSubjects.push(+subjectId);
                                }
                            }
                            return availSubjects;
                        })
                    }else{
                        getAvailableSubjectsForTutProm = DailyPersonalizationHelperSrv.getAvailSubjectForExercise(ExerciseTypeEnum.tutorial.enum);
                    }
                    var getAvailableSubjectsForGameProm = DailyPersonalizationHelperSrv.getAvailSubjectForExercise(ExerciseTypeEnum.game.enum);
                    var getAvailableSubjectsForDrillProm = DailyPersonalizationHelperSrv.getAvailSubjectForExercise(ExerciseTypeEnum.drill.enum);
                    return $q.all([getAvailableSubjectsForTutProm,getAvailableSubjectsForGameProm ,getAvailableSubjectsForDrillProm ]).then(function(res){
                        var subjectsAvailPerExercise = {};
                        subjectsAvailPerExercise[ExerciseTypeEnum.tutorial.enum] = res[0];
                        subjectsAvailPerExercise[ExerciseTypeEnum.game.enum] = res[1];
                        subjectsAvailPerExercise[ExerciseTypeEnum.drill.enum] = res[2];
                        return subjectsAvailPerExercise;
                    });
                });
            }

            function _randomFromArray(arr){
                var randomIndex = Math.round(Math.random() * (arr.length - 1));
                return arr[randomIndex];
            }

            function _getWeakestGeneralCategoryForExercise(exerciseType,subjectsToExclude){
                if(!subjectsToExclude){
                    subjectsToExclude = [];
                }
                
                return DailyPersonalizationHelperSrv.getAvailableGeneralCategories(exerciseType).then(function(optionalGeneralCategories){
                    subjectsToExclude.forEach(function(subject){
                        optionalGeneralCategories[subject] = [];
                    });
                    
                    return PersonalizationStatsSrv.getWeakestGeneralCategory(optionalGeneralCategories);
                });
            }

            function _getWeakestSpecificCategoryForExercise(exerciseType,subjectsToExclude){
                
                return _getWeakestGeneralCategoryForExercise(exerciseType,subjectsToExclude).then(function(weakestGeneralCategoryForExercise){
                    return DailyPersonalizationHelperSrv.getAvailableSpecificCategoriesForGeneralCategory(exerciseType,weakestGeneralCategoryForExercise.subjectId,weakestGeneralCategoryForExercise.id);
                }).then(function(optionalSpecificCategories){
                    return PersonalizationStatsSrv.getWeakestSpecificCategory(optionalSpecificCategories);
                });
            }

            function _generateExerciseByWeakestSpecificCategory(exerciseType,subjectsToExclude){
                if(!subjectsToExclude){
                    subjectsToExclude = [];
                }
                console.info('generating exercise by weakest specific category for exercise type',JSON.stringify(exerciseType));
                return _getWeakestSpecificCategoryForExercise(exerciseType,subjectsToExclude).then(function(weakestSpecificCategoryForExercise){
                    return DailyPersonalizationHelperSrv.getAvailableExercisesForSpecificCategory(
                        exerciseType,weakestSpecificCategoryForExercise.subjectId,
                        weakestSpecificCategoryForExercise.generalCategoryId,
                        weakestSpecificCategoryForExercise.id
                    ).then(function(availableExercisesForSpecificCategory){
                            var exerciseId = _randomFromArray(availableExercisesForSpecificCategory);
                            return {
                                id: exerciseId ,
                                subjectId: weakestSpecificCategoryForExercise.subjectId
                            }
                        });
                });
            }

            function _generateTutorial(dailyOrder,excludedSubjects){
                console.info('generating daily tutorial');
                return DailyPersonalizationHelperSrv.getGeneralStrategyTutsNum().then(function(gsTutNum){
                    if(+dailyOrder <= gsTutNum){
                        
                        return DailyPersonalizationHelperSrv.getAvailableGSTutorialsBySubject().then(function(availGSTutorialsBySubject){
                            console.info('avail GS tutorial by subject',JSON.stringify(availGSTutorialsBySubject));
                            var availGSTutorialsArr = [];
                            for(var subjectId in availGSTutorialsBySubject){
                                if(excludedSubjects && excludedSubjects.indexOf(+subjectId) !== -1){
                                    availGSTutorialsBySubject[subjectId] = [];
                                }
                                availGSTutorialsBySubject[subjectId].forEach(function(tutorialId){
                                    availGSTutorialsArr.push({
                                        id: tutorialId,
                                        subjectId: +subjectId
                                    });
                                });
                            }
                            var generatedTutorial = _randomFromArray(availGSTutorialsArr);
                            console.info('generating GS tutorial',JSON.stringify(generatedTutorial));
                            return generatedTutorial;
                        })
                    }else{
                        console.info('generating regular tutorial');
                        return _generateExerciseByWeakestSpecificCategory(ExerciseTypeEnum.tutorial.enum,excludedSubjects);
                    }
                });
            }

            function _generateGame(subjectsToExclude){
                console.info('generating daily game');
                return _getWeakestGeneralCategoryForExercise(ExerciseTypeEnum.game.enum,subjectsToExclude).then(function(weakestGeneralCategoryForGame){
                    var getAvailableExercisesForGeneralCategoryProm =
                        DailyPersonalizationHelperSrv.getAvailableExercisesForGeneralCategory(ExerciseTypeEnum.game.enum,weakestGeneralCategoryForGame.subjectId,weakestGeneralCategoryForGame.id);
                    return $q.all([weakestGeneralCategoryForGame,getAvailableExercisesForGeneralCategoryProm]);
                }).then(function(res){
                    var weakestCategoryForGame = res[0];
                    var dailyGameId = _randomFromArray(res[1]);
                    return {
                        id: dailyGameId,
                        subjectId: weakestCategoryForGame.subjectId
                    }
                });
            }

            var  _generateDrill = _generateExerciseByWeakestSpecificCategory.bind(this,ExerciseTypeEnum.drill.enum);

            function _tryToMapExercisesSubject(exercisesAvailSubjectArr,usedSubjects,optionalMappingsArr){
                var exerciseNotUsedAvailSubjects = DailyPersonalizationHelperSrv.excludeArr(exercisesAvailSubjectArr[0],usedSubjects);
                if(!exerciseNotUsedAvailSubjects.length){
                    return;
                }
                if(exercisesAvailSubjectArr.length === 1){
                    usedSubjects.push(+exerciseNotUsedAvailSubjects[0]);
                    optionalMappingsArr.push(usedSubjects)
                }else{
                    var exercisesAvailSubjectArrCopy = angular.copy(exercisesAvailSubjectArr);
                    exercisesAvailSubjectArrCopy.shift();
                    exerciseNotUsedAvailSubjects.forEach(function(notUsedAvailSubject){
                        var usedSubjectsCopy = angular.copy(usedSubjects);
                        usedSubjectsCopy.push(+notUsedAvailSubject);
                        _tryToMapExercisesSubject(exercisesAvailSubjectArrCopy,usedSubjectsCopy,optionalMappingsArr);
                    });
                }
            }

            function _getDailyExercisesSubjectMapping(availSubjectForTutorial,availSubjectForGame,availSubjectForDrill){
                var availSubjectsPerExerciseArr = [availSubjectForTutorial,availSubjectForGame,availSubjectForDrill];;
                var optionalMappingsArr = [];
                _tryToMapExercisesSubject(availSubjectsPerExerciseArr,[],optionalMappingsArr);
                if(optionalMappingsArr.length){
                    
                    var randomOptionalMapping =  _randomFromArray(optionalMappingsArr);
                }else{
                    randomOptionalMapping = [
                        _randomFromArray(availSubjectForTutorial),
                        _randomFromArray(availSubjectForGame),
                        _randomFromArray(availSubjectForDrill)
                    ];
                    
                }


                var ret = {};
                ret[ExerciseTypeEnum.tutorial.enum] = randomOptionalMapping[0];
                ret[ExerciseTypeEnum.game.enum] = randomOptionalMapping[1];
                ret[ExerciseTypeEnum.drill.enum] = randomOptionalMapping[2];
                console.info('daily exercises subject mapping was made',JSON.stringify(ret));
                return ret;
            }

            function _getExcludedSubjectsByExerciseSubject(exerciseSubject,defaultValue){
                if(angular.isUndefined(exerciseSubject)){
                    return defaultValue;
                }

                var excludedSubjects = [];
                SUBJECT_ENUM_ARR.forEach(function(subjectEnum){
                    if(subjectEnum.enum !== exerciseSubject){
                        excludedSubjects.push(subjectEnum.enum);
                    }
                });
                return excludedSubjects;
            }

            DailyPersonalizationSrv.createPersonalizedDaily = function(dailyOrder,forcedSubject){
                console.info('starting generating daily ',dailyOrder);
                //added in order to prevent creation of same daily several times
                if(!DailyPersonalizationSrv.createPersonalizedDaily.dailyCreationPromiseMap){
                    DailyPersonalizationSrv.createPersonalizedDaily.dailyCreationPromiseMap = {};
                }

                if(DailyPersonalizationSrv.createPersonalizedDaily.dailyCreationPromiseMap[dailyOrder]){
                    return DailyPersonalizationSrv.createPersonalizedDaily.dailyCreationPromiseMap[dailyOrder];
                }

                console.info('checking avail subjects per exercise');
                var dailyCreationProm = _getSubjectsAvailablePerExercise(dailyOrder).then(function(subjectsAvailPerExercise){
                    
                    var _availSubjectsForTutorial = subjectsAvailPerExercise[ExerciseTypeEnum.tutorial.enum];
                    var _allSubjectsAvailForTutorial = _availSubjectsForTutorial.length === SUBJECTS_NUM ;

                    var _availSubjectsForGame = subjectsAvailPerExercise[ExerciseTypeEnum.game.enum];
                    var _allSubjectsAvailForGame = _availSubjectsForGame.length === SUBJECTS_NUM ;

                    var _availSubjectsForDrill = subjectsAvailPerExercise[ExerciseTypeEnum.drill.enum];
                    var _allSubjectsAvailForDrill = _availSubjectsForDrill.length === SUBJECTS_NUM ;

                    if(angular.isDefined(forcedSubject)){
                        var isForcedSubjectAvailForTutorial = _availSubjectsForTutorial.indexOf(forcedSubject) !== -1;
                        var isForcedSubjectAvailForGame = _availSubjectsForGame.indexOf(forcedSubject) !== -1;
                        var isForcedSubjectAvailForDrill= _availSubjectsForDrill.indexOf(forcedSubject) !== -1;
                        if(!isForcedSubjectAvailForTutorial || !isForcedSubjectAvailForGame || !isForcedSubjectAvailForDrill){
                            forcedSubject = undefined;
                        }
                    }

                    if(angular.isUndefined(forcedSubject) && _allSubjectsAvailForTutorial && _allSubjectsAvailForGame && _allSubjectsAvailForDrill){
                        
                        return $q.all([_generateTutorial(dailyOrder),null]);
                    }else{
                        
                        var dailyExercisesSubjectMapping;
                        if(angular.isDefined(forcedSubject)){
                            dailyExercisesSubjectMapping = {};
                            dailyExercisesSubjectMapping[ExerciseTypeEnum.tutorial.enum] =
                                dailyExercisesSubjectMapping[ExerciseTypeEnum.game.enum] =
                                dailyExercisesSubjectMapping[ExerciseTypeEnum.drill.enum] = forcedSubject;
                        }else{
                            dailyExercisesSubjectMapping = _getDailyExercisesSubjectMapping(_availSubjectsForTutorial,_availSubjectsForGame,_availSubjectsForDrill );
                        }

                        var tutorialExcludedSubjects = _getExcludedSubjectsByExerciseSubject(dailyExercisesSubjectMapping[ExerciseTypeEnum.tutorial.enum]);
                        

                        return $q.all([_generateTutorial(dailyOrder,tutorialExcludedSubjects),dailyExercisesSubjectMapping]);
                    }
                }).then(function(res){
                    
                    var dailyTutorial = res[0];
                    var dailyExercisesSubjectMapping = res[1];

                    var gameSubject = dailyExercisesSubjectMapping ? dailyExercisesSubjectMapping[ExerciseTypeEnum.game.enum] : undefined;
                    var excludedSubjects = _getExcludedSubjectsByExerciseSubject(gameSubject,[dailyTutorial.subjectId]);

                    

                    var generateGameProm = _generateGame(excludedSubjects);

                    return $q.all([dailyTutorial,generateGameProm,dailyExercisesSubjectMapping]);
                }).then(function(res){
                    
                    var dailyTutorial = res[0];
                    var dailyGame = res[1];
                    var dailyExercisesSubjectMapping = res[2];

                    var drillSubject = dailyExercisesSubjectMapping ? dailyExercisesSubjectMapping[ExerciseTypeEnum.drill.enum] : undefined;
                    var excludedSubjects = _getExcludedSubjectsByExerciseSubject(drillSubject,[dailyTutorial.subjectId,dailyGame.subjectId]);
                    
                    var generateDrillProm = _generateDrill(excludedSubjects);

                    return $q.all([dailyTutorial,dailyGame,generateDrillProm]);
                }).then(function(res){
                    
                    var dailyTutorial = res[0];
                    var dailyGame = res[1];
                    var dailyDrill = res[2];
                    var generatedDaily = {
                        tutorial: dailyTutorial,
                        game: dailyGame,
                        drill: dailyDrill
                    };
                    var exercises = ['tutorial' + dailyTutorial.id,
                        'game' + dailyGame.id,
                        'drill' + dailyDrill.id
                    ];

                    OfflineContentSrv.neverUpdateRevOf(exercises);

                    return $q.all([
                        DailyPersonalizationHelperSrv.setExerciseAsUsed(ExerciseTypeEnum.tutorial.enum,dailyTutorial.id),
                        DailyPersonalizationHelperSrv.setExerciseAsUsed(ExerciseTypeEnum.game.enum,dailyGame.id),
                        DailyPersonalizationHelperSrv.setExerciseAsUsed(ExerciseTypeEnum.drill.enum,dailyDrill.id)
                    ]).then(function(){
                        console.info('DailyPersonalizationSrv: daily generated');
                        return generatedDaily;
                    });
                });

                DailyPersonalizationSrv.createPersonalizedDaily.dailyCreationPromiseMap[dailyOrder] = dailyCreationProm;

                return dailyCreationProm;
            };

            return DailyPersonalizationSrv;
        }
    ]);
})(angular);
