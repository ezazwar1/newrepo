(function (angular) {
    'use strict';

    var examEventsConst = {
        COMPLETE: 'exam:complete',
        SECTION_FINISH: 'exam:section finish'
    };
    angular.module('znk.sat').constant('examEventsConst', examEventsConst);
})(angular);
