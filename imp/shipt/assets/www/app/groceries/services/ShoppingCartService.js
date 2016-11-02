
(function () {
    'use strict';

    var serviceId = 'ShoppingCartService';

    angular.module('shiptApp').factory(serviceId, [
        '$http',
        '$rootScope',
        '$filter',
        'LogService',
        '$q',
        '$timeout',
        'ApiEndpoint',
        'common',
        'AuthService',
        '$log',
        'DefaultHeaders',
        'AppAnalytics',
        ShoppingCartService]);

    var keyLocalCartItems = 'localCartItems';

    function ShoppingCartService($http,
                                 $rootScope,
                                 $filter,
                                 LogService,
                                 $q,
                                 $timeout,
                                 ApiEndpoint,
                                 common,
                                 AuthService,
                                 $log,
                                 DefaultHeaders,
                                 AppAnalytics) {


        var service = {
            getCartTotal: getCartTotal,
            loadServerCart: getServerCart,
            getCartItems: getCartItems,
            getCartItemCount: getCartItemCount,
            updateNoteOnItem: updateNoteOnItem,
            addProductToCart: addProductToCart,
            addCustomProductToCart: addCustomProductToCart,
            removeOneProductFromCart: removeOneProductFromCart,
            removeProductsCartItemFromCart: removeProductsCartItemFromCart,
            clearCart:clearCart
        };

        var _cartItems = [];
        var lastRequest = null;
        var lastGetServerAddRequest = null;
        var lastGetServerSubtractRequest = null;
        var byWeightProductType = 'by weight';
        var bogoAmount = 2;

        //setting the auth token header for all requests from here.
        DefaultHeaders.customer();

        $rootScope.$on('cart.data.changed', function(event, data){
            var cartItems = data ? data : getLocalCartItems();
            createServerCart(cartItems);
        });

        $rootScope.$on('get.cart.data.from.server', function(){
            getServerCart();
        });

        return service;

        var cartBaseApiUrl = null;
        var customer = null;

        $rootScope.$on('refresh.user-data', function(event,data){
            cartBaseApiUrl = null;
        });

        function getShoppingCartBaseUrl () {
            try {
                //use the cart api url that is passed on the user but if not there use the regular api
                if (cartBaseApiUrl != null){
                    return cartBaseApiUrl;
                } else {
                    var user = customer == null ? AuthService.getUserInfo() : customer;
                    if (user.shopping_cart_base_url) {
                        cartBaseApiUrl = user.shopping_cart_base_url;
                        return user.shopping_cart_base_url;
                    } else {
                        return ApiEndpoint.apiurl;
                    }
                }
            } catch (e) {

            }
        };

        function createServerCart(cartItems) {
            try {
                addDefaultHeaders();
                LogService.info(['createServerCart', cartItems]);
                _.each(cartItems, function(element, index, list){
                    if(element.product) {
                        if(element.product.isCustom) {
                            element.product = _.pick(element.product, 'name');
                        } else {
                            element.product = _.pick(element.product, 'id');
                        }
                    }
                });

                if(lastRequest) lastRequest.cancel();
                var canceller = $q.defer();

                var cancel = function(){
                    canceller.resolve('User Canceled Request');
                };

                var promise = $http.post(
                    getShoppingCartBaseUrl() + '/api/shopping_cart/create.json',
                    {items:cartItems}
                    , { timeout: canceller.promise })
                    .success(function(data){
                        LogService.info(['createServerCart', data]);
                        saveServerCartToLocal(data);
                    })
                    .error(function(data, status, headers, config){
                        if(status != 0){
                            LogService.critical(['Error createServerCart', data, status, headers, config]);
                        }
                    });

                //so we save only the last request. With the most up to date data...
                lastRequest = {
                    promise: promise,
                    cancel: cancel
                }
            } catch (exception){
                LogService.critical(['saveCartToServer', exception]);
            }
        }

        function getServerCart() {
            try {
                var deferred = $q.defer();
                if(!AuthService.shouldMakeShiptApiCall()) {
                    deferred.resolve(null);
                    return;
                }
                addDefaultHeaders();
                $http({
                    method: 'GET',
                    url: getShoppingCartBaseUrl() + '/api/shopping_cart.json'
                })
                    .success(function(data){
                        if(data.length >= 0) {
                            saveServerCartToLocal(data);
                        }
                        deferred.resolve();
                    })
                    .error(function(data){
                        LogService.critical(['getServerCart', data]);
                        deferred.reject();
                    });

                return deferred.promise;
            } catch (exception){
                LogService.critical(['getServerCart', exception]);
            }
        }

        function emptyServerCart() {
            var deferred = $q.defer();
            addDefaultHeaders();

            var promise = $http({
                method: "DELETE",
                url: getShoppingCartBaseUrl() + '/api/shopping_cart/empty.json'
            }).success(function (server_cart) {
                deferred.resolve(server_cart);
            }).error(function (error) {
                deferred.reject(error);
                LogService.error(['Error callServerAddForProduct', error]);
            });

            return deferred.promise;
        }

        function saveServerCartToLocal(serverCart) {
            try {
                var cartItems = mergeCart(serverCart);
                writeLocalCartItemsToLocalStorage(cartItems, true);
            } catch (exception){
                LogService.critical(['saveServerCartToLocal', exception]);
            }
        }

        function mergeCart(data) {
            try {
                _.each(data, function(element, index, list){
                    element = new common.GroceryCartItem(element);
                });
                return data;
            } catch (exception){
                LogService.critical(['mergeCart', exception]);
            }
        }

        function broadcastCartItemsChanged(cartItems){
            $rootScope.$broadcast('cart.data.changed', cartItems);
        }

        function addDefaultHeaders(){
            DefaultHeaders.customer();
        }

        function callServerSaveForCartItemNotes(cartItem){
            var deferred = $q.defer();
            performRetryCartActions();
            addDefaultHeaders();
            cartItem = angular.copy(cartItem);
            if(cartItem.product.isCustom) {
                cartItem.product = _.pick(cartItem.product, 'name', 'description');
            } else {
                cartItem.product = _.pick(cartItem.product, 'id');
            }
            cartItem =  _.pick(cartItem, 'note', 'product', 'qty');
            cartItem.qty = 0;
            // if(lastGetServerAddRequest) lastGetServerAddRequest.cancel();
            var promise = $http({
                method: "POST",
                url: getShoppingCartBaseUrl() + '/api/shopping_cart/add.json',
                data: cartItem
            }).success(function (server_cart) {
                if(lastGetServerAddRequest && cartItem.id == lastGetServerAddRequest.cartItem.id) {
                    saveServerCartToLocal(server_cart);
                }
                deferred.resolve(server_cart);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
                if(status != 0){
                    LogService.error(['Error callServerAddForProduct', data, status, headers, config]);
                } else {
                    offlineCartItemTriedToAdd('add', cartItem);
                }
            });
            lastGetServerAddRequest = {
                cartItem: cartItem
            };
            return deferred.promise;
        }

        function callServerAddForCartItem(cartItem, addingCustomFirstTime){
            var deferred = $q.defer();
            performRetryCartActions();
            addDefaultHeaders();
            cartItem = angular.copy(cartItem);
            var unitWeight = getUnitWeightForProduct(cartItem.product);
            var itemByWeight = cartItem.product.product_type == byWeightProductType;
            var itemBogo = cartItem.product.bogo;
            var customProduct = cartItem.product.isCustom;
            if(cartItem.product.isCustom) {
                cartItem.product = _.pick(cartItem.product, 'name', 'description');
            } else {
                cartItem.product = _.pick(cartItem.product, 'id');
            }
            if(itemByWeight){
                //move up by product's unit_weight. Defaults to .5 on server
                cartItem =  _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = unitWeight;
            } else if(itemBogo){
                //move up by 2
                cartItem =  _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = bogoAmount;
            } else if(addingCustomFirstTime && customProduct){
                //move up by 2
                cartItem =  _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = cartItem.qty;
            } else {
                //if not by weight system will default to plus 1
                cartItem =  _.pick(cartItem, 'note', 'product');
            }
            var promise = $http({
                method: "POST",
                url: getShoppingCartBaseUrl() + '/api/shopping_cart/add.json',
                data: cartItem
            }).success(function (server_cart) {
                if(lastGetServerAddRequest && cartItem.id != lastGetServerAddRequest.cartItem.id) {
                    saveServerCartToLocal(server_cart);
                }
                lastGetServerAddRequest = {
                    cartItem: cartItem
                };
                deferred.resolve(server_cart);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
                if(status != 0) {
                    LogService.error(['Error callServerAddForProduct', data, status, headers, config]);
                } else {
                    offlineCartItemTriedToAdd('add', cartItem);
                }
            });
            return deferred.promise;
        }

        function callServerSubtractForCartItem(cartItem){
            var deferred = $q.defer();
            performRetryCartActions();
            addDefaultHeaders();
            cartItem = angular.copy(cartItem);
            var unitWeight = getUnitWeightForProduct(cartItem.product);
            var itemByWeight = cartItem.product.product_type == byWeightProductType;
            var itemBogo = cartItem.product.bogo;
            if(cartItem.product.isCustom) {
                cartItem.product = _.pick(cartItem.product, 'name', 'description');
            } else {
                cartItem.product = _.pick(cartItem.product, 'id');
            }
            if(itemByWeight){
                //move down by unit_weight on by weight items
                cartItem =  _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = unitWeight;
            } else if(itemBogo){
                //move down by 2
                cartItem =  _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = bogoAmount;
            } else {
                //if not by weight system will default to minus 1
                cartItem =  _.pick(cartItem, 'note', 'product');
            }
            var promise = $http({
                method: "DELETE",
                url: getShoppingCartBaseUrl() + '/api/shopping_cart/substract.json',
                data: cartItem,
                headers: {"Content-Type": "application/json;charset=utf-8"}
            }).success(function (server_cart) {
                if(lastGetServerSubtractRequest && cartItem.id != lastGetServerSubtractRequest.cartItem.id) {
                    saveServerCartToLocal(server_cart);
                }
                lastGetServerSubtractRequest = {
                    cartItem: cartItem
                };
                deferred.resolve(server_cart);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
                if(status != 0){
                    LogService.error(['Error callServerSubtractForCartItem', data, status, headers, config]);
                } else {
                    offlineCartItemTriedToAdd('subtract', cartItem);
                }
            });

            return deferred.promise;
        }

        function offlineCartItemTriedToAdd(action, cartItem){
            try {
                addActionRetryCartActions({action: action, cartItem: cartItem});
            } catch (e) {
                LogService.error(e);
            }
        }

        function performRetryCartActions() {
            try {
                var actions = getRetryCartActions();
                //clear out actions, they will just get re added if they fail.
                actions = angular.copy(actions);
                saveCartActions([]);
                for (let action of actions) {
                    if(action.action == 'add') {
                        callServerAddForCartItem(action.cartItem);
                    } else if (action.action == 'subtract') {
                        callServerSubtractForCartItem(action.cartItem);
                    } else if (action.action == 'note') {
                        callServerSaveForCartItemNotes(action.cartItem);
                    }
                }
            } catch(e) {
                LogService.error(e);
            }
        }

        function getRetryCartActions() {
            try {
                var string = localStorage.getItem('actionRetryCartItems');
                var actions = angular.fromJson(string);
                actions = actions ? actions : [];
                return actions;
            } catch (e) {
                LogService.error(e);
                return [];
            }
        }

        function addActionRetryCartActions(action){
            try {
                var newAction = _.clone(action);
                var actions = getRetryCartActions();
                actions.push(newAction);
                saveCartActions(actions);
            } catch (e) {
                LogService.error(e);
            }
        }

        function saveCartActions(actions) {
            try {
                localStorage.setItem('actionRetryCartItems', angular.toJson(actions));
            } catch (e) {
                LogService.error(e);
            }
        }

        function getCartTotal() {
            var total = 0;
            angular.forEach(getLocalCartItems(), function(cartItem,key){
                if(cartItem.product.on_sale){
                    total = total + (cartItem.product.sale_price * cartItem.qty);
                } else {
                    total = total + (cartItem.product.price * cartItem.qty);
                }
            });
            return total;
        }

        function removeProductsCartItemFromCart(product, skipCallToServer) {
            if(!product){
                return;
            }
            removeCartItemForProduct(product, getLocalCartItems(), true);
            AppAnalytics.track('removeProductFromCart',product);
        }

        function removeCartItemForProduct(product, cartItemsArray, skipCallToServer) {
            var index;
            if(product.isCustom){

                index = cartItemsArray.map(function (el) {
                    return el.product.name;
                }).indexOf(product.name);

            } else {
                index = cartItemsArray.map(function (el) {
                    return el.product.id;
                }).indexOf(product.id);
            }

            if (index > -1) {
                removeCartItemFromCart(cartItemsArray[index], skipCallToServer);
            }
        }

        function removeCartItemFromCart(cartItem, skipCallToServer) {
            var cartItemsArray = getLocalCartItems();
            var index;
            if(cartItem.product.isCustom){
                index = cartItemsArray.map(function(el) {
                    return el.product.name;
                }).indexOf(cartItem.product.name);
            } else {
                index = cartItemsArray.map(function(el) {
                    return el.product.id;
                }).indexOf(cartItem.product.id);
            }
            if(index > -1){
                callServerSubtractForCartItem(cartItemsArray[index], 0);
                cartItemsArray.splice(index,1);
            }
            writeLocalCartItemsToLocalStorage(cartItemsArray, skipCallToServer);
        }

        function addCustomProductToCart(customProductToAdd) {
            addCustomProductToCartItems(customProductToAdd, getLocalCartItems(), true);
        }

        function addCustomProductToCartItems(customProductToAdd, cartItems, skipCallToServer) {
            var i;
            var foundItemInCart = false;
            for (i = 0; i < cartItems.length; i++) {
                var cartItem = cartItems[i];
                if(cartItem.product.name == customProductToAdd.name) {
                    //found the product was already in the cart so just add to the count of that item :)
                    foundItemInCart = true;
                    cartItem.qty += 1;
                    callServerAddForCartItem(cartItem);
                    break;
                }
            }
            if(!foundItemInCart){
                var itemToAdd = new common.GroceryCartItem();
                itemToAdd.product  = customProductToAdd;
                itemToAdd.qty = customProductToAdd.qty;
                callServerAddForCartItem(itemToAdd, true);
                cartItems.push(itemToAdd);
            }
            writeLocalCartItemsToLocalStorage(cartItems, skipCallToServer);
        }

        function addProductToCart(productToAdd) {
            if (productToAdd.isCustom ) {
                var customProduct = {
                    name:productToAdd.name,
                    isCustom: true,
                    price: 0,
                    qty: productToAdd.qty ? productToAdd.qty : 1
                };
                addCustomProductToCart(customProduct);
                AppAnalytics.addSpecialRequest(productToAdd);
            }  else {
                var localCartItems = getLocalCartItems();
                addProductToCartItems(productToAdd, localCartItems, true);
            }
        }

        function getUnitWeightForProduct(product){
            try {
                if(product.product_type == byWeightProductType){
                    if(product.unit_weight){
                        return product.unit_weight;
                    } else {
                        return .5;
                    }
                } else {
                    return 1;
                }
            } catch (e) {
                return 1;
            }
        }

        function addProductToCartItems(productToAdd, localCartItems ,skipCallToServer){
            //check if this product exists in the cart items
            //if so then add to the count of that item
            //if not add a new cart item
            var i;
            var foundItemInCart = false;
            for (i = 0; i < localCartItems.length; i++) {
                var cartItem = localCartItems[i];
                if(cartItem.product.id == productToAdd.id) {
                    //found the product was already in the cart so just add to the count of that item :)
                    foundItemInCart = true;
                    if (productToAdd.product_type == byWeightProductType){
                        cartItem.qty = $filter('number')((parseFloat(cartItem.qty) + parseFloat(getUnitWeightForProduct(productToAdd))), 2);
                        callServerAddForCartItem(cartItem);
                        break;
                    } else if (productToAdd.bogo){
                        cartItem.qty = parseFloat(cartItem.qty) + bogoAmount;
                        callServerAddForCartItem(cartItem);
                        break;
                    }
                    cartItem.qty++;
                    callServerAddForCartItem(cartItem);
                    break;
                }
            }
            if(!foundItemInCart){
                var itemToAdd = new common.GroceryCartItem();
                itemToAdd.product  = productToAdd;
                if(productToAdd.qty){
                    itemToAdd.qty = productToAdd.qty;
                }
                if (productToAdd.product_type == byWeightProductType){
                    itemToAdd.qty = (parseFloat(itemToAdd.qty)*100 + parseFloat(getUnitWeightForProduct(productToAdd))*100)/100;
                } else if(productToAdd.bogo){
                    itemToAdd.qty = parseFloat(itemToAdd.qty) + bogoAmount;
                } else {
                    itemToAdd.qty = 1;
                }
                callServerAddForCartItem(itemToAdd);
                localCartItems.push(itemToAdd);
            }
            writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
        }

        function removeOneProductFromCartItems(productToRemove, localCartItems, skipCallToServer){
            var i;
            //im gonna assume that the product is in the cart...
            if(productToRemove.isCustom){
                for (i = 0; i < localCartItems.length; i++) {
                    var cartItem = localCartItems[i];
                    if (cartItem.product.name == productToRemove.name) {
                        //we will not go negative, its like a friendly political campaign
                        if (cartItem.qty > 0) {
                            if (productToRemove.product_type == byWeightProductType){
                                cartItem.qty  = (parseFloat(cartItem.qty*100) - parseFloat(getUnitWeightForProduct(productToRemove)*100))/100;
                                if(cartItem.qty == 0){
                                    removeProductsCartItemFromCart(productToRemove);
                                    return;
                                }
                                callServerSubtractForCartItem(cartItem);
                                writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
                                return;
                            } else if (productToRemove.bogo){
                                cartItem.qty  = parseFloat(cartItem.qty) - bogoAmount;
                                if(cartItem.qty == 0){
                                    removeProductsCartItemFromCart(productToRemove);
                                    return;
                                }
                                callServerSubtractForCartItem(cartItem);
                                writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
                                return;
                            }
                            cartItem.qty--;
                            if(cartItem.qty == 0){
                                removeProductsCartItemFromCart(productToRemove);
                                return;
                            }
                            callServerSubtractForCartItem(cartItem);
                        }

                        break;
                    }
                }
            } else {
                for (i = 0; i < localCartItems.length; i++) {
                    var cartItem = localCartItems[i];
                    if (cartItem.product.id == productToRemove.id) {
                        //we will not go negative, its like a friendly political campaign
                        if (cartItem.qty > 0) {
                            if (productToRemove.product_type == byWeightProductType){
                                cartItem.qty  = ((parseFloat(cartItem.qty)*100) - (parseFloat(getUnitWeightForProduct(productToRemove))*100))/100;
                                if(parseFloat(cartItem.qty) <= 0){
                                    removeProductsCartItemFromCart(productToRemove);
                                    return;
                                }
                                callServerSubtractForCartItem(cartItem);
                                writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
                                return;
                            } else if (productToRemove.bogo){
                                cartItem.qty  = parseFloat(cartItem.qty) - bogoAmount;
                                if(cartItem.qty == 0){
                                    removeProductsCartItemFromCart(productToRemove);
                                    return;
                                }
                                callServerSubtractForCartItem(cartItem);
                                writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
                                return;
                            }
                            cartItem.qty--;
                            if(cartItem.qty == 0){
                                removeProductsCartItemFromCart(productToRemove, skipCallToServer);
                                return;
                            }
                            callServerSubtractForCartItem(cartItem);
                        }
                        break;
                    }
                }
            }
            writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
        }

        function removeOneProductFromCart(productToRemove) {
            var localCartItems = getLocalCartItems();
            removeOneProductFromCartItems(productToRemove, localCartItems, true);
        }

        function updateNoteOnItem(itemToUpdateWithNotes) {
            var localCartItems = getLocalCartItems();
            updateNoteOnItemInCartItems(itemToUpdateWithNotes, localCartItems, true);
        }

        function updateNoteOnItemInCartItems(itemToUpdateWithNotes, localCartItems, skipCallToServer){
            var i;
            var cartItem;
            //need to use custom because they are id'd by name not id
            if(itemToUpdateWithNotes.product.isCustom){
                for (i = 0; i < localCartItems.length; i++) {
                    cartItem = localCartItems[i];
                    if (cartItem.product.name == itemToUpdateWithNotes.product.name) {
                        cartItem.note = itemToUpdateWithNotes.note;
                        callServerSaveForCartItemNotes(cartItem);
                        break;
                    }
                }
            } else {
                for (i = 0; i < localCartItems.length; i++) {
                    cartItem = localCartItems[i];
                    if (cartItem.product.id == itemToUpdateWithNotes.product.id) {
                        cartItem.note = itemToUpdateWithNotes.note;
                        callServerSaveForCartItemNotes(cartItem);
                        break;
                    }
                }
            }
            writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
        }

        function clearCart() {
            var cartItems = [];
            emptyServerCart();
            writeLocalCartItemsToLocalStorage(cartItems, true);
        }

        function getCartItemCount () {
            var count = 0;
            angular.forEach(getLocalCartItems(), function(cartItem,key) {
                if(cartItem.product.product_type != "by weight") {
                    if(parseFloat(cartItem.qty) % 1 != 0){
                        count += Math.ceil(parseFloat(cartItem.qty));
                    } else {
                        count += parseFloat(cartItem.qty);
                    }
                } else {
                    var unit_weight = getUnitWeightForProduct(cartItem.product);
                    var toAdd = (parseFloat(cartItem.qty)*100)/(unit_weight*100);
                    if (cartItem.product.has_custom_label) {
                        count += parseInt($filter('number')(toAdd, 0));
                    } else {
                        if(parseFloat(cartItem.qty) % 1 != 0){
                            count += Math.ceil(parseFloat(cartItem.qty));
                        } else {
                            count += parseFloat(cartItem.qty);
                        }
                    }
                }
            });
            return count;
        }

        function getLocalCartItems() {
            var localCartItems = null;
            var cartString = window.localStorage[keyLocalCartItems];
            if(cartString) {
                localCartItems = angular.fromJson(cartString);
            } else {
                return [];
            }
            _cartItems = localCartItems;
            return localCartItems;
        }

        function getCartItems() {
            return _cartItems;
        }

        function writeLocalCartItemsToLocalStorage(localCartItems, skipCallToSync) {
            try {
                window.localStorage[keyLocalCartItems] = angular.toJson(localCartItems);
                _cartItems =  localCartItems;
                $rootScope.$broadcast('cart.items.saved.refresh');
            } catch (exception) {
                LogService.critical(exception);
            }

            try {
                if(!skipCallToSync){
                    broadcastCartItemsChanged(localCartItems);
                }
            } catch (exception) {
                LogService.critical(exception);
            }
        }
    }
})();
