/*global define, FileTransfer, FileUploadOptions*/
define([
    'app',
    'settings',
    'services/request'
], function (app) {

    'use strict';

    app.service('messageService', [
        'requestService',
        function (requestService) {
            // Get all messages for a user
            this.get = function (pager) {
                return requestService.send({
                    method: 'get',
                    url: '/message' + requestService.buildFilterURI(pager, true),
                    authorization: true
                });
            };

            // Get unread message count
            this.getNew = function () {
                return requestService.send({
                    method: 'get',
                    url: '/message/new',
                    authorization: true
                });
            };
        }
    ]);
});
