'use strict';

(function () {

    angular.module('znk.sat').factory('PracticeInstructionsSrv', ['$q', 'OfflineContentSrv', PracticeInstructionsSrv]);

    function PracticeInstructionsSrv($q, OfflineContentSrv) {

        var _cachedInstructions;

        var getInstructions = function () {
            var deferred = $q.defer();


            if (_cachedInstructions) {
                deferred.resolve(_cachedInstructions);
            }
            else {
                OfflineContentSrv.getPracticeInstructions().then(function (instructions) {
                    if (instructions) {
                        _cachedInstructions = instructions;
                        deferred.resolve(instructions);
                    } else {
                        deferred.reject();
                    }
                });
            }

            return deferred.promise;
        };

        function getCategories() {
            return OfflineContentSrv.getCategories();
        }

        return {
            getInstructions: getInstructions,
            getCategories: getCategories
        };
    }

})();

