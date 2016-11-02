(function (angular) {
    'use strict';

    angular.module('znk.sat').service('EstimatedScoreHelperSrv', [
        'StorageSrv', 'SubjectEnum', '$rootScope',
        function (StorageSrv, SubjectEnum, $rootScope) {
            var EstimatedScoreHelperSrv = this;

            var ESTIMATE_SCORE_PATH = StorageSrv.appUserSpacePath.concat(['estimatedScore']);

            function _SetSubjectInitialVal(obj,initValue){
                var subjectKeys = Object.keys(SubjectEnum);
                for(var i in subjectKeys){
                    var subjectEnum = SubjectEnum[subjectKeys[i]]
                    obj[subjectEnum.enum] = angular.copy(initValue);
                }
            }

            EstimatedScoreHelperSrv.getEstimatedScoreData = function(){
                if(!EstimatedScoreHelperSrv.getEstimatedScoreData.prom){
                    EstimatedScoreHelperSrv.getEstimatedScoreData.prom = StorageSrv.get(ESTIMATE_SCORE_PATH).then(function(estimatedScore){
                        var defaultValues = {
                            estimatedScores: {},
                            sectionsRawScores:{},
                            exercisesRawScores: {},
                            processedExercises: []
                        };

                        _SetSubjectInitialVal(defaultValues.estimatedScores,[]);
                        _SetSubjectInitialVal(defaultValues.sectionsRawScores,[]);
                        var rawScoreInitialObject = {
                            total: 0,
                            earned: 0
                        };
                        _SetSubjectInitialVal(defaultValues.exercisesRawScores,rawScoreInitialObject);

                        for(var prop in defaultValues){
                            var defaultVal = defaultValues[prop];

                            if(angular.isUndefined(estimatedScore[prop])){
                                estimatedScore[prop] = defaultVal ;
                            }

                            if(estimatedScore[prop] !== defaultVal && angular.isObject(defaultValues[prop])){
                                var currVal = estimatedScore[prop];
                                for(var prop1 in defaultVal){
                                    if(angular.isUndefined(currVal[prop1])){
                                        currVal[prop1] = defaultVal[prop1] ;
                                    }
                                }
                            }
                        }

                        return estimatedScore;
                    });
                }
                return EstimatedScoreHelperSrv.getEstimatedScoreData.prom;
            };

            EstimatedScoreHelperSrv.setEstimateScoreData = function (newEstimateScoreData){
                return StorageSrv.set(ESTIMATE_SCORE_PATH,newEstimateScoreData);
            };

            var childScope = $rootScope.$new(true);
            childScope.$on('auth:logout',function(){
                EstimatedScoreHelperSrv.getEstimatedScoreData.prom = null;
            });
        }
    ]);
})(angular);
