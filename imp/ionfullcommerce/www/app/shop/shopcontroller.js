'use strict';
(function(){
	angular.module('eCommerce')
	.controller('singleCtrl', ['$scope','$stateParams','productService',
		'$ionicLoading','$ionicSlideBoxDelegate','$state',
		function ($scope,$stateParams,productService,$ionicLoading,
			$ionicSlideBoxDelegate,$state) {

			$scope.productName;
			$scope.singleProduct;
			$scope.accordClass = 'closed'; 
			$scope.chosenColor ='';
			$scope.chosenSize = 0; 
			

			$scope.$on('$ionicView.loaded', function(){
				$scope.productName =$stateParams.id;
				$ionicLoading.show({
					template:'Loading..'
				});
			});

			$scope.$on('$ionicView.afterEnter', function(){
				getSingleProduct()
			});



			function getSingleProduct(){
				productService.get().then(function(res){

					$scope.singleProduct =_.findWhere(res.data.products, {name:$scope.productName});
					$ionicSlideBoxDelegate.update();
					//console.log($scope.singleProduct);

					setTimeout(function(){
						
						$ionicLoading.hide();
					},1000);
				});
			}

			$scope.toggleDesc =function(){
				if($scope.IsItemOpened()){
					$scope.accordClass = 'closed';
				}else{
					$scope.accordClass = 'open';    
				}
			}

			$scope.IsItemOpened =function(){
				return $scope.accordClass === 'open'
			};

			$scope.choseColor = function(color){
				$scope.chosenColor = color;
			};

			$scope.chooseSize = function(size){
				$scope.chosenSize =size;
			};

			$scope.gotoCart=function(){
				$state.go('app.cart');
			}

			
		}])
	.controller('cartCtrl', ['$scope','$state','productService','$ionicLoading',
		function ($scope,$state,productService,$ionicLoading) {
			$scope.cartItems =[];
			$scope.cartLoaded = 0;
			$scope.$on('$ionicView.loaded', function(){
				$ionicLoading.show({
					template:'Loading..'
				});
			});

			$scope.$on('$ionicView.afterEnter', function(){
				getCartItems()
			});

			function getCartItems(){
				productService.get().then(function(res){				

					setTimeout(function(){
						
						$scope.cartItems =_.where(res.data.products, {categoryId:"3"});
						$scope.cartLoaded =1;
						$ionicLoading.hide();
					},2000);
				});
			}

			$scope.startCheckout = function(){
				$state.go('app.delivery');
			};
		}])
	.controller('checkoutCtrl', ['$scope','$state', function ($scope,$state) {

		$scope.proceedToCheckout =function(){
			$state.go('app.checkout');
		}
		
	}])
	


})()