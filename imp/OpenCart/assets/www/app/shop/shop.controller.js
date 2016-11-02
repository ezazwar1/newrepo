'use strict';

/**
* @ngdoc controller
* @name shop.module.controller:ShopHomeCtrl
* @requires $scope
* @requires $localStorage
* @requires $rootScope
* @requires $stateParams
* @requires $ionicSlideBoxDelegate
* @requires ShopService
* @description
* Home page of the Shop module. This controller contains methods to show banners and product catalog in
* the home page.
*/
angular
    .module('shop.module')
    .controller('ShopHomeCtrl', function ($scope, $localStorage, $rootScope, $stateParams, $ionicSlideBoxDelegate, ShopService) {
        var vm = this;
        $scope.endOfRLatestItems = false;
        $scope.loadingLatest = false;

        // sync form input to localstorage
        $localStorage.home = $localStorage.home || {};
        $scope.data = $localStorage.home;
        $scope.data.latestPage = 1;

        if (!$scope.data.slides)
            $scope.data.slides = [{ image: "app/shop/images/slide.png" }];

        $scope.refreshUI = function () {
            $scope.data.latestPage = 1;
            $scope.endOfRLatestItems = false;
            $scope.loadLatest(true);
            $scope.loadFeatured();
            //$scope.loadCategories();
            $scope.loadBanners();
        }

        $scope.loadBanners = function () {
            ShopService.GetBanners().then(function (data) {
                $scope.data.slides = data.main_banners;
                $scope.data.offers = data.offer_banner;
                $ionicSlideBoxDelegate.update();
            });
        }
        
        $scope.loadFeatured = function () {
            ShopService.GetFeaturedProducts().then(function (data) {
                $scope.data.featuredItems = data.products;
                $ionicSlideBoxDelegate.update();
            });
        }

        $scope.loadLatest = function (refresh) {
            if ($scope.loadingLatest) {
                return;
            }

            $scope.loadingLatest = true;
            $scope.data.latestItems = $scope.data.latestItems || [];

            ShopService.GetLatestProducts($scope.data.latestPage).then(function (data) {
                if (refresh) {
                    $scope.data.latestItems = data.products;
                    $scope.data.latestPage = 1;
                } else {
                    if ($scope.data.latestPage == 1) {
                        $scope.data.latestItems = [];
                    }

                    $scope.data.latestItems = $scope.data.latestItems.concat(data.products);
                    $scope.data.latestPage++;
                }
                if (data.products && data.products.length < 1)
                    $scope.endOfRLatestItems = true;
                $scope.loadingLatest = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            }, function (data) {
                $scope.loadingLatest = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.loadNextRecentPage = function () {
            if (!$scope.endOfRLatestItems) {
                $scope.loadLatest();
            } else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        }

        $scope.$on('$ionicView.enter', function () {
            $ionicSlideBoxDelegate.update();
        });
		
		$scope.$on('i2csmobile.shop.refresh', function () {
            $scope.refreshUI();
        });

        $scope.loadFeatured();
        $scope.loadBanners();
    });


/**
* @ngdoc controller
* @name shop.module.controller:ShopItemCtrl
* @requires $scope
* @requires $timeout
* @requires $localStorage
* @requires $rootScope
* @requires $state
* @requires $stateParams
* @requires $ionicPopup
* @requires $ionicLoading
* @requires $ionicTabsDelegate
* @requires $ionicSlideBoxDelegate
* @requires locale
* @requires ShopService
* @requires CartService
* @requires WEBSITE
* @description
* Shows details of a selected item. Renders all attributes and options in the view.
* Contains a `Buy` button which interacts with the API and add to product cart.
*/
angular
    .module('shop.module')
    .controller('ShopItemCtrl', function ($scope, $timeout, $localStorage, $rootScope, $state, $stateParams, $ionicPopup, $ionicLoading, $ionicTabsDelegate, $ionicSlideBoxDelegate, locale, ShopService, CartService, WEBSITE) {
        var vm = this;
        $scope.shop = {};
        $scope.cart = {};
        $scope.cart.quantity = 1;
        $scope.id = $stateParams.id;
        
        $scope.$on('$ionicView.enter', function () {
            $timeout(function () {
                $ionicTabsDelegate.$getByHandle('product-tabs').select(0);
            }, 0)
        });
        
        $localStorage.item_cache = $localStorage.item_cache || {};
        $scope.item_cache = $localStorage.item_cache;

        $ionicLoading.show();

        // check cache for the item. if item is available, immediately assign it
        if ($scope.item_cache.items && $scope.item_cache.items[$stateParams.id])
            $scope.item = $scope.item_cache.items[$stateParams.id];

        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                if (!$scope.item) {
                    alert(locale.getString('shop.error_not_connected_cache_failed'));
                } else {
                    alert(locale.getString('shop.error_not_connected_cache_success'));
                }

                $ionicLoading.hide();
            }
        }

        ShopService.GetProduct($stateParams.id).then(function (data) {
            $scope.item = {};

            $scope.item.name = data.heading_title;
            $scope.item.product_id = data.product_id;
            $scope.item.text_stock = data.text_stock;
            $scope.item.text_model = data.text_model;
            $scope.item.attribure_groups = data.attribute_groups;

            $scope.item.price = data.price;
            $scope.item.special = data.special;
            $scope.item.description = data.description;
            $scope.item.off = data.off;
            $scope.item.mobile_special = data.mobile_special;
            $scope.item.stock = data.stock;
            $scope.item.model = data.model;
            $scope.item.options = data.options;
            $scope.item.minimum = data.minimum || 1;

            $scope.item.review_status = data.review_status;
            $scope.item.review_guest = data.review_guest;
            $scope.item.reviews = data.reviews;
            $scope.item.rating = data.rating;
            $scope.item.entry_name = data.entry_name;
            $scope.item.entry_review = data.entry_review;
            
            $scope.item.related = data.products;

            $scope.item.images = data.images;

            if (!$scope.item_cache.items)
                $scope.item_cache.items = {};
            $scope.item_cache.items[$stateParams.id] = $scope.item;

            $ionicSlideBoxDelegate.update();
            $timeout(function () { 
                $ionicLoading.hide();
            }, 500);
        });

        $scope.openRingSizeGuide = function () {

            $ionicPopup.alert({
                title: "Ring Size Guide",
                templateUrl: 'templates/popups/size_guide.html',
                scope: $scope
            });

            ShopService.GetRingSizeImage().then(function (data) {
                if (data && data.banners && data.banners[0])
                    $scope.item_cache.ringSizeUrl = data.banners[0].image;
            });
        }

        $scope.buyNow = function () {
            // add to cart and checkout
            if ($scope.shop.shopItemForm.$invalid) {
                $ionicPopup.alert({
                    title: locale.getString('shop.warning_options_missing'),
                    templateUrl: "app/shop/templates/popups/missing-props.html",
                    scope: $scope,
                    buttons: [
                      {
                          text: 'OK',
                          type: 'button-positive'
                      }
                    ]
                });
            } else {
                $ionicLoading.show();

                CartService.AddToCart($stateParams.id, $scope.cart.quantity, $scope.cart.options).then(function (data) {
                    $rootScope.cartItemCount = $rootScope.cartItemCount || 0;
                    $rootScope.cartItemCount += parseInt($scope.cart.quantity);
                    $ionicTabsDelegate.select(2);
                    $state.go('app.menu.cart.home', {}, { reload: true });
                    $ionicLoading.hide();
                }, function (error) {
                    alert("Error. Can't add to the cart");
                    $ionicLoading.hide();
                });
            }
        }

        $scope.addToCart = function () {
            if ($scope.shop.shopItemForm.$invalid) {
                $ionicPopup.alert({
                    title: 'Oops!',
                    templateUrl: "app/shop/templates/popups/missing-props.html",
                    scope: $scope,
                    buttons: [
                      {
                          text: 'OK',
                          type: 'button-positive'
                      }
                    ]
                });
            } else {

                // show alert regardless Add to cart confirmation
                var alertPopup = $ionicPopup.alert({
                    title: locale.getString('shop.added_to_cart_title'),
                    cssClass: 'desc-popup',
                    template: locale.getString('shop.added_to_cart_desc'),
                    buttons: [
                      { text: locale.getString('shop.button_shop_more') },
                      {
                          text: locale.getString('shop.button_go_to_cart'),
                          type: 'button-positive',
                          onTap: function (e) {
                              $ionicTabsDelegate.select(2);
                              $state.go('app.menu.cart.home', {}, { reload: true });
                          }
                      }
                    ]
                });

                CartService.AddToCart($stateParams.id, $scope.cart.quantity, $scope.cart.options).then(function (data) {
                    $rootScope.cartItemCount = $rootScope.cartItemCount || 0;
                    $rootScope.cartItemCount += parseInt($scope.cart.quantity);
                }, function (error) {
                    alertPopup.close();
                    alert("Error");
                });
            }
        }

        $scope.share = function () {
            var link = WEBSITE + "/index.php?route=product/product&product_id=" + $stateParams.id;
            window.plugins.socialsharing.share($scope.name, $scope.name, null, link);
        }

        $scope.range = function (min, max, step) {
            step = step || 1;
            min = min || 1;
            max = max || 10;
            min = parseInt(min);
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }

            return input;
        };

        $scope.selectableOptions = function (item) {
            return item.type === 'radio' || item.type === 'select';
        }

        $scope.multipleOptions = function (item) {
            return item.type === 'checkbox';
        }

        $scope.textOptions = function (item) {
            return item.type === 'text' || item.type === 'date' || item.type === 'time';
        }

        $scope.fileOptions = function (item) {
            return item.type === 'file';
        }

        $scope.datetimeOptions = function (item) {
            return item.type === 'datetime';
        }

        $scope.textareaOptions = function (item) {
            return item.type === 'textarea';
        }
    });


