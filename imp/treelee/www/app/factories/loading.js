/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    app.factory('LoadingFactory', [
        '$q',
        '$rootScope',
        '$ionicLoading',
        function ($q, $rootScope, $ionicLoading) {

            return function (options) {
                var promise = $q.defer();

                options = options || {};

                if (!options.template) {
                    options.template = $rootScope.dict.pleaseWait;
                }

                // load modal
                $ionicLoading.show(options);

                promise.resolve($ionicLoading);

                return promise.promise;
            };
        }
    ]);
});