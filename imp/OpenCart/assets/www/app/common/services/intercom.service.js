'use strict';

/**
* @ngdoc service
* @name starter.intercomService
* @require $localStorage
* @require $rootScope
* @require INTERCOM_INTEGRATION
* 
* @description
* Enables Intercom.io chat service for ios and android. Please install intercom cordova plugin by
* running the following following command
* 
* ionic plugin add cordova-plugin-intercom
*/
angular.module('starter')
    .service('intercomService', function ($localStorage, $rootScope, INTERCOM_INTEGRATION) {

        /**
         * @ngdoc function
         * @methodOf starter.intercomService
         * @name starter.intercomService#init
         * @kind function
         * 
         * @description
         * Starts Intercom.io chat service
         */
        this.init = function () {
            if (INTERCOM_INTEGRATION && intercom) {
                if ($localStorage.login) {
                    intercom.registerIdentifiedUser({ email: $localStorage.login.email });
                } else {
                    intercom.registerUnidentifiedUser();
                }

                $rootScope.$on('i2csmobile.more', function () {
                    intercom.displayMessenger();
                });
            }
        }
    });
