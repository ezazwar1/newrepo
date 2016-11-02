/*global angular*/
'use strict';

angular.module('stohke.controllers')

.controller('HomeController', ['$scope', 'userService', function ($scope, userService) {
    $scope.userMedia = {};
}]);