'use strict';

(function(angular) {

    angular.module('znk.sat').factory('GameSrv', ['OfflineContentSrv', GameSrv]);

    function GameSrv(OfflineContentSrv) {
        var get = function get (id) {
            return OfflineContentSrv.getGame(id).then(function (game) {
                return game;
            });
        };

        return {
            get: get
        };
    }

})(angular);
