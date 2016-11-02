'use strict';

(function (angular) {
    angular.module('znk.sat').service('EstimatedScoreSrv', [
        'EstimatedScoreHelperSrv', 'ExerciseTypeEnum', 'satSubjectRawScore', 'ScoringSrv', '$q', 'CategorySrv', 'SubjectEnum', '$log',
        function EstimatedScoreSrv(EstimatedScoreHelperSrv, ExerciseTypeEnum, satSubjectRawScore, ScoringSrv, $q, CategorySrv, SubjectEnum, $log) {
            var EstimatedScoreSrv = this;

            var ESTIMATED_SCORE_RANGE = 30;
            var MIN_SUBJECT_SCORE = 200;
            var MAX_SUBJECT_SCORE = 800;

            var MIN_DIAGNOSTIC_SCORE = 410;
            var MAX_DIAGNOSTIC_SCORE = 650;

            function _getEstimatedScoreRange(estimatedScore,isTotal){
                var multBy = isTotal ? 3 : 1;//if exam then the score is the sum of all subjects
                var minVal = MIN_SUBJECT_SCORE * multBy;
                var maxVal = MAX_SUBJECT_SCORE * multBy;
                return {
                    min: Math.max(estimatedScore.score - ESTIMATED_SCORE_RANGE,minVal),
                    max: Math.min(estimatedScore.score + ESTIMATED_SCORE_RANGE,maxVal)
                }
            }

            EstimatedScoreSrv.getEstimatedScoreRanges = function(){
                return EstimatedScoreSrv.getEstimatedScores().then(function(estimatedScores){
                    var ret = {};
                    var totalEstimatedScore = 0;

                    var subjectEnumArr = SubjectEnum.getEnumArr().map(function(item){
                        return item.enum;
                    });

                    subjectEnumArr.forEach(function(subjectId){
                        ret[subjectId] = {};

                        var estimatedScoreForSubject;
                        if(estimatedScores[subjectId]){
                            estimatedScoreForSubject = estimatedScores[subjectId][estimatedScores[subjectId].length - 1];
                        }

                        if(estimatedScoreForSubject){
                            totalEstimatedScore += estimatedScoreForSubject.score;
                            ret[subjectId] = _getEstimatedScoreRange(estimatedScoreForSubject)
                        }
                    });

                    if(totalEstimatedScore){
                        ret.total = _getEstimatedScoreRange({score: totalEstimatedScore},true);
                    }

                    return ret;
                });
            };

            function _baseGetter(key, subjectId) {
                return EstimatedScoreHelperSrv.getEstimatedScoreData().then(function (estimatedScore) {
                    if (angular.isUndefined(subjectId)) {
                        return estimatedScore[key];
                    }
                    return estimatedScore[key][subjectId];
                });
            }

            EstimatedScoreSrv.getEstimatedScores = _baseGetter.bind(this, 'estimatedScores');

            EstimatedScoreSrv.getSectionsRawScores = _baseGetter.bind(this, 'sectionsRawScores');

            EstimatedScoreSrv.getExercisesRawScore = _baseGetter.bind(this, 'exercisesRawScores');

            function _getSubjectDelta(estimatedScoreData,subjectId){
                var estimatedScore = estimatedScoreData.estimatedScores[subjectId];
                var scoresNum = estimatedScore.length;
                var subjectDelta = {
                    scoresNum: scoresNum
                };
                subjectDelta.delta = scoresNum >= 2 ? estimatedScore[scoresNum - 1].score - estimatedScore[scoresNum - 2].score : 0;
                return subjectDelta;
            }
            EstimatedScoreSrv.getSubjectsDelta = function(subjectId){
                return EstimatedScoreHelperSrv.getEstimatedScoreData().then(function (estimatedScoreData) {
                    if (angular.isUndefined(subjectId)) {
                        var subjectsDelta = {};
                        for(var _subjectId in estimatedScoreData.estimatedScores){
                            subjectsDelta[_subjectId] = _getSubjectDelta(estimatedScoreData,_subjectId);
                        }
                        return subjectsDelta;
                    }
                    return _getSubjectDelta(estimatedScoreData,subjectId);
                });
            };

            EstimatedScoreSrv.setDiagnosticSectionScore = function (score, exerciseType, subjectId, exerciseId) {
                return EstimatedScoreHelperSrv.getEstimatedScoreData().then(function (estimatedScoreData) {
                    //score was already set
                    if(estimatedScoreData.estimatedScores[subjectId].length){
                        return $q.reject('Exercise already processed ' + 'type ' + exerciseType + ' id ' + exerciseId)
                    }

                    score = Math.max(MIN_DIAGNOSTIC_SCORE,Math.min(MAX_DIAGNOSTIC_SCORE,score));
                    estimatedScoreData.estimatedScores[subjectId].push({
                        exerciseType: exerciseType,
                        exerciseId: exerciseId,
                        score: score,
                        time: Date.now()
                    });
                    return EstimatedScoreHelperSrv.setEstimateScoreData(estimatedScoreData).then(function () {
                        return estimatedScoreData.estimatedScores[subjectId][estimatedScoreData.estimatedScores[subjectId].length - 1];
                    });
                });
            };

            function _calculateNormalizedRawScore(sectionSubjectRawScores, exerciseSubjectRawScore, subjectId) {
                var sectionsWithWeightTotalPoints = 0;
                var sectionsWithWeightEarnedPoints = 0;
                var sectionsTotalPoints = 0;
                sectionSubjectRawScores.forEach(function(sectionRawScore,index){
                    sectionsTotalPoints += sectionRawScore.total;
                    var multiBy = +index + 1;
                    sectionsWithWeightTotalPoints += sectionRawScore.total * multiBy;
                    sectionsWithWeightEarnedPoints += sectionRawScore.earned * multiBy;
                });
                var combinedSectionRawScore = {
                    total: sectionsTotalPoints,
                    earned: sectionsTotalPoints * sectionsWithWeightEarnedPoints / sectionsWithWeightTotalPoints
                };
                var rawScore = (2 / 3) * combinedSectionRawScore.earned + (1 / 3) * exerciseSubjectRawScore.earned;
                var maxRawScore = (2 / 3) * combinedSectionRawScore.total + (1 / 3) * exerciseSubjectRawScore.total;
                var subjectMaxRawScore = satSubjectRawScore[subjectId];
                return Math.max(Math.round(subjectMaxRawScore * rawScore / maxRawScore),-6);//@todo(igor) result can be under -6
            }

            function _calculateNewEstimatedScore(subjectId, normalizedRawScore, currEstimatedScore, addLimitToNewEstimatedScore) {
                return ScoringSrv.getScoreByRawScore(subjectId, normalizedRawScore).then(function (newEstimatedScore) {
                    if(!currEstimatedScore){
                        return newEstimatedScore;
                    }

                    if (addLimitToNewEstimatedScore && Math.abs(newEstimatedScore - currEstimatedScore) > (newEstimatedScore * 0.05)) {
                        return currEstimatedScore + (newEstimatedScore - currEstimatedScore > 0 ? 1 : -1) * newEstimatedScore * 0.05;
                    }
                    return newEstimatedScore;
                });
            }

            function _isExerciseAlreadyProcessed(estimatedScoreData,exerciseType,exerciseId){
                var exerciseKey = exerciseType + '_' + exerciseId;
                if(estimatedScoreData.processedExercises.indexOf(exerciseKey) !== -1){
                    return true;
                }
                estimatedScoreData.processedExercises.push(exerciseKey);
            }

            EstimatedScoreSrv.addRawScore = function (rawScore, exerciseType, subjectId, exerciseId, isDiagnostic) {
                return EstimatedScoreHelperSrv.getEstimatedScoreData().then(function (estimatedScoreData) {
                    if(_isExerciseAlreadyProcessed(estimatedScoreData,exerciseType,exerciseId)){
                        return $q.reject('Exercise already processed ' + 'type ' + exerciseType + ' id ' + exerciseId);
                    }
                    if (exerciseType === ExerciseTypeEnum.section.enum) {
                        var sectionSubjectRowScores = estimatedScoreData.sectionsRawScores[subjectId];
                        var newSectionSubjectRawScore = {
                            exerciseType: exerciseType,
                            exerciseId: exerciseId,
                            time: Date.now()
                        };
                        angular.extend(newSectionSubjectRawScore,rawScore);
                        sectionSubjectRowScores.push(newSectionSubjectRawScore);
                    } else {
                        var exerciseSubjectRawScore = estimatedScoreData.exercisesRawScores[subjectId];
                        exerciseSubjectRawScore.exerciseType = exerciseType;
                        exerciseSubjectRawScore.exerciseId = exerciseId;
                        exerciseSubjectRawScore.time = Date.now();
                        exerciseSubjectRawScore.total += rawScore.total;
                        exerciseSubjectRawScore.earned += rawScore.earned;
                    }

                    if (!isDiagnostic) {
                        var normalizedRawScore = _calculateNormalizedRawScore(estimatedScoreData.sectionsRawScores[subjectId], estimatedScoreData.exercisesRawScores[subjectId], subjectId);
                        var estimatedScoresForSpecificSubject = estimatedScoreData.estimatedScores[subjectId];
                        var currEstimatedScore = estimatedScoresForSpecificSubject[estimatedScoresForSpecificSubject.length - 1] || {};
                        return _calculateNewEstimatedScore(subjectId, normalizedRawScore, currEstimatedScore.score, exerciseType !== ExerciseTypeEnum.section.enum).then(function (newEstimatedScore) {
                            estimatedScoreData.estimatedScores[subjectId].push({
                                exerciseType: exerciseType,
                                exerciseId: exerciseId,
                                score: newEstimatedScore,
                                time: Date.now()
                            });
                            return estimatedScoreData;
                        });
                    }
                    return estimatedScoreData;
                }).then(function (estimatedScoreData) {
                    return EstimatedScoreHelperSrv.setEstimateScoreData(estimatedScoreData);
                });
            };

            EstimatedScoreSrv.getDiagnosticSummary = function(){
                return EstimatedScoreSrv.getEstimatedScores().then(function(estimatedScore){
                    var mathScore = estimatedScore[SubjectEnum.math.enum][0].score;
                    var readScore = estimatedScore[SubjectEnum.reading.enum][0].score;
                    var writeScore = estimatedScore[SubjectEnum.writing.enum][0].score;
                    var total = mathScore + readScore + writeScore;
                    return  {
                        math: {
                            min: mathScore - 30,
                            max: mathScore + 30
                        },
                        read: {
                            min: readScore - 30,
                            max: readScore + 30
                        },
                        write: {
                            min: writeScore - 30,
                            max: writeScore + 30
                        },
                        total: {
                            min: total - 30,
                            max: total + 30,
                            avg: ((total - 30) + (total + 30)) / 2
                        }
                    };
                });
            };
        }
    ]);
})(angular);
