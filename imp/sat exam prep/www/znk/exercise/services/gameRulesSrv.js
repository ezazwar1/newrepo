'use strict';

(function(angular) {

    angular.module('znk.sat').factory('GameRulesSrv', ['EnumSrv', GameRulesSrv]);

    function GameRulesSrv(EnumSrv) {

        var basicGame = {
            canGoBack: true,
            canSkipQuestions: true,
            hasTimeLimit: false,
            timeToAddOnCorrect: 0,
            extend: function (obj) {
                return angular.extend({}, this, obj);
            }
        };

        var perfectionGame = basicGame.extend({
            canSkipQuestions: false
        });

        var speedRunGame = basicGame.extend({
            hasTimeLimit: true,
            timeLimit: 300 * 1000
        });

        var checkpointGame = speedRunGame.extend({
            timeLimit: 180 * 1000,
            timeToAddOnCorrect: 30

        });

        var getRules = function getRules (gameTypeId) {

            switch (gameTypeId) {
                case EnumSrv.gameTypes.perfection.enum:
                    return perfectionGame;
                case EnumSrv.gameTypes.speedRun.enum:
                case EnumSrv.gameTypes.pushIt.enum:
                    return speedRunGame;
                case EnumSrv.gameTypes.checkpoint.enum:
                    return checkpointGame;
                default:
                    return basicGame;
            }
        };

        return {
            getRules: getRules
        };
    }

})(angular);
