
(function () {
    'use strict';

    angular.module('shiptApp').factory('ProductDetailProvider', [
        '$rootScope',
        '$filter',
        '$ionicModal',
        '$q',
        'ShoppingService',
        '$ionicSlideBoxDelegate',
        'LogService',
        ProductDetailProvider]);

    function ProductDetailProvider($rootScope,
                                   $filter,
                                   $ionicModal,
                                   $q,
                                   ShoppingService,
                                   $ionicSlideBoxDelegate,
                                   LogService){

        var productDetailModal = null;

        function getModal($scope) {
            var defer = $q.defer();

            $ionicModal.fromTemplateUrl('app/groceries/shop/productDetail/productDetailModal.html', {
                scope: $scope,
                focusFirstInput: true
            }).then(function(modal) {
                    productDetailModal = modal;
                    defer.resolve(productDetailModal);
                });

            return defer.promise;
        }


        var init = function($scope, product) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();

            $scope.productDetailProduct = product;

            getModal($scope)
                .then(function(modal){
                    modal.show().then( function(){
                        $( "button[aria-label='add to favorites icon in top left']" ).first().focus();
                    });
                });

            $scope.closeProductDetail = function(){
                defer.resolve();
                productDetailModal.hide();
                productDetailModal.remove();
                productDetailModal = null;
                $scope.productDetailProduct = null;
            };

            $scope.$on('$destroy', function() {
                if(productDetailModal)productDetailModal.remove();
            });


            //this all needs to be factored into a controller for the modal.
            //it'll do here for now.
            //that will take a few hours to re write for all that shtuff
            var imageModal = null;
            $scope.imageModalImageUrl = '';
            var cartItems = function(){
                return ShoppingService.getCartItems();
            };

            $scope.cartItemCountForProduct = function(product, includeZero){
                if(product){
                    var index = cartItems().map(function(el) {
                        return el.product.id;
                    }).indexOf(product.id);
                    if(index > -1){
                        if(product.product_type != "by weight") {
                            return parseInt(cartItems()[index].qty);
                        } else if (product.has_custom_label) {
                            return $filter('number')(parseFloat((cartItems()[index].qty*100)/(product.unit_weight*100)), 0);
                        } else {
                            return parseFloat(cartItems()[index].qty);
                        }
                    } else if (includeZero) {
                        return 0;
                    }
                }
            };

            $scope.removeItemFromCart = function(product){
                ShoppingService.removeOneProductFromCart(product);
                cartItems();
            };

            $scope.productInCart = function(product) {
                if(!product){
                    return false;
                }
                var index = cartItems().map(function(el) {
                    return el.product.id;
                }).indexOf(product.id);
                return index > -1;
            };

            $scope.addItem = function(product){
                ShoppingService.addProductToCart(product);
                product.added = true;
                cartItems();
            };

            $scope.addNoteForProduct = function(product) {
                if(product){
                    var index = cartItems().map(function(el) {
                        return el.product.id;
                    }).indexOf(product.id);

                    if(index > -1) {
                        $scope.notePopoverItem = cartItems()[index];
                        $scope.noteModal.show();
                        $scope.$broadcast('data.productNotes', $scope.notePopoverItem.note);
                    }
                }
            };

            $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
                scope: $scope,
                focusFirstInput: true,
                animation: 'scale-in'
            }).then(function(modal) {
                $scope.noteModal = modal;
            });

            $scope.$on('close.productNotes',function(event, data){
                $scope.notePopoverItem.note = data;
                ShoppingService.updateNoteOnItem($scope.notePopoverItem);
                $scope.notePopoverItem = null;
                $scope.noteModal.hide();
                cartItems();
            });

            $scope.$on('cancel.productNotes', function(){
                $scope.notePopoverItem = null;
                $scope.noteModal.hide();
            });

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

            return defer.promise;
        };

        return {
            showModal: init
        }

    }
})();
