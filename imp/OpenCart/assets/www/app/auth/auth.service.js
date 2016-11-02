'use strict';

/**
* @ngdoc service
* @name auth.module.AuthService
* @requires ng.$q
* @requires $ionicLoading
* @requires BASE_API_URL
* @requires dateService
* @description 
* This service class contains methods needed to start social api authentication and customer login procedures.
*/
angular
    .module('auth.module')
    .service('AuthService', function ($q, $ionicLoading, BASE_API_URL, dataService) {

        /**
         * @ngdoc function
         * @name auth.module.AuthService#Auth
         * @methodOf auth.module.AuthService
         * @kind function
         * 
         * @description
         * Starts a new connect authentication flow with a given `provider`. If provider settings are not
         * configured in the backend, it will return a promise with error. Returns a promise containing success 
         * or failure response from the server. Promise resolved an object with newly created/logged in customer `id` 
         * property if succssful authentication. Otherwise rejects with an object containing property `error`.
         <pre>
         {
            id : 1
         }
         </pre>
         * or
         <pre>
         {
            error: "Warning: You do not have permission to access the API!"
         }
         </pre>
         * @example
         <pre>
         AuthService.Auth("google").then(function (data) {
              loadUserData(data.id);
          }, function (data) {
              alert(data.error);
         });
         </pre>
         * 
         * @param {string} provider Provider name. ex. `google`, `facebook` and `twitter` by default
         * 
         * @returns {promise} Returns a promise with customer `id` or `error`
         */
        this.Auth = function (provider) {
            var deferred = $q.defer();

            if (!angular.isString(provider))
                deferred.reject({ error: "Provider not set" });

            if (cordova && cordova.InAppBrowser) {
                $ionicLoading.show();
                var inappbrowser = cordova.InAppBrowser.open(BASE_API_URL + "/auth/handler&provider=" + provider, '_blank', 'location=no,hidden=yes');
                inappbrowser.addEventListener('loadstop', function (e) {
                    inappbrowser.show();
                    $ionicLoading.hide();
                    try {
                        if (e.url.substring(0, BASE_API_URL.length) === BASE_API_URL) {
                            if (e.url.indexOf("api2/auth/handler/success") > -1) {
                                deferred.resolve({ id: getParameterByName("id", e.url) });
                                inappbrowser.close();
                            } else if (e.url.indexOf("api2/auth/handler/error") > -1) {
                                deferred.reject({ error: getParameterByName("error", e.url) });
                                inappbrowser.close();
                            }
                        }
                    } catch (e) {

                    }
                });
            } else {
                deferred.reject({ error: "No inAppBrowser" });
            }

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name auth.module.AuthService#LoadUserData
         * @methodOf auth.module.AuthService
         * @kind function
         * 
         * @description
         * Get customer data by id
         * @param {number} id Customer id
         * @returns {promise} Returns a promise with customer object
         */
        this.LoadUserData = function (id) {
            return dataService.apiSecuredPost('/auth/handler/getuser', { id: id });
        }

        var getParameterByName = function (name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    })