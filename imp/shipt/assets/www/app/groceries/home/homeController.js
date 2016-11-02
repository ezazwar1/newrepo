(function () {
    'use strict';

    angular.module('shiptApp').controller('homeController', [
        '$scope',
        '$log',
        'AccountService',
        '$state',
        'ShoppingService',
        'LogService',
        '$rootScope',
        'PromoFeaturesService',
        '$ionicModal',
        'ProductService',
        '$ionicScrollDelegate',
        '$timeout',
        '$ionicSlideBoxDelegate',
        '$cordovaKeyboard',
        '$filter',
        'AppAnalytics',
        'shopCategoriesProvider',
        'chooseStoreModal',
        'ShoppingCartService',
        'FeatureService',
        'FEATURE_TOGGLES',
        'COMMON_FEATURE_TOGGLES',
        homeController]);

    function homeController($scope,
                            $log,
                            AccountService,
                            $state,
                            ShoppingService,
                            LogService,
                            $rootScope,
                            PromoFeaturesService,
                            $ionicModal,
                            ProductService,
                            $ionicScrollDelegate,
                            $timeout,
                            $ionicSlideBoxDelegate,
                            $cordovaKeyboard,
                            $filter,
                            AppAnalytics,
                            shopCategoriesProvider,
                            chooseStoreModal,
                            ShoppingCartService,
                            FeatureService,
                            FEATURE_TOGGLES,
                            COMMON_FEATURE_TOGGLES) {

        var viewModel = this;

        var defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
        var mq = window.matchMedia('all and (max-width: 700px)');
        if(mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }
        $scope.getItemWidth =function() {
            return $scope.itemWidth;
        };

        viewModel.goToSearch = function() {
            $state.go('app.searchProducts');
        };

        viewModel.changeLocationStoreClick = function() {
            if(AccountService.checkFeature("chooseStoreInApp")){
                chooseStoreModal.showModal($scope, null , viewModel.store)
                    .then(function(store){
                        viewModel.store = store;
                    });
            }
        };

        $scope.showSearch = false;
        var current_page = 0;
        var total_pages = null;
        var lastSearchText = "";
        $scope.search = { searchQuery: null};
        $scope.searchResults = [];
        $scope.searching = false;
        var searchFocused = false;
        $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
            scope: $scope,
            focusFirstInput: true,
            animation: 'scale-in'
        }).then(function(modal) {
            $scope.noteModal = modal;
        });

        var searchButtonIonItem = {
            addButton: true
        };

        var loadingMoreButton = {
            loadingMore: true
        };

        viewModel.shopCategories = function($event) {
            shopCategoriesProvider.show($scope, $event, viewModel.categories);
        }

        viewModel.inCartText = function (product, count) {
            if(count > 1) {
                return product.description_label[product.description_label.length - 1];
            } else {
                return product.description_label[0];
            }
        };

        viewModel.guest_account = function() {
            return AccountService.isCustomerGuest()
        };

        viewModel.goToCart = function() {
            $state.go('app.shoppingCart');
        };

        viewModel.cartCount = function(){
            return ShoppingService.getCartItemCount();
        };

        function loadNextAvailableDelivery() {
            AccountService.getNextAvailability()
                .then(function(nextAvailable){
                    viewModel.nextAvailability = nextAvailable;
                    viewModel.nextAvailableErrorHappened = false;
                }, function(error){
                    viewModel.nextAvailableErrorHappened = true;
                    LogService.critical([error, 'Error loading next availablity.']);
                });
        }

        function loadCategoriesFromServer() {
            ShoppingService.getCategories(true)
                .then(function(data){
                    viewModel.categories = data;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                },function(error){
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }


        viewModel.startShoppingClick = function() {
            $state.go('app.categories');
        };

        viewModel.accountClick = function() {
            $state.go('app.account');
        };

        function getSaleCategory() {
            var saleCat = viewModel.categories.find(x => x.name == 'On Sale');
            return saleCat;
        }

        viewModel.saleCategoryClick = function(){
            try {
                var parentCat = getSaleCategory();
                if(parentCat.category_count < 1){
                    $state.go('app.products', {category: angular.toJson(parentCat)});
                } else {
                    $state.go('app.subcategories', {parentCat: angular.toJson(parentCat)});
                }
            } catch (e) {
                LogService.error(e);
                $state.go('app.subcategories', {parentCat: angular.toJson(parentCat)});
            }
        };

        viewModel.yourRecentItemsClick = function() {
            $state.go('app.recentProducts');
        };

        viewModel.webFeatureClick = function(feature) {
            $state.go('app.products', {category: angular.toJson(feature.category)});
        };

        viewModel.categoryClick = function(category) {
            $state.go('app.products', {category: angular.toJson(category)});
        };

        viewModel.featureClick = function(feature) {
            try {
                if(feature.category.category_count < 1){
                    $state.go('app.products', {category: angular.toJson(feature.category)});
                } else {
                    $state.go('app.subcategories', {parentCat: angular.toJson(feature.category)});
                }
            } catch (e) {
                LogService.error(e);
                $state.go('app.subcategories', {parentCat: angular.toJson(feature.category)});
            }
        };

        viewModel.refreshData = function() {
            $rootScope.$broadcast('refresh.user-data');
        }

        viewModel.loadData = loadData;
        function loadData() {
            loadFeatures();
            loadFeatureToggles();
            loadNextAvailableDelivery();
            loadCategoriesFromServer();
            loadStore();
            setDefaultShoppingAddressText();
            defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
        }

        $rootScope.$on('refreshed.user-data',function(){
            loadData();
        });

        function loadStore() {
            try {
                viewModel.store = AccountService.getCustomerStore();
                viewModel.chooseStoreEnabled = AccountService.checkFeature("chooseStoreInApp");
            } catch (e) {
                viewModel.store = null;
            }
        }

        function loadFeatures() {
            PromoFeaturesService.getPromoFeatures()
                .then(function(data){
                    viewModel.errorGettingFeatures = false;
                    viewModel.featurePromos = data;
                },function(error){
                    viewModel.errorGettingFeatures = true;
                })
        }

        function loadFeatureToggles() {
            viewModel.featureToggles = {};
            viewModel.featureToggles.isChangeStoreVariant = FeatureService.getFeatureToggle(FEATURE_TOGGLES.CHANGE_STORE_VARIANT);
            viewModel.featureToggles.isInstantSearchEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_INSTANT_SEARCH_ENABLED);
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            loadData();
        });

        $scope.$on('user.loggedin', function (event, data) {
            $log.info('home screen user.loggedin');
            loadData();
        });

        $rootScope.$on('refresh.user-data', function(event,data){
            loadData();
            ShoppingCartService.loadServerCart()
                .then(function(){
                    refreshCartItems();
                })
        });

        $scope.$on('user.registered', function (event, data) {
            $log.info('home screen user.registered');
            loadData();
        });

        $scope.$on('nav.home-menu-item-click', function (event, data) {
            $log.info('home screen nav.home-menu-item-click');
            $scope.clearSearch();
        });

        $rootScope.$on('nav.home-menu-item-click', function (event, data) {
            $log.info('home screen nav.home-menu-item-click');
            $scope.clearSearch();
        });

        loadData();

        $scope.searchSubmit = function (value) {
            var val = $scope.search.searchQuery;
            if(!val || val == "" || val == 'undefined'){
                $scope.searching = false;
                lastSearchText = "";
            } else {
                $scope.searching = true;
                $scope.filterText = val;
                searchForProducts($scope.filterText);
                $ionicScrollDelegate.$getByHandle('homeScroll').resize();
            }
        };

        $scope.$watch('search.searchQuery', function (val) {
            var val = $scope.search.searchQuery;
            if(!val || val == "" || val == 'undefined'){
                $scope.searching = false;
                lastSearchText = "";
            } else if (viewModel.featureToggles.isInstantSearchEnabled) {
                $scope.searchSubmit();
            }
        });

        function addMoreLoadingThing() {
            $scope.searchResults.push(loadingMoreButton);
        }

        function removeLoadingThing() {
            var index = $scope.searchResults.map(function(el) {
                return el.loadingMore;
            }).indexOf(loadingMoreButton.loadingMore);
            if(index > -1) {
                $scope.searchResults.splice(index, 1);
            }
        }

        function removeAddSpecialButton() {
            var index = $scope.searchResults.map(function(el) {
                return el.addButton;
            }).indexOf(searchButtonIonItem.addButton);
            if(index > -1) {
                $scope.searchResults.splice(index, 1);
            }
        }

        function searchForProducts(text) {
            if(!text || text == "") return;
            if (text != lastSearchText) {
                //reset search params if the search is different
                AppAnalytics.productSearch(text);
                $scope.searchResults = null;
                current_page = 0;
                lastSearchText = text;
            } else if(total_pages != null && total_pages <= current_page){
                //this will catch searches that were not supposed to happen
                return false;
            }
            var searchPromise = ProductService.searchForGroceryProducts(text, current_page)
                .then(function(results){
                    current_page = results.current_page;
                    total_pages = results.total_pages;
                    if($scope.searchResults && $scope.searchResults.length > 1){
                        //add items to the end of the array
                        angular.forEach(results.products,function(item){
                            $scope.searchResults.push(item)
                        });
                    } else {
                        $scope.searchResults = results.products;
                    }
                    if(current_page == total_pages || total_pages == 0) {
                        if(!$scope.searchResults) $scope.searchResults = [];
                        $scope.searchResults.push(searchButtonIonItem);
                    } else {
                        removeAddSpecialButton();
                        removeLoadingThing();
                        if($scope.searchResults.length > 0){
                            $scope.searchResults.push(searchButtonIonItem);
                        }

                        if(current_page == total_pages){
                            removeLoadingThing();
                        } else {
                            addMoreLoadingThing();
                            removeAddSpecialButton();
                        }

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $ionicScrollDelegate.$getByHandle('homeScroll').resize();
                },function(error){
                    LogService.error({
                        message: 'Error Searching For Product',
                        error: error
                    });
                });
        }

        $scope.clearSearch = function() {
            $scope.searching = false;
            $scope.search.searchQuery = null;
            $scope.searchResults = [];
            $ionicScrollDelegate.$getByHandle('homeScroll').scrollTop(true);
            $ionicScrollDelegate.$getByHandle('homeScroll').resize();
            // $timeout(function () {
            //      $ionicScrollDelegate.$getByHandle('homeScroll').resize();
            // }, 100);
        };

        angular.element('#clearSearchTextHome').on('touchstart' , function(){
            $timeout(function () {
                $scope.search.searchQuery = '';
            }, 1);
        });

        angular.element('#homeIonContent').on('touchstart' , function(){
            $log.info('#homeIonContent touchstart');
            $timeout(function () {
                $log.info('#homeIonContent timeout');
                if(window.cordova) {
                    $log.info('#homeIonContent window.cordova');
                    if($cordovaKeyboard.isVisible()) {
                        $log.info('#homeIonContent cordovaKeyboard.close');
                        $cordovaKeyboard.close();
                    }
                }
            }, 1);
        });

        $scope.searchFocus = function() {
            $ionicScrollDelegate.$getByHandle('homeScroll').scrollTop(true);
            searchFocused = true;
            $scope.showCancelSearch = true;
        };

        $scope.searchUnFocus = function() {
            searchFocused = false;
            if($scope.searching) {
                $scope.showCancelSearch = true;
            } else {
                $scope.showCancelSearch = false;
            }
            if(window.cordova && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
        };

        $scope.addItem = function(product){
            if(canClickInList()) {
                ShoppingService.addProductToCart(product);
                product.added = true;
                refreshCartItems();
                AppAnalytics.addProductToCart(product, 'search');
            }
        };

        $scope.removeItemFromCart = function(product){
            if(canClickInList()) {
                ShoppingService.removeOneProductFromCart(product);
                refreshCartItems();
            }
        };

        $scope.cartItemCountForProduct = function(product, includeZero){
            if(product){
                var found = $scope.cartItems().find(x => x.product.id == product.id);
                if(found) {
                    if(product.product_type != "by weight") {
                        return parseInt(found.qty);
                    } else if(product.has_custom_label) {
                        return parseInt((found.qty*100)/(product.unit_weight*100));
                    } else {
                      return parseFloat(found.qty)
                    }
                } else if (includeZero) {
                    return 0
                }
            }
        };

        $scope.removeCartItemForProductFromCartCompletely = function(product) {
            if(canClickInList()) {
                ShoppingService.removeProductsCartItemFromCart(product);
                refreshCartItems();
            }
        };

        $scope.productInCart = function(product) {
            if(!product){
                return false;
            }
            var index = $scope.cartItems().map(function(el) {
                return el.product.id;
            }).indexOf(product.id);
            return index > -1;
        };

        $ionicModal.fromTemplateUrl('app/groceries/shop/productDetail/productDetailModal.html', {scope: $scope})
            .then(function(modal) {
                $scope.productDetailModal = modal;
            });

        $scope.productDetail = function(product) {
            if(canClickInList()) {
                if (product.addButton) {
                    $scope.addCustomProduct();
                    return;
                }
                $scope.productDetailProduct = product;
                $scope.productDetailModal.show();
                AppAnalytics.viewProduct(product, 'search');
            }
        };

        $scope.closeProductDetail = function(){
            $scope.productDetailModal.hide();
            $scope.productDetailProduct = null;
        };

        $scope.getItemClass = function(product){
            if(!product) return '';
            if(product.addButton) {
                return 'item-stable item-no-border';
            } else if (product.loadingMore) {
                return 'item-loading-more';
            }
        }

        $scope.addCustomProduct = function(){
            $ionicModal.fromTemplateUrl('app/groceries/shop/customProduct/addCustomProductModal.html', {
                scope: $scope,
                focusFirstInput: true
            }).then(function(modal) {
                $scope.addCustomProductModal = modal;
                $scope.addCustomProductModal.show();
            });
        };

        $scope.$on('close.addCustomProduct',function(){
            $scope.addCustomProductModal.hide();
            refreshCartItems();
        });


        $scope.cartItems = function(){
            return ShoppingService.getCartItems();
        };

        $scope.cartCount = function(){
            return ShoppingService.getCartItemCount();
        };


        $scope.addNoteForProduct = function(product) {
            if(product){
                var index = $scope.cartItems().map(function(el) {
                    return el.product.id;
                }).indexOf(product.id);

                if(index > -1) {
                    $scope.notePopoverItem = $scope.cartItems()[index];
                    $scope.noteModal.show();
                    $scope.$broadcast('data.productNotes', $scope.notePopoverItem.note);
                }
            }
        };

        $scope.$on('close.productNotes',function(event, data){
            $scope.notePopoverItem.note = data;
            ShoppingService.updateNoteOnItem($scope.notePopoverItem);
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
            refreshCartItems();
        });

        $scope.$on('cancel.productNotes', function(){
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.moreDataCanBeLoadedSearch = function() {
            if(!$scope.searching || total_pages == 0){
                return false;
            }
            if(total_pages ){
                if($scope.searchResults.length > 1){
                   if( total_pages > current_page){
                       return true;
                   } else {
                       return false;
                   }
                }
            } else {
                return false;
            }
        };

        $scope.loadMoreSearchItems = function() {
            searchForProducts($scope.search.searchQuery);
        };

        $scope.moreDataCanBeLoaded = function() {
            if($scope.dataLoaded){
                return false;
            } else {
                return true;
            }
        };


        var imageModal = null;
        $scope.imageModalImageUrl = '';
        $scope.openImageModal = function(product){
            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                imageModal = modal;
                var url = '';
                try {
                    if(product.images.length > 0 && product.images[0].original_size_url) {
                        url = product.images[0].original_size_url
                    }
                } catch (exception) {
                    LogService.error(exception);
                }
                $scope.imageModalImageUrl = url;
                $ionicSlideBoxDelegate.slide(0);
                imageModal.show();
            });
        };

        $scope.closeImageModal = function() {
            imageModal.hide();
        };

        $scope.imageSlideChanged = function() {
            imageModal.hide();
        };

        function refreshCartItems() {
            $scope.cartItems();
            $scope.cartCount();
        }

        function canClickInList() {
            return true;
        }

        function setDefaultShoppingAddressText(){
            try {
                var address = AccountService.getCustomerDefaultShoppingAddress();
                if(address){
                    viewModel.defaultShoppingAddressText = address.street1;
                }
            } catch (e) {
                $log.error(e);
            }
        };

        viewModel.searchButtonText = function(){
            if(viewModel.store && defaultShoppingAddress){
                return "Search " + viewModel.store.name + ", " + defaultShoppingAddress.zip_code;
            } else {
                return "Search All Products";
            }
        };

        viewModel.clickEditShoppingAddressButton = function(){
            if(AccountService.checkFeature("chooseStoreInApp")){
                //open up the choose store modal in address mode
                chooseStoreModal.showModal($scope, null , viewModel.store, true)
                    .then(function(store){
                        viewModel.store = store;
                    });
            }
        };

        viewModel.nextAvailableDeliveryMessage = function(){
            if(viewModel.nextAvailability){
                return viewModel.nextAvailability.message + " " + viewModel.nextAvailability.window;
            } else {
                return "Next Delivery: Loading..."
            }
        }

        viewModel.getPrice = function(product) {
            if (product.product_type == 'by weight') {
                if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                    var unit_of_measure = "lb";
                } else {
                    var unit_of_measure = product.unit_of_measure
                }

                return `${$filter('currency')(product.price)} per ${unit_of_measure}`
            } else {
                return $filter('currency')(product.price);
            }
        }

        viewModel.getSalePrice = function(product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                var unit_of_measure = "lb";
            } else {
                var unit_of_measure = product.unit_of_measure
            }

            if (product.product_type == 'by weight') {
                return `${$filter('currency')(product.sale_price)} per ${unit_of_measure}`
            } else {
                return $filter('currency')(product.sale_price);
            }
        }

    };
})();
