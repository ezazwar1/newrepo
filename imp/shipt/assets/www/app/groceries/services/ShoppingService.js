/**
 * Created by SHIPT
 */



(function () {
    'use strict';

    var serviceId = 'ShoppingService';

    angular.module('shiptApp').factory(serviceId, [
        '$http',
        '$q',
        '$log',
        'ApiEndpoint',
        'common',
        'LogService',
        'AuthService',
        'ShoppingCartService',
        'DefaultHeaders',
        ShoppingService]);

    var keyLocalCartItems = 'localCartItems';
    var keyLocalCategories = 'localCategories';
    var keyLocalSubCategories = 'localSubCategories';
    var keyLocalProducts = 'localProducts';

    function ShoppingService($http,
                             $q,
                             $log,
                             ApiEndpoint,
                             common,
                             LogService,
                             AuthService,
                             ShoppingCartService,
                             DefaultHeaders) {


        var service = {
            getCartItems: ShoppingCartService.getCartItems,
            getCartItemCount: ShoppingCartService.getCartItemCount,
            getProducts: getProducts,
            getCategories: getCategories,
            getCachedCategories: getCachedCategories,
            getSubCategories: getSubCategories,
            clearCart: ShoppingCartService.clearCart,
            updateNoteOnItem: ShoppingCartService.updateNoteOnItem,
            addProductToCart: ShoppingCartService.addProductToCart,
            addCustomProductToCart: ShoppingCartService.addCustomProductToCart,
            removeOneProductFromCart: ShoppingCartService.removeOneProductFromCart,
            getCartTotal: ShoppingCartService.getCartTotal,
            removeProductsCartItemFromCart: ShoppingCartService.removeProductsCartItemFromCart,
            getRecentlyPurchasedProducts: getRecentlyPurchasedProducts,
            getRecentlyPurchasedSpecialRequests:getRecentlyPurchasedSpecialRequests
        };

        //setting the auth token header for all requests from here.
        DefaultHeaders.customer();

        return service;

        function addDefaultHeaders(){
            DefaultHeaders.customer();
        }

        /* Products */
        function getProducts(subCategory,fromServer, page, searching) {
            return getProductsFromServer(subCategory, page, searching);
        }

        function getProductsFromServer(subCategory, page, searching) {
            var defer = $q.defer();
            if(!AuthService.shouldMakeShiptApiCall()) {
                defer.resolve(null);
                return;
            }
            var req = null
            if (searching) {
                req = {
                    params:{
                        "searching": 'true',
                        "page": page
                    }
                };
            } else {
                req = {
                    params: {
                        page: page,
                    }
                };
            }
            addDefaultHeaders();
            $http.get(ApiEndpoint.apiurl + subCategory.products.url, req)
                .success(function(data){
                    //success
                    defer.resolve(data);
                })
                .error(function(error){
                    LogService.error(error);
                    //error
                    defer.reject(error);
                });
            return defer.promise;
        }

        /* CATEGORIES */
        function getCachedCategories() {
            var cats = getCategoriesFromCache();
            return cats;
        }

        function getCategories(fromServer) {
            var defer = $q.defer();
            if(!AuthService.shouldMakeShiptApiCall()) {
                defer.resolve(null);
                return defer.promise;
            }
            fromServer = fromServer || false;
            if(fromServer){
                return getCategoriesFromServer();
            } else {
                var cats = getCategoriesFromCache();
                if(cats.length > 0){
                    defer.resolve(cats);
                } else {
                    return getCategoriesFromServer();
                }
            }
            return defer.promise;
        }

        function getRecentlyPurchasedProducts(page) {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/customers/products.json",
                params: {
                    page: page
                }
            };
            addDefaultHeaders();
            $http(req)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(error){
                    LogService.error('error', error);
                    defer.reject(error);
                });
            return defer.promise;
        }

        function getRecentlyPurchasedSpecialRequests() {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/customers/custom_products.json"
            };
            addDefaultHeaders();
            $http(req)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(error){
                    LogService.error('error', error);
                    defer.reject(error);
                });
            return defer.promise;
        }

        function getCategoriesFromServer() {
            var defer = $q.defer();
            if(!AuthService.shouldMakeShiptApiCall()) {
                defer.resolve(null);
                return;
            }
            var categories = null;
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/categories.json"
            };
            addDefaultHeaders();
            $http(req)
                .success(function(data){
                    saveCategoriesToCache(data);
                    defer.resolve(data);
                })
                .error(function(error){
                    LogService.error('error', error);
                    //error
                    defer.reject(error);
                });
            return defer.promise;
        }

        function saveCategoriesToCache(categories) {
            window.localStorage[keyLocalCategories] = angular.toJson(categories);
        }

        function getCategoriesFromCache() {
            var local = null;
            var localString = window.localStorage[keyLocalCategories];
            if(localString) {
                local = angular.fromJson(localString);
            } else {
                return [];
            }
            return local;
        }

        /* SUB-CATEGORIES */
        function getSubCategories(parentCat, fromServer) {
            return getSubCategoriesFromServer(parentCat);
        }

        function getSubCategoriesFromServer(parentCat) {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + parentCat.url
            };
            addDefaultHeaders();
            $http(req)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(error){
                    LogService.error('error', error);
                    defer.reject(error);
                });
            return defer.promise;
        }

    }
})();
