(function() {
    'use strict';

    angular
        .module('shiptApp')
        .service('StoreService', StoreService);

    StoreService.$inject = ['$log','$q','$http','LogService','DefaultHeaders','ApiEndpoint','$timeout','AccountService','AuthService','AppAnalytics'];

    function StoreService($log,$q,$http,LogService,DefaultHeaders,ApiEndpoint,$timeout,AccountService,AuthService,AppAnalytics) {

        this.selectStore = function(store, zip){
            var defer = $q.defer();
            var customer = AccountService.getCustomerInfo(true);
            customer.shopping_zip_code = zip;
            customer.store_id = store.id;
            customer.store = store;
            AccountService.updateAccountInfo(customer)
                .success(function(){
                    AuthService.saveAccountData(customer);
                    defer.resolve();
                })
                .error(function(error){
                    defer.reject(error);
                })
            return defer.promise;
        };

        this.selectStoreIdWithAddress = function(storeId, address) {
            var defer = $q.defer();
            var customer = AccountService.getCustomerInfo(true);
            customer.store_id = storeId;
            if(!address.id){
                AppAnalytics.track('addCard', {fromLocation:"account"});
                AccountService.addAddress(address)
                    .then(function(newAddress){
                        customer.default_shopping_address_id = newAddress.id;
                        AccountService.updateAccountInfo(customer)
                            .success(function(){
                                customer.customer_addresses.push(newAddress);
                                AuthService.saveAccountData(customer);
                                defer.resolve();
                            })
                            .error(function(error){
                                defer.reject(error);
                            })
                    },function(error){
                        defer.reject(error);
                    });
            } else {
                customer.default_shopping_address_id = address.id;
                AccountService.updateAccountInfo(customer)
                    .success(function(){
                        AuthService.saveAccountData(customer);
                        defer.resolve();
                    })
                    .error(function(error){
                        defer.reject(error);
                    })
            }

            return defer.promise;
        };

        this.selectStoreWithAddress = function(store, address) {
            var defer = $q.defer();
            var customer = AccountService.getCustomerInfo(true);
            customer.store = store;
            customer.store_id = store.id;
            if(!address.id){
                AppAnalytics.track('addCard', {fromLocation:"account"});
                AccountService.addAddress(address)
                    .then(function(newAddress){
                        customer.default_shopping_address_id = newAddress.id;
                        AccountService.updateAccountInfo(customer)
                            .success(function(){
                                customer.customer_addresses.push(newAddress);
                                AuthService.saveAccountData(customer);
                                defer.resolve();
                            })
                            .error(function(error){
                                defer.reject(error);
                            })
                    },function(error){
                        defer.reject(error);
                    });
            } else {
                customer.default_shopping_address_id = address.id;
                AccountService.updateAccountInfo(customer)
                    .success(function(){
                        AuthService.saveAccountData(customer);
                        defer.resolve();
                    })
                    .error(function(error){
                        defer.reject(error);
                    })
            }

            return defer.promise;
        };

        this.listForAddress = function(address) {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/zip_codes/"+address.zip_code+"/available_stores.json",
                params: {
                    zip: address.zip_code
                }
            };
            DefaultHeaders.customer();
            $http(req)
                .success(function(data){
                    $log.debug('success', data.stores);
                    defer.resolve(data.stores);
                })
                .error(function(error){
                    LogService.error('error', error);
                    defer.reject(error);
                });
            return defer.promise;
        };

        this.listForZip = function(zip) {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/zip_codes/"+zip+"/available_stores.json",
                params: {
                    zip: zip
                }
            };
            DefaultHeaders.customer();
            $http(req)
                .success(function(data){
                    $log.debug('success', data.stores);
                    defer.resolve(data.stores);
                })
                .error(function(error){
                    LogService.error('error', error);
                    defer.reject(error);
                });
            return defer.promise;

        }
    }
})();
