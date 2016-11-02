'use strict';

/**
* @ngdoc controller
* @name cart.module.controller:CartHomeCtrl
* @requires $scope
* @requires $rootScope
* @requires $ionicLoading
* @requires CartService
* @description
* Show the home page of cart module. Contains the items of current shopping cart. Lists down
* all items added to the cart. Can proceed to the next step of the checkout process.
* 
* Here we check for the existance of any payment module within the app. It checks if any valid $state route exists 
* with selected payment method name. These payment modules are registered in `payment_modules` folder. Please check
* `www/app/payment_modules/payment_modules.module.js`. 
* If a payment module is found the order is not placed from here. The payment module is responsible for placing the order
* or handling any 3rd party API call done and finally to place the order. Most of the payment gateways in OpenCart create
* the order first, with state_id = 0. These orders can be found in admin panel, orders section when filters for `missing` state.
* Once the payment is confirmed the status is set to `processed` or `completed`
*/
angular
    .module('cart.module')
    .controller('CartHomeCtrl', function ($scope, $rootScope, $ionicLoading, CartService, COUPONS_ENABLED) {
        var vm = this;
        $scope.items = [];
        $scope.dataLoaded = false;
        $scope.couponAdded = false;
		$scope.coupons_enabled = COUPONS_ENABLED;

        $scope.loadCart = function () {
            $ionicLoading.show();
            CartService.GetCart().then(function (data) {
                $scope.items = data.products;
                $scope.totals = data.totals;
                $scope.error = data.error;
                $scope.total_amount_clean = data.total_amount_clean;
                $scope.total_amount = data.total_amount;
                $rootScope.currency = data.currency;
                $rootScope.cartItemCount = parseInt(data.total_item_count);
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
            }, function (data) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
            });
        }

        $scope.removeCartItem = function (id) {
            CartService.RemoveCartItem(id).then(function (data) {
                $scope.loadCart();
            });
        }

        $scope.quantityChanged = function (cartItemId, quantity) {
            $ionicLoading.show();
            // save cart item quantity
            CartService.UpdateCartItemQuantity(cartItemId, quantity).then(function (data) {
                $scope.loadCart();
            }, function (data) {
                alert("Error while changing the quantity. Please try again");
                $ionicLoading.hide();
            });
        }

        $scope.submitCoupon = function (coupon) {
            $ionicLoading.show();
            // save cart item quantity
            CartService.ApplyCoupon(coupon).then(function (data) {
                $scope.loadCart();
				$ionicLoading.hide();
                $scope.couponAdded = true;
                alert(data.success);
            }, function (data) {
                alert(data);
                $scope.loadCart();
                $ionicLoading.hide();
                $scope.couponAdded = false;
            });
        }

        $scope.$on('$ionicView.enter', function () {
            $scope.dataLoaded = false;
            $scope.loadCart();
        });

    });

