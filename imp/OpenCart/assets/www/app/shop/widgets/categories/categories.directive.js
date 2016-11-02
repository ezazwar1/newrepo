'use strict';

/**
* @ngdoc directive
* @name shop.module.directive:categoryList
* @description
* Widget to render category list. 
* @param {string} mode Template to render. Available options are `simple` or `collapse`. Default is `simple` 
* @param {boolean} thumbnail Whether to show category image as a thumbnail or not. Default is `false`
* @example
<pre>
    <category-list mode="simple|collapse|icons|vertical" thumbnail="true|false" category="1"></category-list>
</pre>
*/
angular.module('shop.module')
   .directive('categoryList', function ($ionicLoading) {
       return {
           scope: {
               thumbnail: "@thumbnail",
			   category: "=category"
           },
           link: function (scope, element, attrs) {
               scope.loadCategories();
			   angular.element(element).addClass('product-categories');
           },
           controller: ['$scope', 'ShopService', function ($scope, ShopService) {
               $scope.categories = [];

               $scope.loadCategories = function () {
                   $ionicLoading.show();
                   ShopService.GetCategories($scope.category).then(function (data) {
                       $scope.categories = data.categories;
                       $ionicLoading.hide();
                   }, function (data) {
                       $ionicLoading.hide();
                   });
               }

               $scope.toggleGroup = function (group) {
                   if (group.categories && group.categories.length > 0)
                       group.visible = !group.visible;
               };

           }],
           templateUrl: function ($element, $attrs) {
               var tplUrl = 'app/shop/widgets/categories/simple-template.html';
               if ($attrs.mode) {
                   tplUrl = 'app/shop/widgets/categories/' + $attrs.mode + '-template.html';
               }

               return tplUrl;
           }
       };
   });
