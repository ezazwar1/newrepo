/**
 * Created by patrick on 2/24/15.
 */

(function () {
    'use strict';

    var serviceId = 'AccountService';

    var needsCustomerInfoRefresh = false;

    angular.module('shiptApp').factory(serviceId, [
        '$http',
        '$q',
        'LogService',
        '$log',
        'AuthService',
        'ApiEndpoint',
        '$rootScope',
        '$timeout',
        'VersionProvider',
        'DefaultHeaders',
        'FeatureService',
        AccountService]);

    function AccountService($http,
                            $q,
                            LogService,
                            $log,
                            AuthService,
                            ApiEndpoint,
                            $rootScope,
                            $timeout,
                            VersionProvider,
                            DefaultHeaders,
                            FeatureService) {


        var service = {
            getCustomerInfo: getCustomerInfo,
            isCustomerGuest: isCustomerGuest,
            customerAddressObject: customerAddressObject,
            creditCartObject: creditCartObject,
            customerObject: customerObject,
            updateAddress: updateAddress,
            addAddress: addAddress,
            updateCard: updateCard,
            saveNewCard: saveNewCard,
            deleteCard: deleteCard,
            getOrders: getOrders,
            deleteAddress: deleteAddress,
            refreshCustomerInfo: refreshCustomerInfoShort,
            registerUserForPush: registerUserForPush,
            updateAccountInfo: updateAccountInfo,
            cancelOrder: cancelOrder,
            getOrder: getOrder,
            getNextAvailability: getNextAvailability,
            refreshCustomerInfoShort: refreshCustomerInfoShort,
            getOrdersFromServer: getOrdersFromServer,
            getAddressesFromServer: getAddressesFromServer,
            getCardsFromServer: getCardsFromServer,
            getCustomerStore: getCustomerStore,
            checkFeature: checkFeature,
            getAddress: getAddress,
            getCustomerDefaultShoppingAddress: getCustomerDefaultShoppingAddress
        };

        DefaultHeaders.customer();

        $rootScope.$on('refresh.user-data', function(event,data){
            needsCustomerInfoRefresh = true;
            refreshCustomerInfo();
        });

        return service;

        function addDefaultHeaders(){
            DefaultHeaders.customer();
        }

        function isCustomerGuest(){
            try {
                var customerInfo = AuthService.getCustomerInfo();
                if(customerInfo && typeof customerInfo.guest_account != 'undefined'){
                    return customerInfo.guest_account;
                } else {
                    return true;
                }
            } catch(exception){
                LogService.error(['isCustomerGuest',exception]);
            }
        }

        function cancelOrder(order) {
            addDefaultHeaders();
            var rootUrl = ApiEndpoint.apiurl;
            var orderId = order.id;
            LogService.info([orderId + ' :: User Canceling Order', order]);
            var serviceUrl = rootUrl + '/api/v1/orders/'+orderId+'/cancel.json';
            return $http({
                url: serviceUrl,
                method: "PATCH"
            });
        }

        function getNextAvailability () {
            var defer = $q.defer();
            if(!AuthService.shouldMakeShiptApiCall()) {
                defer.resolve(null);
                return defer.promise;
            }
            var platform = VersionProvider.getPlatformName();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customers/next_delivery_availablity.json',
                method: "GET",
                params: {device_type: platform}
            })
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }

        function registerUserForPush(deviceToken) {
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid();
            var customerId = AuthService.getCustomerInfo().id;
            var deviceType;
            if (isIOS) {
                deviceType = 'ios';
            } else if (isAndroid) {
                deviceType = 'android';
            }

            addDefaultHeaders();

            var rootUrl = ApiEndpoint.apiurl;
            var serviceUrl = rootUrl + '/api/v1/customers/'+ customerId +'.json';

            //PATCH

            return $http({
                    url: serviceUrl,
                    method: "PATCH",
                    data: {
                        device_token: deviceToken,
                        device_type: deviceType
                    }
            });

        }

        function updateAccountInfo(accountInfo) {
            addDefaultHeaders();
            var rootUrl = ApiEndpoint.apiurl;
            var customerId = AuthService.getCustomerInfo().id;
            var serviceUrl = rootUrl + '/api/v1/customers/'+ customerId +'.json';
            return $http({
                url: serviceUrl,
                method: "PATCH",
                data: accountInfo
            });
        }

        function getCustomerStore () {
            if(FeatureService.chooseStoreInApp()){
                var store = AuthService.getCustomerInfo().store;
                return store;
            } else {
                return {
                    image: "img/shipt_text_white.png",
                    name: "Shipt",
                    background_color: "#61A43D"
                }
            }
        }

        function getCustomerDefaultShoppingAddress(){
            try {
                var customer = AuthService.getCustomerInfo();
                var currentDefaultAddress = customer.customer_addresses.find(a => a.id == customer.default_shopping_address_id);
                return currentDefaultAddress;
            } catch (e) {
                $log.error(e);
            }
        }

        function checkFeature(featureFunction) {
            return FeatureService[featureFunction]();
        }

        function getCustomerInfo(force) {
            if(force === true){
                return AuthService.getCustomerInfo();
            }
            var defer = $q.defer();

            if(needsCustomerInfoRefresh){
                return refreshCustomerInfo();
            } else {
                var custInfo = AuthService.getCustomerInfo();
                if(custInfo){
                    defer.resolve(custInfo);
                } else {
                    defer.reject(null);
                }
            }

            return defer.promise;
        }

        function refreshCustomerInfoShort() {
            var custId = AuthService.getCustomerId();
            var defer = $q.defer();
            if(!custId) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            var custInfo = AuthService.getCustomerInfo();
            $http({
                url: ApiEndpoint.apiurl + custInfo.short_version_url,
                method: "GET"
            })
                .success(function(data){
                    AuthService.saveAuthToken(data);
                    needsCustomerInfoRefresh = false;
                    defer.resolve(data);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }

        function refreshCustomerInfo(){
            var custId = AuthService.getCustomerId();
            var defer = $q.defer();
            if(!custId) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            $log.info('refreshCustomerInfo');
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customers/'+custId+'.json',
                method: "GET"
            })
                .success(function(data){
                    AuthService.saveAuthToken(data);
                    needsCustomerInfoRefresh = false;
                    $rootScope.$broadcast('refreshed.user-data');
                    defer.resolve(data);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;

        }

        function deleteAddress(deleteAddress){
            var defer = $q.defer();
            $log.info('getCustomerData');
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customer_addresses'+ "/" + deleteAddress.id,
                method: "DELETE"
            })
                .success(function(data){
                    $log.info('success', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }

        function updateAddress(updatedAddress){
            var defer = $q.defer();
            $log.info('getCustomerData');
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customer_addresses' + '/' + updatedAddress.id,
                method: "PATCH",
                data: updatedAddress
            })
                .success(function(data){
                    $log.info('success', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }

        function addAddress(newAddress){
            var defer = $q.defer();
            $log.info('addAddress requesting',newAddress);
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + AuthService.getCustomerInfo().create_customer_address_url,
                method: "POST",
                data: newAddress
            })
                .success(function(data){
                    $log.info('success', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }


        function getAddress(id) {
            var defer = $q.defer();
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customer_addresses/'+id+'.json',
                method: "GET"
            })
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }

        function getAddressesFromServer() {
            var custInfo = AuthService.getCustomerInfo();
            var defer = $q.defer();
            if(!custInfo) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customer_addresses.json',
                method: "GET"
            })
                .success(function(data){
                    defer.resolve(data);
                    custInfo.customer_addresses = data.customer_addresses;
                    AuthService.saveAuthToken(custInfo);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }

        function getCardsFromServer() {
            var custInfo = AuthService.getCustomerInfo();
            var defer = $q.defer();
            if(!custInfo) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/credit_cards.json',
                method: "GET"
            })
                .success(function(data){
                    defer.resolve(data);
                    custInfo.credit_cards = data.credit_cards;
                    AuthService.saveAuthToken(custInfo);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }


        function updateCard(updateCard) {
            $log.info('updateCard service', updateCard);
        }

        function deleteCard(card){
            var defer = $q.defer();
            $log.info('deleteCard service', card);
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/credit_cards/' + card.id,
                method: "DELETE"
            })
                .success(function(data){
                    $log.info('success', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }

        function saveNewCard(newCard) {
            // format exp date for stripe
            if (newCard.exp_date) {
              newCard.exp = newCard.exp_date.slice(0,2) + "/" + newCard.exp_date.slice(2,4)
            }

            $log.info('saveNewCard service', newCard);

            var defer = $q.defer()
            setStripePublishableKey()
            Stripe.card.createToken(newCard, function (status, response) {
              if (response.error) {
                  $log.error('Stripe tokenization error', response.error)
                  defer.reject(response.error.message);
              } else {
                  $log.info('Stripe tokenization success', response)
                  var token = {card_token: response.id};
                  saveStripeCardToken(token, defer) // send to shipt servers
              }
            })
            return defer.promise;
        }

        function saveStripeCardToken (token, defer) {
          $http({
              url: ApiEndpoint.apiurl + AuthService.getCustomerInfo().create_credit_cards_url,
              method: "POST",
              data: token
          })
              .success(function(data){
                  $log.info('Credit Card Saved', data);
                  defer.resolve(data);
              })
              .error(function(error){
                  $log.error('saveCardStripeToken error', error);
                  defer.reject(error);
              });
        }

        function setStripePublishableKey() {
          var stripe_key = AuthService.getCustomerInfo().config.stripe_api_public_key
          Stripe.setPublishableKey(stripe_key)
        }

        function getOrders() {
            var custInfo = AuthService.getCustomerInfo();
            return custInfo ? custInfo.orders : [];
        }

        function getOrdersFromServer() {
            var custInfo = AuthService.getCustomerInfo();
            var defer = $q.defer();
            if(!custInfo) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customers/orders.json',
                method: "GET"
            })
                .success(function(data){
                    defer.resolve(data);
                    custInfo.orders = data.orders;
                    AuthService.saveAuthToken(custInfo);
                })
                .error(function(error){
                    defer.reject(error);
                });

            return defer.promise;
        }

        function getOrder(id) {
            addDefaultHeaders();
            return $http({
                url: ApiEndpoint.apiurl + "/api/v1/orders/" + id + ".json",
                method: "GET"
            })
        }


        //TODO these need to be moved out to the common.model and re worked to match everything on the server side
        function customerAddressObject() {
            this.id = 0;
            this.street1 = "";
            this.street2 = "";
            this.city = "";
            this.zip_code = "";
            this.metro_id = 0;
            this.state = "";
            this.created_at = null;
            this.updated_at = null;
        }

        function creditCartObject() {
            this.id = 0;
            this.cutomer_id = 0;
            this.last_4_digits = "";
            this.exp_date = null;
            this.created_at = null;
            this.updated_at = null;
            this.stripe_id = 0;
        }

        function customerObject() {
            this.id = 0;
            this.name = "";
            this.email = "";
            this.phone = "";
            this.password = "";
            this.created_at = "";
            this.updated_at = "";
            this.stripe_subscription_id = "";
        }
    }
})();
