/*global define*/
define([
    'app',
    'services/request',
    'factories/storage',
    'factories/popup',
    'factories/loading'
], function (app) {

    'use strict';

    app.service('userService', [
        '$q',
        '$rootScope',
        'requestService',
        'StorageFactory',
        'PopupFactory',
        'LoadingFactory',
        function ($q, $rootScope, requestService, StorageFactory, popupFactory, loadingFactory) {
            var abortPromises = [];
            this.user = {};

            // login
            this.login = function (params) {
                return requestService.send({
                    method: 'post',
                    url: '/authentication/login',
                    data: params
                });
            };

            // register
            this.register = function (params) {
                return requestService.send({
                    method: 'post',
                    url: '/user',
                    data: params
                });
            };

            // logout
            this.logout = function () {
                var self = this;
                return requestService.send({
                    method: 'get',
                    url: '/authentication/logout',
                    authorization: true,
                    success: function (res, promise) {
                        StorageFactory.remove(StorageFactory.keys);
                        self.user = {};
                        promise.resolve(res);

                    },
                    error: function (res, promise) {
                        StorageFactory.remove(StorageFactory.keys);
                        self.user = {};
                        promise.reject(res);
                    }
                });
            };

            // Social login
            this.facebookLogin = function (params) {
                return requestService.send({
                    method: 'post',
                    url: '/authentication/facebookDirect',
                    authorization: true,
                    data: params,
                    success: function (res, promise) {
                        StorageFactory.add({
                            'logged_in': true,
                            'userId': res.id,
                            'tokenType': res.tokenType,
                            'accessToken': res.accessToken,
                            'refreshToken': res.refreshToken,
                            'expirationTime': res.expirationTime
                        });

                        promise.resolve(res);
                    }
                });
            };

            // send new password
            this.sendPassword = function (params) {
                return requestService.send({
                    method: 'put',
                    url: '/user/sendPassword',
                    data: params
                });
            };

            // Gets current logged in user
            this.account = function () {
                var self = this;
                return requestService.send({
                    method: 'get',
                    url: '/user/account',
                    authorization: true,
                    success: function (res, promise) {
                        self.user = res;
                        promise.resolve(res);
                    }
                });
            };

            // Get user by id
            this.getOne = function (id) {
                return requestService.send({
                    method: 'get',
                    url: '/user/id/' + id,
                    authorization: true
                });
            };

            // Update user
            this.setAccount = function (params) {
                var self = this;
                return requestService.send({
                    method: 'put',
                    url: '/user/account',
                    authorization: true,
                    data: params,
                    success: function (res, promise) {
                        self.user = res;

                        promise.resolve(res);
                    }
                });
            };

            // Check if email and/or username already exists
            this.check = function (params) {
                var customUrl = params.username ? '?username=' + params.username : '';
                return requestService.send({
                    method: 'get',
                    url: '/user/check' + customUrl
                });
            };

            // Set new user avatar
            this.uploadImage = function (params) {
                var self = this;
                return requestService.send({
                    method: 'post',
                    url: '/user/avatar',
                    data: params,
                    authorization: true,
                    success: function (res, promise) {
                        self.user = res;
                        $rootScope.$broadcast('imageChanged');
                        promise.resolve(res);
                    }
                });
            };

            // Toggle favorite user
            this.toggleFavorite = function (id, username) {
                var tmpPromise = $q.defer(),
                    self = this,
                    name = username || $rootScope.dict.thisUser;
                if (self.user.favUsers.indexOf(id) >= 0) {
                    popupFactory({
                        title: $rootScope.dict.remove,
                        template: $rootScope.dict.reallyRemoveFavorite1 + ' <span class="bold">' + name + '</span> ' + $rootScope.dict.reallyRemoveFavorite2,
                        buttons: [{
                            text: $rootScope.dict.no,
                            type: 'button button-outline button-dark',
                            onTap: function () {
                                return;
                            }
                        }, {
                            text: $rootScope.dict.yes,
                            type: 'button button-outline button-assertive',
                            onTap: function () {
                                loadingFactory().then(function (loadingOverlay) {
                                    requestService.send({
                                        method: 'put',
                                        url: '/user/id/' + id + '/favorize',
                                        authorization: true,
                                        success: function (res, promise) {
                                            self.user = res;
                                            promise.resolve(res);
                                        }
                                    }).then(function (res) {
                                        loadingOverlay.hide();
                                        tmpPromise.resolve(res);
                                    }, function (res) {
                                        loadingOverlay.hide();
                                        tmpPromise.reject(res);
                                    });
                                });
                            }
                        }]
                    });
                } else {
                    loadingFactory().then(function (loadingOverlay) {
                        requestService.send({
                            method: 'put',
                            url: '/user/id/' + id + '/favorize',
                            authorization: true,
                            success: function (res, promise) {
                                self.user = res;
                                promise.resolve(res);
                            }
                        }).then(function (res) {
                            loadingOverlay.hide();
                            tmpPromise.resolve(res);
                        }, function (res) {
                            loadingOverlay.hide();
                            tmpPromise.reject(res);
                        });
                    });
                }

                return tmpPromise.promise;
            };

            // get Favorites
            this.getFavorites = function (id, params) {
                params = params || {
                    filter: {}
                };

                return requestService.send({
                    method: 'get',
                    url: '/user/id/' + id + '/favorites' + requestService.buildFilterURI(params, true),
                    authorization: true
                });
            };

            //Get users
            this.get = function (params, noCancel) {
                if (!noCancel) {
                    if (abortPromises.get) {
                        abortPromises.get.resolve();
                    }
                    abortPromises.get = $q.defer();
                }

                params = params || {
                    filter: {}
                };
                if (!params.filter) {
                    params.filter = {};
                }
                return requestService.send({
                    method: 'get',
                    url: '/user' + requestService.buildFilterURI(params, true),
                    timeout: noCancel ? undefined : abortPromises.get.promise,
                    authorization: true
                });
            };

            // Retrieve paged followers of an user
            this.follower = function (id, pager, noCancel) {
                pager = pager || {
                    filter: {}
                };

                if (!noCancel) {
                    if (abortPromises.follower) {
                        abortPromises.follower.resolve();
                    }
                    abortPromises.follower = $q.defer();
                }

                return requestService.send({
                    method: 'get',
                    url: '/user/id/' + id + '/followers' + requestService.buildFilterURI(pager, true),
                    authorization: true,
                    timeout: noCancel ? undefined : abortPromises.follower.promise
                });
            };

            // Updates token for authentication
            this.token = function (params) {
                return requestService.send({
                    method: 'put',
                    url: '/authentication/token',
                    data: params,
                    authorization: true
                });
            };
        }
    ]);
});
