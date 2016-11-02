'use strict';

(function (angular) {

    angular.module('znk.sat').factory('DrillSrv', ['$q', 'OfflineContentSrv', 'ExerciseProgressSrv', DrillSrv]);

    function DrillSrv($q, OfflineContentSrv, ExerciseProgressSrv) {

        var getAll = function getAll() {
            var deferred = $q.defer();

            OfflineContentSrv.getDrills().then(function (drills) {
                if (drills) {
                    deferred.resolve(drills);
                } else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        };

        var get = function get(id) {
            var deferred = $q.defer();

            OfflineContentSrv.getDrill(id).then(function (drill) {
                if (drill) {
                    deferred.resolve(drill);
                } else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        };

        function markAsSeen(id) {
            return OfflineContentSrv.neverUpdateRevOf('drill' + id);
        }

         function getAllDrillsIds(){
            return OfflineContentSrv.getAllDrillsIds();
        }

        function isDrillComplete(drillId){
            var getDrillProgressProm = ExerciseProgressSrv.getDrillProgress();
            return getDrillProgressProm.then(function(drillsProgress){
                return !!(drillsProgress && angular.isArray(drillsProgress.completedIds) && (drillsProgress.completedIds.indexOf(drillId) !== -1) ) ;
            });
        }

        return {
            get: get,
            markAsSeen: markAsSeen,
            getAll: getAll,
            getAllDrillsIds: getAllDrillsIds,
            isDrillComplete: isDrillComplete
        };
    }

})(angular);
