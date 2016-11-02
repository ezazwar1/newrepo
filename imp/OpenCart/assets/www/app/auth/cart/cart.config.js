'use strict';

angular.module('cart.module')
    .config(function config($stateProvider) {
        $stateProvider
            .state('app.menu.cart', {
                url: '/cart',
                abstract: true,
                views: {
                    'tab-cart': {
                        templateUrl: 'app/cart/templates/layout.html'
                    },
                    'menu': {
                        templateUrl: 'app/cart/templates/layout.html'
                    }
                }
            })
            .state('app.menu.cart.home', {
                url: '/home',
                views: {
                    'cartContent': {
                        templateUrl: 'app/cart/templates/cart-home.html',
                        controller: 'CartHomeCtrl'
                    }
                }
            })
            .state('app.menu.cart.checkout', {
                url: '/checkout',
                views: {
                    'cartContent': {
                        templateUrl: 'app/cart/templates/cart-checkout-step1.html',
                        controller: 'CartCheckoutCtrl'
                    }
                }
            })
            .state('app.menu.cart.checkoutstep2', {
                url: '/checkoutstep2',
                views: {
                    'cartContent': {
                        templateUrl: 'app/cart/templates/cart-checkout-step2.html',
                        controller: 'CartCheckoutCtrl'
                    }
                }
            })
            .state('app.menu.cart.checkoutstep3', {
                url: '/checkoutstep3',
                views: {
                    'cartContent': {
                        templateUrl: 'app/cart/templates/cart-checkout-step3.html',
                        controller: 'CartCheckoutCtrl'
                    }
                }
            })
            .state('app.menu.cart.order_added', {
                url: '/order_added',
                views: {
                    'cartContent': {
                        templateUrl: 'app/cart/templates/cart-success.html',
						controller: 'CartSuccessCtrl'
                    }
                }
            })
    });
