(function (angular) {
    'use strict';

    var ExerciseTypeConst = {
        tutorial: 1,
        practice: 2,
        game: 3,
        section: 4,
        drill: 5
    };

    angular.module('znk.sat').constant('ExerciseTypeConst', ExerciseTypeConst);

    angular.module('znk.sat').factory('ExerciseTypeEnum', [
        'EnumSrv',
        function (EnumSrv) {
            var ExerciseTypeEnum = new EnumSrv.BaseEnum([
                ['tutorial', ExerciseTypeConst.tutorial, 'Tutorial'],
                ['practice', ExerciseTypeConst.practice, 'Practice'],
                ['game', ExerciseTypeConst.game, 'Game'],
                ['section', ExerciseTypeConst.section, 'Section'],
                ['drill', ExerciseTypeConst.drill, 'Drill']
            ]);

            return ExerciseTypeEnum;
        }
    ]);
})(angular);
