/*global define, google, navigator*/
define([
    'angular',
    'app',
    'services/checkout',
    'services/browse',
    'factories/loading',
    'factories/popup'
], function (angular, app) {

    'use strict';

    app.controller('ShippingMethodCtrl', [
        '$ionicNavBarDelegate',
        '$scope',
        '$rootScope',
        'checkoutService',
        'browseService',
        'LoadingFactory',
        'PopupFactory',
        function ($ionicNavBarDelegate, $scope, $rootScope, checkoutService, browseService, LoadingFactory, PopupFactory) {
            var loading;

            $scope.shipping = {};

            $scope.goBack = function () {
                $ionicNavBarDelegate.back();
            };

            if (checkoutService.checkout.shippingMethod) {
                $scope.shipping.method = checkoutService.checkout.shippingMethod;
            }

            if (checkoutService.checkout.shippingMethods) {
                $scope.shippingMethods = checkoutService.checkout.shippingMethods;
            } else {
                loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    checkoutService.shippingMethods().then(function (shippingMethods) {
                        $scope.shippingMethods = shippingMethods;
                        loadingOverlay.hide();
                    }, loadingOverlay.hide);
                });
            }

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

            $scope.saveShippingMethod = function () {
                var loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    checkoutService.saveShippingMethod({
                        'shipping_method': $scope.shipping.method
                    }).then(function () {
                        loadingOverlay.hide();
                        $scope.info = undefined;
                        browseService.navigate('checkout/payment');
                    }, function (err) {
                        loadingOverlay.hide();
                        $scope.info = {
                            'class': 'assertive',
                            'msg': err.text
                        };
                    });
                });
            };
        }
    ]);
});
