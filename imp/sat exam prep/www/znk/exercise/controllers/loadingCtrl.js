'use strict';

(function(angular) {

    angular.module('znk.sat').controller('LoadingCtrl', ['$scope', '$interval', LoadingCtrl]);

    function LoadingCtrl($scope, $interval) {
        var _intervalPromise;

        // may have been injected
        $scope.d = $scope.d || {};
        $scope.d.loadingText = $scope.d.loadingText || 'Loading...';

        if ($scope.d.countdown) {
            _intervalPromise = $interval(function() {
                $scope.d.countdown--;
            }, 1000, $scope.d.countdown);

            // handle countdown finish
            _intervalPromise.then(function() {
                $scope.close();
            });
        }

        $scope.$on('$destroy', function() {
            if (_intervalPromise) {
                $interval.cancel(_intervalPromise);
            }
        });
    }

})(angular);
