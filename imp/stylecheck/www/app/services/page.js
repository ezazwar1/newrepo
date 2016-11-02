/*global define*/
define([
    'app',
    'services/request',
    'factories/storage'
], function (app) {

    'use strict';

    app.service('pageService', [
        'requestService',
        function (requestService) {
            // Get all pages or restricted by type
            this.get = function (type, language) {
                var customUrl;

                type = type || '';
                language = language || '';
                if (type !== '' && language !== '') {
                    customUrl = '?type=' + type + '&language=' + language;
                } else {
                    customUrl = '';
                }

                return requestService.send({
                    method: 'get',
                    url: '/page' + customUrl
                });
            };
        }
    ]);
});
