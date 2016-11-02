/*global define*/
define([
    'app',
    'services/api',
    'services/browse',
    'services/style',
    'services/user'
], function (app) {

    'use strict';

    app.controller('ChooseCategoryCtrl', [
        '$scope',
        '$timeout',
        'apiService',
        'browseService',
        'styleService',
        'userService',
        function ($scope, $timeout, apiService, browseService, styleService, userService) {

            function getCategories() {
                if (userService.user._id) {
                    $scope.categories = apiService.config.categories;
                }
            }
            // state change
            getCategories();
            // reload
            $scope.$on('userLoaded', getCategories);

            $scope.setCategory = function (index) {
                styleService.newStyle.category = $scope.categories[index];

                $timeout(function () {
                    browseService.go('base.createStyle.tags.addTags');
                }, 300);
            };
        }
    ]);
});
