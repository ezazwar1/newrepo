(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('ExpSrv', [
        'StorageSrv', '$q', '$rootScope',
        function (StorageSrv, $q, $rootScope) {

            var srvScope = $rootScope.$new(true);

            //@todo: move to config phase
            var ExpSrv = {
                xpPointsEnabled : true
            };

            ExpSrv.errors = {
                EXP_ALREADY_SET_FOR_EXERCISE: 'Experience points were already given for this exercise'
            };

            /* exercise */
            ExpSrv.getExerciseGetFnName = function (exerciseName) {
                var nameStartWithUpperLetter = exerciseName[0].toUpperCase() + exerciseName.substr(1);
                return 'get' + nameStartWithUpperLetter + 'Exp';
            };

            ExpSrv.getExerciseSetFnName = function (exerciseName) {
                var nameStartWithUpperLetter = exerciseName[0].toUpperCase() + exerciseName.substr(1);
                return 'set' + nameStartWithUpperLetter + 'Exp';
            };

            var gamificationPath = StorageSrv.appUserSpacePath.concat(['gamification']);
            var getGamificationObjProm;
            ExpSrv.getGamificationObj = function (dontSync) {
                if(dontSync){
                    if (!getGamificationObjProm) {
                        var userLoadedProm = StorageSrv.get(gamificationPath);
                        getGamificationObjProm = userLoadedProm.then(function (gamificationObj) {
                            return gamificationObj  || {};
                        });
                    }
                    return getGamificationObjProm;
                }else{
                    return saveSyncProm.then(function(){
                        if (!getGamificationObjProm) {
                            var userLoadedProm = StorageSrv.get(gamificationPath);
                            getGamificationObjProm = userLoadedProm.then(function (gamificationObj) {
                                return gamificationObj  || {};
                            });
                        }
                        return getGamificationObjProm;
                    });
                }
            };

            //getExpObj saved on service for testing
            var getExpObjProm;
            ExpSrv.getExpObj = function (dontSync) {
                if(dontSync){
                    if (!getExpObjProm) {
                        var getGamificationProm = ExpSrv.getGamificationObj(dontSync);
                        getExpObjProm = getGamificationProm.then(function (gamificationObj) {
                            if(!gamificationObj.exp){
                                gamificationObj.exp = {};
                            }
                            return gamificationObj.exp;
                        });
                    }
                    return getExpObjProm;
                }else{
                    return saveSyncProm.then(function(){
                        if (!getExpObjProm) {
                            var getGamificationProm = ExpSrv.getGamificationObj();
                            getExpObjProm = getGamificationProm.then(function (gamificationObj) {
                                if(!gamificationObj.exp){
                                    gamificationObj.exp = {};
                                }
                                return gamificationObj.exp;
                            });
                        }
                        return getExpObjProm;
                    });
                }


            };

            var saveSyncProm = $q.when();
            function saveExp() {
                return ExpSrv.getGamificationObj(true).then(function(gamificationObj) {
                    return StorageSrv.syncedSet(gamificationPath, gamificationObj);
                });
            }

            function _baseGetExerciseExp(exerciseName, exerciseId) {
                var getExpObjProm = ExpSrv.getExpObj();
                return getExpObjProm.then(function (expObj) {
                    var exerciseMapObj = expObj[exerciseName];
                    if (!exerciseMapObj) {
                        exerciseMapObj = expObj[exerciseName] = {};
                    }
                    return exerciseMapObj[exerciseId];
                });
            }

            function _baseSetExerciseExp(exerciseName, exerciseId, exp, isPerfect) {
                saveSyncProm = saveSyncProm.then(function(){
                    var getExpObjProm = ExpSrv.getExpObj(true);
                    return getExpObjProm.then(function (expObj) {
                        var defer = $q.defer();

                        var exerciseMapObj = expObj[exerciseName];
                        if (!exerciseMapObj) {
                            exerciseMapObj = expObj[exerciseName] = {};
                        }

                        if (exerciseMapObj[exerciseId]) {
                            defer.reject(ExpSrv.errors.EXP_ALREADY_SET_FOR_EXERCISE);
                            return;
                        }

                        exerciseMapObj[exerciseId] = {
                            createTime: StorageSrv.serverTimeStamp,
                            exp: exp,
                            perfectScore: !!isPerfect//@todo(igor) add relevant test
                        };

                        if (!expObj.total) {
                            expObj.total = 0;
                        }
                        expObj.total += exp;

                        var saveProm = saveExp(expObj);
                        saveProm.then(function () {
                            defer.resolve(expObj);
                        });

                        return defer.promise;
                    });
                });
                return saveSyncProm;
            }

            function getExamSectionExp(examId,sectionOrderId){
                var getExpObjProm = ExpSrv.getExpObj();
                return getExpObjProm.then(function (expObj) {
                    var examMapObj = expObj.exam;

                    if(!examMapObj){
                        examMapObj = expObj.exam = {};
                    }
                    //check whether the section exists inside the exam in exp object, if true return it
                    // otherwise return false
                    return examMapObj[examId] && examMapObj[examId].section && examMapObj[examId].section[sectionOrderId] ? examMapObj[examId].section[sectionOrderId] : undefined;
                });
            }

            function setExamSectionExp(examId,sectionOrder,exp,isPerfectScore){
                saveSyncProm = saveSyncProm.then(function(){
                    var getExpObjProm = ExpSrv.getExpObj(true);
                    return getExpObjProm.then(function (expObj) {

                        var defer = $q.defer();

                        var examMapObj = expObj.exam;

                        if(!examMapObj){
                            examMapObj = expObj.exam = {};
                        }

                        var exam = examMapObj[examId];
                        if(!exam){
                            exam = examMapObj[examId] = {};
                        }

                        if(!exam.section){
                            exam.section = {};
                        }

                        if(exam.section[sectionOrder]){
                            defer.reject(ExpSrv.errors.EXP_ALREADY_SET_FOR_EXERCISE);
                            return;
                        }

                        exam.section[sectionOrder] = {
                            createTime: StorageSrv.serverTimeStamp,
                            exp: exp,
                            perfectScore: isPerfectScore//@todo(igor) add relevant test
                        };

                        if (!expObj.total) {
                            expObj.total = 0;
                        }
                        expObj.total += exp;

                        var saveProm = saveExp(expObj);
                        saveProm.then(function () {
                            defer.resolve(expObj);
                        });

                        return defer.promise;
                    });
                });
                return saveSyncProm;
            }

            function addExercise(exerciseName, getterFn, setterFn) {
                ExpSrv[ExpSrv.getExerciseGetFnName(exerciseName)] = getterFn ||_baseGetExerciseExp.bind(_baseGetExerciseExp, exerciseName);
                ExpSrv[ExpSrv.getExerciseSetFnName(exerciseName)] = setterFn || _baseSetExerciseExp.bind(_baseSetExerciseExp, exerciseName);
            }

            var exercisesToAddArr = ['tutorial', 'practice', 'game', 'drill'];
            exercisesToAddArr.forEach(function (exerciseName) {
                addExercise(exerciseName);
            });
            //add exam section exercise
            addExercise('examSection', getExamSectionExp, setExamSectionExp);
            /* end exercise */

            /* exercise parent*/
            ExpSrv.getExerciseParentGetCompleteExpFnName = function (exerciseName) {
                var nameStartWithUpperLetter = exerciseName[0].toUpperCase() + exerciseName.substr(1);
                return 'getComplete' + nameStartWithUpperLetter + 'Exp';
            };

            ExpSrv.getExerciseParentSetCompleteExpFnName = function (exerciseName) {
                var nameStartWithUpperLetter = exerciseName[0].toUpperCase() + exerciseName.substr(1);
                return 'setComplete' + nameStartWithUpperLetter + 'Exp';
            };

            function _baseGetCompleteExerciseParentExp(exerciseParentName, id) {
                var getExpObjProm = ExpSrv.getExpObj();
                return getExpObjProm.then(function (expObj) {
                    var exerciseParentMapObj = expObj[exerciseParentName];

                    if (!exerciseParentMapObj) {
                        exerciseParentMapObj = expObj[exerciseParentName] = {};
                    }

                    return exerciseParentMapObj[id] ? exerciseParentMapObj[id].complete : undefined;
                });
            }

            function _baseSetCompleteExerciseParentExp(exerciseParentName, id, exp) {
                saveSyncProm = saveSyncProm.then(function(){
                    var getExpObjProm = ExpSrv.getExpObj(true);
                    return getExpObjProm.then(function (expObj) {
                        var defer = $q.defer();
                        var exerciseParentMapObj = expObj[exerciseParentName];

                        if (!exerciseParentMapObj) {
                            exerciseParentMapObj = expObj[exerciseParentName] = {};
                        }

                        if (!exerciseParentMapObj[id]) {
                            exerciseParentMapObj[id] = {};
                        }

                        if (exerciseParentMapObj[id].complete) {
                            defer.reject(ExpSrv.errors.EXP_ALREADY_SET_FOR_EXERCISE);
                            return;
                        }

                        if (!expObj.total) {
                            expObj.total = 0;
                        }

                        expObj.total += exp;

                        exerciseParentMapObj[id].complete = {
                            createTime: StorageSrv.serverTimeStamp,
                            exp: exp,
                            total: expObj.total
                        };


                        var saveProm = saveExp(expObj);
                        saveProm.then(function () {
                            defer.resolve(exerciseParentMapObj[id].complete);
                        });

                        return defer.promise;
                    });
                });
                return saveSyncProm;
            }

            function addExerciseParent(exerciseParentName) {
                ExpSrv[ExpSrv.getExerciseParentGetCompleteExpFnName(exerciseParentName)] = _baseGetCompleteExerciseParentExp.bind(_baseGetCompleteExerciseParentExp, exerciseParentName);
                ExpSrv[ExpSrv.getExerciseParentSetCompleteExpFnName(exerciseParentName)] = _baseSetCompleteExerciseParentExp.bind(_baseSetCompleteExerciseParentExp, exerciseParentName);
            }

            var exerciseParentToAddArr = ['exam', 'daily'];
            exerciseParentToAddArr.forEach(function (exerciseParentName) {
                addExerciseParent(exerciseParentName);
            });
            /* end exercise parent*/

            ExpSrv.getTotalExp = function () {
                var getExpObj = ExpSrv.getExpObj();
                return getExpObj.then(function (expObj) {
                    if (!expObj.total) {
                        expObj.total = 0;
                    }

                    return expObj.total;
                });
            };

            ExpSrv.setCompleteFlashCardExp = function(exp){
                saveSyncProm = saveSyncProm.then(function(){
                    var getExpObjProm = ExpSrv.getExpObj(true);
                    return getExpObjProm.then(function (expObj) {
                        var defer = $q.defer();

                        if (!expObj.total) {
                            expObj.total = 0;
                        }

                        expObj.total += exp;

                        var saveProm = saveExp(expObj);
                        saveProm.then(function () {
                            defer.resolve();
                        });

                        return defer.promise;
                    });
                });
                return saveSyncProm;
            };

            srvScope.$on('auth:logout', function(){
                getGamificationObjProm = undefined;
                getExpObjProm = undefined;
                saveSyncProm = $q.when();
            });


            return ExpSrv;
        }
    ]);
})(angular);
