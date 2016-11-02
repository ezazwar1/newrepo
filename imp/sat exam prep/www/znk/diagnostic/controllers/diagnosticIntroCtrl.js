'use strict';

(function (angular) {

    angular.module('znk.diagnostic').controller('DiagnosticIntroCtrl', ['$stateParams', 'diagnosticData', 'DiagnosticConst', 'GoBackHardwareSrv', DiagnosticIntroCtrl]);

    function DiagnosticIntroCtrl($stateParams, diagnosticData, DiagnosticConst, GoBackHardwareSrv) {

        var vm = this;

        vm.d = {
            exam: diagnosticData.exam,
            subjectId: $stateParams.subjectId,
            subjects: DiagnosticConst.subjects,
            currentSubject: DiagnosticConst.subjects[$stateParams.subjectId]
        };

        GoBackHardwareSrv.registerGoHomeHandler();

    }

})(angular);
