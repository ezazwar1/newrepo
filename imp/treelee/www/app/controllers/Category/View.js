/*global define, google, navigator, window, ionic, StatusBar*/
define([
    'angular',
    'app',
    'services/catalog',
    'services/browse',
    'factories/loading',
    'factories/modal',
    'directives/ionScroll'
], function (angular, app) {

    'use strict';

    app.controller('CategoryCtrl', [
        '$q',
        '$scope',
        '$window',
        '$rootScope',
        '$stateParams',
        '$ionicScrollDelegate',
        '$ionicViewService',
        'catalogService',
        'browseService',
        'LoadingFactory',
        'ModalFactory',
        function ($q, $scope, $window, $rootScope, $stateParams, $ionicScrollDelegate, $ionicViewService, catalogService, browseService, LoadingFactory, ModalFactory) {
            var categoryId = $stateParams.categoryId,
                tasks = [],
                loading,
                modal,
                abortPromises = [],
                settings = {};

            $ionicViewService.clearHistory();
            $scope.filterSettings = {};

            function setDefaultFilter(filter) {
                var i = 0,
                    filterSettings = {};

                for (i; i < filter.length; i = i + 1) {
                    filterSettings[filter[i].code] = 'default';
                }

                $scope.filterSettings = filterSettings;
            }

            // check if the category was shown the last time
            if (catalogService.activeCategory && categoryId === catalogService.activeCategory.category_id) {
                // get stored values of the service
                $scope.category = catalogService.activeCategory;
                $scope.products = catalogService.activeProducts;

                if (catalogService.chosenFilterLength) {
                    $scope.totalCount = catalogService.chosenFilterLength;
                } else {
                    $scope.totalCount = $scope.category.product_count;
                }
                if (catalogService.activeFilter && catalogService.activeFilter.length) {
                    $scope.category.filter = catalogService.activeFilter;
                    setDefaultFilter(catalogService.activeFilter);
                } else {
                    catalogService.getFilter(categoryId).then(function (filter) {
                        $scope.category.filter = filter;
                        setDefaultFilter(filter);
                    });
                }
            } else {
                // load data from api
                tasks.push(catalogService.getProducts(categoryId));
                tasks.push(catalogService.getFilter(categoryId));


                loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    $q.all(tasks).then(function (results) {
                        loadingOverlay.hide();
                        $scope.category = catalogService.activeCategory;
                        $scope.category.filter = results[1];
                        setDefaultFilter(results[1]);
                        $scope.totalCount = $scope.category.product_count;
                        $scope.products = results[0];
                        catalogService.chosenFilterLength = '';
                    }, loadingOverlay.hide);
                });
            }

            // lazy loading for products
            $scope.loadProducts = function () {
                var i = abortPromises.length;
                abortPromises.push($q.defer());
                $scope.productsLoading = true;
                catalogService.getProducts(categoryId, settings, abortPromises[abortPromises.length - 1]).then(function (products) {
                    $scope.productsLoading = false;
                    abortPromises.splice(i, 1);
                    $scope.products = products;
                    $scope.category.has_more_items = catalogService.activeCategory.has_more_items;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function () {
                    $scope.productsLoading = false;
                });
            };

            // show filter modal
            $scope.showModal = function () {
                var myModal = new ModalFactory($scope, 'categoryFilter.html');
                // Modal is initialized
                myModal.then(function (theModal) {
                    modal = theModal;
                    $scope.showFilter(0);
                });
            };

            // display the choosen filter
            $scope.showFilter = function (index) {
                if ($scope.category.filter[index]) {
                    $scope.activeFilter = $scope.category.filter[index].code;
                    $scope.filter = $scope.category.filter[index];
                    modal.show();

                    if ($window.cordova && ionic.Platform.isIOS()) {
                        StatusBar.styleDefault();
                    }
                }
            };

            // save filter value
            $scope.setFilter = function (filterCode, filterItems) {
                var key,
                    i = 0;

                settings = angular.copy($scope.filterSettings);

                if (settings[filterCode]) {

                    for (key in settings) {
                        if (settings.hasOwnProperty(key) && (settings[key] === 'default')) {
                            delete settings[key];
                        }
                    }

                    $scope.activeFilters = settings;

                    loading = new LoadingFactory();
                    loading.then(function (loadingOverlay) {
                        $scope.closeModal();

                        for (i; i < abortPromises.length; i = i + 1) {
                            abortPromises[i].resolve();
                            abortPromises.splice(i, 1);
                        }

                        catalogService.getProducts(categoryId, settings).then(function (products) {
                            $scope.category.has_more_items = catalogService.activeCategory.has_more_items;
                            $scope.products = products;
                            //set correct length
                            $scope.totalCount = filterItems;
                            catalogService.chosenFilterLength = filterItems;
                            $ionicScrollDelegate.resize();
                            loadingOverlay.hide();
                        }, loadingOverlay.hide);
                    });
                }
            };

            $scope.deleteFilter = function () {
                var newSettings = '';
                loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    $scope.closeModal();

                    catalogService.getProducts(categoryId, newSettings).then(function (products) {
                        $scope.category.has_more_items = catalogService.activeCategory.has_more_items;
                        $scope.products = products;
                        $scope.totalCount = $scope.category.product_count;
                        catalogService.chosenFilterLength = '';
                        setDefaultFilter(catalogService.activeFilter);
                        $scope.activeFilters = {};
                        $ionicScrollDelegate.resize();
                        loadingOverlay.hide();
                    }, loadingOverlay.hide);
                });
            };

            // close filter modal
            $scope.closeModal = function () {
                modal.hide().then(function () {
                    modal.remove();

                    if ($window.cordova && ionic.Platform.isIOS()) {
                        StatusBar.styleLightContent();
                    }
                });
            };

            // navigate to product
            $scope.showProduct = function (productId) {
                browseService.navigate('category/product/' + productId);
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
