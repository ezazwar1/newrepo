/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    app.factory('ModalFactory', [
        '$q',
        '$ionicModal',
        function ($q, $ionicModal) {

            return function (scope, template, animation, backdropClickToClose) {
                var promise = $q.defer();

                // load modal
                $ionicModal.fromTemplateUrl(template, {
                    scope: scope,
                    animation: animation || 'slide-in-up',
                    backdropClickToClose: backdropClickToClose || false
                }).then(function (modal) {
                    promise.resolve(modal);
                }, promise.reject);

                return promise.promise;
            };
        }
    ]);
});
