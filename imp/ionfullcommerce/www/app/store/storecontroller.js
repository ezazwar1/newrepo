'use strict';
(function(){
	angular.module('eCommerce')
	.controller('storeCtrl', ['$scope','productService','$ionicLoading','$state',
		function ($scope,productService,$ionicLoading,$state) {

			$scope.selectedTabId;
			$scope.idFilter;
			$scope.categories = [ ];
			$scope.products = [ ];
			$scope.isProductLoaded =999;

			function getProductAndCategories(){
				productService.getCategories().then(function(data){
					$scope.categories =_.where(data.data.categories, {showInMenu: "1"});
					$scope.idFilter = "all";
					productService.get().then(function(res){
						$scope.products =res.data.products;
						$scope.isProductLoaded = 1;
						$ionicLoading.hide();
					});
					
				})
			}

			$scope.$on('$ionicView.loaded', function(){
				$ionicLoading.show({
					template:'Loading..'
				});
			});

			$scope.$on('$ionicView.afterEnter', function(){
				getProductAndCategories();
			});

			$scope.getCategoryItem =function(catId){
				$scope.selectedTabId =catId;
				$scope.isProductLoaded =999;
				$scope.idFilter=catId;
				$ionicLoading.show({
					template:'Loading..'
				});


					// $scope.idFilter = "all";
					productService.get().then(function(res){
						if($scope.idFilter == "all"){
							$scope.products =res.data.products;
							
						}else{
							$scope.products =_.where(res.data.products, {categoryId:catId});
							
						}
						
						setTimeout(function(){
							if($scope.products.length>0){
								$scope.isProductLoaded =1
							}else{
								$scope.isProductLoaded =0
							}
							$ionicLoading.hide();
						},2000);
					});

				}

				$scope.showDetails =function(product){
					$state.go('app.single',{id:product});
					
				};

			}])


	;
	


})()