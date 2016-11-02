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

            // uses ui-router $state.go - recommended to use
            // options
            /*
                location:   Boolean or "replace" (default true), If true will update the url in the location bar,
                            if false will not. If string "replace", will update url and also replace last history record.
                inherit:    Boolean (default true), If true will inherit url parameters from current url.
                relative:   stateObject (default $state.$current), When transitioning with relative path (e.g '^'),
                            defines which state to be relative from.
                notify:     Boolean (default true), If true will broadcast $stateChangeStart and $stateChangeSuccess events.
                reload v0.2.5: Boolean (default false), If true will force transition even if the state or params have not changed,
                            aka a reload of the same state. It differs from reloadOnSearch because you'd use this when you want to
                             force a reload when everything is the same, including search params.
            */
            this.go = function (stateName, params, notInHistory, notify) {
                return $state.go(stateName, params, {
                    location: notInHistory ? 'replace' : true,
                    notify: notify !== undefined ? notify : true
                });
            };

            // uses ui-router $state.current
            this.current = function () {
                return $state.current;
            };

            // uses ui-router $state.params to get params
            this.params = function () {
                return $state.params;
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