/**
* @ngdoc controller
* @name shop.module.controller:ShopCategoryCtrl
* @requires $scope
* @requires $rootScope
* @requires $stateParams
* @requires $state
* @requires ShopService
* @description
* Lists products of a selected category.
*/
angular
    .module('shop.module')
    .controller('ShopCategoryCtrl', function ($scope, $rootScope, $stateParams, $state, ShopService) {
        var vm = this;

		$scope.id = $stateParams.id;
		
        if (!$stateParams.id) {
            $state.go('app.menu.shop.home');
        }

        $scope.endOfItems = false;
        $scope.loadingItems = false;
        $scope.page = 1;

        $scope.refreshUI = function () {
            $scope.endOfItems = false;
            $scope.items = [];
            $scope.page = 1;
            $scope.loadItems();
        }

        $scope.loadItems = function () {
            if ($scope.loadingItems) {
                return;
            }

            $scope.loadingItems = true;
            $scope.items = $scope.items || [];

            ShopService.GetCategoryProducts($stateParams.id, $scope.page).then(function (data) {
                $scope.items = $scope.items.concat(data.products);
                $scope.category_name = data.heading_title;
                $scope.text_empty = data.text_empty;
                $scope.page++;
                if (data && data.products.length < 1)
                    $scope.endOfItems = true;
                $scope.loadingItems = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            }, function (data) {
                $scope.loadingItems = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.loadNextPage = function () {
            if (!$scope.endOfItems) {
                $scope.loadItems();
            } else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            }
        }
    });


/**
* @ngdoc controller
* @name shop.module.controller:ShopSearchCtrl
* @requires $scope
* @requires $rootScope
* @requires $ionicScrollDelegate
* @requires $stateParams
* @requires ShopService
* @description
* Search page shows a search input box and filters the product catalog for the customer entered
* keywords.
*/
angular
    .module('shop.module')
    .controller('ShopSearchCtrl', function ($scope, $rootScope, $ionicScrollDelegate, $stateParams, ShopService) {

    });
