'use strict';

/**
* @ngdoc directive
* @name shop.module.directive:itemSearch
* @description
* Widget to render product search page. 
* @example
<pre>
    <item-search></item-search>
</pre>
*/
angular.module('shop.module')
   .directive('itemSearch', function ($ionicLoading) {
       return {
           scope: {},
           link: function (scope, element, attrs) {
           },
           controller: ['$scope', '$ionicScrollDelegate', 'ShopService', function ($scope, $ionicScrollDelegate, ShopService) {
               $scope.endOfItems = true;
               $scope.loadingItems = false;
               $scope.noSearchword = true;
               $scope.page = 1;
               $scope.search = {};

               $scope.searchProducts = function () {
                   if ($scope.loadingItems) {
                       return;
                   }

                   $scope.loadingItems = true;
                   $scope.items = $scope.items || [];

                   if ($scope.search && $scope.search.value == "") {
                       $scope.loadingItems = false;
                       $scope.noSearchword = true;
                       $scope.items = [];
                       $ionicScrollDelegate.resize();
                       $scope.$broadcast('scroll.infiniteScrollComplete');
                   } else {
                       $scope.noSearchword = false;
                       ShopService.SearchProducts($scope.search.value, $scope.page).then(function (data) {
                           $scope.text_empty = data.text_empty;
                           $scope.items = $scope.items.concat(data.products);
                           $ionicScrollDelegate.resize();
                           $scope.page++;
                           if (data.products.length < 1)
                               $scope.endOfItems = true;
                           else
                               $scope.endOfItems = false;
                           $scope.loadingItems = false;
                           $scope.$broadcast('scroll.infiniteScrollComplete');
                       }, function (data) {
                           $scope.loadingItems = false;
                           $scope.$broadcast('scroll.infiniteScrollComplete');
                       });
                   }
               }

               $scope.loadNextPage = function () {
                   if (!$scope.endOfItems) {
                       $scope.searchProducts();
                   } else {
                       $scope.$broadcast('scroll.infiniteScrollComplete');
                   }
               }

               $scope.onSearchKeyDown = function () {
                   $scope.endOfItems = false;
                   $scope.loadingItems = false;
                   $scope.items = [];
                   $scope.page = 1;
                   $scope.searchProducts();
               }
           }],
           templateUrl: 'app/shop/widgets/item-search/search-template.html'
       };
   });