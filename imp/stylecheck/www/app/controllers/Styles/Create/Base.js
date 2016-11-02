/*global define*/
define([
    'app',
    'services/style',
    'services/browse'
], function (app) {

    'use strict';

    app.controller('CreateStyleCtrl', [
        '$rootScope',
        'styleService',
        'browseService',
        function ($rootScope, styleService, browseService) {
            // reset possible previous unsaved style
            $rootScope.resetHistory();
            styleService.newStyle.tags = [];
            delete styleService.newStyle.activeTag;

            if (!styleService.newStyle.image) {
                browseService.go('base.dashboard');
            }
        }
    ]);
});
