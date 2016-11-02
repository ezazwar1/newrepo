/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('AddProductToOrderSearchController', [
        '$scope',
        '$log',
        '$rootScope',
        'ShoppingService',
        'ProductService',
        'UIUtil',
        '$ionicModal',
        '$filter',
        '$ionicSlideBoxDelegate',
        'common',
        'AppAnalytics',
        AddProductToOrderSearchController]);

    function AddProductToOrderSearchController($scope,
                                               $log,
                                               $rootScope,
                                               ShoppingService,
                                               ProductService,
                                               UIUtil,
                                               $ionicModal,
                                               $filter,
                                               $ionicSlideBoxDelegate,
                                               common,
                                               AppAnalytics) {
        var viewModel = this;


        viewModel.search = {searchQuery: null};
        viewModel.productDetailModal = null;
        var mq = window.matchMedia('all and (max-width: 700px)');
        var searchButtonIonItem = {
            addButton: true
        };
        var lastSearchText = "";
        if(mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }

        $scope.cancelSearch = function(){
            viewModel.closeAddItemModal();
        };

        $scope.$on('modal.shown', function(event, modal) {
            if(modal.id == 'addProductToOrderSearch') {
                viewModel.orderAddingTo = $scope.addProductToOrder;
            }
        });

        viewModel.getItemWidth =function() {
            return $scope.itemWidth;
        };

        $ionicModal.fromTemplateUrl('app/groceries/account/orders/addProduct/addProductToOrderDetailModal.html', {scope: $scope})
            .then(function(modal) {
                viewModel.productDetailModal = modal;
            });

        viewModel.addCustomProductClick = function() {
            $rootScope.$broadcast('customProduct.addProductToOrderSearch');
        };

        viewModel.closeProductDetail = function(){
            viewModel.productDetailModal.hide();
            viewModel.productDetailProduct = null;
        };

        viewModel.productClick = function(product) {
            if (product.addButton) {
                viewModel.addCustomProductClick();
                return;
            }

            viewModel.productDetailProduct = product;
            viewModel.productDetailModal.show();

        };

        viewModel.closeAddItemModal = function(){
            $rootScope.$broadcast('close.addProductToOrderSearch');
        };

        viewModel.saveProduct = function(){
            $rootScope.$broadcast('close.addProductToOrderSearch', viewModel.productToAdd);
        };

        function loadViewModelData(){
            viewModel.productToAdd = {};
        }

        viewModel.productInCart = function(product) {
            if(!product || !viewModel.orderAddingTo){
                return false;
            }
            var index = viewModel.orderAddingTo.order_lines.map(function(el) {
                return el.requested_product.id;
            }).indexOf(product.id);
            return index > -1;
        };

        $scope.productInCart = viewModel.productInCart;

        $scope.addItemProductToOrder = function(product) {
            if(viewModel.productInCart(product)) {
                var orderLine = getOrderLineForProduct (product);
                if(orderLine.requested_product.product_type == 'by weight'){
                    orderLine.requested_qty = ((orderLine.requested_qty*100) + (orderLine.requested_product.unit_weight*100))/100;
                } else {
                    orderLine.requested_qty ++;
                }
            } else {
                var orderLine = {};
                orderLine.requested_product = product;
                if(product.product_type == 'by weight'){
                    orderLine.requested_qty = orderLine.requested_product.unit_weight;
                } else {
                    orderLine.requested_qty = 1;
                }
                orderLine.notes = null;
                viewModel.orderAddingTo.order_lines.push(orderLine);
            }
            $rootScope.$broadcast('update.OrderHistoryDetailModalController', viewModel.orderAddingTo);

        };

        function getOrderLineForProduct (product) {
            var index = viewModel.orderAddingTo.order_lines.map(function(el) {
                return el.requested_product.id;
            }).indexOf(product.id);
            if(index > -1) {
                return viewModel.orderAddingTo.order_lines[index];
            } else {
                return null;
            }
        }

        $scope.inCartCount = function (product) {
            if(product.product_type == 'by weight') {
                var unit_weight = product.unit_weight;
                if(product.has_custom_label) {
                    var quantity = $filter('number')((parseFloat(orderLine.requested_qty)*100)/(unit_weight*100), 0);
                    var label = quantity > 1 ? product.description_label[1] : product.description_label[0];
                    return `${quantity} ${label}`
                } else {
                    return parseFloat(orderLine.requested_qty);
                }
            } else {
                return orderLine.requested_qty;
                }
            };

        $scope.orderLineCountForProduct = function (product) {
            var orderLine = getOrderLineForProduct (product);
            if(orderLine) {
                if (product.product_type == 'by weight' && product.has_custom_label) {
                    var quantity = parseFloat((orderLine.requested_qty*100)/(product.unit_weight*100));
                    var count = $filter('number')(quantity, 0);
                    var label = quantity > 1 ? product.description_label[1] : product.description_label[0];
                    return `${quantity} ${label}`
                } else {
                    return orderLine.requested_qty;
                }
            }
        };

        $scope.removeItemProductToOrder = function(product) {
            var index = viewModel.orderAddingTo.order_lines.map(function(el) {
                return el.requested_product.id;
            }).indexOf(product.id);
            if(index > -1) {
                var orderLine = viewModel.orderAddingTo.order_lines[index];
                if(orderLine.requested_qty == 1 || orderLine.requested_qty == .5 ) {
                    if(orderLine.requested_product.product_type == 'by weight'){
                        if(orderLine.requested_qty == .5) {
                            viewModel.orderAddingTo.order_lines.splice(index, 1);
                        } else {
                            orderLine.requested_qty = (orderLine.requested_qty - .5);
                        }
                    } else {
                        viewModel.orderAddingTo.order_lines.splice(index, 1);
                    }
                } else {
                    if(orderLine.requested_product.product_type == 'by weight'){
                        orderLine.requested_qty = (orderLine.requested_qty - .5);
                    } else {
                        orderLine.requested_qty --;
                    }
                }
                $rootScope.$broadcast('update.OrderHistoryDetailModalController', viewModel.orderAddingTo);
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

        function refreshCartItems() {
            viewModel.cartItems = ShoppingService.getCartItems();
            viewModel.cartCount = ShoppingService.getCartItemCount();
        }

        viewModel.submitSearch = function() {
            if( viewModel.search.searchQuery && viewModel.search.searchQuery != "") {
                searchForProducts(viewModel.search.searchQuery);
            }
        }

        $scope.searchSubmit = viewModel.submitSearch;

        var searchForProducts = function(text) {
            $log.info('searching:'+text);
            if (text !== lastSearchText) {
                //reset search params if the search is different
                lastSearchText = text;
                AppAnalytics.productSearch(text);
            }
            $scope.myPromise = ProductService.searchForGroceryProducts(text)
                .then(function(results){
                    if (results.constructor === Array) {
                        viewModel.searchResults = results;
                    } else {
                        viewModel.searchResults = results.products;
                    }

                    viewModel.searchResults.push(searchButtonIonItem);
                },function(error){
                    UIUtil.showAlert('Error','Error when searching for products.');
                });
        };

        loadViewModelData();

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

    }
})();
