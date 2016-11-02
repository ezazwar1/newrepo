'use strict';

(function () {

    angular.module('znk.sat').factory('TourSrv', ['UserStorageSrv', TourSrv]);

    function TourSrv(UserStorageSrv) {

        var tourState = UserStorageSrv.get('tourState');

        if (!tourState) {
            var initState = {
                footer: false,
                summary: false,
                solution: false
            };

            UserStorageSrv.set('tourState', initState);
            tourState = initState;
        }

        var get = function get() {
            return tourState;
        };

        var set = function set(newState) {
            tourState = newState;
            UserStorageSrv.set('tourState', tourState);
        };

        return {
            get: get,
            set: set
        };
    }

})();
