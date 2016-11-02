(function (angular) {
    'use strict';

    var subjectConst = {
        math: 0,
        reading: 1,
        writing: 2
    };

    angular.module('znk.sat').constant('subjectConst', subjectConst);

    angular.module('znk.sat').factory('SubjectEnum', [
        'EnumSrv',
        function (EnumSrv) {
            var SubjectEnum = new EnumSrv.BaseEnum([
                ['math', subjectConst.math , 'Mathematics'],
                ['reading', subjectConst.reading , 'Critical Reading'],
                ['writing', subjectConst.writing, 'Writing']
            ]);

            return SubjectEnum;
        }
    ]);
})(angular);
