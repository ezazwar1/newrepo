'use strict';

angular.module('welzen')

.controller('alreadySubsCtrl', function($scope, $state, $stateParams,$filter, userService, InAppPurchaseService) {


	$scope.products  = InAppPurchaseService.getAllProducts();
	var currentUser = userService.getCurrentUser();
	$scope.paidDate  = currentUser===null?null:currentUser.paidDate;


	$scope.goBack = function() {
	    $state.go('main');  
	};


	$scope.upgrade = function(product){
		if (InAppPurchaseService.isOwnerAnyProduct()){
			$scope.popUpActive = true;
			return;
		}
		if (userService.isLogged()){
			console.log("Product to buy " + product.id + " " + product.alias);
    		InAppPurchaseService.buyProduct(product);	
		}else{
			$state.go("login",{buying:true,product:product});
		}
    };

  	$scope.isPopularProduct = function(product){
		return InAppPurchaseService.isPopularProduct(product);
	}

	$scope.popUpActive = false;
	$scope.showHidePopup = function(){
		$scope.popUpActive = !$scope.popUpActive;
	}

	$scope.canCancelProduct = function(){
		return InAppPurchaseService.canCancelProduct();
	}

});
