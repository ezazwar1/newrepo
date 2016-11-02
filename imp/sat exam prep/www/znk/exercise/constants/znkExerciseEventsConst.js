(function (angular) {
    'use strict';

    var ZnkExerciseEvents = {
        BOOKMARK: 'znk exercise:bookmark',
        QUESTION_ANSWERED: 'znk exercise:question answered'
    };
    angular.module('znk.sat').constant('ZnkExerciseEvents', ZnkExerciseEvents);
})(angular);
