/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    app.service('browseService', [
        '$location',
        '$window',
        '$state',
        '$stateParams',
        function ($location, $window, $state, $stateParams) {

            // nagivate back
            this.back = function (steps) {
                steps = steps || -1;
                $window.history.go(steps);
            };

            // change location -> go to another state
            this.navigate = function (path, notInHistory) {
                if (!notInHistory) {
                    $location.path(path);
                } else {
                    $location.path(path).replace();
                }
            };

            // get current location
            this.location = function () {
                return $location.path();
            };

            // reload the state or the entire page
            this.reload = function (forceFullReload) {
                if (forceFullReload) {
                    $window.location.reload();
                } else {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                }
            };
        }
    ]);
});