/*global define, FileTransfer, FileUploadOptions*/
define([
    'app',
    'settings',
    'services/request',
    'services/user',
    'factories/storage'
], function (app, settings) {

    'use strict';

    app.service('styleService', [
        '$q',
        '$window',
        'requestService',
        'userService',
        'StorageFactory',
        function ($q, $window, requestService, userService, StorageFactory) {
            var self = this;

            this.newStyle = {
                image: null,
                tags: []
            };
            this.discoverStyles = [];
            this.currentDiscoverStyle = {};

            this.newTag = {};

            // Create new style
            this.create = function (params, newStyle) {
                return requestService.send({
                    method: 'post',
                    url: '/style',
                    authorization: true,
                    data: params,
                    success: function (res, promise) {
                        if (!newStyle) {
                            self.newStyle = angular.extend(self.newStyle, res);
                        }
                        promise.resolve(res);
                    }
                });
            };

            // get style by id
            this.get = function (id) {
                return requestService.send({
                    method: 'get',
                    url: '/style/id/' + id,
                    authorization: true,
                    success: function (res, promise) {
                        self.newStyle = angular.extend(self.newStyle, res);
                        promise.resolve(res);
                    }
                });
            };

            // get own styles
            this.getOwn = function (pager, params) {
                pager = pager || {};
                return requestService.send({
                    method: 'get',
                    url: '/style/user' + requestService.buildFilterURI(pager, true, ['creationDate']) + '&id=' + params.id,
                    authorization: true
                });
            };

            // set image for style
            this.uploadImage = function (id, params) {
                var auth = StorageFactory.get('tokenType') + ' ' + StorageFactory.get('accessToken'),
                    ft,
                    ftOptions,
                    host = settings.host + '/' + settings.api + '/v1/',
                    tmpPromise = $q.defer();

                if ($window.cordova) {
                    //mobile upload
                    ft = new FileTransfer();
                    ftOptions = new FileUploadOptions();

                    ftOptions.fileKey = 'file';
                    ftOptions.fileName = params.substr(params.lastIndexOf('/') + 1);
                    ftOptions.mimeType = 'image/jpeg';
                    ftOptions.httpMethod = 'PUT';
                    ftOptions.headers = {
                        Authorization: auth
                    };

                    ft.upload(params, encodeURI(host + 'style/id/' + id + '/image'), function (res) {
                        var r;
                        try {
                            r = JSON.parse(res.response);
                            self.newStyle = angular.extend(self.newStyle, r);
                            tmpPromise.resolve(r);
                        } catch (e) {
                            console.log(e);
                        }
                    }, function () {
                        tmpPromise.reject();
                    }, ftOptions);

                    return tmpPromise.promise;
                }

                return requestService.send({
                    method: 'put',
                    url: '/style/id/' + id + '/image',
                    data: params,
                    resetContentType: true,
                    transformRequest: angular.identity,
                    authorization: true,
                    success: function (res, promise) {
                        self.newStyle = angular.extend(self.newStyle, res);
                        promise.resolve(res);
                    }
                });
            };

            // Create tag for style
            this.createTag = function (id, params, newStyle) {
                return requestService.send({
                    method: 'post',
                    url: '/style/id/' + id + '/tag',
                    authorization: true,
                    data: params,
                    success: function (res, promise) {
                        if (!newStyle) {
                            self.newStyle = angular.extend(self.newStyle, res);
                        }
                        promise.resolve(res);
                    }
                });
            };

            // update tag for style
            this.updateTag = function (id, tagId, params) {
                return requestService.send({
                    method: 'put',
                    url: '/style/id/' + id + '/tag?id=' + tagId,
                    authorization: true,
                    data: params
                });
            };

            // Delete tag for style
            this.deleteTag = function (id, tagId) {
                return requestService.send({
                    method: 'delete',
                    url: '/style/id/' + id + '/tag?id=' + tagId,
                    authorization: true
                });
            };

            // Get styles of others
            this.rate = function (category, limit, excludes) {
                var customUrl = '',
                    excludeIds = [];

                excludes = excludes || [];

                if (category && category.length !== 0) {
                    customUrl = '?category=' + category;
                }

                if (excludes.length) {
                    angular.forEach(excludes, function (style) {
                        excludeIds.push(style._id);
                    });
                    customUrl = customUrl ? customUrl + '&exclude=' + excludeIds.join(',') : '?exclude=' + excludeIds.join(',');
                }

                if (limit) {
                    customUrl = customUrl ? customUrl + '&limit=' + limit : '?limit=' + limit;
                }

                return requestService.send({
                    method: 'get',
                    url: '/style/rate' + customUrl,
                    authorization: true
                });
            };
            // Create Report for Style
            this.createReport = function (styleId, params) {
                return requestService.send({
                    method: 'post',
                    url: '/style/id/' + styleId + '/report',
                    authorization: true,
                    data: params
                });
            };
            // Create rating for style
            this.rating = function (styleId, params) {
                return requestService.send({
                    method: 'post',
                    url: '/style/id/' + styleId + '/rating',
                    authorization: true,
                    data: params
                });
            };
            // Create comment for style
            this.comment = function (styleId, params) {
                return requestService.send({
                    method: 'post',
                    url: '/style/id/' + styleId + '/comment',
                    authorization: true,
                    data: params
                });
            };
            // Get comments for style
            this.getComments = function (styleId) {
                return requestService.send({
                    method: 'get',
                    url: '/style/id/' + styleId + '/comment',
                    authorization: true
                });
            };
            // Delete comment
            this.deleteComment = function (styleId, commentId) {
                return requestService.send({
                    method: 'delete',
                    url: '/style/id/' + styleId + '/comment?id=' + commentId,
                    authorization: true
                });
            };
            // Get styles in feed
            this.feed = function (pager, favs) {
                var customURL = favs ? '&favs=1' : '';
                pager = pager || {};
                return requestService.send({
                    method: 'get',
                    url: '/style/feed' + requestService.buildFilterURI(pager, true, ['inFeed']) + customURL,
                    authorization: true
                });
            };
            // Delete style
            this.deleteStyle = function (styleId) {
                return requestService.send({
                    method: 'delete',
                    url: '/style/id/' + styleId,
                    authorization: true
                });
            };
            // Favorize/defavorize a style
            this.favorize = function (styleId) {
                return requestService.send({
                    method: 'post',
                    url: '/style/id/' + styleId + '/favorize',
                    authorization: true,
                    success: function (res, promise) {
                        userService.user = res;
                        promise.resolve(res);
                    }
                });
            };
            // Retrieve paged style favorites of an user
            this.getFavorites = function (pager) {
                pager = pager || {};
                return requestService.send({
                    method: 'get',
                    url: '/style/favorites' + requestService.buildFilterURI(pager, true),
                    authorization: true
                });
            };
        }
    ]);
});
