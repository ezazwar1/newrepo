(function() {
	'use strict';

	angular.module('welzen')

	.controller('MenuController', function($scope, userService,MeditationOfflineService,$state,InAppPurchaseService) {

		$scope.categories = MeditationOfflineService.getAllCategories();

		//por si llega a cargar el controler antes que termine el service
		$scope.$on("categories_updated", function(event, categories) {
			$scope.categories = categories;
    	});

	  $scope.isActive = false;
	  $scope.toggleActive = function() {
	    $scope.isActive = !$scope.isActive;
	  };

	  $scope.popUpActive = false;
	  $scope.togglePopUpActive = function() {
	    $scope.popUpActive = !$scope.popUpActive;
	  };

	  $scope.hasReminders = function(){
		var timeInMill =  window.localStorage['welzen.reminder.time'];
		return (timeInMill !== undefined);
	  }


		$scope.logout = function() {
	  		userService.logout();
	  	};

		$scope.isLogged = function() {
	  		return userService.isLogged();
	  	};

	  	$scope.mindfulnessDay = function(){
	  		var meditations = MeditationOfflineService.getAllMediasByProduct("SimpleMeditation")
	  					.filter(function(media){
	  						if (media.length === 5){
	  							return true;
	  						}
	  						return false;
	  					});
	  		var lengthMeditations = meditations.length;
	  		var valueRandom=Math.floor(Math.random() * lengthMeditations);
	  		console.log("Meditations length: " + lengthMeditations + " value ramdom: " + valueRandom);
	  		$state.go('player',{media:meditations[valueRandom]});
	  	};

	  	$scope.isPremium = function() {
	  		return userService.isPaid();
	  	};

	  	$scope.goToUnlock = function() {
	  		$scope.isActive = false;
	  		if (InAppPurchaseService.isOwnerAnyProduct()){
	  			$state.go("already");
	  		}else{
	  			$state.go("unlock");
	  		}
	  		
	  	};

	  	
	});

}());