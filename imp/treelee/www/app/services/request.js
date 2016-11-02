/*global define, XMLHttpRequest, void*/
define([
    'angular',
    'app',
    'settings',
    'services/config',
], function (angular, app, settings) {

    'use strict';
    app.service('requestService', [
        '$q',
        '$rootScope',
        '$http',
        '$ionicPopup',
        'browseService',
        'configService',
        '$ionicLoading',
        function ($q, $rootScope, $http, $ionicPopup, browseService, configService, $ionicLoading) {
            var pendingRequests = 0,
                apiUrl = settings.treeleeApi,
                configRequested = false,
                noConnection = false;

            // source: http://www.bennadel.com/blog/2615-posting-form-data-with-http-in-angularjs.htm
            function serializeData(data) {
                var name,
                    buffer = [],
                    value,
                    source;

                // If this is not an object, defer to native stringification.
                if (!angular.isObject(data)) {
                    return (data === null) ? '' : data.toString();
                }

                // Serialize each key in the object.
                for (name in data) {
                    if (data.hasOwnProperty(name)) {

                        value = data[name];

                        buffer.push(encodeURIComponent(name) + '=' + encodeURIComponent((value === null) ? '' : value));
                    }
                }

                // Serialize the buffer and clean it up for transportation.
                source = buffer
                        .join("&")
                        .replace(/%20/g, "+");

                return source;
            }



            function send(params, promise) {
                var request;

                // increment pending request
                pendingRequests += 1;
                // set loading true to see loading indicator in headerbar
                $rootScope.loading = true;

                // build up request object
                request = {
                    method: params.method,
                    url: apiUrl + params.url,
                    data: params.data || '',
                    headers: params.headers || {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/x-www-form-urlencoded'
                    }
                    //timeout: 10000
                };

                // possibility to transform the request
                if (params.transformRequest) {
                    request.transformRequest = params.transformRequest;
                } else {
                    // magento do not like params in json format -> serialize them in "formData" format
                    request.transformRequest = serializeData;
                }

                if (params.timeout) {
                    request.timeout = params.timeout;
                }

                // send request
                $http(request).then(function (data) {

                    // if success -> decrement pending requests
                    pendingRequests -= 1;

                    // request is failing anyway -> magento does not send 401 or something like that, only a 200 with status 'error'.
                    if (data.data.message && data.data.message.status && data.data.message.status === 'error') {
                        // reject
                        promise.reject(data.data.message);
                    } else {
                        // if there is success callback -> call it.
                        if (data.data.message) {
                            data.data = data.data.message;
                        }
                        if (params.success) {
                            params.success(data.data, promise);
                        } else {
                            // resolve request
                            promise.resolve(data.data);
                        }
                    }
                    // if this was the last pending request -> hide loading indicator
                    if (!pendingRequests) {
                        $rootScope.loading = false;
                    }
                }, function (data) {
                    // if success -> decrement pending requests
                    pendingRequests -= 1;
                    // if this was the last pending request -> hide loading indicator
                    if (!pendingRequests) {
                        $rootScope.loading = false;
                    }

                    // if no connection to server -> show alert to refresh
                    if (data.status !== 0 || (data.status === 0 && !data.config.timeout)) {
                        // if no connection to server -> show alert to refresh
                        if (!noConnection) {
                            noConnection = true;
                            $ionicLoading.hide();
                            $ionicPopup.show({
                                title: '<b>' + $rootScope.dict.connectError.title + '</b>',
                                template: $rootScope.dict.connectError.message,
                                buttons: [
                                    {
                                        text: $rootScope.dict.connectError.label,
                                        onTap: function () {
                                            noConnection = false;
                                            $rootScope.forceReload = true;
                                        }
                                    }
                                ]
                            });
                        }
                    }

                    // request is failing anyway.
                    promise.reject(data.data);
                });
            }

            // get app config
            function getConfig(params) {
                var promise = $q.defer();
                send(params, promise);

                return promise.promise;
            }

            /*
                params:
                    method: get|post|delete|put - required,
                    url: relative rest api url - required,
                    params: parameters - optional,
                    headers: custom header settings - optional,
                    success: success callback (promise) - optional
            */
            this.send = function (params) {
                var promise = $q.defer();

                // check if config was loaded before -> if not get config
                if (!configService.ready) {
                    if (!configRequested) {
                        configRequested = true;
                        getConfig({
                            method: 'get',
                            url: '/configuration/index/app_code/' + settings.appCodeT,
                            success: function (res, promise) {
                                var config = res && res.configuration ? res.configuration : res;

                                configService.config = config;
                                configService.ready = true;

                                promise.resolve(config);
                            }
                        }).then(function () {
                            browseService.reload();
                        });
                    }
                } else {
                    send(params, promise);
                }

                return promise.promise;
            };
        }
    ]);
});