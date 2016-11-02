'use strict';

/**
* @ngdoc service
* @name starter.appService
* @requires ng.$q
* @requires dateService
* @description Contains service methods related to customer login and registration
*/
angular.module('starter')
    .service('appService', function ($q, dataService) {
        /**
         * @ngdoc function
         * @name starter.appService#Register
         * @methodOf starter.appService
         * @kind function
         * 
         * @description
         * Registers a new user
         * 
         * @param {object} register Registration information
         * @param {string} register.firstname Customers first name. must be between 1 and 32 characters
         * @param {string} register.lastname Customers last name. must be between 1 and 32 characters
         * @param {email} register.email Customers email address. must be a valid email address
         * @param {string} register.password Password. must be between 4 and 20 characters
         * @param {string} register.confirm Password confirmation. should be same as the password
         * @param {string} register.telephone Customers telephone number. must be between 3 and 32 characters
         * @param {string} register.address_1 Address line 1. must be between 3 and 128 characters
         * @param {string=} register.address_2 Address line 2
         * @param {string} register.city Address City. must be between 2 and 128 characters
         * @param {string} register.postcode Postal code
         * @param {number} register.country_id Country id
         * @param {string} register.zone_id Zone id
         * @param {number=} register.customer_group_id Customer group id. if none provided config_customer_group_id will be assigned
         * @param {boolean=} register.newsletter Sign up for newsletters
         * 
         * @returns {promise} Promise of the API call
         */
        this.Register = function (register) {
            return dataService.apiSecuredPost('/user_register', register);
        }

        /**
         * @ngdoc function
         * @name starter.appService#Login
         * @methodOf starter.appService
         * @kind function
         * 
         * @description
         * Logs in a user
         * @param {object} login Object containing login data
         * @param {string} login.username Customers email address. must be a valid email address
         * @param {string} login.password Password. must be between 4 and 20 characters and must match with the account of the email address provided
         * 
         * @returns {promise} Promise of the API call
         */
        this.Login = function (login) {
            return dataService.apiSecuredPost('/user_login', login).then(function (data) {
                return data;
            }, function (data) {
                return $q.reject(data.data);
            });
        }

        /**
         * @ngdoc function
         * @name starter.appService#Logout
         * @methodOf starter.appService
         * @kind function
         * 
         * @description
         * Logout current session from API
         * @returns {promise} Promise of the API call
         */
        this.Logout = function () {
            return dataService.apiSecuredPost('/user_logout');
        }
    })