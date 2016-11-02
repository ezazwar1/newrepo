(function() {
	'use strict';

	angular.module('welzen')

	.controller('unlockCtrl', function($scope,InAppPurchaseService, $state, userService, stateService) {

		$scope.products  = InAppPurchaseService.getAllProducts();

		$scope.goBack = function() {
			//FIXME: una solucion facil al problema si viene de cualquier 
			// lado menos de billing, lo llevo a donde estaba, pero en el caso 
			// de billing lo llevo al home, ya q es mas complicado
			// saber el estado real del cual venia
			var ps = stateService.getPreviousState();
			if('signup' === ps || 'billing-details' === ps || 'login' === ps){
				$state.go('main');  
			}else{
				stateService.goBackState();
			}
		};

		$scope.isPopularProduct = function(product){
			return InAppPurchaseService.isPopularProduct(product);
		};

		$scope.isUserLogged = function(){
			return userService.isLogged();
		};

		$scope.buy = function(product){
			if (userService.isLogged()){
				console.log("Product to buy " + product.id + " " + product.alias);
				InAppPurchaseService.buyProduct(product);	
			}else{
				$state.go("signup",{buying:true,product:product});
			}
	    };

	    $scope.needShow = function(){
   	  		var isAndroid = ionic.Platform.isAndroid();
   	  		if (!isAndroid){
   	  			return true;
   	  		}
   	  		return false;
	    }

	    $scope.restore = function(){
	    	InAppPurchaseService.restoreProduct();
	    }

		$scope.$on("inapp-refresh-completed", function() {
			$scope.popUpActive = true;
			$scope.$apply(function(){

			});
    	});

	    $scope.popUpActive = false;
		$scope.togglePopUpActive = function() {
			$scope.popUpActive = !$scope.popUpActive;
		};
	});
}());

