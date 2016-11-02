'use strict';

/**
* @ngdoc service
* @name info.module.InfoService
* @requires ng.$q
* @requires dateService
* @description 
* This service class contains methods needed to show Order list and selected Order info of a logged in customer.
*/
angular
    .module('info.module')
    .service('InfoService', function ($q, dataService) {

        /**
         * @ngdoc function
         * @name info.module.InfoService#GetOrder
         * @methodOf info.module.InfoService
         * @kind function
         * 
         * @description
         * Gets order details identified by the id
         * 
         * @example
         <pre>
         InfoService.GetOrder(id).then(function (data) {
            $scope.order = data;
         });
         </pre>
         * 
         * @param {number} id Order id
         * @returns {promise} Returns a promise of the order
         */
        this.GetOrder = function (id) {

            return dataService.apiSecuredPost('/order_history/info', { order_id: id }).then(function (data) {
                if (data.error) {
                    return $q.reject(data);
                }

                return data;
            });
        }

        /**
        * @ngdoc function
        * @name info.module.InfoService#GetOrders
        * @methodOf info.module.InfoService
        * @kind function
        * 
        * @description
        * Gets order list of the logged in user
        * 
        * @example
         <pre>
         InfoService.GetOrders().then(function (data) {
            $scope.orders = data.orders;
         });
         </pre>
        * @returns {promise} Returns a promise of the order list
        */
        this.GetOrders = function () {

            return dataService.apiSecuredPost('/order_history').then(function (data) {
                if (data.error) {
                    return $q.reject(data);
                }

                return data;
            });
        }

        /**
        * @ngdoc function
        * @name info.module.InfoService#RemoveFromWishlist
        * @methodOf info.module.InfoService
        * @kind function
        * 
        * @description
        * Removes a product from the wishlist
        * 
        * @example
        <pre>
        InfoService.RemoveFromWishlist(46).then(function (data) {
               //success
        });
        </pre>
        * 
        * @param {number} id Product id
        * @returns {promise} Returns a promise of the API call.
        */
        this.RemoveFromWishlist = function (id) {
            return dataService.apiSecuredPost('/wishlist/remove', { product_id: id }).then(function (data) {
                if (data.success) {
                    return data;
                } else {
                    return $q.reject(data);
                }
            });
        }

        /**
         * @ngdoc function
         * @name info.module.InfoService#GetWishlist
         * @methodOf info.module.InfoService
         * @kind function
         * 
         * @description
         * Adds a product to the wishlist
         * 
         * @example
         <pre>
         InfoService.GetWishlist().then(function (data) {
                $scope.products = data.products;
         });
         </pre>
         * 
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetWishlist = function () {
            return dataService.apiSecuredPost('/wishlist').then(function (data) {
                return data;
            });
        }

        /**
        * @ngdoc function
        * @name info.module.InfoService#GetContactInfo
        * @methodOf info.module.InfoService
        * @kind function
        * 
        * @description
        * Gets contact information
        * 
        * @example
        <pre>
        InfoService.GetContactInfo().then(function (data) {
               $scope.products = data;
        });
        </pre>
        * 
        * @returns {promise} Returns a promise of the API call.
        */
        this.GetContactInfo = function () {
            return dataService.apiSecuredPost('/contact').then(function (data) {
                return data;
            });
        }

        /**
        * @ngdoc function
        * @name info.module.InfoService#PostContactForm
        * @methodOf info.module.InfoService
        * @kind function
        * 
        * @description
        * Gets contact information
        * 
        * @example
        <pre>
        InfoService.GetContactInfo().then(function (data) {
               $scope.products = data;
        });
        </pre>
        * 
        * @returns {promise} Returns a promise of the API call.
        */
        this.PostContactForm = function (name, email, enquiry) {
            return dataService.apiSecuredPost('/contact/send', { email: email, name: name, enquiry: enquiry }).then(function (data) {
                return data;
            });
        }
    })