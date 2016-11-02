'use strict';

(function () {

    angular.module('znk.sat').factory('AuthInterceptorSrv', ['$q', '$injector', 'localStorageService', 'ErrorHandlerSrv','ENV', AuthInterceptorSrv]);

    function AuthInterceptorSrv($q, $injector, localStorageService, ErrorHandlerSrv, ENV) {

        var authInterceptorSrvFactory = {};
        var envPrefix = ENV.fbEndpoint.substring(ENV.fbEndpoint.indexOf('/') + 2, ENV.fbEndpoint.indexOf('.'));
        var AUTH_STORAGE_KEY = envPrefix + '.authorizationData';
        var $http;

        var _request = function (config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get(AUTH_STORAGE_KEY);
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        };

        var _responseError = function (rejection) {

            var deferred = $q.defer();
            if (rejection.status === 401) {
                var AuthSrv = $injector.get('AuthSrv');
                AuthSrv.logout();
                var $state = $injector.get('$state');
                $state.go('welcome');
                deferred.reject(ErrorHandlerSrv.handleServerError(rejection));
            } else {
                deferred.reject(ErrorHandlerSrv.handleServerError(rejection));
            }
            return deferred.promise;
        };

        var _retryHttpRequest = function (config, deferred) {
            $http = $http || $injector.get('$http');
            $http(config).then(function (response) {
                deferred.resolve(response);
            }, function (err) {
                deferred.reject(ErrorHandlerSrv.handleServerError(err));
            });
        };

        var _requestError = function (rejection) {
            var deferred = $q.defer();
            deferred.reject(ErrorHandlerSrv.handleServerError(rejection));
            return deferred.promise;
        };

        authInterceptorSrvFactory.request = _request;
        authInterceptorSrvFactory.responseError = _responseError;
        authInterceptorSrvFactory.requestError = _requestError;

        return authInterceptorSrvFactory;
    }

})();
