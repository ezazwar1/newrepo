/*globals define, Image*/
define([
    'app'
], function (app) {

    'use strict';

    var directive = [
        '$rootScope',
        function ($rootScope) {
            return {
                scope: {
                    'limit': '=',
                    'hint': '=',
                    'model': '='
                },
                link: function ($scope, element) {
                    var hint;
                    $scope.inputLength = $scope.limit;


                    if ($scope.hint) {
                        hint = angular.element('<span class="small stable full-width text-right">' + $scope.inputLength + ' ' + $rootScope.dict.charactersLeft + '</span>');
                        element.after(hint);
                    }

                    $scope.$watch(function () {
                        return $scope.model;
                    }, function (model) {
                        if (model || model === '') {
                            if ($scope.limit >= $scope.model.length && hint) {
                                $scope.inputLength = $scope.limit - $scope.model.length;
                                hint.html($scope.inputLength + ' ' + $rootScope.dict.charactersLeft);
                            } else if ($scope.limit < $scope.model.length) {
                                $scope.model = $scope.model.slice(0, $scope.limit);
                            }
                        }
                    });
                }
            };
        }
    ];

    app.directive('inputDelimiter', directive);

    return directive;
});
