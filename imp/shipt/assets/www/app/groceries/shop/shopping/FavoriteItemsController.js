
/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('FavoriteItemsController', [
        '$scope',
        '$ionicModal',
        '$state',
        '$stateParams',
        'ShoppingService',
        '$log',
        'UIUtil',
        '$timeout',
        '$cordovaKeyboard',
        'LogService',
        '$ionicSlideBoxDelegate',
        'AccountService',
        '$filter',
        'AppAnalytics',
        'FavoriteItem',
        FavoriteItemsController]);

    function FavoriteItemsController($scope,
                                $ionicModal,
                                $state,
                                $stateParams,
                                ShoppingService,
                                $log,
                                UIUtil,
                                $timeout,
                                $cordovaKeyboard,
                                LogService,
                                $ionicSlideBoxDelegate,
                                AccountService,
                                $filter,
                                AppAnalytics,
                                FavoriteItem) {


        var mq = window.matchMedia('all and (max-width: 700px)');
        if(mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }
        $scope.getItemWidth =function() {
            return $scope.itemWidth;
        };

        $scope.getItemClass = function(product){
            if(!product) return '';
            if(product.addButton) {
                return 'item-stable item-no-border';
            } else if (product.loadingMore) {
                return 'item-loading-more';
            }
        }

        $scope.search = {
            text: null
        };
        $scope.addCustomProductModal = null;
        $scope.dataLoaded = false;
        $scope.showingProductHistory = false;

        var current_page = 0;
        var total_pages = null;
        var lastPageRequested = null;


        $scope.searchForProduct = function (item){
            try {
                if(item.addButton) {
                    return true;
                }
                if(!$scope.search.text) {
                    return true;
                }
                if (item.name.toLowerCase().indexOf($scope.search.text.toLowerCase()) > -1 || item.brand_name.toLowerCase().indexOf($scope.search.text.toLowerCase()) > -1) {
                    return true;
                }
                if( (item.name.toLowerCase() + ' ' + item.brand_name.toLowerCase()).indexOf($scope.search.text.toLowerCase()) > -1 ) {
                    return true;
                }
                if( (item.brand_name.toLowerCase() + ' ' + item.name.toLowerCase()).indexOf($scope.search.text.toLowerCase()) > -1 ) {
                    return true;
                }
                return false;
            } catch (e) {
                return true;
                $log.info('error in filter',e);
            }
        };

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

        $scope.inCartText = function (product) {
            if(product.product_type == 'by weight') {
                return product.unit_of_measure;
            } else {
                return "in cart";
            }
        };

        $scope.addItem = function(product,fromDetail){
            if (canClickInList()) {
                ShoppingService.addProductToCart(product);
                product.added = true;
                AppAnalytics.addProductToCart(product, $scope.categoryName,fromDetail);
            }
        };

        angular.element('#clearProductSearchText').on('touchstart' , function(){
            $log.debug('touchstart');
            $timeout(function () {
                $scope.search.text = '';
            }, 1);
        });

        $scope.removeItemFromCart = function(product){
            if (canClickInList()) {
                ShoppingService.removeOneProductFromCart(product);
            }
        };

        $scope.removeCartItemForProductFromCartCompletely = function(product) {
            if (canClickInList()) {
                ShoppingService.removeProductsCartItemFromCart(product);
            }
        };

        $scope.cartItemCountForProduct = function(product, includeZero){
            if(product){
                if(product.isCustom) {
                    var index = $scope.cartItems().map(function(el) {
                        return  el.product.name;
                    }).indexOf(product.name);
                    if(index > -1){
                        return $scope.cartItems()[index].qty;
                    } else if (includeZero) {
                        return 0;
                    }
                }

                var index = $scope.cartItems().map(function(el) {
                    return el.product.id;
                }).indexOf(product.id);
                if(index > -1){
                    if(product.product_type != "by weight") {
                        return parseInt($scope.cartItems()[index].qty);
                    } else if (product.has_custom_label){
                        return parseFloat(($scope.cartItems()[index].qty*100)/(product.unit_weight*100));
                    } else {
                        return parseFloat($scope.cartItems()[index].qty);
                    }

                } else if (includeZero) {
                    return 0;
                }
            }
        };

        $scope.clearSearch = function(){
            $scope.search.text = null;
        };

        $scope.$on('$ionicView.beforeEnter', function(){

        });

        $scope.showNoProductsMessage = function() {
            try {
                if($scope.dataLoaded && isRecentProducts()) {
                    return $scope.products.length <= 1;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }

        };

        $scope.isRecentProducts = isRecentProducts;
        var isRecentProducts = function() {
            return $state.includes('app.recentProducts')
        };

        var loadData = function() {
            AppAnalytics.viewCategory($scope.categoryName);
        };

        $scope.clickSubCategory = function(subCat){
            subCat.parentName = $scope.categoryName;
            if (!$scope.parentCategory) $scope.parentCategory = $scope.subCategory;
            $scope.subCategory = subCat;
            $scope.products = null;
            $scope.search.text = null;
            $scope.addCustomProductModal = null;
            $scope.dataLoaded = false;
            $scope.showingProductHistory = false;

            current_page = 0;
            total_pages = null;
            lastPageRequested = null;

            loadProducts();
        };

        $scope.clickHome = function() {
            $state.go('app.home')
        };

        $scope.parentCategoryClick = function() {
            $ionicHistory.goBack();
        };

        function loadProducts(searching) {
            getProducts(searching);
        }

        function getRecentProducts() {
            ShoppingService.getRecentlyPurchasedProducts(current_page += 1)
                .then(function(data) {
                    current_page = data.current_page;
                    total_pages = data.total_pages;
                    if($scope.products && $scope.products.length > 1){
                        angular.forEach(data.products,function(item){
                            $scope.products.push(item)
                        });
                    } else {
                        $scope.products = data.products;
                    }
                    if((current_page -1) == total_pages) {
                        removeAddSpecialButton();
                        $scope.products.push(searchButtonIonItem);
                    } else {
                        removeAddSpecialButton();
                        removeLoadingThing();
                        if($scope.products.length > 0){
                            $scope.products.push(searchButtonIonItem);
                        }

                        if(current_page == total_pages){
                            removeLoadingThing();
                        } else {
                            addMoreLoadingThing();
                            removeAddSpecialButton();
                        }
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.dataLoaded = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function(error) {
                    UIUtil.showErrorAlert('Error Loading Recently Purchased Products');
                    $scope.$broadcast('scroll.refreshComplete');
                    LogService.error({
                        message: 'getRecentlyPurchasedProducts error',
                        error:error
                    });
                });
        }

        function preventDuplicateUtilityItemsInList(){
            try {

                var index = $scope.products.map(function(el) {
                    return el.addButton;
                }).indexOf(searchButtonIonItem.addButton);
                if(index > -1) {
                    $scope.products.splice(index, 1);
                }

                var index = $scope.products.map(function(el) {
                    return el.loadingMore;
                }).indexOf(loadingMoreButton.loadingMore);
                if(index > -1) {
                    $scope.products.splice(index, 1);
                }
                var found = $scope.cartItems().find(x => x.product.id == product.id);
            } catch(e) {

            }
        }

        function getProducts(searching) {
            if(!$scope.moreDataCanBeLoaded('function getProducts') && getFilteredCount() <= 2){
                removeLoadingThing();
                return false;
            }

            if(lastPageRequested){
                if ((current_page + 1) == lastPageRequested) {
                    $log.info('skipping page get because it was already requested but just not returned.');
                    return;
                } else {
                    lastPageRequested += 1;
                }
            } else {
                lastPageRequested = 1;
            }

            FavoriteItem.list(current_page += 1,searching)
                .then(function(data){
                    current_page = data.current_page;
                    total_pages = data.total_pages;
                    if($scope.products && $scope.products.length > 1){
                        angular.forEach(data.products,function(item){
                            $scope.products.push(item)
                        });
                    } else {
                        $scope.products = data.products;
                    }
                    if(current_page > total_pages) {
                        removeAddSpecialButton();
                        $scope.products.push(searchButtonIonItem);
                        removeLoadingThing();
                    } else {
                        removeAddSpecialButton();
                        removeLoadingThing();
                        if($scope.products.length > 0){
                            $scope.products.push(searchButtonIonItem);
                        }

                        if(current_page == total_pages){
                            removeLoadingThing();
                        } else {
                            addMoreLoadingThing();
                            removeAddSpecialButton();
                        }
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.dataLoaded = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function (error) {
                    UIUtil.showErrorAlert('Error retrieving products.');
                    $scope.$broadcast('scroll.refreshComplete');
                    LogService.error({
                        message: 'getProducts error',
                        error:error
                    });
                });
        }

        function recentSpecialRequests() {
            ShoppingService.getRecentlyPurchasedSpecialRequests()
                .then(function(products) {
                    $scope.products = products;
                    var i = 0;
                    for (i = 0; i < $scope.products.length; i++) {
                        var product = $scope.products[i];
                        if(product.product_type == 'custom') {
                            product.name = product.description;
                            product.isCustom = true;
                        }
                    }
                    $scope.dataLoaded = true;
                    $scope.products.push(searchButtonIonItem);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    total_pages = 0;
                }, function(error) {
                    UIUtil.showErrorAlert('Error Loading Recently Purchased Products');
                    $scope.$broadcast('scroll.refreshComplete');
                    LogService.error({
                        message: 'getRecentlyPurchasedProducts error',
                        error:error
                    });
                });
        }


        function removeAddSpecialButton() {
            var index = $scope.products.map(function(el) {
                return el.addButton;
            }).indexOf(searchButtonIonItem.addButton);
            if(index > -1) {
                $scope.products.splice(index, 1);
            }
        }

        $scope.$watch('search.text',function(){
            if($scope.search.text && $scope.search.text != ""){
                // if(getFilteredCount() <= 1 && webVersion){
                if(webVersion){
                    loadProducts(true);
                }
            }
        });

        $scope.getFilteredCount = getFilteredCount;
        function getFilteredCount() {
            try {
                var length = $scope.$eval('products | filter:searchForProduct').length
                $log.info('getFilteredCount',length)
                return length;
            } catch (e){
                $log.error('getFilteredCount', e)
            }
        }

        function addMoreLoadingThing() {
            removeLoadingThing();
            $scope.products.push(loadingMoreButton);
        }

        function removeLoadingThing() {
            var index = $scope.products.map(function(el) {
                return el.loadingMore;
            }).indexOf(loadingMoreButton.loadingMore);
            if(index > -1) {
                $scope.products.splice(index, 1);
            }
        }

        $scope.doRefresh = function(){
            $scope.$broadcast('scroll.refreshComplete');
            current_page = 0;
            total_pages = null;
            $scope.products = null;
            loadProducts();
        };

        $scope.productUnFavoritedRemove = function(product) {
            $scope.products = $scope.products.filter(prod => prod.id != product.id);
            $scope.closeProductDetail()
        };

        $scope.guest_account = function() {
            return AccountService.isCustomerGuest()
        };

        $scope.goToCat = function(catId){
            $state.go('app.shopping');
        };

        $scope.productInCart = function(product) {
            if(!product){
                return false;
            }
            if(product.isCustom) {
                var index = $scope.cartItems().map(function(el) {
                    return el.product.name;
                }).indexOf(product.name);
                return index > -1;
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
            if (canClickInList()) {
                if(product.addButton){
                    $scope.addCustomProduct();
                    return;
                }
                $scope.productDetailProduct = product;
                $log.info('product detail product', product);
                $scope.productDetailModal.show();
                AppAnalytics.viewProduct(product, $scope.categoryName);
            }
        };

        $scope.closeProductDetail = function(){
            $scope.productDetailModal.hide();
            $scope.productDetailCartItem = null;
            $scope.productDetailProduct = null;
        };

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

        $scope.moreDataCanBeLoaded = function() {
            if(total_pages == 0){
                return false;
            }
            if(total_pages){
                if(current_page != 0){
                    if(total_pages > current_page){
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return true;
            }
        };


        $scope.loadMoreItems = function(locationcalledfrom) {
            if($scope.search.text && $scope.search.text != ""){
                loadProducts(true);
            } else {
                loadProducts();
            }
        };

        var lastScrolling = Date.now();

        $scope.scrollList = function() {
            lastScrolling = Date.now();
        };

        angular.element('#productsIonContent').on('touchstart' , function(){
            $log.debug('productsIonContent touchstart');
            $timeout(function () {
                if(window.cordova) {
                    if ($cordovaKeyboard.isVisible()) {
                        $cordovaKeyboard.close();
                    }
                }
            }, 1);
        });

        function canClickInList() {
            var diff =  Date.now() - lastScrolling;
            return diff > 400;
        }

        $scope.cartItems = function(){
            return ShoppingService.getCartItems();
        };

        $scope.addNoteForProduct = function(product) {
            if(product){
                var index = -1;
                if(product.isCustom) {
                    index = $scope.cartItems().map(function(el) {
                        return  el.product.name;
                    }).indexOf(product.name);
                } else {
                    index = $scope.cartItems().map(function(el) {
                        return el.product.id;
                    }).indexOf(product.id);
                }

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

        var searchFocused = false;
        $scope.showCancelSearch = false;

        $scope.searchFocus = function() {
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
                $log.debug('closingkeyboard');
                cordova.plugins.Keyboard.close();
            }
        };

        loadData();


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

        $scope.viewRecentSpecialRequestsClick = function(){
            $state.go('app.recentSpecialRequests');
        }


    }
})();
