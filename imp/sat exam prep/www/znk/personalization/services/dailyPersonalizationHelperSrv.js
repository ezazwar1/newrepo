(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('DailyPersonalizationHelperSrv', [
        'StorageSrv', 'OfflineContentSrv', 'ExerciseTypeEnum', 'SubjectEnum', '$q', '$rootScope', '$injector',
        function (StorageSrv, OfflineContentSrv, ExerciseTypeEnum, SubjectEnum, $q, $rootScope, $injector) {
            var DailyPersonalizationHelperSrv = {};

            var DAILY_PERSONALIZATION_PATH = StorageSrv.appUserSpacePath.concat(['dailyPersonalization']);

            var exerciseTypeEnumToNameMap = {};
            exerciseTypeEnumToNameMap[ExerciseTypeEnum.tutorial.enum] = 'tutorial';
            exerciseTypeEnumToNameMap[ExerciseTypeEnum.game.enum] = 'game';
            exerciseTypeEnumToNameMap[ExerciseTypeEnum.drill.enum] = 'drill';

            var deletePromEvents = ['pause','auth:login','auth:logout'];
            deletePromEvents.forEach(function(eventName){
                var childScope = $rootScope.$new(true);
                childScope.$on(eventName, function() {
                    delete DailyPersonalizationHelperSrv.getDailyPersonalization.prom;
                });
            });
            DailyPersonalizationHelperSrv.getDailyPersonalization = function(){
                if(!DailyPersonalizationHelperSrv.getDailyPersonalization.prom){
                    DailyPersonalizationHelperSrv.getDailyPersonalization.prom = StorageSrv.get(DAILY_PERSONALIZATION_PATH).then(function(dailyPersonalization){
                        var defaultValues = {
                            usedTutorials: [],
                            usedGames: [],
                            usedDrills: []
                        };

                        for(var prop in defaultValues){
                            if(angular.isUndefined(dailyPersonalization[prop])){
                                dailyPersonalization[prop] = defaultValues[prop];
                            }
                        }

                        return dailyPersonalization;
                    });
                }
                return DailyPersonalizationHelperSrv.getDailyPersonalization.prom;
            };

            function _setDailyPersonalization(dailyPersonalization){
                return StorageSrv.set(DAILY_PERSONALIZATION_PATH,dailyPersonalization);
            }

            function _getAllExercisesPropNameInPersonalizationObj(exerciseType){
                var allExercisesPropNameInPersonalizationObj;
                switch (exerciseType){
                    case ExerciseTypeEnum.tutorial.enum:
                        allExercisesPropNameInPersonalizationObj = 'specificTacticTutorials';
                        break;
                    case ExerciseTypeEnum.game.enum:
                        allExercisesPropNameInPersonalizationObj = 'generalTacticGames';
                        break;
                    case ExerciseTypeEnum.drill.enum:
                        allExercisesPropNameInPersonalizationObj = 'specificTacticDrills';
                        break;
                }
                return allExercisesPropNameInPersonalizationObj;
            }

            function _getPersonalizationData(){
                if(!_getPersonalizationData.prom){
                    _getPersonalizationData.prom = OfflineContentSrv.getPersonalizationData();
                }
                return _getPersonalizationData.prom;
            }

            function _prettifyStructure(uglyStructure){
                var prettyStructure = {};
                uglyStructure.forEach(function(item){
                    var itemKey = Object.keys(item)[0];
                    prettyStructure[itemKey] = item[itemKey];
                });
                return prettyStructure;
            }

            function _prettifyAllStructure(uglyStructure){
                if(angular.isObject(uglyStructure)){
                    var keys = Object.keys(uglyStructure);
                    keys.forEach(function(prop){
                        var val = uglyStructure[prop];
                        if(angular.isArray(val) && angular.isObject(val[0])){
                            uglyStructure[prop] = _prettifyStructure(uglyStructure[prop]);
                            _prettifyAllStructure(uglyStructure[prop]);
                        }
                    });
                }
            }

            function _mergeLevel(groupedObj){
                if(!angular.isObject(groupedObj)){
                    return groupedObj;
                }

                var mergedObj = angular.copy(groupedObj);

                var firstLevelKeys = Object.keys(mergedObj);
                firstLevelKeys.forEach(function(firstLevelKey){
                    var firstLevelObj = mergedObj[firstLevelKey];
                    var secondLevelKeys = Object.keys(firstLevelObj);
                    var mergedItemsArr = [];
                    secondLevelKeys.forEach(function(secondLevelKey){
                        var secondLevelObj = firstLevelObj[secondLevelKey];
                        if(angular.isArray(secondLevelObj)){
                            mergedItemsArr = mergedItemsArr.concat(secondLevelObj);
                        }else{
                            _mergeLevel(secondLevelObj);
                        }
                    });
                    mergedObj[firstLevelKey] = mergedItemsArr;
                });
                return mergedObj;
            }

            DailyPersonalizationHelperSrv.excludeArr = function(srcArr,excludeArr){
                return srcArr.filter(function(item){
                    return excludeArr.indexOf(item) === -1;
                });
            };

            DailyPersonalizationHelperSrv.getAllExercises = function(exerciseType){
                return OfflineContentSrv.getPersonalizationData().then(function(personalization){
                    switch (exerciseType){
                        case ExerciseTypeEnum.tutorial.enum:
                            return personalization.tutorialSubject;
                            break;
                        case ExerciseTypeEnum.game.enum:
                            return personalization.gameSubject;
                            break;
                        case ExerciseTypeEnum.drill.enum:
                            return personalization.drillSubject;
                            break;
                    }
                });
            };

            DailyPersonalizationHelperSrv.getAllExercisesBySpecificCategory = function(exerciseType){
                
                if(!DailyPersonalizationHelperSrv.getAllExercisesBySpecificCategory[exerciseType]){
                    DailyPersonalizationHelperSrv.getAllExercisesBySpecificCategory[exerciseType] = _getPersonalizationData().then(function(personalizationData){
                        
                        var allExercisesGroupedBy = angular.copy(personalizationData[_getAllExercisesPropNameInPersonalizationObj(exerciseType)]);

                        var allExercisesBySpecificCategory = {};
                        for(var subjectProp in allExercisesGroupedBy){
                            var allExercisesUnderSpecificSubject = _prettifyStructure(allExercisesGroupedBy[subjectProp]);
                            allExercisesBySpecificCategory[subjectProp] = {};
                            for(var generalCategoryId in allExercisesUnderSpecificSubject){
                                var exercisesBySpecificCategory = _prettifyStructure(allExercisesUnderSpecificSubject[generalCategoryId]);
                                allExercisesBySpecificCategory[subjectProp][generalCategoryId] = exercisesBySpecificCategory;
                            }

                        }
                        
                        return allExercisesBySpecificCategory;
                    });
                }
                
                return DailyPersonalizationHelperSrv.getAllExercisesBySpecificCategory[exerciseType];
            };

            DailyPersonalizationHelperSrv.getAllExercisesByGeneralCategory = function(exerciseType){
                if(!DailyPersonalizationHelperSrv.getAllExercisesByGeneralCategory[exerciseType]){
                    DailyPersonalizationHelperSrv.getAllExercisesByGeneralCategory[exerciseType] = _getPersonalizationData().then(function(personalizationData){
                        var allExercisesGroupedBy = angular.copy(personalizationData[_getAllExercisesPropNameInPersonalizationObj(exerciseType)]);

                        var allExercisesByGeneralCategory = {};
                        for(var subjectProp in allExercisesGroupedBy){
                            var allExercisesUnderSpecificSubject = _prettifyStructure(allExercisesGroupedBy[subjectProp]);
                            if(exerciseType === ExerciseTypeEnum.game.enum){
                                allExercisesByGeneralCategory[subjectProp] = allExercisesUnderSpecificSubject;
                            }else{
                                allExercisesByGeneralCategory[subjectProp] = {};
                                for(var generalCategoryId in allExercisesUnderSpecificSubject){
                                    var allExercisesBySpecificCategory = _prettifyStructure(allExercisesUnderSpecificSubject[generalCategoryId]);
                                    allExercisesByGeneralCategory[subjectProp][generalCategoryId] = [];
                                    for(var specificCategoryId in allExercisesBySpecificCategory ){
                                        var allExercisesUnderSpecificCategory = allExercisesBySpecificCategory[specificCategoryId];
                                        allExercisesByGeneralCategory[subjectProp][generalCategoryId] = allExercisesByGeneralCategory[subjectProp][generalCategoryId].concat(allExercisesUnderSpecificCategory);
                                    }
                                }
                            }
                        }
                        return allExercisesByGeneralCategory;
                    });
                }

                return DailyPersonalizationHelperSrv.getAllExercisesByGeneralCategory[exerciseType];
            };

            DailyPersonalizationHelperSrv.getAllExercisesBySubject = function(exerciseType){
                if(!DailyPersonalizationHelperSrv.getAllExercisesBySubject[exerciseType]){
                    DailyPersonalizationHelperSrv.getAllExercisesBySubject[exerciseType] = DailyPersonalizationHelperSrv.getAllExercisesByGeneralCategory(exerciseType).then(function(allExercisesByGeneralCategory){
                        var allExercisesBySubject = {};
                        for(var subjectProp in allExercisesByGeneralCategory){
                            allExercisesBySubject[subjectProp] = [];
                            var allExercisesUnderSpecificSubject = allExercisesByGeneralCategory[subjectProp];
                            for(var generalCategoryId in allExercisesUnderSpecificSubject){
                                var allExercisesForSpecificGeneralCategory = allExercisesUnderSpecificSubject[generalCategoryId];
                                allExercisesBySubject[subjectProp] = allExercisesBySubject[subjectProp].concat(allExercisesForSpecificGeneralCategory);
                            }
                        }
                        return allExercisesBySubject;
                    });
                }

                return DailyPersonalizationHelperSrv.getAllExercisesBySubject[exerciseType];
            };

            DailyPersonalizationHelperSrv.getGeneralStrategyTutorialsBySubject = function (){
                if(!DailyPersonalizationHelperSrv.getGeneralStrategyTutorialsBySubject.GSTutorialsBySubject){
                    DailyPersonalizationHelperSrv.getGeneralStrategyTutorialsBySubject.GSTutorialsBySubject = OfflineContentSrv.getPersonalizationData().then(function(personalization){
                        var generalStrategyTutorialsBySubject = angular.copy(personalization.generalStrategyTutorials);
                        for(var subjectProp in generalStrategyTutorialsBySubject){
                            var generalStrategyTutorialsByGeneralCategory = _prettifyStructure(generalStrategyTutorialsBySubject[subjectProp]);
                            generalStrategyTutorialsBySubject[subjectProp] = [];
                            for(var generalCategoryId in generalStrategyTutorialsByGeneralCategory){
                                var generalStrategyTutorialsBySpecificCategory = _prettifyStructure(generalStrategyTutorialsByGeneralCategory[generalCategoryId]);
                                for(var specificCategoryId in generalStrategyTutorialsBySpecificCategory){
                                    generalStrategyTutorialsBySubject[subjectProp] = generalStrategyTutorialsBySubject[subjectProp].concat(generalStrategyTutorialsBySpecificCategory[specificCategoryId]);
                                }
                            }
                        }
                        return generalStrategyTutorialsBySubject;
                    });
                }
                return DailyPersonalizationHelperSrv.getGeneralStrategyTutorialsBySubject.GSTutorialsBySubject;
            };

            function _getUsedExercisesPropName(exerciseType){
                var exerciseTypeEnumMap = ExerciseTypeEnum.getEnumMap();
                return 'used' + exerciseTypeEnumMap[exerciseType] + 's';
            }
            DailyPersonalizationHelperSrv.getUsedExercises = function (exerciseType){
                //
                //return DailyPersonalizationHelperSrv.getDailyPersonalization().then(function(dailyPersonalization){
                //    
                //    return dailyPersonalization[_getUsedExercisesPropName(exerciseType)];
                //});
                //
                //    
                //was injected via injector in order to prevent dependency
                var DailyHelperSrv = $injector.get('DailyHelperSrv');
                return DailyHelperSrv.getDailiesData().then(function(dailiesData){
                    var usedExercises = [];
                    var exerciseProp;
                    switch (exerciseType){
                        case ExerciseTypeEnum.drill.enum:
                            exerciseProp = 'drill';
                            break;
                        case ExerciseTypeEnum.game.enum:
                            exerciseProp = 'game';
                            break;
                        case ExerciseTypeEnum.tutorial.enum:
                            exerciseProp = 'tutorial';
                            break;
                    }
                    dailiesData.dailies.forEach(function(daily){
                        if(daily && daily[exerciseProp] && daily[exerciseProp].id){
                            usedExercises.push(daily[exerciseProp].id);
                        }
                    });
                    return usedExercises;
                });
            };

            DailyPersonalizationHelperSrv.getAvailableExercisesByGeneralCategory = function(exerciseType){
                var getAllExercisesByGeneralCategoryProm = DailyPersonalizationHelperSrv.getAllExercisesByGeneralCategory(exerciseType);
                var getUsedExercisesProm = DailyPersonalizationHelperSrv.getUsedExercises(exerciseType);
                return $q.all([getAllExercisesByGeneralCategoryProm ,getUsedExercisesProm]).then(function(res){
                    var allExercisesByGeneralCategory = angular.copy(res[0]);
                    var usedExercises = res[1];
                    
                    var availExercisesByGeneralCategory = {};
                    var subjectProp;
                    var generalCategoryId;
                    var allExercisesUnderSpecificSubjectByGeneralCategory;
                    if(exerciseType === ExerciseTypeEnum.tutorial.enum || exerciseType === ExerciseTypeEnum.drill.enum){
                        for(subjectProp in allExercisesByGeneralCategory){
                            allExercisesUnderSpecificSubjectByGeneralCategory = allExercisesByGeneralCategory[subjectProp];
                            for(generalCategoryId in allExercisesUnderSpecificSubjectByGeneralCategory){
                                var allExercisesUnderSpecificGeneralCategoryBySpecificCategory = allExercisesUnderSpecificSubjectByGeneralCategory[generalCategoryId];
                                allExercisesUnderSpecificSubjectByGeneralCategory[generalCategoryId] = [];
                                for(var specificCategoryId in allExercisesUnderSpecificGeneralCategoryBySpecificCategory){
                                    var allExercisesForSpecificCategoryId = allExercisesUnderSpecificGeneralCategoryBySpecificCategory[specificCategoryId];
                                    allExercisesUnderSpecificSubjectByGeneralCategory[generalCategoryId] = allExercisesUnderSpecificSubjectByGeneralCategory[generalCategoryId].concat(allExercisesForSpecificCategoryId);
                                }
                            }
                        }
                    }

                    for(subjectProp in allExercisesByGeneralCategory){
                        allExercisesUnderSpecificSubjectByGeneralCategory = allExercisesByGeneralCategory[subjectProp];
                        availExercisesByGeneralCategory[subjectProp] = {};
                        for(generalCategoryId in allExercisesUnderSpecificSubjectByGeneralCategory){
                            availExercisesByGeneralCategory[subjectProp][generalCategoryId ] = DailyPersonalizationHelperSrv.excludeArr(allExercisesUnderSpecificSubjectByGeneralCategory[generalCategoryId],usedExercises);
                        }
                    }
                    return availExercisesByGeneralCategory;
                });
            };

            DailyPersonalizationHelperSrv.getAvailableExercisesBySubject = function(exerciseType){
                return DailyPersonalizationHelperSrv.getAvailableExercisesByGeneralCategory(exerciseType).then(function(availExercisesByGeneralCategory){
                    
                    return _mergeLevel(availExercisesByGeneralCategory);
                });
            };

            DailyPersonalizationHelperSrv.getAvailableGeneralCategories = function(exerciseType){
                
                return DailyPersonalizationHelperSrv.getAvailableExercisesByGeneralCategory(exerciseType).then(function(availableExercisesByGeneralCategory){
                    
                    var availableGeneralCategories = {};
                    for(var subjectProp in availableExercisesByGeneralCategory){
                        availableGeneralCategories[subjectProp] = [];
                        var availableExercisesForSubjectByGeneralCategory = availableExercisesByGeneralCategory[subjectProp];
                        for(var generalCategoryId in availableExercisesForSubjectByGeneralCategory){
                            var availableExerciseForGeneralCategory = availableExercisesForSubjectByGeneralCategory[generalCategoryId];
                            if(availableExerciseForGeneralCategory && availableExerciseForGeneralCategory.length){
                                availableGeneralCategories[subjectProp].push(+generalCategoryId);
                                continue;
                            }
                        }
                    }
                    return availableGeneralCategories;
                });
            };

            DailyPersonalizationHelperSrv.getAvailGeneralStrategyTutorials = function(){
                var getAllGSTutorialBySubjectProm = DailyPersonalizationHelperSrv.getGeneralStrategyTutorialsBySubject();
                var getUsedTutorialsProm = DailyPersonalizationHelperSrv.getUsedExercises(ExerciseTypeEnum.tutorial.enum);
                return $q.all([getAllGSTutorialBySubjectProm,getUsedTutorialsProm ]).then(function(res){
                    var GSTutorialsBySubject = res[0];
                    var usedTut = res[1];

                    var GSTutorials = [];
                    for(var subjectProp in GSTutorialsBySubject){
                        GSTutorials = GSTutorials.concat(GSTutorialsBySubject[subjectProp]);
                    }

                    return DailyPersonalizationHelperSrv.excludeArr(GSTutorials,usedTut);
                });
            };

            DailyPersonalizationHelperSrv.getAvailableGSTutorialsBySubject = function(){
                return DailyPersonalizationHelperSrv.getAvailGeneralStrategyTutorials().then(function(availGSTutorials){
                    var promArr = [];
                    availGSTutorials.forEach(function(tutorialId){
                        var prom = $q.all([DailyPersonalizationHelperSrv.getExerciseSubject(ExerciseTypeEnum.tutorial.enum,tutorialId),tutorialId]);
                        promArr.push(prom);
                    });
                    return $q.all(promArr);
                }).then(function(res){
                    var availGSTutBySubject = {};
                    availGSTutBySubject[SubjectEnum.math.enum] = [];
                    availGSTutBySubject[SubjectEnum.reading.enum] = [];
                    availGSTutBySubject[SubjectEnum.writing.enum] = [];
                    res.forEach(function(tutIdAndSubArr){
                        var subject = tutIdAndSubArr[0];
                        var tutId = tutIdAndSubArr[1];
                        availGSTutBySubject[subject].push(tutId);
                    });
                    return availGSTutBySubject;
                });
            };

            DailyPersonalizationHelperSrv.getAvailableExercisesForSpecificCategory = function(exerciseType,subject,generalCategoryId,specificCategoryId){
                var getAllExercisesBySpecificCategoryProm = DailyPersonalizationHelperSrv.getAllExercisesBySpecificCategory(exerciseType);
                var getUsedExercises = DailyPersonalizationHelperSrv.getUsedExercises(exerciseType);
                return $q.all([getAllExercisesBySpecificCategoryProm,getUsedExercises]).then(function(res){
                    var allExercisesForSpecificCategory = res[0][subject][generalCategoryId][specificCategoryId];
                    var usedExercises = res[1];
                    return DailyPersonalizationHelperSrv.excludeArr(allExercisesForSpecificCategory,usedExercises);
                });
            };

            DailyPersonalizationHelperSrv.getAvailableExercisesForGeneralCategory = function(exerciseType,subject,generalCategoryId){
                return DailyPersonalizationHelperSrv.getAvailableExercisesByGeneralCategory(exerciseType).then(function(availExercisesByGeneralCategory){
                    return availExercisesByGeneralCategory[subject][generalCategoryId];
                });
            };

            DailyPersonalizationHelperSrv.getAvailSubjectForExercise = function(exerciseType){
                return DailyPersonalizationHelperSrv.getAvailableExercisesBySubject(exerciseType).then(function(availExerciseBySubject){
                    
                    var availSubject = [];
                    var keys = Object.keys(availExerciseBySubject);
                    keys.forEach(function(subjectId){
                        if(availExerciseBySubject[subjectId].length){
                            availSubject.push(+subjectId);
                        }
                    });
                    return availSubject;
                });
            };

            DailyPersonalizationHelperSrv.getAvailableSpecificCategoriesForGeneralCategory = function(exerciseType,subjectId,generalCategoryId){
                
                var getAllExercisesBySpecificCategoryProm = DailyPersonalizationHelperSrv.getAllExercisesBySpecificCategory(exerciseType);
                var getUsedExercisesProm = DailyPersonalizationHelperSrv.getUsedExercises(exerciseType);
                return $q.all([getAllExercisesBySpecificCategoryProm,getUsedExercisesProm]).then(function(res){
                    var exercisesForGeneralCategory = res[0][subjectId][generalCategoryId];
                    var usedExercises = res[1];

                    var availableSpecificCategoriesForGeneralCategory = {};
                    availableSpecificCategoriesForGeneralCategory[subjectId] = {};
                    availableSpecificCategoriesForGeneralCategory[subjectId][generalCategoryId] = [];

                    for(var specificCategoryId in exercisesForGeneralCategory){
                        var exercisesForSpecificCategory = DailyPersonalizationHelperSrv.excludeArr(exercisesForGeneralCategory[specificCategoryId],usedExercises);
                        if(exercisesForSpecificCategory.length){
                            availableSpecificCategoriesForGeneralCategory[subjectId][generalCategoryId].push(+specificCategoryId);
                        }
                    }
                    
                    return availableSpecificCategoriesForGeneralCategory;
                });
            };

            DailyPersonalizationHelperSrv.getExerciseSubject = function(exerciseType,id){
                return DailyPersonalizationHelperSrv.getAllExercisesBySubject(exerciseType).then(function(allExercisesBySubject){
                    for(var subjectId in allExercisesBySubject){
                        if(allExercisesBySubject[subjectId].indexOf(id) !== -1){
                            return +subjectId;
                        }
                    }

                });
            };

            DailyPersonalizationHelperSrv.setExerciseAsUsed = function(exerciseType,idToSetAsUsed){
                idToSetAsUsed = +idToSetAsUsed;
                return DailyPersonalizationHelperSrv.getDailyPersonalization().then(function(dailyPersonalization){
                    var usedExercisesArray = dailyPersonalization[_getUsedExercisesPropName(exerciseType)];
                    if(usedExercisesArray.indexOf(idToSetAsUsed) === -1){
                        usedExercisesArray.push(idToSetAsUsed);
                    }
                    return _setDailyPersonalization(dailyPersonalization);
                });
            };

            DailyPersonalizationHelperSrv.getGeneralStrategyTutsNum = function(){
                return _getPersonalizationData().then(function(personalizationData){
                    var generalStrategyTuts = personalizationData.generalStrategyTutorials;
                    _prettifyAllStructure(generalStrategyTuts);
                    var mergedObj = {};
                    mergedObj[SubjectEnum.math.enum] = _mergeLevel(generalStrategyTuts[SubjectEnum.math.enum]);
                    mergedObj[SubjectEnum.reading.enum] = _mergeLevel(generalStrategyTuts[SubjectEnum.reading.enum]);
                    mergedObj[SubjectEnum.writing.enum] = _mergeLevel(generalStrategyTuts[SubjectEnum.writing.enum]);
                    mergedObj = _mergeLevel(mergedObj);
                    var generalStrategyNum = 0;
                    var keys = Object.keys(mergedObj);
                    keys.forEach(function(key){
                        generalStrategyNum += mergedObj[key].length;
                    });
                    return generalStrategyNum;
                });
            };

            /* for testing */
            DailyPersonalizationHelperSrv.__prettifyStructure = _prettifyStructure;
            DailyPersonalizationHelperSrv.__mergeLevel = _mergeLevel;

            return DailyPersonalizationHelperSrv;
        }
    ]);
})(angular);
