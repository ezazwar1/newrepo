'use strict';

(function (angular) {

    angular.module('znk.sat').factory('ExerciseResultSrv', ['StorageSrv', '$q', 'AuthSrv', ExerciseResultSrv]);

    function ExerciseResultSrv(StorageSrv, $q, AuthSrv) {

        function ExerciseResult(resultData, key) {
            angular.extend(this, resultData || {});
            this.$id = key || StorageSrv.createGuid();
        }

        ExerciseResult.prototype.$save = function $save() {
            var copyOfThis = angular.copy(this);
            copyOfThis.uid = AuthSrv.authentication.uid;
            
            
            return getResultPointer(this.exerciseTypeId, this.exerciseId).then(function(resultKey) {
                
                var key = resultKey || copyOfThis.$id;
                delete copyOfThis.$id;

                var path = StorageSrv.appPath.concat(['exerciseResults', key]);

                var retValue;
                
                return StorageSrv.set(path, copyOfThis).then(function(savedResult) {
                    
                    retValue = savedResult;
                    if (!resultKey) {
                        
                        return setResultPointer(copyOfThis.exerciseTypeId, copyOfThis.exerciseId, key);
                    }
                }).then(function() {
                    
                    return retValue;
                });
            });
        };

        function getResultPointer(typeId, id) {
            var pointersObjPath = StorageSrv.appUserSpacePath.concat(['exerciseResults']);
            return StorageSrv.get(pointersObjPath).then(function(pointersObj) {
                if (pointersObj && pointersObj[typeId] && pointersObj[typeId][id]) {
                    return pointersObj[typeId][id];
                }
            });
        }

        function setResultPointer(typeId, id, key) {
            var pointersObjPath = StorageSrv.appUserSpacePath.concat(['exerciseResults']);
            return StorageSrv.get(pointersObjPath).then(function(pointersObj) {
                pointersObj = pointersObj || {};
                pointersObj[typeId] = pointersObj[typeId] || {};
                pointersObj[typeId][id] = key;

                return StorageSrv.set(pointersObjPath, pointersObj);
            });
        }

        function exists(typeId, id) {
            return getResultPointer(typeId, id).then(function(key) {
                return !!key;
            });
        }

        function get(typeId, id) {
            return getResultPointer(typeId, id).then(function(pointerKey) {
                return getByKey(pointerKey);
            });
        }

        function getByKey(key) {
            if (!key) {
                return new ExerciseResult();
            }

            return StorageSrv.get(StorageSrv.appPath.concat(['exerciseResults', key])).then(function(result) {
                return new ExerciseResult(result, key);
            });
        }

        return {
            get: get,
            getByKey: getByKey,
            exists: exists
        };
    }

})(angular);
