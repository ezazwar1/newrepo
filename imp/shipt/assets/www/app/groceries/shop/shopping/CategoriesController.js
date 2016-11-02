
(function () {
    'use strict';

    angular.module('shiptApp').controller('CategoriesController', [
        '$scope',
        '$rootScope',
        '$ionicModal',
        '$state',
        'ShoppingService',
        'ProductService',
        '$timeout',
        '$ionicScrollDelegate',
        '$cordovaKeyboard',
        '$filter',
        'LogService',
        'AccountService',
        '$ionicSlideBoxDelegate',
        'UIUtil',
        'AppAnalytics',
        CategoriesController]);

    function CategoriesController($scope,
                                  $rootScope,
                                  $ionicModal,
                                  $state,
                                  ShoppingService,
                                  ProductService,
                                  $timeout,
                                  $ionicScrollDelegate,
                                  $cordovaKeyboard,
                                  $filter,
                                  LogService,
                                  AccountService,
                                  $ionicSlideBoxDelegate,
                                  UIUtil,
                                  AppAnalytics) {

        var mq = window.matchMedia('all and (max-width: 700px)');
        if(mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }
        $scope.getItemWidth =function() {
            return $scope.itemWidth;
        };

        $scope.showSearch = false;
        var current_page = 0;
        var total_pages = null;
        var lastSearchText = "";
        $scope.saleCategory = null;
        $scope.search = { searchQuery: null};
        $scope.searchResults = [];
        $scope.searching = false;
        $scope.filterText = '';
        $scope.addCustomProductModal = null;
        var searchFocused = false;
        $scope.showCancelSearch = false;
        //$scope.recentProducts = [];
        $scope.showRecentProducts = false;
        var lastScrolling = Date.now();
        $scope.dataLoaded = false;
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

        function showRecentPurchasedButton() {
            try {
                var orders = AccountService.getOrders();
                if(orders && orders != null && orders.length > 0) {
                    $scope.showRecentProducts = true;
                }
            } catch (exception) {
                LogService.error(exception);
            }
        }

        $scope.inCartText = function (product) {
            if($scope.cartItemCountForProduct(product) > 1) {
              return product.description_label[product.description_label.length - 1];
            } else {
              return product.description_label[0];
            }
        };

        $scope.showRecentPurchased = function() {
            $state.go('app.recentProducts');
        };

        $scope.guest_account = function() {
            return AccountService.isCustomerGuest()
        };

        $scope.$on('$ionicView.beforeEnter', function() {
            loadNextAvailableDelivery();
        });

        $scope.goToSearchPage = function(e) {
            $state.go('app.searchProducts');
        }

        $scope.categoryClick = function(parentCat) {
            try {
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

        $scope.doRefresh = function() {
            if($scope.searching){
                $scope.$broadcast('scroll.refreshComplete');
                return;
            }
            showRecentPurchasedButton();
            loadCategoriesFromServer();
            loadNextAvailableDelivery();
        };

        function loadSubCategories (category){
            return ShoppingService.getSubCategories(category, true);
        }

        $scope.showProducts = function(subCat) {
            $state.go('app.products', {category: angular.toJson(subCat)});
        };

        function loadCategoriesFromServer() {
            ShoppingService.getCategories(true)
                .then(function(data){
                    $scope.categories = data;
                    $scope.dataLoaded = true;
                    showRecentPurchasedButton();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                },function(error){
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.dataLoaded = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        $scope.searchSubmit = function (value) {
            var val = $scope.search.searchQuery;
            if(!val || val == "" || val == 'undefined'){
                $scope.searching = false;
                lastSearchText = "";
            } else {
                $scope.searching = true;
                $scope.filterText = val;
                searchForProducts($scope.filterText);
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            }
        };

        $scope.$watch('search.searchQuery', function (val) {
            var val = $scope.search.searchQuery;
            if(!val || val == "" || val == 'undefined'){
                $scope.searching = false;
                lastSearchText = "";
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
                $scope.searchResults = [];
                current_page = null;
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
                    $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                },function(error){
                    LogService.error({
                        message: 'Error Searching For Product',
                        error: error
                    });
                });
            if(current_page == 1){
                $scope.myPromise = searchPromise;
            }
        }

        $scope.cancelSearch = function() {

            $scope.searching = false;
            $scope.search.searchQuery = null;
            $scope.searchResults = [];
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();

            $timeout(function () {
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            }, 100);
        };

        angular.element('#clearSearchText').on('touchstart' , function(){
            $timeout(function () {
                $scope.search.searchQuery = '';
            }, 1);
        });

        angular.element('#catIonContent').on('touchstart' , function(){
            $timeout(function () {
                if(window.cordova) {
                    if($cordovaKeyboard.isVisible()) {
                        $cordovaKeyboard.close();
                    }
                }
            }, 1);
        });

        $scope.searchFocus = function() {
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
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

        $scope.addItem = function(product,fromDetail){
            if(canClickInList()) {
                ShoppingService.addProductToCart(product);
                product.added = true;
                AppAnalytics.addProductToCart(product,'search',fromDetail);
            }
        };

        $scope.removeItemFromCart = function(product){
            if(canClickInList()) {
                ShoppingService.removeOneProductFromCart(product);
            }
        };

        $scope.cartItemCountForProduct = function(product, includeZero){
            if(product){
                var found = $scope.cartItems().find(x => x.product.id == product.id);
                if(found) {
                    if(product.product_type != "by weight") {
                        return parseInt(found.qty);
                    } else if (product.has_custom_label) {
                        return parseFloat(found.qty*100)/(found.product.unit_weight*100);
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

        $scope.$on('user.loggedin', function (event, data) {
            $scope.dataLoaded = false;
            $scope.doRefresh();
        });

        $rootScope.$on('refresh.user-data', function(event,data){
            $scope.dataLoaded = false;
            $scope.doRefresh();
        });

        $scope.$on('user.registered', function (event, data) {
            $scope.dataLoaded = false;
            $scope.doRefresh();
        });

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
        });

        $scope.cartItems = function(){
            return ShoppingService.getCartItems();
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
        });

        $scope.$on('cancel.productNotes', function(){
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.scrollList = function() {
            lastScrolling = Date.now();
        };

        function canClickInList() {
            var diff =  Date.now() - lastScrolling;
            return true;
            return diff > 300;
        }

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

        $scope.loadMoreItems = function() {
            loadCategoriesFromServer();
        };

        $scope.categories = ShoppingService.getCachedCategories();

        $scope.doRefresh();

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

        $scope.clickAvailableTimeInfo = function() {
            UIUtil.showInfoAlertMessage('This delivery estimate is subject to change. ' +
                'You will be shown available time slots to choose from at checkout.')
        };

        $scope.getPrice = function(product) {
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

        $scope.getSalePrice = function(product) {
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

        function loadNextAvailableDelivery() {
            AccountService.getNextAvailability()
                .then(function(nextAvailable){
                    $scope.nextAvailability = nextAvailable;
                    $scope.nextAvailableErrorHappened = false;
                }, function(error){
                    $scope.nextAvailableErrorHappened = true;
                    LogService.critical([error, 'Error loading next availablity.']);
                });
        }

    }
})();
