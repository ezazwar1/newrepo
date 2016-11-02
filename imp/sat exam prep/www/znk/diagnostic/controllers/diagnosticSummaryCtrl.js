'use strict';

(function (angular) {

    angular.module('znk.diagnostic').controller('DiagnosticSummaryCtrl', ['$scope', 'GoBackHardwareSrv', 'SubjectEnum', 'MobileSrv', 'expRulesConst', 'EstimatedScoreSrv', DiagnosticSummaryCtrl]);

    function DiagnosticSummaryCtrl($scope, GoBackHardwareSrv, SubjectEnum, MobileSrv, expRulesConst, EstimatedScoreSrv) {

        $scope.d = {
            subjectEnum: SubjectEnum,
            isMobile: MobileSrv.isMobile(),
            xpPoints: expRulesConst.exam.diagnosticComplete,
            gauge:{
                radius: 55,
                stroke: 5
            }
        };

        if($scope.d.isMobile){
            $scope.d.gauge.radius =  40;
            $scope.d.gauge.stroke =  3;
        }

        EstimatedScoreSrv.getDiagnosticSummary().then(function(estimatedScore){
            for(var subject in estimatedScore){
                estimatedScore[subject].score = (estimatedScore[subject].min || 0) + 30;
            }
            $scope.d.estimatedScore = estimatedScore;
        });

        GoBackHardwareSrv.registerGoHomeHandler();
    }

})(angular);
