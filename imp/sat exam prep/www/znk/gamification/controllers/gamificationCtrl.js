'use strict';

(function (angular) {
    angular.module('znk.sat').controller('GamificationCtrl', ['$scope',
        function ($scope) {

            var vm = this;

            $scope.onGameifictionHandler = function(gameObj) {
                vm.gameObj = gameObj;
            };

        }]);
})(angular);
