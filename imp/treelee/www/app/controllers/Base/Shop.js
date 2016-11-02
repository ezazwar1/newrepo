/*global define, google, navigator, ionic, StatusBar*/
define([
    'app',
    'services/browse',
    'services/catalog',
    'services/config',
    'services/cart',
    'services/product',
    'factories/loading'
], function (app) {

    'use strict';

    app.controller('ShopCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$rootScope',
        '$state',
        '$ionicSideMenuDelegate',
        '$ionicScrollDelegate',
        'browseService',
        'catalogService',
        'configService',
        'cartService',
        'productService',
        'userService',
        'LoadingFactory',
        function ($scope, $window, $timeout, $rootScope, $state, $ionicSideMenuDelegate, $ionicScrollDelegate, browseService, catalogService, configService, cartService, productService, userService, LoadingFactory) {

            var loading;

            $scope.bars = {
                hide: false
            };

            $window.addEventListener('orientationchange', function () {
                productService.containerHeight = 0;
                productService.containerWidth = 0;
            }, false);

            // init scope variables
            $scope.visibleCategories = {};
            $scope.search = {
                query: ''
            };

            function getCartInfo() {
                cartService.getInfo().then(function (cartInfo) {
                    $scope.cartItems = cartInfo.summary_qty || 0;
                    userService.loggedIn().then(function (loggedIn) {
                        //prevent showing wrong cart item count on timeout
                        if (!loggedIn && $state.current.name.match(/start/)) {
                            $scope.cartItems = 0;
                        } else {
                            $scope.cartItems = cartInfo.summary_qty || 0;
                        }
                    });
                });
            }

            // check if state changes and change checkout step -> check if cart is valid -> if not go to start page
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                // check if checkout step
                if (toState.name.match(/^shop\.checkout/) && toState.name !== 'shop.checkout.cart') {
                    cartService.getInfo().then(function (cartInfo) {
                        if (!cartInfo.summary_qty || cartInfo.summary_qty === '0') {
                            browseService.navigate('/start');
                            $scope.$emit('cartChanged');
                        }
                    });
                }

                if (toState.url !== '/product/:productId' && $scope.bars.hide) {
                    $scope.$emit('togglebars');
                }
            });

            $scope.$on('togglebars', function () {
                $scope.bars.show = $scope.bars.hide ? true : false;
                $timeout(function () {
                    $scope.bars.hide = !$scope.bars.hide;

                    if ($window.cordova && ionic.Platform.isIOS()) {
                        if ($scope.bars.hide) {
                            StatusBar.styleDefault();
                        } else {
                            StatusBar.styleLightContent();
                        }
                    }
                });
            });

            // Get cart info
            getCartInfo();

            $scope.$on('cartChanged', getCartInfo);

            // Load categories/pages
            if (!catalogService.categories.length) {
                loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    catalogService.get().then(function (categories) {
                        $scope.categories = categories;
                        loadingOverlay.hide();
                    }, loadingOverlay.hide);
                });
            } else {
                $scope.categories = catalogService.categories;
            }

            // watch if config is ready (first request finished -> get cms pages
            $scope.$watch(function () {
                return configService.ready;
            }, function (configReady) {
                var pages = [];

                if (configReady) {
                    if (configService.config && configService.config.content && configService.config.content.page) {
                        pages = configService.config.content.page;
                    }

                    /*$window.open('http://treelee.flyacts.com/checkout/cart/', '_blank', 'location=yes,enableViewportScale=yes');*/

                   /* var treeleeWindow = $window.open('http://treelee.com', '_blank', 'location=yes,enableViewportScale=yes');

                    // listen to page load events
                    treeleeWindow.addEventListener('load', function (event) {
                        treeleeWindow.close();
                    });*/

                    $scope.pages = pages;
                }
            });

            // trigger search
            $scope.search = function () {
                $scope.toggleLeft();
                document.activeElement.blur();
                browseService.navigate('/search/' + decodeURIComponent($scope.search.query));
            };

            $scope.$on('togglebars', function (event, data) {
                $scope.hideBars = data;
            });

            // only if categories are correctly set -> add functionality
            $scope.$watch(function () {
                return $scope.categories;
            }, function (categories) {
                if (categories) {
                    $scope.isActive = function (id) {
                        return $scope.activeCategory === id;
                    };

                    // navigate to content page in sidebar
                    $scope.showPage = function (pageId) {
                        browseService.navigate('/page/' + pageId);
                        $scope.toggleLeft();
                    };

                    // navigate to start
                    $scope.goToStart = function () {
                        browseService.navigate('/start');
                        $scope.toggleLeft();
                    };

                    // handle toggle left
                    $scope.toggleLeft = function (event) {
                        if (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        $ionicSideMenuDelegate.toggleLeft();
                    };

                    // navigate category
                    $scope.goToCategory = function (categoryId) {
                        $scope.toggleLeft();
                        $scope.activeCategory = categoryId.toString();
                        browseService.navigate('/category/' + categoryId);
                    };

                    // unfold/fold category in sidebar
                    $scope.showCategory = function ($event, catId, level) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        if ($scope.visibleCategories[catId]) {
                            delete $scope.visibleCategories[catId];
                        } else {
                            if (level === '2') {
                                $scope.visibleCategories = {};
                            }

                            $scope.visibleCategories[catId] = true;
                        }

                        $scope.activeCategory = catId;
                        $ionicScrollDelegate.resize();
                    };

                    // show shopping cart
                    $scope.cart = function (fromSideMenu) {
                        browseService.navigate('/checkout/cart');

                        if (fromSideMenu) {
                            $scope.toggleLeft();
                        }
                    };

                    // navigate to startpage
                    $scope.toStartPage = function () {
                        $scope.toggleLeft();
                        browseService.navigate('/start');
                    };
                }
            });
        }
    ]);
});
