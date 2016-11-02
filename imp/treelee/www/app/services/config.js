/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    app.service('configService', [
        function () {

            this.ready = false;
            this.config = {};
        }
    ]);
});
