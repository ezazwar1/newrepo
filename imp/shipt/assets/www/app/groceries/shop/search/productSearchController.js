(function () {
    'use strict';

    angular.module('shiptApp').controller('productSearchController', [
        '$scope',
        '$log',
        '$filter',
        'UIUtil',
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
        'AppAnalytics',
        'shopCategoriesProvider',
        'chooseStoreModal',
        'AccountService',
        'filterSortModal',
        'filterSortOptions',
        'FILTER_SORT',
        'FeatureService',
        'COMMON_FEATURE_TOGGLES',
        productSearchController]);

    function productSearchController($scope,
                            $log,
                            $filter,
                            UIUtil,
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
                            AppAnalytics,
                            shopCategoriesProvider,
                            chooseStoreModal,
                            AccountService,
                            filterSortModal,
                            filterSortOptions,
                            FILTER_SORT,
                            FeatureService,
                            COMMON_FEATURE_TOGGLES) {

        var viewModel = this;

        $scope.isAlgoliaSearchEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_SEARCH_ENABLED);
        $scope.isFilterSortEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_FILTER_SORT_ENABLED);
        $scope.isIosPlatform = ionic.Platform.isIOS();
        $scope.showFilterBar = false;
        $scope.search = { searchQuery: null};

        /**
         * Ensure that pagination is reset each time a new filter is applied.
         */
        $scope.$on(FILTER_SORT.EVENTS.APPLY_FILTER, function(event, filterSortResults) {
            $scope.showFilterBar = true;
            current_page = null;
            total_pages = null;
            searchForProducts(filterSortResults.searchTerm, filterSortResults);
        });

        /**
         * Re-initialize the model when a search is cleared.
         */
        $scope.$on(FILTER_SORT.EVENTS.CLEAR_FILTER, function(event, options = {}) {
            $scope.showFilterBar = false;
            current_page = null;
            total_pages = null;
            try { // Re-initialize the facet filters after they are cleared
                $scope.filterSortOptions = filterSortOptions.init(originalSearchFacets.categories_name, originalSearchFacets.brand_name);
            } catch (e) { // If the facet filters cannot be reinitialized, close the modal and init a blank filter model
                filterSortModal.closeModal();
                $scope.filterSortOptions = filterSortOptions.init();
            }

            if (options.refreshSearch) { // In the case that a search should be refreshed after clearing the filters
                $scope.searchResults = [];
                searchForProducts(options.searchTerm, null);
            }

        });

        var defaultShoppingAddress = null;
        var mq = window.matchMedia('all and (max-width: 700px)');
        if(mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }
        var current_page = 0;
        var total_pages = null;
        var lastSearchText = "";

        var currentFacets = null;
        var originalSearchFacets = null;
        $scope.filterSortOptions = filterSortOptions.init();

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

        $scope.getItemWidth =function() {
            return $scope.itemWidth;
        };

        $scope.searchSubmit = function (value) {
            var val = $scope.search.searchQuery;
            if(!val || val == "" || val == 'undefined'){
                $scope.searching = false;
                lastSearchText = "";
            } else {
                $scope.searching = true;
                $scope.filterText = val;
                searchForProducts($scope.filterText, $scope.filterSortOptions);
                $ionicScrollDelegate.$getByHandle('homeScroll').resize();
            }
        };

        $scope.$on('$ionicView.afterEnter', function(){
            $('input.productSearchBox').focus();
            $cordovaKeyboard.open();
        });

        $scope.$watch('search.searchQuery', function (val) {
            var val = $scope.search.searchQuery;
            if(!val || val == "" || val == 'undefined'){
                $scope.searching = false;
                lastSearchText = "";
                $scope.showFilterBar = false;
                $scope.$broadcast(FILTER_SORT.EVENTS.RESET);
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

        function loadStoreAddressData() {
            try {
                viewModel.store = AccountService.getCustomerStore();
                defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
                viewModel.chooseStoreEnabled = AccountService.checkFeature("chooseStoreInApp");
            } catch (e) {
                viewModel.store = null;
            }
        }

        viewModel.filterSortClick = function() {
            if (currentFacets && !$scope.filterSortOptions.isFilterSortActive()) {
                $scope.filterSortOptions = filterSortOptions.init(currentFacets.categories_name, currentFacets.brand_name);
            }
            filterSortModal.show($scope);
            AppAnalytics.filterSort();
        };

        viewModel.searchButtonText = function(){
            if(viewModel.store && defaultShoppingAddress){
                return "Search " + viewModel.store.name + ", " + defaultShoppingAddress.zip_code;
            } else {
                return "Search All Products";
            }
        };

        function removeAddSpecialButton() {
            var index = $scope.searchResults.map(function(el) {
                return el.addButton;
            }).indexOf(searchButtonIonItem.addButton);
            if(index > -1) {
                $scope.searchResults.splice(index, 1);
            }
        }

        function searchForProducts(text, filterSortOptions) {
            if(!text || text == "") return;
            if (text != lastSearchText) {
                //reset search params if the search is different
                AppAnalytics.productSearch(text);
                $scope.searchResults = [];
                current_page = null;
                lastSearchText = text;
            } else if(total_pages != null && total_pages <= current_page){
                //this will catch searches that were not supposed to happen
                removeLoadingThing();
                return false;
            }
            if (useFilterSortSearchApi(filterSortOptions)) {
                ProductService.searchForFilterSortGroceryProducts(text, current_page, filterSortOptions.facetFilters, filterSortOptions.indexName)
                    .then(function(results) {
                        processSearchResults(results);
                    }, onSearchError);
            } else {
                ProductService.searchForGroceryProducts(text, current_page)
                    .then(function(results){
                        if ($scope.isAlgoliaSearchEnabled) { // Only map facets when using algolia results
                            originalSearchFacets = mapFacets(results.facets);
                        }
                        processSearchResults(results);
                    }, onSearchError);
            }
        }

        viewModel.inCartText = function (product) {
                if($scope.cartItemCountForProduct(product) > 1) {
                  return product.description_label[product.description_label.length - 1];
                } else {
                  return product.description_label[0]
                }
        };

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

        $scope.cancelSearch = function(){
            $state.go('app.home')
        };

        $scope.clearSearch = function() {
            $scope.searching = false;
            $scope.search.searchQuery = null;
            $scope.searchResults = [];
            $ionicScrollDelegate.$getByHandle('homeScroll').scrollTop(true);
            $ionicScrollDelegate.$getByHandle('homeScroll').resize();
        };

        angular.element('#clearSearchTextHome').on('touchstart' , function(){
            $timeout(function () {
                $scope.search.searchQuery = '';
            }, 1);
        });

        angular.element('#searchIonContent').on('touchstart' , function(){
            $timeout(function () {
                $log.info('#searchIonContent timeout');
                if(window.cordova) {
                    $log.info('#searchIonContent window.cordova');
                    if($cordovaKeyboard.isVisible()) {
                        $log.info('#searchIonContent cordovaKeyboard.close');
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
                    } else if(product.has_custom_label) {
                        return $filter('number')((parseFloat(found.qty*100)/(product.unit_weight*100)), 0);
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
            $scope.filterSortOptions.facetFilters = $scope.filterSortOptions.getFacetFiltersForSearch() || null;
            searchForProducts($scope.search.searchQuery, $scope.filterSortOptions);
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

        function canClickInList() {
            return true;
        }

        function useFilterSortSearchApi(filterSortOptions) {
            filterSortOptions = filterSortOptions || {};
            return ((filterSortOptions.facetFilters && filterSortOptions.facetFilters.length > 0) || filterSortOptions.indexName);
        }

        function processSearchResults(results) {
            current_page = results.current_page++;
            total_pages = results.total_pages;

            if ($scope.isAlgoliaSearchEnabled) { // Handle processing of algolia search results
                $scope.nbHits = results.nbHits;
                currentFacets = mapFacets(results.facets);
                $scope.showFilterBar = (results.nbHits > 1);
                $scope.searchResults = (results.current_page === 1) ? [] : $scope.searchResults;
                $scope.filterSortOptions.setCurrentFacets(currentFacets.categories_name, currentFacets.brand_name);
            }

            if($scope.searchResults && $scope.searchResults.length > 1){
                //add items to the end of the array
                angular.forEach(results.products,function(item){
                    $scope.searchResults.push(item)
                });
            } else {
                $scope.searchResults = results.products;
            }
            if(current_page == total_pages || total_pages == 0) {
                removeLoadingThing();
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
        }

        function mapFacets(facets = {}) {
            return {
                categories_name: facets[FILTER_SORT.FACETS.CATEGORIES],
                brand_name: facets.brand_name
            }
        }

        function onSearchError(error) {
            LogService.error({
                message: 'Error Searching For Product',
                error: error
            });
        }

        loadStoreAddressData();
    }

})();
