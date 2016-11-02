/*global define, XMLHttpRequest*/
define([
    'app',
    'settings',
    'services/api',
    'services/browse',
    'factories/popup',
    'factories/storage'
], function (app, settings) {

    'use strict';
    app.service('requestService', [
        '$q',
        '$rootScope',
        '$http',
        'StorageFactory',
        'apiService',
        'browseService',
        'PopupFactory',
        function ($q, $rootScope, $http, StorageFactory, apiService, browseService, popupFactory) {
            var pendingRequests = 0,
                apiUrl = settings.host + '/' + settings.api,
                badRequest = false,
                pendingRequestsAfterRefresh = [],
                tokenRequested = false,
                noConnection = false;

            function request(params, isConfigRequest) {
                var requestData,
                    errorText = $rootScope.dict.errors.unknownError,
                    header = {},
                    version = '',
                    database = '',
                    authData = {},
                    promise = $q.defer();

                // increment pending request
                pendingRequests = pendingRequests + 1;
                // set loading true to see loading indicator in headerbar
                $rootScope.loading = true;

                if (params.authorization) {
                    authData = StorageFactory.get(['tokenType', 'accessToken']);
                    header.Authorization = authData.tokenType + ' ' + authData.accessToken;
                }
                if (params.resetContentType) {
                    header['Content-Type'] = undefined;
                }
                if (params.store) {
                    header.Store = params.store;
                }

                // build up request object
                requestData = {
                    url: apiUrl,
                    method: params.method,
                    data: params.data || '',
                    headers: header
                };

                // possibility to transform the request
                if (params.transformRequest) {
                    requestData.transformRequest = params.transformRequest;
                }

                if (!isConfigRequest) {
                    version = params.version ? '/' + params.version : '/v1';
                }

                if (params.timeout) {
                    requestData.timeout = params.timeout;
                }

                requestData.url = requestData.url + version + database + params.url;
                // send request
                $http(requestData).then(function (data) {
                    // if success -> decrement pending requests
                    pendingRequests -= 1;

                    if (params.success) {
                        params.success(data.data, promise);
                    } else {
                        // resolve request
                        promise.resolve(data.data);
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

                    if (data.status === 500 || data.status === 503 || data.status === 502) {
                        if (!noConnection && !badRequest) {
                            // if no connection to server -> show alert to refresh
                            noConnection = true;
                            popupFactory({
                                title: '<b>' + $rootScope.dict.errors.connectError.title + '</b>',
                                template: $rootScope.dict.errors.connectError.message,
                                buttons: [{
                                    text: $rootScope.dict.errors.connectError.label,
                                    type: 'button button-outline button-assertive',
                                    onTap: function () {
                                        noConnection = false;
                                        browseService.reload(true);
                                    }
                                }]
                            });
                        }
                    } else if (data.status === 403 && data.data && data.data.error === 'invalid_authorization') {
                        $rootScope.$broadcast('clearLogin', true);
                    } else {
                        // check if response is 400 -> and there is no badRequest Popup shown
                        if (data.status === 400 && !badRequest && !noConnection) {
                            badRequest = true;

                            if (data.data.error && data.data.param) {
                                if (!$rootScope.dict.errors[data.data.error] || !$rootScope.dict.errors[data.data.error][data.data.param]) {
                                    errorText = $rootScope.dict.errors.defaultMessage;
                                } else {
                                    errorText = $rootScope.dict.errors[data.data.error][data.data.param];
                                }
                                errorText = '<span id="' + data.data.error + '">' + errorText + '</span>';
                            } else if (data.data.error && !data.data.param) {
                                if (!$rootScope.dict.errors[data.data.param]) {
                                    errorText = $rootScope.dict.errors.defaultMessage;
                                } else {
                                    errorText = $rootScope.dict.errors[data.data.error];
                                }
                                errorText = '<span id="' + data.data.error + '">' + errorText + '</span>';
                            } else {
                                errorText = $rootScope.dict.errors.defaultMessage;
                            }

                            popupFactory({
                                title: '<b>' + $rootScope.dict.errors.errorTitle + '</b>',
                                template: errorText,
                                buttons: [{
                                    text: $rootScope.dict.ok,
                                    type: 'button button-outline button-assertive',
                                    onTap: function () {
                                        badRequest = false;
                                        return;
                                    }
                                }]
                            });
                        }
                        if (params.error) {
                            return params.error(data, promise);
                        }
                    }
                    // request is failing anyway.
                    promise.reject(data);
                });
                return promise.promise;
            }

            function retry(req) {
                request(req.params).then(req.promise.resolve, function (res) {
                    req.promise.reject(res.data);
                });
            }

            function tryOrRefresh(params, q) {
                // try sending request
                request(params).then(q.resolve, function (res) {
                    // if response 401 -> unauthorized
                    if (res.status === 401) {
                        // push request to pendings
                        params.retryIndex = pendingRequests.length;
                        pendingRequestsAfterRefresh.push({promise: q, params: params});
                        // if first unauthorized request
                        if (!tokenRequested) {
                            // block other requests
                            tokenRequested = true;
                            // get storage data
                            var storageData = StorageFactory.get(['accessToken', 'refreshToken']);
                            // send refresh request only one time
                            request({
                                method: 'post',
                                url: '/authentication/refresh',
                                database: storageData.dbname,
                                data: {
                                    accessToken: storageData.accessToken,
                                    refreshToken: storageData.refreshToken
                                },
                                success: function (res, promise) {
                                    // refresh localstorage data
                                    StorageFactory.add({
                                        'tokenType': res.tokenType,
                                        'accessToken': res.accessToken,
                                        'refreshToken': res.refreshToken,
                                        'expirationTime': Date.now() + (res.expiresInMinutes * 60 * 1000) - ((res.expiresInMinutes - 1) * 1000 * 60),
                                        'dbname': res.db
                                    });
                                    return promise.resolve(res);
                                },
                                error: function (res, promise) {
                                    // failing refresh -> delete all important data and clear localstorage
                                    if ($rootScope.online && !noConnection) {
                                        $rootScope.$broadcast('clearLogin', true);
                                    }
                                    promise.reject(res);
                                }
                            }).then(function () {
                                // send all pending Requests
                                angular.forEach(pendingRequestsAfterRefresh, function (req) {
                                    retry(req);
                                });
                                // unlock refresh
                                tokenRequested = false;
                                pendingRequestsAfterRefresh.length = 0;
                            }, function () {
                                // unlock refresh, goto login
                                tokenRequested = false;
                                pendingRequestsAfterRefresh.length = 0;
                                // failing refresh -> delete all important data and clear localstorage
                                if ($rootScope.online && !noConnection) {
                                    $rootScope.$broadcast('clearLogin', true);
                                }
                            });
                        }
                    } else {
                        q.reject(res);
                    }
                });
            }

            this.send = function (params) {
                var q = $q.defer(),
                    configTask = [];

                // send request only if online
                if (!$rootScope.online || noConnection) {
                    q.reject();
                } else {

                    // if no config -> load it
                    if (!apiService.config.version) {
                        // get config request flag to block request sending
                        configTask.push(request({
                            method: 'get',
                            url: '/config',
                            success: function (res, promise) {
                                // store config in api service
                                apiService.config = res;
                                return promise.resolve(res);
                            }
                        }, true));
                    }
                    // if new token already requested
                    if (tokenRequested) {
                        params.retryIndex = pendingRequests.length;
                        pendingRequestsAfterRefresh.push({promise: q, params: params});
                    } else { // ordinary request -> check if it should request new token
                        // send possible config request
                        $q.all(configTask).then(function () {
                            // send original Request
                            tryOrRefresh(params, q);
                        }, function (res) {
                            if ($rootScope.online && !noConnection) {
                                // config request fails -> go to login page and clear data
                                $rootScope.$broadcast('clearLogin', true);
                                q.reject(res.data);
                            }
                        });
                    }
                }
                return q.promise;
            };

            this.secSend = function (params) {
                var self = this,
                    q = $q.defer();

                popupFactory({
                    title: $rootScope.dict.deletePopup.title,
                    template: $rootScope.dict.deletePopup.message,
                    buttons: [{
                        text: $rootScope.dict.yes,
                        type: 'button button-outline button-assertive',
                        onTap: function () {
                            return self.send(params).then(q.resolve, q.reject);
                        }
                    }, {
                        text: $rootScope.dict.no,
                        type: 'button button-outline button-calm',
                        onTap: function () {
                            return q.reject({
                                error: 'deletion_aborted'
                            });
                        }
                    }]
                });

                return q.promise;
            };

            // validate date filters
            this.validateDate = function (pager, keys) {
                angular.forEach(pager.filter, function (value, key) {
                    if (!isNaN(Date.parse(value)) && (keys.indexOf(key) !== -1)) {
                        pager.filter[key] = Date.parse(value);
                    }
                });
            };

            // build filter uri
            this.buildFilterURI = function (pager, defaultLimit, dateKeys) {
                var filterString = '',
                    hasPager = pager !== undefined,
                    page;
                pager = pager || {};
                // if default limit -> set default limit
                if (defaultLimit && !pager.limit) {
                    pager.limit = 10;
                }

                // validate dates
                if (dateKeys && dateKeys.length) {
                    this.validateDate(pager, dateKeys);
                }
                // set up uri parts
                page = pager.page ? '?page=' + pager.page : '?page=1';

                var limit = pager.limit ? '&limit=' + pager.limit : '',
                    orderBy = pager.orderBy !== undefined ? '&orderBy=' + pager.orderBy : '',
                    orderDesc = pager.orderDesc !== undefined ? (pager.orderDesc ? '&orderDesc=true' : '&orderDesc=false') : '';

                // if there was pager -> build up filter uri
                if (hasPager) {
                    angular.forEach(pager.filter, function (value, key) {
                        if (value || value === false || value === 0) {
                            filterString = filterString + '&filter=' + key + '&value=' + value;
                        }
                    });
                    return page + limit + filterString + orderBy + orderDesc;
                }
                // return only page
                return page + limit;
            };

            // transform timestamps into dates
            this.setPagerDates = function (newPager, oldPager, datekeys) {
                if (oldPager.filter && newPager.filter) {
                    angular.forEach(datekeys, function (value) {
                        if (!isNaN(Date.parse(oldPager.filter[value])) && oldPager.filter[value] !== undefined && newPager.filter[value] !== undefined) {
                            newPager.filter[value] = new Date(newPager.filter[value]);
                        }
                    });
                }
                return newPager;
            };
        }
    ]);
});
