/*global define*/
define([
    'app',
    'services/request'
], function (app) {

    'use strict';

    app.service('pageService', [
        'requestService',
        function (requestService) {

            // get page
            this.get = function (pageId) {

                return requestService.send({
                    method: 'get',
                    url: '/cms/page/id/' + pageId,
                    success: function (res, promise) {
                        var page = res && res.page ? res.page : res;

                        promise.resolve(page);
                    }
                });
            };
        }
    ]);
});