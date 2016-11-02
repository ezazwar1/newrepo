/*global define, document, navigator*/
define([
    'angular',
    'app',
    'services/product',
    'services/browse',
    'factories/loading',
    'factories/modal',
    'directives/ionScroll'
], function (angular, app) {

    'use strict';

    app.controller('ProductSearchCtrl', [
        '$q',
        '$scope',
        '$rootScope',
        '$stateParams',
        '$ionicScrollDelegate',
        '$ionicViewService',
        'productService',
        'browseService',
        'LoadingFactory',
        'ModalFactory',
        function ($q, $scope, $rootScope, $stateParams, $ionicScrollDelegate, $ionicViewService, productService, browseService, LoadingFactory, ModalFactory) {
            var searchQuery = $stateParams.searchQuery,
                modal,
                abortPromises = [],
                settings = {};

            $ionicViewService.clearHistory();

            $scope.searchQuery = searchQuery;

            $scope.filterSettings = {};

            function setDefaultFilter(filter) {
                var i = 0,
                    filterSettings = {};

                for (i; i < filter.length; i = i + 1) {
                    filterSettings[filter[i].code] = 'default';
                }

                $scope.filterSettings = filterSettings;
            }

            $scope.loadProducts = function (init) {
                var loading,
                    i = abortPromises.length,
                    tasks = [];

                if (init) {
                    tasks.push(new LoadingFactory({
                        template: $rootScope.dict.searching
                    }));
                }

                abortPromises.push($q.defer());

                $q.all(tasks).then(function (results) {
                    loading = results[0];

                    productService.search(searchQuery, settings, init, abortPromises[i]).then(function (search) {
                        if (loading) {
                            loading.hide();
                        }
                        abortPromises.splice(i, 1);

                        $scope.products = search.products;
                        $scope.hasMoreItems = search.hasMoreItems;


                        if (init) {
                            $scope.filters = productService.filter;
                            setDefaultFilter(productService.filter);
                        }

                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }, function () {
                        if (loading) {
                            loading.hide();
                        }
                    });
                });
            };

            $scope.loadProducts(true);

            $scope.showProduct = function (productId) {
                browseService.navigate('search/product/' + productId);
            };

            // show filter modal
            $scope.showFilter = function (index) {
                var myModal = new ModalFactory($scope, 'searchFilter.html');
                // Modal is initialized
                myModal.then(function (theModal) {
                    modal = theModal;
                    $ionicScrollDelegate.resize();
                    // set modal content to clicked filter
                    if ($scope.filters[index]) {
                        $scope.filter = $scope.filters[index];
                        modal.show();
                    }
                });
            };

            // save filter value
            $scope.setFilter = function (filterCode) {
                var key,
                    loading,
                    i = 0;

                settings = angular.copy($scope.filterSettings);

                if (settings[filterCode]) {

                    for (key in settings) {
                        if (settings.hasOwnProperty(key) && (settings[key] === 'default')) {
                            delete settings[key];
                        }
                    }

                    for (i; i < abortPromises.length; i = i + 1) {
                        abortPromises[i].resolve();
                        abortPromises.splice(i, 1);
                    }

                    $scope.activeFilters = settings;

                    loading = new LoadingFactory();
                    loading.then(function (loadingOverlay) {
                        $scope.closeModal();

                        productService.search(searchQuery, settings).then(function (search) {
                            $scope.has_more_items = search.has_more_items;
                            $scope.products = search.products;
                            $ionicScrollDelegate.resize();
                            loadingOverlay.hide();
                        }, loadingOverlay.hide);
                    });
                }
            };

            // close filter modal
            $scope.closeModal = function () {
                modal.hide().then(function () {
                    modal.remove();
                });
            };

            // if state change started -> abort product loading requests
            $rootScope.$on('$stateChangeStart', function () {
                var i = 0;

                for (i; i < abortPromises.length; i = i + 1) {
                    abortPromises[i].resolve();
                    abortPromises.splice(i, 1);
                }
            });
        }
    ]);
});

