/*global define*/
define([
    'app',
    'angular',
    'services/request'
], function (app, angular) {

    'use strict';

    app.service('cartService', [
        '$q',
        'requestService',
        function ($q, requestService) {

            // initial request to register the app
            this.get = function () {
                var promise = $q.defer(),
                    tasks = [];

                tasks.push(requestService.send({
                    method: 'get',
                    url: '/cart/index' //index
                }));
                tasks.push(requestService.send({
                    method: 'get',
                    url: '/cart/info'
                }));

                $q.all(tasks).then(function (results) {
                    var cart = {},
                        tmpProducts,
                        price,
                        options,
                        i = 0;

                    // cart products, messages
                    if (results && results[0] && results[0].cart) {
                        cart = results[0].cart;
                        tmpProducts = cart.products && cart.products.item ? cart.products.item : [];

                        // Check if products is only object -> put it in an array
                        if (angular.isArray(tmpProducts)) {
                            cart.products = tmpProducts;
                        } else if (angular.isObject(tmpProducts)) {
                            cart.products = [tmpProducts];
                        }

                        // Check if options is only object -> put it in an array
                        for (i; i < cart.products.length; i = i + 1) {
                            options = cart.products[i].options && cart.products[i].options.option ? cart.products[i].options.option : [];
                            // sadly everything comes as strings :(, so i have to parse int first
                            cart.products[i].qty = parseInt(cart.products[i].qty, 10);
                            cart.products[i].initQty = parseInt(cart.products[i].qty, 10);

                            if (angular.isArray(options)) {
                                cart.products[i].options = options;
                            } else if (angular.isObject(options)) {
                                cart.products[i].options = [options];
                            }
                        }

                        // format price
                        if (cart.products.length) {
                            if (angular.isArray(cart.products)) {
                                for (i; i < cart.products.length; i = i + 1) {
                                    price = cart.products[i].formated_price['@attributes'].regular;
                                    cart.products[i].formated_price['@attributes'].regular = price.replace("\u00a0", " ");
                                }
                            }
                        }
                    }

                    // cart info: prices, amounts, ...
                    if (results && results[1] && results[1].cart) {
                        cart.info = results[1].cart;
                    }

                    promise.resolve(cart);
                }, promise.reject);

                return promise.promise;
            };

            this.getInfo = function () {

                return requestService.send({
                    method: 'get',
                    url: '/cart/info',
                    success: function (res, promise) {
                        var cart = res && res.cart ? res.cart : undefined;

                        promise.resolve(cart);
                    }
                });
            };

            this.add = function (productId, quantity, options) {
                quantity = quantity || 1;

                return requestService.send({
                    method: 'post',
                    url: '/cart/add/product/' + productId + '/qty/' + quantity,
                    data: options
                });
            };

            this.update = function (code, quantity) {
                var params = {};

                quantity = quantity || 1;
                params[code] = quantity;

                return requestService.send({
                    method: 'post',
                    url: '/cart/update',
                    data: params
                });
            };

            this.remove = function (itemId) {

                return requestService.send({
                    method: 'post',
                    url: '/cart/delete/item_id/' + itemId
                });
            };
        }
    ]);
});
