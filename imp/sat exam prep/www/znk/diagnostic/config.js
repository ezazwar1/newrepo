'use strict';

(function (angular) {

angular.module('znk.diagnostic', [])

    .config(['$stateProvider',
        function ($stateProvider) {

        $stateProvider
            .state('app.diagnostic', {
                url: '/diagnostic',
                template: '<ion-nav-view></ion-nav-view>',
                controller: 'DiagnosticCtrl as diagnostic',
                resolve: {
                    diagnosticData: function(DiagnosticSrv) {
                       return DiagnosticSrv.getAllData();
                    }
                  }
                })
                .state('app.diagnostic.intro', {
                    url: '/intro/:subjectId',
                    templateUrl: 'znk/diagnostic/templates/intro.html',
                    controller: 'DiagnosticIntroCtrl as intro'
                })
                .state('app.diagnostic.exercise', {
                    url: '/exercise/:subjectId/:questionId',
                    templateUrl: 'znk/diagnostic/templates/exercise.html',
                    controller: 'DiagnosticExerciseCtrl as exercise'
                })
                .state('app.diagnostic.summary', {
                    url: '/summary',
                    templateUrl: 'znk/diagnostic/templates/summary.html',
                    controller: 'DiagnosticSummaryCtrl',
                    resolve:{
                        introData: [
                            'HintSrv', '$timeout',
                            function(HintSrv, $timeout) {
                                return HintSrv.triggerDiagnosticSummaryHint().then(function(introModal){
                                    if(introModal){
                                        return $timeout(function(){
                                            introModal.close();
                                        }, 6000);
                                    }
                                });
                            }
                        ]
                    }
                });
    }]);

})(angular);
