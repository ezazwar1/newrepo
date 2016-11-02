/*global define*/
define([
    'app',
    'services/browse',
    'directives/imageOnLoad'
], function (app) {

    'use strict';

    app.controller('ProfileCtrl', [
        '$scope',
        'browseService',
        function ($scope, browseService) {

            $scope.showDetail = function (id) {
                browseService.go('base.profile.styleDetail', {id: id});
            };

            $scope.goToUser = function (id) {
                browseService.go('base.profile.overview', {userId: id});
            };
        }
    ]);
});
