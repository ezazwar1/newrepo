'use strict';
(function(){
	angular.module('eCommerce')
	.controller('categoriesCtrl', ['$scope','productService','$ionicLoading', 
		function ($scope,productService,$ionicLoading) {
			$scope.featuredCategory =[];
			$scope.categories = [];
			$scope.loaded = false;

			$scope.$on('$ionicView.loaded', function(){
				$ionicLoading.show({
					template:'Loading..'
				});
			});

			$scope.$on('$ionicView.afterEnter', function(){

				getCategories();


			});

			function getCategories(){
				productService.getCategories().then(function(data){
					$scope.featuredCategory = _.where(data.data.categories, {isPromo: "1"});
					//console.log($scope.featuredCategory);
					$scope.categories = _.where(data.data.categories, {isPromo: "0"});
					//console.log("$scope.categories",$scope.categories);
					setTimeout(function(){
						$scope.loaded =true;
						$ionicLoading.hide();
					},3000);
					
				},function(){
					$ionicLoading.hide();
				})
			}
		}])
	


})()