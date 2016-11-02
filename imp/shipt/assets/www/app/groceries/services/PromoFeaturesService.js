





(function () {
    'use strict';

    var serviceId = 'PromoFeaturesService';

    angular.module('shiptApp').factory(serviceId, [
        '$http',
        '$q',
        'LogService',
        '$log',
        'AuthService',
        'ApiEndpoint',
        '$rootScope',
        '$timeout',
        'DefaultHeaders',
        PromoFeaturesService]);

    function PromoFeaturesService($http,
                                  $q,
                                  LogService,
                                  $log,
                                  AuthService,
                                  ApiEndpoint,
                                  $rootScope,
                                  $timeout,
                                  DefaultHeaders) {


        var service = {
            getPromoFeatures: getPromoFeatures
        };

        return service;

        function getPromoFeatures() {
            var deferred = $q.defer();
            var url = ApiEndpoint.apiurl + '/api/v1/feature_promotions.json';
            DefaultHeaders.customer();
            $http({
                url: url,
                method: "GET"
            }).success(function(data){
                    deferred.resolve(data);
                })
                .error(function(error){
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }
})();
