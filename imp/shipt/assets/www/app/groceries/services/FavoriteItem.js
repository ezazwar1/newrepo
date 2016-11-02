(function() {
    'use strict';

    angular
        .module('shiptApp')
        .service('FavoriteItem', FavoriteItem);

    FavoriteItem.$inject = ['$log','$q','$http','LogService','DefaultHeaders','ApiEndpoint','AppAnalytics'];

    function FavoriteItem($log,$q,$http,LogService,DefaultHeaders,ApiEndpoint,AppAnalytics) {

        this.list = function(page) {
          var defer = $q.defer();
          var req = {
              method: 'GET',
              url: ApiEndpoint.apiurl + "/api/v1/favorite_items.json",
              params: {
                  page: page
              }
          };
          DefaultHeaders.customer();
          $http(req)
              .success(function(data){
                  $log.debug('getFavoritedItems from server success', data);
                  defer.resolve(data);
              })
              .error(function(error){
                  LogService.error('error', error);
                  defer.reject(error);
              });
          return defer.promise;
        }

        this.listIds = function() {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/favorite_items/list_ids.json"
            };
            DefaultHeaders.customer();
            $http(req)
                .success(function(data){
                    $log.debug('favorite_items/list_ids from server success', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    LogService.error('error', error);
                    defer.reject(error);
                });
            return defer.promise;
        };

        this.addProduct = function(item) {
            $log.info('FavoriteItem.addItem', item);
            item.favorite = true;
            var defer = $q.defer();
            var req = {
                method: 'POST',
                url: ApiEndpoint.apiurl + "/api/v1/favorite_items.json",
                data: {
                    favoritable_id: item.id,
                    favoritable_type: "Product"
                }
            };
            DefaultHeaders.customer();
            AppAnalytics.track('favoriteProduct',item);
            $http(req)
                .success(function(data){
                    $log.debug('added favorite_items', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    LogService.error('error', error);
                    defer.reject(error);
                });
            return defer.promise;
        }

        this.removeProduct = function(item) {
            $log.info('FavoriteItem.removeProduct', item);
            item.favorite = false;
            var defer = $q.defer();
            var req = {
                method: 'POST',
                url: ApiEndpoint.apiurl + "/api/v1/favorite_items/remove_favorite_item.json",
                params: {
                    favoritable_type: "Product",
                    id: item.id
                }
            };
            DefaultHeaders.customer();
            AppAnalytics.track('unFavoriteProduct',item);
            $http(req)
                .success(function(data){
                    $log.debug('DELETE favorite_items', data);
                    defer.resolve(data);
                })
                .error(function(error){
                    LogService.error('error', error);
                    defer.reject(error);
                });
            return defer.promise;
        }

    }
})();
