'use strict';

(function (angular) {

    angular.module('znk.diagnostic').controller('DiagnosticCtrl', ['diagnosticData', '$state', 'DiagnosticSrv', DiagnosticCtrl]);

    function DiagnosticCtrl(diagnosticData, $state, DiagnosticSrv) {

        DiagnosticSrv.getState(diagnosticData).then(function(resp) {
            $state.go(resp.state, resp.params);
        });
    }

})(angular);
