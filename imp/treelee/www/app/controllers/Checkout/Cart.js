/*global define, google, navigator*/
define([
    'app',
    'services/cart',
    'services/checkout',
    'services/user',
    'services/browse',
    'factories/loading'
], function (app) {

    'use strict';

    app.controller('CartCtrl', [
        '$scope',
        '$timeout',
        '$ionicNavBarDelegate',
        'cartService',
        'userService',
        'checkoutService',
        'browseService',
        'LoadingFactory',
        function ($scope, $timeout, $ionicNavBarDelegate, cartService, userService, checkoutService, browseService, LoadingFactory) {
            var loading = new LoadingFactory(),
                timer;

            $scope.goBack = function () {
                $ionicNavBarDelegate.back();
            };

            $scope.error = {};

            loading.then(function (loadingOverlay) {
                cartService.get().then(function (cart) {
                    $scope.cart = cart;
                    loadingOverlay.hide();
                }, loadingOverlay.hide);
            });

            $scope.update = function (code, quantity, item_id, index) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function () {
                    var loading = new LoadingFactory();
                    loading.then(function (loadingOverlay) {
                        $scope.error[item_id] = undefined;

                        cartService.update(code, quantity).then(function () {
                            cartService.get().then(function (cart) {
                                $scope.cart = cart;
                                loadingOverlay.hide();
                            }, function () {
                                loadingOverlay.hide();
                                browseService.reload();
                            });
                        }, function (err) {
                            $scope.error[item_id] = err.text;
                            $scope.cart.products[index].qty = $scope.cart.products[index].initQty;
                            loadingOverlay.hide();
                        });
                    });
                }, 1500);
            };

            $scope.remove = function (item_id) {
                var loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    cartService.remove(item_id).then(function () {
                        cartService.get().then(function (cart) {
                            $scope.$emit('cartChanged');
                            $scope.cart = cart;
                            loadingOverlay.hide();
                        }, function () {
                            loadingOverlay.hide();
                            browseService.reload();
                        });
                    }, loadingOverlay.hide);
                });
            };

            $scope.checkout = function () {
                checkoutService.checkout = {};
                loading.then(function (loadingOverlay) {
                    userService.loggedIn().then(function (loggedIn) {
                        if (!loggedIn) {
                            loadingOverlay.hide();
                            browseService.navigate('/checkout/auth');
                        } else {
                            userService.getUserAddress().then(function () {
                                checkoutService.prefillSaved(userService.address);
                                loadingOverlay.hide();
                                browseService.navigate('/checkout/billing');
                            });
                        }
                    }, loadingOverlay.hide);
                });
            };
        }
    ]);
});
