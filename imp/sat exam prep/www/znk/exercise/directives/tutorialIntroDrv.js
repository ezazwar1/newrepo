'use strict';

(function (angular) {

    angular.module('znk.sat').directive('tutorialIntro', [
        'GoBackHardwareSrv',
        function (GoBackHardwareSrv) {
            return {
                restrict: 'E',
                scope: {
                    name: '=',
                    contentArray: '=',
                    questionCount: '=',
                    visited: '=',
                    handleClose: '&',
                    buttonTitle: '=',
                    videosArray: '=',
                    videoType: '=',
                    contentId: '='
                },
                templateUrl: 'znk/exercise/templates/tutorialIntro.html',
                link: function link($scope) {
                    $scope.d = {
                        expandedIndex: ''
                    };

                    function goBackHardwareHandler() {
                        $scope.handleClose();
                    }
                    var hardwareGoBackHandlerDestroyer = GoBackHardwareSrv.registerHandler(goBackHardwareHandler,undefined,true);
                    $scope.$on('$destroy',function(){
                        if (hardwareGoBackHandlerDestroyer){
                            hardwareGoBackHandlerDestroyer();
                        }
                    });
                }
            };

        }]);

})(angular);
