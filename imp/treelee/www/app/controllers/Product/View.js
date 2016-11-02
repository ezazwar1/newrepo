/*global define, google, navigator, window, ionic, StatusBar*/
define([
    'angular',
    'app',
    'services/product',
    'services/browse',
    'services/cart',
    'factories/loading',
    'directives/pinchToZoom',
    'directives/imageOnLoad'
], function (angular, app) {

    'use strict';

    app.controller('ProductCtrl', [
        '$q',
        '$rootScope',
        '$scope',
        '$window',
        '$state',
        '$stateParams',
        'productService',
        'browseService',
        'cartService',
        'catalogService',
        'LoadingFactory',
        'ModalFactory',
        'PopupFactory',
        function ($q, $rootScope, $scope, $window, $state, $stateParams, productService, browseService, cartService, catalogService, LoadingFactory, ModalFactory, PopupFactory) {
            var productId = $stateParams.productId,
                categoryName = catalogService.activeCategory.name,
                loading = new LoadingFactory(),
                modalTasks = [],
                setZoomContainer = function (offset) {
                    var square;

                    if (window.innerWidth < window.innerHeight) {
                        square = window.innerWidth;
                    } else {
                        square = window.innerHeight - offset;
                    }

                    square = square.toString();
                    $scope.zoomImage.height = square + 'px';
                    $scope.zoomImage.width = square + 'px';
                };

            $scope.activeTab = 'overview';
            $scope.options = {};
            $scope.subOptions = [];
            //get category name when starting here?
            $scope.category = { name: categoryName };
            $scope.attributes = {};
            $scope.image = '';
            $scope.zoomImage = {
                content: '',
                height: 0,
                width: 0
            };
            $scope.hideBars = false;
            $scope.backSteps = -1;
            $scope.goBack = function () {
                browseService.back($scope.backSteps);
            };

            $window.addEventListener('orientationchange', function () {
                setZoomContainer(150);
            }, false);

            modalTasks.push(new ModalFactory($scope, 'chooseSize.html'));

            $q.all(modalTasks).then(function (modals) {
                $scope.showModal = function (index) {
                    if ($window.cordova && ionic.Platform.isIOS()) {
                        StatusBar.styleDefault();
                    }

                    modals[index].show();
                };

                $scope.closeModal = function (index) {
                    if ($window.cordova && ionic.Platform.isIOS()) {
                        StatusBar.styleLightContent();
                    }

                    modals[index].hide();
                };
            });

            $scope.$watch('info', function (info) {
                if (info && !angular.equals(info, {})) {
                    return new PopupFactory({
                        title: $rootScope.dict.error.title,
                        template: info.msg,
                        buttons : [{
                            type: 'button-energized',
                            text: $rootScope.dict.OK
                        }]
                    }, 'show');
                }
            });

            loading.then(function (loadingOverlay) {
                productService.get(productId).then(function (product) {
                    $scope.product = product;
                    setZoomContainer(150);
                    loadingOverlay.hide();
                }, function () {
                    loadingOverlay.hide();
                });
            });

            $scope.toggleBars = function () {
                $scope.$emit('togglebars');
            };

            $scope.showSubOptions = function (values) {
                if (values) {
                    $scope.subOptions = values;
                }
            };

            $scope.showSetSubOptions = function (values) {
                if (values) {
                    $scope.subOptions = values;
                } else {
                    $scope.setOptions();
                }
            };

            $scope.setOptions = function () {
                $scope.closeModal(0);
                $scope.addToBasket();
            };

            // add product to basket
            $scope.addToBasket = function () {
                var options = $scope.options,
                    product = $scope.product;

                if (Object.keys(options).length < product.options.length) {
                    //show info
                    $scope.showModal(0, '');
                } else {
                    //add
                    loading = new LoadingFactory();

                    loading.then(function (overlayLoading) {
                        cartService.add(product.entity_id, product.min_sale_qty, options).then(function () {
                            $scope.$emit('cartChanged');
                            overlayLoading.hide();
                        }, function () {
                            overlayLoading.hide();
                            $scope.info = {
                                'class': 'energized',
                                'msg': $rootScope.dict.error.quantity_not_available
                            };
                        });
                    });
                }
            };

            $scope.addAccessoryToBasket = function (productId, quantity, hasOptions, event) {
                if (!hasOptions) {
                    event.preventDefault();
                    event.stopPropagation();

                    loading = new LoadingFactory();

                    loading.then(function (overlayLoading) {
                        cartService.add(productId, quantity, $scope.options).then(function () {
                            $scope.$emit('cartChanged');
                            overlayLoading.hide();
                        }, function () {
                            overlayLoading.hide();
                        });
                    });
                }
            };

            $scope.showProduct = function (productId) {
                $scope.closeModal(2);
                var prefix = $state.current.name === 'shop.category.product' ? '/category' : '/search';

                browseService.navigate(prefix + '/product/' + productId);
            };

            $scope.changeContent = function (view) {
                $scope.backSteps -= 1;
                $scope.activeTab = view;
                browseService.navigate('category/product/' + $scope.product.entity_id + '/' + view);
            };
        }
    ]);
});
