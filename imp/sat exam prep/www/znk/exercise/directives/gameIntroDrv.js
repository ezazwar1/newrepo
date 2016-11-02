'use strict';

(function(angular) {

    angular.module('znk.sat').directive('gameIntro', [
        'GoBackHardwareSrv', 'CategorySrv', 'EnumSrv', '$ionicScrollDelegate', 'MobileSrv',
        function (GoBackHardwareSrv, CategorySrv, EnumSrv, $ionicScrollDelegate, MobileSrv) {
        return {
            restrict: 'E',
            scope: {
                typeId: '=',
                timeLimit: '=',
                timeToAddOnCorrect: '=',
                visited: '=',
                handleClose: '&',
                questionsCount: '=',
                buttonTitle: '=',
                categoryId:'&'
            },
            templateUrl: 'znk/exercise/templates/gameIntro.html',
            controller: ['$scope', 'EnumSrv', function($scope, EnumSrv ) {

                $scope.gameTypesEnum = EnumSrv.gameTypes;
                $scope.gameTypesMap = EnumSrv.gameTypes.getEnumMap();

                function goBackHardwareHandler(){
                    $scope.handleClose();
                }
                var hardwareGoBackHandlerDestroyer = GoBackHardwareSrv.registerHandler(goBackHardwareHandler,undefined,true);
                $scope.$on('$destroy',function(){
                    if (hardwareGoBackHandlerDestroyer){
                        hardwareGoBackHandlerDestroyer();
                    }
                });
            }],
            link:function(scope){
                $ionicScrollDelegate.$getByHandle('game-intro').freezeScroll(!MobileSrv.isMobile());

                scope.subjectNameObj = {};
                scope.subjectNameObj[EnumSrv.subject.math.enum] =EnumSrv.subject.math.val;
                scope.subjectNameObj[EnumSrv.subject.reading.enum] = EnumSrv.subject.reading.val;
                scope.subjectNameObj[EnumSrv.subject.writing.enum] = EnumSrv.subject.writing.val;

                CategorySrv.getAllGeneralCategoryWithIcons().then(function(generalCategories){
                    var currentCategory = generalCategories[scope.categoryId()]
                    scope.svgIcon = currentCategory.svgIcon;
                    scope.categoryName = currentCategory.name;
                    scope.subjectName = scope.subjectNameObj[currentCategory.parentId];
                });

            }
        };

    }]);

})(angular);
