'use strict';

(function () {

    angular.module('znk.sat').factory('DailyResultSrv', ['StorageSrv', '$q', 'AuthSrv', DailyResultSrv]);

    function DailyResultSrv(StorageSrv, $q, AuthSrv) {

        function DailyResult(resultData) {
            angular.extend(this, resultData);
        }

        DailyResult.prototype.$save = function $save() {
            var _this = this;
            _this.uid = AuthSrv.authentication.uid;

            return getResultPointer(this.dailyOrderId).then(function(resultKey) {
                var key = resultKey || StorageSrv.createGuid();
                var path = StorageSrv.appPath.concat(['dailyResults', key]);

                var promises = [StorageSrv.set(path, _this)];
                if (!resultKey) {
                    promises.push(setResultPointer(_this.dailyOrderId, key));
                }
                return $q.all(promises);

            }).then(function(resolvedArr) {
                // return only the saved result
                return resolvedArr[0];
            });
        };

        function getResultPointer(orderId) {
            var pointersObjPath = StorageSrv.appUserSpacePath.concat(['dailyResults']);
            return StorageSrv.get(pointersObjPath).then(function(pointersObj) {
                if (pointersObj && pointersObj[orderId]) {
                    return pointersObj[orderId];
                }
            });
        }

        function setResultPointer(orderId, key) {
            var pointersObjPath = StorageSrv.appUserSpacePath.concat(['dailyResults']);
            return StorageSrv.get(pointersObjPath).then(function(pointersObj) {
                pointersObj = pointersObj || {};
                pointersObj[orderId] =  key;

                return StorageSrv.set(pointersObjPath, pointersObj);
            });
        }

        function exists(orderId) {
            return getResultPointer(orderId).then(function(key) {
                return !!key;
            });
        }

        function get(orderId) {
            return getResultPointer(orderId).then(function(pointerKey) {
                return getByKey(pointerKey);
            });
        }

        function getByKey(key) {
            if (!key) {
                return new DailyResult();
            }

            return StorageSrv.get(StorageSrv.appPath.concat(['dailyResults', key])).then(function(result) {
                return new DailyResult(result);
            });
        }

        return {
            get: get,
            getByKey: getByKey,
            exists: exists
        };
    }

})();
