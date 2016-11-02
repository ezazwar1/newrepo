(function() {
    'use strict';

    angular
        .module('shiptApp')
        .service('Subscription', Subscription);

    Subscription.$inject = ['$log','$q','$http','LogService','DefaultHeaders','ApiEndpoint','AppAnalytics'];

    function Subscription($log,$q,$http,LogService,DefaultHeaders,ApiEndpoint,AppAnalytics) {

        this.list = function() {
            var defer = $q.defer();
            DefaultHeaders.customer();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions/list_available.json',
                method: "GET"
            })
                .success(function(data){
                    $log.info('subscriptions/list_available.json', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    $log.error('subscriptions/list_available.json', error);
                    defer.reject(error);
                });

            return defer.promise;
        };

        this.update = function (subscription) {
            var defer = $q.defer();
            DefaultHeaders.customer();
            delete subscription['status'];
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions.json',
                method: "PUT",
                data: subscription
            })
                .success(function(data){
                    AppAnalytics.track('changeSubscriptionPlan',subscription);
                    $log.info('subscriptions/update.json', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    $log.error('subscriptions/update.json', error);
                    defer.reject(error);
                });

            return defer.promise;
        };

        this.create = function (subscription) {
            var defer = $q.defer();
            DefaultHeaders.customer();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions.json',
                method: "POST",
                data: subscription
            })
                .success(function(data){
                    AppAnalytics.membershipPurchase(data);
                    $log.info('subscriptions create.json', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    $log.error('subscriptions create.json', error);
                    defer.reject(error);
                });

            return defer.promise;
        };

        this.edit = function () {
            var defer = $q.defer();
            DefaultHeaders.customer();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions/edit.json',
                method: "GET"
            })
                .success(function(data){
                    $log.info('subscriptions/edit.json', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    $log.error('subscriptions/edit.json', error);
                    defer.reject(error);
                });

            return defer.promise;
        };

        this.cancel = function() {
            var defer = $q.defer();
            DefaultHeaders.customer();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions/delete.json',
                method: "DELETE"
            })
                .success(function(data){
                    AppAnalytics.track('cancelSubscriptionPlan');
                    $log.info('subscriptions/delete.json', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    $log.error('subscriptions/delete.json', error);
                    defer.reject(error);
                });

            return defer.promise;
        }

        this.get = function () {

        }

        this.save = function() {

        }

    }
})();
