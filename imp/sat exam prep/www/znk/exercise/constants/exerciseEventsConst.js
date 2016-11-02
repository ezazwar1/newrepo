(function (angular) {
    'use strict';

    var exerciseEventsConst = {};

    exerciseEventsConst.tutorial = {
        FINISH: 'tutorial:finish'
    };

    exerciseEventsConst.practice = {
        FINISH: 'practice:finish'
    };

    exerciseEventsConst.game = {
        FINISH: 'game:finish'
    };

    exerciseEventsConst.daily = {
        COMPLETE: 'daily:complete'
    };

    exerciseEventsConst.daily = {
        STATUS_CHANGED: 'daily:status'
    };

    exerciseEventsConst.flashCard = {
        COMPLETE: 'flashCard:complete'
    };

    angular.module('znk.sat').constant('exerciseEventsConst', exerciseEventsConst);
})(angular);
