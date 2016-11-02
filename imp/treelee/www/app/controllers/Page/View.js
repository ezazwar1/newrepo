/*global define, document, navigator*/
define([
    'app',
    'services/page'
], function (app) {

    'use strict';

    app.controller('PageCtrl', [
        '$scope',
        '$state',
        '$ionicViewService',
        'pageService',
        function ($scope, $state, $ionicViewService, pageService) {
            var pageId = $state.params.pageId;

            $ionicViewService.clearHistory();

            pageService.get(pageId).then(function (page) {
                $scope.page = page;
            });
        }
    ]);
});

