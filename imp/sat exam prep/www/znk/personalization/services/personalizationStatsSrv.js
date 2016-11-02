(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('PersonalizationStatsSrv', [
        'StorageSrv', 'CategorySrv', '$q', 'SubjectEnum', '$log',
        function (StorageSrv, CategorySrv, $q, SubjectEnum, $log) {
            var DAILY_PERSONALIZATION_PATH = StorageSrv.appUserSpacePath.concat(['personalizationStats']);


            var PersonalizationStatsSrv = {};

            function getPersonalizationStats(){
                return StorageSrv.get(DAILY_PERSONALIZATION_PATH).then(function(personalizationStats){
                    var defaultValues = {
                        subjectStats: {},
                        generalCategoryStats: {},
                        specificCategoryStats: {}
                    };

                    for(var prop in defaultValues){
                        if(angular.isUndefined(personalizationStats[prop])){
                            personalizationStats[prop] = defaultValues[prop];
                        }
                    }

                    return personalizationStats;
                });
            }
            PersonalizationStatsSrv.getPersonalizationStats = getPersonalizationStats;

            function setPersonalizationStats(newPersonalizationStats){
                for(var statsProp in newPersonalizationStats){
                    if(angular.equals(newPersonalizationStats[statsProp],{})){
                        delete newPersonalizationStats[statsProp];
                    }
                }
                return StorageSrv.set(DAILY_PERSONALIZATION_PATH,newPersonalizationStats);
            }

            function _baseStatsGetter(name){
                return getPersonalizationStats().then(function(dailyPersonalization){
                    return dailyPersonalization[name + 'Stats'];
                })
            }

            PersonalizationStatsSrv.getGeneralCategoryStats = function(){
                return _baseStatsGetter('generalCategory');
            };

            PersonalizationStatsSrv.getSpecificCategoryStats = function(){
                return _baseStatsGetter('specificCategory');
            };

            function _getCategoryWeakness(category){
                if(!category.totalQuestions){
                    return -Infinity;
                }
                return (category.totalQuestions - category.correct) / (category.totalQuestions);
            }

            function BaseStats(id,subjectId,generalCategoryId){
                if(angular.isDefined(id)){
                    this.id = +id;
                }

                if(angular.isDefined(subjectId)){
                    this.subjectId = +subjectId;
                }

                if(angular.isDefined(generalCategoryId)){
                    this.generalCategoryId = +generalCategoryId;
                }

                this.totalQuestions = 0;
                this.correct = 0;
                this.unanswered = 0;
                this.wrong = 0;
                this.totalTime = 0;
                //if General category then then set different initial value.
                if(angular.isDefined(subjectId) && subjectId !== null && (angular.isUndefined(generalCategoryId) || generalCategoryId === null)){
                    this.totalQuestions = 5;
                    this.correct = 4;
                    this.wrong = 1;
                }
            }
            PersonalizationStatsSrv.BaseStats = BaseStats;

            PersonalizationStatsSrv.getWeakestGeneralCategory = function(optionalGeneralCategories){
                return PersonalizationStatsSrv.getGeneralCategoryStats().then(function(allGeneralCategoryStats){
                    var optionalGeneralCategoryDataArr = [];
                    for(var subjectId in optionalGeneralCategories){
                        var optionalGeneralCategoriesForSubject = optionalGeneralCategories[subjectId];
                        optionalGeneralCategoriesForSubject.forEach(function(generalCategoryId){
                            var optionalGeneralCategoryData = allGeneralCategoryStats[generalCategoryId];
                            if(!optionalGeneralCategoryData){
                                optionalGeneralCategoryData = new BaseStats(generalCategoryId,subjectId);
                            }
                            optionalGeneralCategoryDataArr.push(optionalGeneralCategoryData);
                        });
                    }
                    optionalGeneralCategoryDataArr.sort(function(generalCategory1,generalCategory2){
                        return _getCategoryWeakness(generalCategory2) - _getCategoryWeakness(generalCategory1);
                    });
                    
                    return optionalGeneralCategoryDataArr[0];
                });
            };

            function _getSpecificCategoryWeakness(specificCategory){
                if(!specificCategory.totalQuestions){
                    return -Infinity;
                }
                return (specificCategory.totalQuestions - specificCategory.correct) / (specificCategory.totalQuestions);
            }

            PersonalizationStatsSrv.getWeakestSpecificCategory = function(optionalSpecificCategories){
                
                return PersonalizationStatsSrv.getSpecificCategoryStats().then(function(allSpecificCategoryStats){
                    var optionalSpecificCategoryDataArr = [];
                    for(var subjectId in optionalSpecificCategories){
                        var optionalSpecificCategoriesForSubject = optionalSpecificCategories[subjectId];
                        for(var generalCategoryId in optionalSpecificCategoriesForSubject){
                            var optionalSpecificCategoriesForGeneralCategory = optionalSpecificCategoriesForSubject[generalCategoryId];
                            optionalSpecificCategoriesForGeneralCategory.forEach(function(specificCategoryId){
                                var optionalSpecificCategoryData = allSpecificCategoryStats[specificCategoryId];
                                if(!optionalSpecificCategoryData){
                                    optionalSpecificCategoryData = new BaseStats(specificCategoryId,subjectId,generalCategoryId);
                                }
                                optionalSpecificCategoryDataArr.push(optionalSpecificCategoryData);
                            });
                        }
                    }
                    optionalSpecificCategoryDataArr.sort(function(specificCategory1,specificCategory2){
                        return _getSpecificCategoryWeakness(specificCategory2) - _getSpecificCategoryWeakness(specificCategory1);
                    });
                    
                    return optionalSpecificCategoryDataArr[0];
                });
            };

            function _baseStatsUpdater(currStat,newStat){
                currStat.totalQuestions += newStat.totalQuestions;
                currStat.correct += newStat.correct;
                currStat.unanswered += newStat.unanswered;
                currStat.wrong += newStat.wrong;
                currStat.totalTime += newStat.totalTime;
            }
            function _getParentCategoryId(lookUp,categoryId){
                return lookUp[categoryId] ? lookUp[categoryId].parentId : lookUp[categoryId];
            }
            PersonalizationStatsSrv.updateStats = function(exerciseType,newStats){
                var getCategoryLookupProm = CategorySrv.getLookup();
                var getPersonalizationStatsProm = getPersonalizationStats();
                return $q.all([getCategoryLookupProm ,getPersonalizationStatsProm]).then(function(res){
                    var categoryLookUp = res[0];
                    var personalizationStats = res[1];
                    var subjectStats = personalizationStats.subjectStats;
                    var generalCategoryStats = personalizationStats.generalCategoryStats;
                    var specificCategoryStats = personalizationStats.specificCategoryStats;

                    for(var categoryId in newStats){
                        var newStat = newStats[categoryId];
                        var categoriesToUpdate = [+categoryId];

                        var parentCategoryId = _getParentCategoryId(categoryLookUp,categoryId);
                        if(parentCategoryId !== null && angular.isDefined(parentCategoryId)){
                            categoriesToUpdate.unshift(parentCategoryId);
                        }

                        parentCategoryId = _getParentCategoryId(categoryLookUp,parentCategoryId);
                        if(parentCategoryId !== null && angular.isDefined(parentCategoryId)){
                            categoriesToUpdate.unshift(parentCategoryId);
                        }

                        var subjectId = categoriesToUpdate[0];
                        var generalCategoryId = categoriesToUpdate[1];
                        var specificCategoryId = categoriesToUpdate[2];


                        if(!subjectStats[subjectId]){
                            subjectStats[subjectId] = new BaseStats(subjectId);
                        }
                        _baseStatsUpdater(subjectStats[subjectId],newStat);

                        if(!generalCategoryStats[generalCategoryId]){
                            generalCategoryStats[generalCategoryId] = new BaseStats(generalCategoryId,subjectId);
                        }
                        _baseStatsUpdater(generalCategoryStats[generalCategoryId],newStat);

                        if(specificCategoryId){
                            if(!specificCategoryStats[specificCategoryId]){
                                specificCategoryStats[specificCategoryId] = new BaseStats(specificCategoryId,subjectId,generalCategoryId);
                            }
                            _baseStatsUpdater(specificCategoryStats[specificCategoryId],newStat);
                        }
                    }

                    return setPersonalizationStats(personalizationStats)
                });
            };

            PersonalizationStatsSrv.getPerformanceData = function(){
                var getPersonalizationStatsProm = PersonalizationStatsSrv.getPersonalizationStats();
                return $q.all([getPersonalizationStatsProm]).then(function(res){
                    var personalizationStats = res[0];
                    var subjectsStats = personalizationStats.subjectStats;
                    var generalCategoriesStats = personalizationStats.generalCategoryStats;

                    var performanceData = {};

                    var generalCategoriesBySubject = {};
                    var generalCategoryStatsKeys = Object.keys(generalCategoriesStats);
                    var weakestGeneralCategoryBySubject = {};
                    generalCategoryStatsKeys.forEach(function(key){
                        var generalCategoryStats = generalCategoriesStats[key];
                        //@todo(igor) in some cases (dont know when) the generalCategoryStats is null;
                        if(!generalCategoryStats){
                            $log.error('PersonalizationStatsSrv: getPerformanceData: null general category stat was received for the following key: ',key);
                            return;
                        }

                        if(!generalCategoriesBySubject[generalCategoryStats.subjectId]){
                            generalCategoriesBySubject[generalCategoryStats.subjectId] = [];
                        }
                        var processedGeneralCategory = {
                            id: generalCategoryStats.id,
                            levelProgress: generalCategoryStats.totalQuestions ? Math.round(generalCategoryStats.correct / generalCategoryStats.totalQuestions * 100) : 0,
                            avgTime: generalCategoryStats.totalTime ? Math.round(generalCategoryStats.totalTime / generalCategoryStats.totalQuestions / 1000) : 0
                        };
                        generalCategoriesBySubject[generalCategoryStats.subjectId].push(processedGeneralCategory);

                        var weakestGeneralCategoryForSubject = weakestGeneralCategoryBySubject[generalCategoryStats.subjectId];
                        if(!weakestGeneralCategoryForSubject || (weakestGeneralCategoryForSubject.successRate > processedGeneralCategory.levelProgress)){
                            weakestGeneralCategoryBySubject[generalCategoryStats.subjectId] = {
                                id: processedGeneralCategory.id,
                                successRate: processedGeneralCategory.levelProgress
                            }
                        }
                    });

                    SubjectEnum.getEnumArr().forEach(function(subject){
                        var subjectId = subject.enum;

                        var performanceDataForSubject = performanceData[subjectId] = {};

                        performanceDataForSubject.category = generalCategoriesBySubject[subjectId];
                        performanceDataForSubject.weakestCategory = weakestGeneralCategoryBySubject[subjectId];

                        var subjectStats = subjectsStats[subjectId];
                        if(subjectStats){
                            performanceDataForSubject.overall = {
                                value: subjectStats.totalQuestions ? Math.round(subjectStats.correct / subjectStats.totalQuestions * 100 ) : 0,
                                avgTime: subjectStats.totalTime ? Math.round(subjectStats.totalTime / subjectStats.totalQuestions / 1000) : 0
                            };
                        }

                    });

                    return performanceData;
                });
            };

            PersonalizationStatsSrv.getWeakestSubject = function(){
                return getPersonalizationStats().then(function(personalizationStats){
                    var subjectStats = personalizationStats.subjectStats;
                    var keys = Object.keys(subjectStats);
                    var subjectStatsArr = [];
                    keys.forEach(function(key){
                        subjectStatsArr.push(subjectStats[key])
                    });
                    subjectStatsArr.sort(function(subectStat1,subectStat2){
                        return _getCategoryWeakness(subectStat1) - _getCategoryWeakness(subectStat2);
                    });
                    return subjectStatsArr[subjectStatsArr.length - 1].id;
                });
            };

            PersonalizationStatsSrv.setCategoryLevel = function(categoryObj){
                if(categoryObj.levelProgress >= 0 && categoryObj.levelProgress < 30){
                    categoryObj.levelName = 'NOVICE';
                }
                else if(categoryObj.levelProgress >= 30 && categoryObj.levelProgress < 55){
                    categoryObj.levelName = 'AVERAGE';
                }
                else if(categoryObj.levelProgress >=55 && categoryObj.levelProgress < 75){
                    categoryObj.levelName = 'ADVANCE';
                }
                else if(categoryObj.levelProgress >=75 && categoryObj.levelProgress < 90){
                    categoryObj.levelName = 'EXPERT';
                }
                else if( categoryObj.levelProgress >=90 && categoryObj.levelProgress <= 100){
                    categoryObj.levelName = 'MASTER';
                }

                return categoryObj;
            };

            return PersonalizationStatsSrv;
        }
    ]);
})(angular);
