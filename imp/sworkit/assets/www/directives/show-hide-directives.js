angular.module('swMobileApp').directive('showHideContainer', function () {
    return {
        scope: {},
        controller: function ($scope, $element, $attrs) {
            $scope.show = false;

            $scope.toggleType = function ($event) {
                $event.stopPropagation();
                $event.preventDefault();

                $scope.show = !$scope.show;

                // Emit event
                $scope.$broadcast("toggle-type", $scope.show);
            };
        },
        templateUrl: 'components/accounts/login/partials/show-hide-password.html',
        restrict: 'A',
        replace: false,
        transclude: true
    };
})


    .directive('showHideInput', function () {
        return {
            scope: {},
            link: function (scope, element, attrs) {
                // listen to event
                scope.$on("toggle-type", function (event, show) {
                    var password_input = element[0],
                        input_type = password_input.getAttribute('type');

                    if (!show) {
                        password_input.setAttribute('type', 'password');
                    }

                    if (show) {
                        password_input.setAttribute('type', 'text');
                    }
                });
            },
            require: '^showHideContainer',
            restrict: 'A',
            replace: false,
            transclude: false
        };
    });

