'use strict';

(function () {

    angular.module('znk.sat').factory('ExamResultSrv', ['StorageSrv', '$q', 'AuthSrv', ExamResultSrv]);

    function ExamResultSrv(StorageSrv, $q, AuthSrv) {

        function ExamResult(resultData) {
            angular.extend(this, resultData);
        }

        ExamResult.prototype.$save = function $save() {
            var _this = this;
            _this.uid = AuthSrv.authentication.uid;

            return getResultPointer(this.examId).then(function(resultKey) {
                var key = resultKey || StorageSrv.createGuid();
                var path = StorageSrv.appPath.concat(['examResults', key]);

                var promises = [StorageSrv.set(path, _this)];
                if (!resultKey) {
                    promises.push(setResultPointer(_this.examId, key));
                }
                return $q.all(promises);

            }).then(function(resolvedArr) {
                // return only the saved result
                return resolvedArr[0];
            });
        };

        function getResultPointer(examId) {
            var pointersObjPath = StorageSrv.appUserSpacePath.concat(['examResults']);
            return StorageSrv.get(pointersObjPath).then(function(pointersObj) {
                if (pointersObj && pointersObj[examId]) {
                    return pointersObj[examId];
                }
            });
        }

        function setResultPointer(examId, key) {
            var pointersObjPath = StorageSrv.appUserSpacePath.concat(['examResults']);
            return StorageSrv.get(pointersObjPath).then(function(pointersObj) {
                pointersObj = pointersObj || {};
                pointersObj[examId] =  key;

                return StorageSrv.set(pointersObjPath, pointersObj);
            });
        }

        function exists(examId) {
            return getResultPointer(examId).then(function(key) {
                return !!key;
            });
        }

        function get(examId) {
            return getResultPointer(examId).then(function(pointerKey) {
                return getByKey(pointerKey);
            });
        }

        function getByKey(key) {
            if (!key) {
                return new ExamResult();
            }

            return StorageSrv.get(StorageSrv.appPath.concat(['examResults', key])).then(function(result) {
                return new ExamResult(result);
            });
        }

        return {
            get: get,
            getByKey: getByKey,
            exists: exists
        };
    }

})();