/**
* @ngdoc controller
* @name cart.module.controller:CartCheckoutCtrl
* @requires $scope
* @requires $rootScope
* @requires $state
* @requires $localStorage
* @requires $ionicTabsDelegate
* @requires $ionicModal
* @requires $ionicLoading
* @requires $ionicPopup
* @requires appService
* @requires CartService
* 
* @description
* Contains checkout process. Customer can place an order by providing personal information, selecting 
* a shipping method and a payment method. If selected payment method is registered as a module in the app,
* it initiates the online payment flow as the last step of the checkout procedure.
*/
angular
    .module('cart.module')
    .controller('CartCheckoutCtrl', function ($scope, $rootScope, $state, $localStorage, $ionicTabsDelegate, $ionicModal, $ionicLoading, $ionicPopup, appService, CartService) {
        var vm = this;
        // sync form input to localstorage
        $localStorage.checkout = $localStorage.checkout || {};
        $scope.checkout = $localStorage.checkout;

        $rootScope.paymentAndShipping = $rootScope.paymentAndShipping || {};
        $rootScope.currency = $rootScope.currency || "USD";
        $scope.forms = {};
        $scope.checkout.personaInfo = 3;
        $scope.items = [];
        $scope.card = {};

        $scope.loadCart = function (silent) {
            if (!silent)
                $ionicLoading.show();

            CartService.GetCart().then(function (data) {
                if (data && data.products && data.products.length < 1) {
                    $state.go('app.menu.cart.home', {}, { reload: true });
                }

                $rootScope.currency = data.currency;
                $scope.items = data.products;
                $scope.error = data.error;
                $scope.totals = data.totals;
                $scope.total_amount_clean = data.total_amount_clean;
                $scope.total_amount = data.total_amount;
                $rootScope.cartItemCount = parseInt(data.total_item_count);
                $ionicLoading.hide();
            }, function (data) {
                $ionicLoading.hide();
            });
        }

        $scope.$on('$ionicView.enter', function () {
            $scope.checkout.personaInfo = 3;
            

            // each view of cart tab, load the shopping cart and update with latest info
            $scope.loadCart();

            if ($state.is("app.menu.cart.checkout")) {
                $scope.loadPersonalInfo();
            } else if ($state.is("app.menu.cart.checkoutstep2")) {
                $scope.loadShippingMethods();
                $scope.loadPaymentMethods();
            } else if ($state.is("app.menu.cart.checkoutstep3")) {
                // loads the cart
            }
        });

        // loads shipping methods to UI
        $scope.loadShippingMethods = function () {

            $rootScope.paymentAndShipping.shipping_method = null;

            CartService.GetShippingMethods().then(function (data) {
                $scope.shippingMethods = data;
            });
        }

        // loads payment methods to UI
        $scope.loadPaymentMethods = function () {
            $ionicLoading.show();

            $rootScope.paymentAndShipping.payment_method = null;

            CartService.GetPaymentMethods().then(function (data) {
                $scope.paymentMethods = data;
                $ionicLoading.hide();
            }, function (data) {
                alert("Error while loading payment methods");
                $ionicLoading.hide();
            });
        }

        // loads user info to UI
        $scope.loadPersonalInfo = function () {

            $ionicLoading.show();

            if ($localStorage.user) {
                ["customer_id", "firstname", "lastname", "email", "telephone"].forEach(function (e) {
                    $scope.checkout[e] = $localStorage.user[e];
                })
            }

            CartService.GetAddress().then(function (data) {
                $scope.countries = data.countries;

                if (data.defaultAddress) {
                    ["address_id", "address_1", "address_2", "city", "country_id", "zone_id", "postcode"].forEach(function (e) {
                        $scope.checkout[e] = data.defaultAddress[e];
                    })
                }

                $ionicLoading.hide();
            }, function (data) {
                $ionicLoading.hide();
            });
        }

        // save personal info
        $scope.savePersonalInfo = function () {
            if ($scope.forms.checkoutForm.$invalid) {
                $ionicPopup.alert({
                    title: 'Oops! Please fill all fields',
                    cssClass: 'desc-popup',
                    scope: $scope,
                    templateUrl: 'app/cart/templates/popups/missing-step1.html'
                });
            } else {
                $ionicLoading.show();

                CartService.SetPersonalInfo($scope.checkout).then(function (data) {
                    $scope.checkout.personaInfo--;
                }, function (data) {
                    $ionicLoading.hide();
                });

                // if logged in, save address and forget the request
                if ($localStorage.user) {
                    CartService.SetAddress($scope.checkout);
                }

                CartService.SetShippingAddress($scope.checkout).then(function (data) {
                    $scope.checkout.personaInfo--;
                }, function (data) {
                    $ionicLoading.hide();
                });

                CartService.SetPaymentAddress($scope.checkout).then(function (data) {
                    $scope.checkout.personaInfo--;
                }, function (data) {
                    $ionicLoading.hide();
                });
            }
        }

        // show invoice [last step before the order is added]
        $rootScope.loadInvoice = function () {
            if ($scope.forms.checkoutForm && $scope.forms.checkoutForm.$invalid) {
                $ionicPopup.alert({
                    title: 'Oops! Please fill following fields',
                    cssClass: 'desc-popup',
                    scope: $scope,
                    templateUrl: 'app/cart/templates/popups/missing-step2.html'
                });
            } else {
                // load invoice
                $state.go("app.menu.cart.checkoutstep3", {}, { reload: true });
            }
        };

        // method to be called when shipping method is changed by user
        $scope.shippingMethodChanged = function () {
            $ionicLoading.show();

            // save shipping method and load payment methods
            CartService.SaveShippingMethod($rootScope.paymentAndShipping).then(function (data) {
                $rootScope.paymentAndShipping.payment_method = null;
                $ionicLoading.hide();
                $scope.loadPaymentMethods();
                $scope.loadCart(true);
            }, function (data) {
                alert("Error while saving shipping method");
                $ionicLoading.hide();
            });
        }

        // method to be called when payment method is changed by user
        $scope.paymentMethodChanged = function () {
            $ionicLoading.show();

            // save payment methods
            CartService.SavePaymentMethod($rootScope.paymentAndShipping).then(function (data) {
                $ionicLoading.hide();
            }, function (data) {
                alert("Error while saving payment method");
                $ionicLoading.hide();
            });
        }

        // method to be called when country is changed by user
        $scope.countryChanged = function () {
            $ionicLoading.show();

            // save payment methods
            CartService.LoadZones($scope.checkout['country_id']).then(function (data) {
                $ionicLoading.hide();
                $scope.zones = data.zones;
            }, function (data) {
                alert("Error while loading zones");
                $ionicLoading.hide();
            });
        }

        // place the order and if any payment module is registered, navigate to them
        $rootScope.confirmOrder = function () {
            if ($scope.forms.checkoutForm && $scope.forms.checkoutForm.$invalid) {
                $ionicPopup.alert({
                    title: 'Oops! Please fill following fields',
                    cssClass: 'desc-popup',
                    scope: $scope,
                    templateUrl: 'app/cart/templates/popups/missing-step2.html'
                });
            } else {
                // here we check for the existance of any payment module within the app. It checks if any valid $state route exists 
                // with selected payment method name. These payment modules are registered in `payment_modules` folder. Please check
                // `www/app/payment_modules/payment_modules.module.js`. 
                // If a payment module is found the order is not placed from here. The payment module is responsible for placing the order
                // or handling any 3rd party API call done and finally to place the order. Most of the payment gateways in OpenCart create
                // the order first, with state_id = 0. These orders can be found in admin panel, orders section when filters for `missing` state.
                // Once the payment is confirmed the status is set to `processed` or `completed`

                if ($state.get("app.menu.payment_modules." + $rootScope.paymentAndShipping.payment_method + ".home")) {
                    $ionicLoading.hide();
                    $state.go("app.menu.payment_modules." + $rootScope.paymentAndShipping.payment_method + ".home", { checkout: $scope.checkout, currency: $rootScope.currency, total_amount: $scope.total_amount, total_amount_clean: $scope.total_amount_clean, success_state: "app.menu.cart.order_added" }, { reload: true });
                } else {
                    $ionicLoading.show();

                    CartService.AddOrder($rootScope.paymentAndShipping).then(function (data) {
                        $ionicLoading.hide();

                        // set cart badge to empty
                        $rootScope.cartItemCount = "";
                        $state.go("app.menu.cart.order_added");
                    }, function (data) {
                        if (angular.isString(data)) {
                            alert(data);
                            $ionicLoading.hide();
                        } else if (data.status == "406") {
                            if (data.data && data.data.error && data.data.error.warning)
                                alert(data.data.error.warning);
                            $ionicLoading.hide();
                            if ($localStorage.login)
                                appService.Login($localStorage.login);
                        }

                        $ionicLoading.hide();
                        $state.go("welcome");
                    });
                }
            }
        };

        $scope.goBackToShop = function () {
            $ionicTabsDelegate.select(0);
        }

        $scope.$watch('checkout.personaInfo', function (v) {
            if (v == 0) {
                $ionicLoading.hide();
                $state.go('app.menu.cart.checkoutstep2', {}, { reload: true });
            }
        });
    });

/**
* @ngdoc controller
* @name cart.module.controller:CartSuccessCtrl
* @requires $scope
* @requires $state
* @requires $ionicTabsDelegate
* @description
* Show the last step of the checkout process. 
*/
angular
    .module('cart.module')
    .controller('CartSuccessCtrl', function ($scope, $state, $ionicTabsDelegate) {

        $scope.goBackToShop = function () {
            $ionicTabsDelegate.select(0);
            $state.go("app.menu.shop.home", {}, {reload:true});
        }

    });
