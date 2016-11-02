'use strict';
(function(){
	angular.module('eCommerce')
	.controller('homeCtrl', ['$scope','productService','$ionicLoading',
		function ($scope,productService,$ionicLoading) {
			$scope.products = [];
			$scope.featured ={};

			$ionicLoading.show();

			productService.get().then(function(data){
				setTimeout(function(){
					$scope.products = _.filter(data.data.products,function(obj){
						return obj.isFeatured=="0";
					});

					$scope.featured = _.find(data.data.products,function(obj){
						return obj.isFeatured=="1";
					});
					$ionicLoading.hide();
				},3000)

			},function(err){
				alert(err.statusText);
				$ionicLoading.hide();
			});

			$scope.viewProduct =function(item){
				var singleItem = JSON.stringify(item);
				$state.go('app.single',{product:singleItem});
			};
		}])
	.controller('AppCtrl', ['productService','$scope','$ionicSideMenuDelegate',
		function(productService,$scope,$ionicSideMenuDelegate){

			$scope.categories = [];


			productService.getCategories().then(function(data){
				$scope.Allcategories =data.data.categories;    
			});

			$scope.toggleCategories = function(cat) {
				if ($scope.isCategoryShown(cat)) {
					$scope.shownCategory = null;
				} else {
					$scope.shownCategory = cat;
				}
			};
			$scope.isCategoryShown = function(cat) {
				return $scope.shownCategory === cat;
			};



		}])



	;
	


})()