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

    app.controller('BillingAddressCtrl', [
        '$ionicNavBarDelegate',
        '$q',
        '$scope',
        '$rootScope',
        'checkoutService',
        'browseService',
        'userService',
        'LoadingFactory',
        'ModalFactory',
        'PopupFactory',
        function ($ionicNavBarDelegate, $q, $scope, $rootScope, checkoutService, browseService, userService, LoadingFactory, ModalFactory, PopupFactory) {
            var loading,
                modalTasks = [];

            $scope.changeAddress = { id: '' };

            $scope.goBack = function () {
                $ionicNavBarDelegate.back();
            };

            modalTasks.push(new ModalFactory($scope, 'chooseAddress.html'));

            $q.all(modalTasks).then(function (modals) {
                $scope.showModal = function (index) {
                    modals[index].show();
                };

                $scope.closeModal = function (index) {
                    modals[index].hide();
                };
            });

            if (userService.logged_in === true) {
                $scope.loggedIn = true;
            }

            if (userService.address && userService.address.additional) {
                $scope.additionalAdresses = userService.address.additional;
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

            if (checkoutService.checkout.billingAddress) {
                $scope.billing = checkoutService.checkout.billingAddress;
            } else {
                $scope.billing = {
                    'billing[save_in_address_book]': 1,
                    'billing[use_for_shipping]': 0
                };
            }

            if ($scope.loggedIn && !checkoutService.checkout.billingAddress) {
                $scope.addressInfo = {
                    'class': 'assertive',
                    'msg': $rootScope.dict.error.load_customer_form_problem //error.text
                };
            }

            if (checkoutService.checkout.billingForm) {
                $scope.billingFields = checkoutService.checkout.billingForm;
            } else {
                loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    checkoutService.billingForm().then(function (billingFields) {
                        $scope.billingFields = billingFields;
                        loadingOverlay.hide();
                    }, loadingOverlay.hide);
                });
            }

            // show region input or selectbox for country
            $scope.checkRelation = function (fieldIndex, optionValue, initValue) {
                var options = $scope.billingFields[fieldIndex] && $scope.billingFields[fieldIndex].values && $scope.billingFields[fieldIndex].values && $scope.billingFields[fieldIndex].values ? $scope.billingFields[fieldIndex].values : undefined,
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
                                $scope.billing['billing[region_id]'] = undefined;
                            }
                            $scope.showRegionTextField = false;
                        } else if (option['@attributes'].relation === 'region_id' && option.regions && option.regions.region_item) {
                            $scope.showRegionTextField = false;
                            $scope.billing['billing[region]'] = undefined;
                            if (angular.isArray(option.regions.region_item)) {
                                regions = angular.copy(option.regions.region_item);
                            } else if (angular.isObject(option.regions.region_item)) {
                                regions = [angular.copy(option.regions.region_item)];
                            }

                            if (regions.length) {
                                if (!initValue || !$scope.billing['billing[region_id]']) {
                                    $scope.billing['billing[region_id]'] = regions[0].value;
                                }
                            }
                            $scope.regions = regions;
                        }
                    }
                }
            };

            $scope.newAddress = function () {
                checkoutService.checkout.billingAddress = {};
                $scope.billing = {
                    'billing[save_in_address_book]': 1,
                    'billing[use_for_shipping]': 0
                };
                //scroll to top?
            };

            $scope.setAddress = function () {
                var i = 0;
                //fill in chosen one
                for (i; i < $scope.additionalAdresses.length; i = i + 1) {
                    if ($scope.additionalAdresses[i].entity_id === $scope.changeAddress.id) {
                        checkoutService.checkout.billingAddress = {};
                        $scope.billing = {
                            'billing[firstname]': $scope.additionalAdresses[i].firstname,
                            'billing[lastname]': $scope.additionalAdresses[i].lastname,
                            'billing[company]': $scope.additionalAdresses[i].company,
                            'billing[email]': $scope.additionalAdresses[i].email,
                            'billing[street][]': $scope.additionalAdresses[i].street,
                            'billing[postcode]': $scope.additionalAdresses[i].postcode,
                            'billing[city]': $scope.additionalAdresses[i].city,
                            'billing[telephone]': $scope.additionalAdresses[i].telephone,
                            'billing[country_id]': $scope.additionalAdresses[i].country_id,
                            'billing[region_id]': $scope.additionalAdresses[i].region_id,
                            'billing[use_for_shipping]': 0
                        };
                    }
                }
                $scope.closeModal(0);
            };

            $scope.deleteAddress = function () {
                //ToDo: ask?
                var loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    userService.deleteAddress(checkoutService.checkout.billingAddress['billing[entity_id]']).then(function () {
                        $scope.recoverInfo = {
                            'class': 'balanced',
                            'msg': $rootScope.dict.success.address_deleted
                        };
                        $scope.recover = {};
                        //other addresses saved: fill in
                        //no other addresses: show empty form
                        userService.getUserAddress().then(function () {
                            checkoutService.prefillSaved(userService.address);
                            loadingOverlay.hide();
                            browseService.navigate('/checkout/billing', true);
                        }, function () {
                            loadingOverlay.hide();
                            $scope.addressInfo = {
                                'class': 'assertive',
                                'msg': $rootScope.dict.error.load_customer_form_problem
                            };
                        });
                    }, function () {
                        $scope.recoverInfo = {
                            'class': 'assertive',
                            'msg': $rootScope.dict.error.address_not_deleted
                        };
                        loadingOverlay.hide();
                    });
                });
            };

            $scope.saveBilling = function () {
                var loading = new LoadingFactory();

                loading.then(function (loadingOverlay) {
                    //if newly registered, save address to user
                    if (!$scope.billing['billing[entity_id]']) {
                        userService.buildBillingAddress($scope.billing);
                    }
                    checkoutService.saveBilling($scope.billing).then(function () {
                        //if billing address == shipping address, proceed to shipping methods
                        if ($scope.billing['billing[use_for_shipping]'] && checkoutService.checkout.shippingAddress) {
                            $scope.shipping = checkoutService.checkout.shippingAddress;
                            if (!$scope.shipping['shipping[entity_id]']) {
                                userService.buildShippingAddress($scope.shipping);
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
                        } else {
                            loadingOverlay.hide();
                            $scope.info = undefined;
                            browseService.navigate('checkout/shipping');
                        }
                    }, function (err) {
                        loadingOverlay.hide();
                        $scope.info = {
                            'class': 'assertive',
                            msg: err.text
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
