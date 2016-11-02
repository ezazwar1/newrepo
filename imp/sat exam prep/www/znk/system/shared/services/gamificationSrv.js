'use strict';

(function() {
    angular.module('znk.sat').factory('GamificationSrv', [GamificationSrv]);

    function GamificationSrv() {

        var sectionPoints = 25;
        var examPoints = 100;

        var getPointsForCompletedSection = function getPointsForCompletedSection() {
            return 25;
        };

        return {
            getPointsForCompletedSection: getPointsForCompletedSection,
            sectionPoints: sectionPoints,
            examPoints: examPoints
        };
    }
})();
