/*global define*/
define([
    'app',

    'controllers/App',

    'controllers/Base/Shop',

    'controllers/Category/View',

    'controllers/Checkout/Cart',
    'controllers/Checkout/Auth',
    'controllers/Checkout/BillingAddress',
    'controllers/Checkout/ShippingAddress',
    'controllers/Checkout/ShippingMethod',
    'controllers/Checkout/Payment',
    'controllers/Checkout/Overview',

    'controllers/Product/View',
    'controllers/Product/Search',
    'controllers/Product/Partials/List',

    'controllers/Start/View',

    'controllers/Page/View'
], function (app) {
    'use strict';

    return app.config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            // url routes/states
            $urlRouterProvider.otherwise('/start');

            function setTemplate(area, view) {
                var viewName = view && view !== '' ? view : 'View';

                viewName = viewName[0].toLowerCase() + viewName.slice(1);
                area = area[0].toLowerCase() + area.slice(1);

                return 'app/templates/' + area + '/' + viewName + '.html';
            }

            $stateProvider
                // app states
                .state('shop', {
                    url: '/',
                    abstract: true,
                    templateUrl: setTemplate('Base', 'Shop'),
                    controller: 'ShopCtrl'
                })
                .state('shop.start', {
                    url: 'start',
                    templateUrl: setTemplate('Start', 'View'),
                    controller: 'ViewCtrl'
                })
                .state('shop.category', {
                    url: 'category',
                    abstract: true,
                    templateUrl: setTemplate('Category', 'Base')
                })
                .state('shop.category.category', {
                    url: '/:categoryId',
                    views: {
                        'content@shop.category': {
                            templateUrl: setTemplate('Category', 'View'),
                            controller: 'CategoryCtrl'
                        },
                        'productList@shop.category.category': {
                            templateUrl: setTemplate('Product/partials', 'List'),
                            controller: 'ProductListCtrl'
                        }
                    }
                })
                .state('shop.category.product', {
                    url: '/product/:productId',
                    //abstract: true,
                    views: {
                        'content@shop.category': {
                            templateUrl: setTemplate('Product', 'View'),
                            controller: 'ProductCtrl'
                        }
                    }
                })
                .state('shop.search', {
                    url: 'search',
                    templateUrl: setTemplate('Product', 'Base')
                })
                .state('shop.search.search', {
                    url: '/:searchQuery',
                    views: {
                        'content@shop.search': {
                            templateUrl: setTemplate('Product', 'Search'),
                            controller: 'ProductSearchCtrl'
                        },
                        'productList@shop.search.search': {
                            templateUrl: setTemplate('Product/partials', 'List'),
                            controller: 'ProductListCtrl'
                        }
                    }
                })
                .state('shop.search.product', {
                    url: '/product/:productId',
                    //abstract: true,
                    views: {
                        'content@shop.search': {
                            templateUrl: setTemplate('Product', 'View'),
                            controller: 'ProductCtrl'
                        }
                    }
                })
                .state('shop.page', {
                    url: 'page/:pageId',
                    templateUrl: setTemplate('Page', 'View'),
                    controller: 'PageCtrl',
                    contentPage: true
                })
                .state('shop.checkout', {
                    url: 'checkout',
                    abstract: true,
                    templateUrl: setTemplate('Checkout', 'Base')
                })
                .state('shop.checkout.cart', {
                    url: '/cart',
                    views: {
                        'content@shop.checkout': {
                            templateUrl: setTemplate('Checkout', 'Cart'),
                            controller: 'CartCtrl'
                        }
                    }
                })
                .state('shop.checkout.auth', {
                    url: '/auth',
                    views: {
                        'content@shop.checkout': {
                            templateUrl: setTemplate('Checkout', 'Auth'),
                            controller: 'AuthCtrl'
                        }
                    },
                    checkout: true
                })
                .state('shop.checkout.billing', {
                    url: '/billing',
                    views: {
                        'content@shop.checkout': {
                            templateUrl: setTemplate('Checkout', 'BillingAddress'),
                            controller: 'BillingAddressCtrl'
                        }
                    },
                    checkout: true
                })
                .state('shop.checkout.shipping', {
                    url: '/shipping',
                    views: {
                        'content@shop.checkout': {
                            templateUrl: setTemplate('Checkout', 'ShippingAddress'),
                            controller: 'ShippingAddressCtrl'
                        }
                    },
                    checkout: true
                })
                .state('shop.checkout.shipping_method', {
                    url: '/shipping_method',
                    views: {
                        'content@shop.checkout': {
                            templateUrl: setTemplate('Checkout', 'ShippingMethod'),
                            controller: 'ShippingMethodCtrl'
                        }
                    },
                    checkout: true
                })
                .state('shop.checkout.payment', {
                    url: '/payment',
                    views: {
                        'content@shop.checkout': {
                            templateUrl: setTemplate('Checkout', 'Payment'),
                            controller: 'PaymentCtrl'
                        }
                    },
                    checkout: true
                })
                .state('shop.checkout.overview', {
                    url: '/overview',
                    views: {
                        'content@shop.checkout': {
                            templateUrl: setTemplate('Checkout', 'Overview'),
                            controller: 'OverviewCtrl'
                        }
                    },
                    checkout: true
                });
        }
    ]);
});