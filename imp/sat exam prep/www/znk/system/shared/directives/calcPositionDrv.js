
(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('calcPosition', [
        function () {
            return {
                restrict: "A",
                scope: {
                    onCalc: "&"
                },
                link: function(scope, element, attrs) {

                    if(angular.isDefined(attrs.middle)) {
                           scope.calcPosition = element[0].offsetLeft + (element[0].offsetWidth / 3);
                     } else {
                            scope.calcPosition = element[0].offsetLeft;
                    }


                    scope.onCalc( {val : scope} );
                }
            };
        }
    ]);
})(angular);
