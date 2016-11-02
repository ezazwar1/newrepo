/*global define, google, navigator*/
define([
    'app',
    'services/cart',
    'directives/imageOnLoad'
], function (app) {

    'use strict';

    app.controller('ProductListCtrl', [
        '$scope',
        '$window',
        '$state',
        'cartService',
        'productService',
        'LoadingFactory',
        function ($scope, $window, $state, cartService, productService, LoadingFactory) {
            var loading;

            $window.addEventListener('orientationchange', function () {
                $state.reload();
            }, false);

            // add product to basket
            $scope.addToBasket = function (event, productId, quantity, hasOptions) {
                if (!hasOptions) {
                    event.stopPropagation();
                    event.preventDefault();

                    loading = new LoadingFactory();

                    loading.then(function (overlayLoading) {
                        cartService.add(productId, quantity).then(function () {
                            $scope.$emit('cartChanged');
                            overlayLoading.hide();
                        }, overlayLoading.hide);
                    });
                }
            };

            $scope.getItemHeight = function () {
                if (productService.containerHeight) {
                    return productService.containerHeight;
                }

                var container = document.getElementsByClassName('product-container')[0];
                if (container) {
                    productService.containerHeight = container.offsetHeight;
                    return productService.containerHeight;
                }
            };

            $scope.getItemWidth = function () {
                if (productService.containerWidth) {
                    return productService.containerWidth;
                }

                var container = document.getElementsByClassName('product-container')[0];
                if (container) {
                    productService.containerWidth = container.offsetWidth - 2;
                    return productService.containerWidth;
                }
            };
        }
    ]);
});
