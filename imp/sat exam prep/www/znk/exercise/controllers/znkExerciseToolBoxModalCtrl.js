(function (angular) {
    'use strict';

    angular.module('znk.sat').controller('ZnkExerciseToolBoxModalCtrl', [
        '$scope', 'EnumSrv', 'ExerciseTypeEnum',
        function ($scope, EnumSrv, ExerciseTypeEnum) {
            $scope.d = {
                blackboardActions: {},
                subjects: EnumSrv.subject,
                exerciseType: ExerciseTypeEnum
            };

            $scope.d.tools = {
                PENCIL: 'pen',
                ERASER: 'eraser',
                MARKER: 'mar',
                CALCULATOR: 'cal'
            };

            $scope.d.openTool = function(tool){
                if (tool === $scope.d.tools.PENCIL) {
                    $scope.d[tool] = true;
                    $scope.d[$scope.d.tools.ERASER] = false;

                    $scope.injections.hidePager($scope.d[tool]);
                    $scope.injections.hideInstructionsButton(true);

                    if ($scope.d.blackboardActions.activatePen) {
                        $scope.d.blackboardActions.activatePen();
                    }
                } else if (tool === $scope.d.tools.ERASER) {
                    $scope.d[tool] = true;
                    if ($scope.d.blackboardActions.activateEraser) {
                        $scope.d.blackboardActions.activateEraser();
                    }
                } else {
                    $scope.d[tool] = !$scope.d[tool];
                    $scope.injections.hideInstructionsButton($scope.d[$scope.d.tools.PENCIL]);
                }
            };

            $scope.d.closeBlackboard = function closeBlackboard() {
                $scope.d[$scope.d.tools.PENCIL] = false;
                $scope.d[$scope.d.tools.ERASER] = false;

                $scope.injections.hidePager(false);
                $scope.injections.hideInstructionsButton(false);
            };

            $scope.$watch('injections.currIndex',function(newIndex){
                if(angular.isUndefined(newIndex)){
                    return;
                }

                $scope.d.currQuestion = $scope.injections.questionArr[newIndex];
            });
        }
    ]);
})(angular);
