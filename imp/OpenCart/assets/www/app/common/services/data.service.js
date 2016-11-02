'use strict';

/**
* @ngdoc service
* @name starter.dataService
* @requires ng.$http
* @requires ng.$q
* @requires ng.$httpParamSerializerJQLike
* @requires starter.BASE_API_URL
* @description
* Calls the http API endpoints and resolves the response. Contains authentication call, `apiLogin` which should be 
called before using apiSecuredPost method. otherwise it will reject the request with error status of 0 on API 
calls which needs the authentication. The `dataService` is responsible for providing a `promise` object containing 
the requested data. On a success response it returns the data from the server, and on an error the promise rejects 
with the HTTP server response. i.e, HTTP server response object contains,

```
config:Object
data:Object
headers:function(c)
status:406
statusText:"Not Acceptable"
```
*/
angular.module('starter')
    .service('dataService', function ($http, $q, $httpParamSerializerJQLike, BASE_API_URL) {

        /**
         * @ngdoc function
         * @name starter.dataService#apiSecuredPost
         * @methodOf starter.dataService
         * @kind function
         * 
         * @description
         * Calls the http API endpoints and resolves the response
         * 
         * @example
         <pre>
         this.GetSomething = function () {
             return dataService.apiSecuredPost('/ctrl/sample');
         }
         </pre>
         or
         <pre>
         this.GetSomething = function () {
             return dataService.apiSecuredPost('/ctrl/sample').then(function(data){
                // success
             }, function(data){
                // error
             })
         }
         </pre>
         * @param {string} url Relative URL of the API endpoint. Ex "/layout/banners"
         * @param {object} data Data to be sent via Http post params
         * @returns {promise} Returns a promise of the API call.
         */
        this.apiSecuredPost = function (url, data) {
            var that = this;
            if (!data)
                data = {}

            // last post item is ommited from emulator [bug]
            data.zzz_fix = 1;

            var config = {};
            config.headers = [];
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';

            return $http.post(BASE_API_URL + url, $httpParamSerializerJQLike(data), config).then(function (response) {
                /** rejects the entire response. response is,
                * config:Object
                * data:Object
                * headers:function(c)
                * status:401
                * statusText:"Not Acceptable"
                **/
                if (!response || response.status == 401)
                    return $q.reject(response);

                return response && response.data ? response.data : {};
            }, function (response) {
                /** rejects the entire response. response is,
                * config:Object
                * data:Object
                * headers:function(c)
                * status:406
                * statusText:"Not Acceptable"
                **/
                return $q.reject(response);
            });
        };

        /**
         * @ngdoc function
         * @name starter.dataService#apiFilePost
         * @methodOf starter.dataService
         * @kind function
         * 
         * @description
         * Posts a file to the server via `$http` service
         * 
         * @param {string} url Relative URL of the API endpoint. Ex "/layout/banners"
         * @param {object} data Data to be sent via Http post params
         * @returns {promise} Returns a promise of the API call.
         */
        this.apiFilePost = function (url, data) {
            if (!data)
                data = {}

            var formData = new FormData();
            formData.append('file', data);

            var config = {};
            config.headers = [];
            config.headers['Content-Type'] = undefined;
            config.transformRequest = angular.identity;

            return $http.post(BASE_API_URL + url, formData, config).then(function (response) {
                if (!response || response.error)
                    return $q.reject(response);

                return response && response.data ? response.data : {};
            }, function (response) {
                return response && response.data ? response.data : { error: "Network error" };
            });
        };
    });