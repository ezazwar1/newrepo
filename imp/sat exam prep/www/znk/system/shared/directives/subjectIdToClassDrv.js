/**
 * attrs:
 *  subject-id-to-class-drv
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('subjectIdToClassDrv', [
        'EnumSrv',
        function (EnumSrv) {
            return {
                priority: 1000,
                link: {
                    pre:
                        function (scope, element, attrs) {
                        var subjectEnum = EnumSrv.subject;
                        var watchDestroyer = scope.$watch(attrs.subjectIdToClassDrv,function(newVal){
                            if(angular.isUndefined(newVal)){
                                return;
                            }
                            watchDestroyer();
                            var classToAdd;
                            switch(newVal){
                                case subjectEnum.math.enum:
                                    classToAdd = 'math-pattern';
                                    break;
                                case subjectEnum.reading.enum:
                                    classToAdd = 'reading-pattern';
                                    break;
                                case subjectEnum.writing.enum:
                                    classToAdd = 'writing-pattern';
                                    break;
                            }
                            element.addClass(classToAdd);
                        });
                    }
                }
            };
        }
    ]);
})(angular);

