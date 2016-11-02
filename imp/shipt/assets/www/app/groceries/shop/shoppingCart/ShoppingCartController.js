/**
 * Created by Shipt
 */



(function () {
    'use strict';

    angular.module('shiptApp').controller('ShoppingCartController', [
        '$scope',
        '$filter',
        '$rootScope',
        'ShoppingService',
        'ShoppingCartService',
        '$ionicModal',
        '$log',
        '$state',
        'AccountService',
        'ProductDetailProvider',
        'UIUtil',
        '$ionicActionSheet',
        '$timeout',
        ShoppingCartController]);

    function ShoppingCartController($scope,
                                    $filter,
                                    $rootScope,
                                    ShoppingService,
                                    ShoppingCartService,
                                    $ionicModal,
                                    $log,
                                    $state,
                                    AccountService,
                                    ProductDetailProvider,
                                    UIUtil,
                                    $ionicActionSheet,
                                    $timeout) {

        $scope.guest_account = function(){
            return AccountService.isCustomerGuest();
        };

        $scope.title = "Cart";
        $scope.total = 0;

        $rootScope.$on('cart.items.saved.refresh', function(){
            $scope.refreshCartData();
        });

        $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
            scope: $scope,
            focusFirstInput: true,
            animation: 'scale-in'
        }).then(function(modal) {
            $scope.noteModal = modal;
        });

        $ionicModal.fromTemplateUrl('app/groceries/shop/customProduct/addCustomProductModal.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function(modal) {
            $scope.addCustomProductModal = modal;
        });

        $ionicModal.fromTemplateUrl('app/groceries/shop/terms/alcoholTermsModal.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function(modal) {
            $scope.alcoholTermsModal = modal;
        });

        $scope.showNoCartItemsMessage = function() {
            if($scope.cartItems) {
                if ($scope.cartItems.length < 1) {
                    return true;
                }
                return false;
            } else {
                return false;
            }
        };

        $scope.inCartText = function (product) {
            if(product.product_type == 'by weight') {
                return " " + product.unit_of_measure;
            } else {
                return "";
            }
        };


        $scope.inCartCount = function (cartItem) {
          var product = cartItem.product;
          if(product.product_type == 'by weight') {
            var unit_weight = product.unit_weight;
            if(product.has_custom_label) {
              return $filter('number')((parseFloat(cartItem.qty)*100)/(unit_weight*100), 0);
            } else {
              return parseFloat(cartItem.qty);
            }
          } else {
            return cartItem.qty;
          }
      };

        $scope.inShoppingCartText = function (product, count) {
            if (product.product_type == 'by weight') {
                return $scope.byWeightText(product, count);
            } else {
                return "";
            }
        };

        $scope.byWeightText = function (product, count) {
            if (product.has_custom_label) {
                if (count > 1) {
                    return " " + product.description_label[product.description_label.length-1];
                } else {
                    return " " + product.description_label[0];
                }
            } else {
                return " " + product.unit_of_measure;
            }
        };

        $scope.saleHasExpiredSinceUpdate = function(cartItem) {
            try {
                if(cartItem.product.on_sale) {
                    return false;
                }
                if(!cartItem.product.sale_ends_on || !cartItem.updated_at) {
                    return false;
                }
                var saleEndDate = moment(cartItem.product.sale_ends_on);
                var cartItemUpdated = moment(cartItem.updated_at);
                if(cartItemUpdated.isBefore(saleEndDate) && moment().isAfter(saleEndDate)) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        };

        $scope.anyItemsWithSalePriceChanged = function() {
            try {
                for(let cartItem of $scope.cartItems) {
                    if($scope.saleHasExpiredSinceUpdate(cartItem)){
                        return true;
                    }
                }
            } catch(e) {
                return false;
            }
        }

        $scope.getItemClass = function(cartItem) {
            var itemClass = '';
            if(!cartItem.product.isCustom) {
                itemClass += ' item-thumbnail-left '
            }
            if($scope.saleHasExpiredSinceUpdate(cartItem)){
                itemClass += ' item-sale-expired '
            }
            return itemClass;
        }

        $scope.addCustomProduct = function(){
            $scope.addCustomProductModal.show();
        };

        $scope.clickCartItem = function(cartItem){
            ProductDetailProvider.showModal($scope,cartItem.product)
                .then(function(){
                    $scope.refreshCartData()
                });
        };

        $scope.$on('close.addCustomProduct',function(){
            $scope.addCustomProductModal.hide();
            $scope.refreshCartData();
        });

        $scope.refreshCartData = function(fromServer) {
            if(fromServer){
                $scope.cartItems = ShoppingService.getCartItems();
                $scope.updateTotal();
                ShoppingCartService.loadServerCart()
                    .then(function(){
                        $scope.cartItems = ShoppingService.getCartItems();
                        $scope.updateTotal();
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            } else {
                $scope.cartItems = ShoppingService.getCartItems();
                console.log($scope.cartItems);
                $scope.updateTotal();
            }
        };

        $scope.clearCart = function(confirm) {
            if (confirm) {
                confirmClearCart();
            } else {
                ShoppingService.clearCart();
                $scope.cartItems = [];
            }
        };

        $scope.updateTotal = function(){
            try {
                var total = 0;
                angular.forEach($scope.cartItems, function(cartItem){
                    if(cartItem.product.on_sale){
                        total = total + (cartItem.product.sale_price * cartItem.qty);
                    } else {
                        total = total + (cartItem.product.price * cartItem.qty);
                    }
                });
                $scope.total = total;
            } catch (exception) {

            }
        };

        $scope.completeOrder = function(){
            if (orderContainsAlcohol()) {
                $scope.alcoholTermsModal.show();
            } else {
                $state.go('app.checkout');
            }
        };

        function orderContainsAlcohol(){
            try {
                // check each product's categories for an alcohol category
                for (let item of $scope.cartItems) {
                    if (!item.product.isCustom && categoryContainsAlcohol(item.product.categories)) {
                        return true;
                    }
                }
                return false;
            } catch (e) {
                return false;
            }
        }

        function categoryContainsAlcohol(categories) {
            try {
                for (let category of categories) {
                    if (category.terms_required) {
                        return true;
                    }
                }
                return false;
            } catch (e) {
                return false;
            }
        }

        $scope.$on('$ionicView.beforeEnter', function(){
            loadStore();
            $scope.refreshCartData(true);
        });

        $scope.$on('$ionicView.afterEnter', function(){
            loadStore();
        });

        $scope.addNote = function(item) {
            $scope.noteModal.show();
            $scope.notePopoverItem = item;
            $scope.$broadcast('data.productNotes',$scope.notePopoverItem.note);
        };

        $scope.editAddNote = function(item) {
            item.showEditNote = true;
            item.editNoteText = item.note;
            $timeout(function(){
                $("textarea.text-are-note-item").focus();
            },200);

        };

        $scope.saveEditNoteArea = function(item) {
            item.note = item.editNoteText;
            ShoppingService.updateNoteOnItem(item);
            item.showEditNote = false;
        };

        $scope.cancelEditNoteArea = function(item) {
            item.editNoteText = item.note;
            item.showEditNote = false;
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

        $scope.addProduct = function(productToAdd){
            $log.info('add item', productToAdd);
            ShoppingService.addProductToCart(productToAdd);
            $scope.refreshCartData();
        };

        $scope.removeCartItemForProductFromCartCompletely = function(cartItem) {
            ShoppingService.removeProductsCartItemFromCart(cartItem.product);
            $scope.refreshCartData();
        };

        $scope.removeProduct = function(productToRemove){
            ShoppingService.removeOneProductFromCart(productToRemove);
            $scope.refreshCartData();
        };

        function confirmClearCart(){
            UIUtil.showYesNoConfirm('Clear Cart', 'Are you sure you want to remove everything from your cart? This is not reversible.')
                .then(function(doIt){
                    if(doIt){
                        //clear the cart.
                        ShoppingCartService.clearCart();
                        $scope.cartItems = [];
                    }
                })
        }

        $scope.cartOptionsButtonClicked = function() {
            $ionicActionSheet.show({
                titleText: 'Shopping Cart Options',
                cancelText: 'Cancel',
                destructiveText: 'Empty Cart',
                destructiveButtonClicked: function(){
                    confirmClearCart();
                    return true;
                }
            });
        };

        function loadStore() {
            $scope.store = AccountService.getCustomerStore();
        }

        $scope.getPrice = function(product) {
            if (product.product_type == 'by weight') {
                if (product.has_custom_label) {
                    var price = `~${$filter('currency')((product.price)*(product.unit_weight))}`;
                    var label = product.description_label[0];
                } else {
                    var price = $filter('currency')(product.price);
                    var label = weightedLabel(product);
                }
                return `${price} / ${label}`;
            } else {
                return $filter('currency')(product.price);
            }
        }

        function weightedLabel(product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                return "lb";
            } else {
                return product.unit_of_measure;
            }
        }

        $scope.getSalePrice = function(product) {
            if (product.product_type == 'by weight') {
                if (product.has_custom_label) {
                    var price = `~${$filter('currency')((product.sale_price)*(product.unit_weight))}`;
                    var label = product.description_label[0];
                } else {
                    var price = $filter('currency')(product.sale_price);
                    var label = weightedLabel(product);
                }
                return `${price} / ${label}`;
            } else {
                return $filter('currency')(product.sale_price);
            }
        }
    }
})();
