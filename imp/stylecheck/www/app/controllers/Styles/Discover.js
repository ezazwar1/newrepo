/*global define*/
define([
    'app',
    'services/api',
    'services/style',
    'services/browse',
    'factories/popup'
], function (app) {

    'use strict';

    app.controller('DiscoverCtrl', [
        '$q',
        '$scope',
        '$rootScope',
        '$ionicPopover',
        'apiService',
        'styleService',
        'browseService',
        'PopupFactory',
        function ($q, $scope, $rootScope, $ionicPopover, apiService, styleService, browseService, popupFactory) {
            var styleLimit = 5,
                loading = false;

            $scope.selectedCategories = [];
            $scope.filterSelected = false;

            // get style categories from config
            function getCategories() {
                if (apiService.config.categories) {
                    $scope.categories = apiService.config.categories;
                }
            }

            function createPopOver() {
                if ($scope.filterPopover) {
                    $scope.filterPopover.remove();
                }
                $ionicPopover.fromTemplateUrl('filterPopover.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.filterPopover = popover;
                });
            }

            function onTap() {
                $rootScope.resetHistory();
                $scope.filterSelected = false;
                $scope.selectedCategories = [];
                browseService.go('base.dashboard').then(function () {
                    createPopOver();
                });
            }

            // load next styles to discover
            function loadStyles(categories, limit, excludes, newCategories, categoriesChanged) {
                var q = $q.defer();
                loading = true;
                styleService.rate(categories, limit, excludes).then(function (newStyles) {
                    if (newStyles.length) {
                        if (styleService.discoverStyles.length && !newCategories) {
                            styleService.discoverStyles = styleService.discoverStyles.concat(newStyles);
                        } else {
                            styleService.discoverStyles = newStyles;
                        }
                    } else if (categories && categories.length && categoriesChanged) {
                        popupFactory({
                            title: $rootScope.dict.sorry,
                            template: $rootScope.dict.noStylesForFilter,
                            buttons: [
                                {
                                    text: $rootScope.dict.ok,
                                    type: 'button-outline button-assertive',
                                    onTap: onTap
                                }
                            ]
                        });
                    }
                    loading = false;
                    q.resolve();
                }, function () {
                    q.resolve();
                    loading = false;
                });

                return q.promise;
            }

            function popup() {
                return popupFactory({
                    title: $rootScope.dict.sorry,
                    template: $rootScope.dict.noStyles,
                    buttons: [
                        {
                            text: $rootScope.dict.ok,
                            type: 'button-outline button-assertive',
                            onTap: onTap
                        }
                    ]
                });
            }

            function getCurrentStyle() {
                var currentStyle = {};
                if (styleService.currentDiscoverStyle && styleService.currentDiscoverStyle._id) {
                    angular.forEach(styleService.discoverStyles, function (style, index) {
                        if (style._id === styleService.currentDiscoverStyle._id) {
                            styleService.discoverStyles.splice(index, 1);
                        }
                    });
                    currentStyle = styleService.currentDiscoverStyle;
                    styleService.currentDiscoverStyle = {};
                } else {
                    currentStyle = styleService.discoverStyles[0];
                }
                return currentStyle;
            }

            // set next style and load more if possible
            function getStyles(categories, limit, categoriesChanged) {
                var style;

                if (!styleService.discoverStyles.length || categoriesChanged) {
                    loadStyles(categories, limit, [], true, categoriesChanged).then(function () {
                        if (styleService.discoverStyles.length === 0) {
                            if ($scope.selectedCategories.length) {
                                return popupFactory({
                                    title: $rootScope.dict.sorry,
                                    template: $rootScope.dict.noStylesForFilter,
                                    buttons: [
                                        {
                                            text: $rootScope.dict.ok,
                                            type: 'button-outline button-assertive',
                                            onTap: onTap
                                        }
                                    ]
                                });
                            }
                            return popup();
                        }
                        style = getCurrentStyle();
                        $scope.$broadcast('styleLoaded', style);
                    });
                } else {
                    style = getCurrentStyle();
                    $scope.$broadcast('styleLoaded', style);
                    if (styleService.discoverStyles.length === 2 && !loading) {
                        loadStyles(categories, limit, styleService.discoverStyles);
                    }
                }
            }

            // state change
            getCategories();
            createPopOver();

            $scope.showPopover = function ($event) {
                $scope.filterPopover.show($event);
            };

            $scope.setCategory = function (index) {
                if ($scope.selectedCategories.indexOf($scope.categories[index]) > -1) {
                    $scope.selectedCategories.splice($scope.selectedCategories.indexOf($scope.categories[index]), 1);
                } else {
                    $scope.selectedCategories.push($scope.categories[index]);
                }
            };

            $scope.filter = function () {
                $scope.$broadcast('filerStyles');
                getStyles($scope.selectedCategories, styleLimit, true);
                $scope.filterSelected = $scope.selectedCategories.length ? true : false;
                $scope.filterPopover.hide();
            };

            $scope.$on('$ionicView.leave', function () {
                styleService.discoverStyles.length = 0;
            });

            // child state wants styles!
            $scope.$on('loadStyles', function () {
                getStyles($scope.selectedCategories, styleLimit);
            });
        }
    ]);
});
