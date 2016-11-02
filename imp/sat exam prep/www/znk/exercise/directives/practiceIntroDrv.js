'use strict';

(function (angular) {

    angular.module('znk.sat').directive('practiceIntro', [function () {

        return {
            restrict: 'E',
            scope: {
                subjectId: '=',
                questionCount: '=',
                difficulty: '=',
                visited: '=',
                handleClose: '&',
                buttonTitle: '='
            },
            templateUrl: 'znk/exercise/templates/practiceIntro.html',
            controller: [
                '$scope', 'GoBackHardwareSrv',
                function ($scope, GoBackHardwareSrv) {
                    var killWatch = $scope.$watch('subjectId', function () {
                        if (angular.isDefined($scope.subjectId)) {
                            $scope.subjectName = ($scope.subjectId === 0 ? 'math' : ($scope.subjectId === 1 ? 'reading' : 'writing'));
                            killWatch();
                        }
                    });

                    function goBackHardwareHandler(){
                        $scope.handleClose();
                    }
                    var hardwareGoBackHandlerDestroyer = GoBackHardwareSrv.registerHandler(goBackHardwareHandler,undefined,true);
                    $scope.$on('$destroy',function(){
                        if (hardwareGoBackHandlerDestroyer){
                            hardwareGoBackHandlerDestroyer();
                        }
                    });
                }]
        };

    }]);

})(angular);
