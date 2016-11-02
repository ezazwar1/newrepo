/*global define, google, navigator*/
define([
    'angular',
    'app',
    'services/user',
    'services/checkout',
    'services/browse',
    'factories/loading',
    'factories/popup'
], function (angular, app) {

    'use strict';

    app.controller('ShippingAddressCtrl', [
        '$ionicNavBarDelegate',
        '$scope',
        '$rootScope',
        'checkoutService',
        'browseService',
        'userService',
        'LoadingFactory',
        'PopupFactory',
        function ($ionicNavBarDelegate, $scope, $rootScope, checkoutService, browseService, userService, LoadingFactory, PopupFactory) {
            var loading;

            $scope.goBack = function () {
                $ionicNavBarDelegate.back();
            };

            if (checkoutService.checkout.shippingAddress) {
                $scope.shipping = checkoutService.checkout.shippingAddress;
            } else {
                $scope.shipping = {};
            }

            if (checkoutService.checkout.shippingForm) {
                $scope.shippingFields = checkoutService.checkout.shippingForm;
            } else {
                loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    checkoutService.shippingForm().then(function (shippingFields) {
                        $scope.shippingFields = shippingFields;
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

            $scope.checkRelation = function (fieldIndex, optionValue, initValue) {
                var options = $scope.shippingFields[fieldIndex] && $scope.shippingFields[fieldIndex].values && $scope.shippingFields[fieldIndex].values && $scope.shippingFields[fieldIndex].values ? $scope.shippingFields[fieldIndex].values : undefined,
                    i = 0,
                    option,
                    regions = [];

                if (options) {
                    for (i; i < options.length; i = i + 1) {
                        if (options[i].value === optionValue) {
                            option = options[i];
                            break;
                        }
                    }
                }

                if (option) {
                    if (option['@attributes'] && option['@attributes'].relation) {
                        if (option['@attributes'].relation === 'region') {
                            if ($scope.regions) {
                                $scope.regions.length = 0;
                                $scope.shipping['shipping[region_id]'] = undefined;
                            }
                            $scope.showRegionTextField = false;
                        } else if (option['@attributes'].relation === 'region_id' && option.regions && option.regions.region_item) {
                            $scope.showRegionTextField = false;
                            $scope.shipping['shipping[region]'] = undefined;
                            if (angular.isArray(option.regions.region_item)) {
                                regions = angular.copy(option.regions.region_item);
                            } else if (angular.isObject(option.regions.region_item)) {
                                regions = [angular.copy(option.regions.region_item)];
                            }

                            if (regions.length) {
                                if (!initValue || !$scope.shipping['shipping[region_id]']) {
                                    $scope.shipping['shipping[region_id]'] = regions[0].value;
                                }
                            }
                            $scope.regions = regions;
                        }
                    }
                }
            };

            $scope.saveShipping = function () {
                var loading = new LoadingFactory();

                loading.then(function (loadingOverlay) {
                    //if newly registered, save address to user
                    if (!$scope.shipping['shipping[entity_id]']) {
                        var addressData = {
                            "firstname": $scope.shipping['shipping[firstname]'],
                            "lastname": $scope.shipping['shipping[lastname]'],
                            "street[]": $scope.shipping['shipping[street][]'],
                            "city": $scope.shipping['shipping[city]'],
                            "country_id": $scope.shipping['shipping[country_id]'],
                            "region_id": $scope.shipping['shipping[region_id]'],
                            "postcode": $scope.shipping['shipping[postcode]'],
                            "telephone": $scope.shipping['shipping[telephone]'],
                            "default_shipping": 1
                        };
                        userService.saveAddress(addressData);
                    }
                    checkoutService.saveShipping($scope.shipping).then(function () {
                        loadingOverlay.hide();
                        $scope.info = undefined;
                        browseService.navigate('checkout/shipping_method');
                    }, function (err) {
                        loadingOverlay.hide();
                        $scope.info = {
                            'class': 'assertive',
                            'msg': err.text
                        };
                    });
                });
            };

            $scope.setSubmit = function () {
                $scope.submitted = true;
            };
        }
    ]);
});
