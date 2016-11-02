'use strict';

angular.module('welzen')

.controller('guidedMeditationsSMDetailCtrl', function($scope, $state,$stateParams, MeditationOfflineService,LockService) {

	$scope.meditation = $stateParams.meditation;

	$scope.goBack = function(){
		$state.go("single-meditation",{category:JSON.stringify($stateParams.meditation.category)});
	}

	$scope.showLock = function(media){
    	return LockService.showLock(media);
    }

    $scope.popUpActive = false;
	$scope.togglePopUpActive = function() {
    	$scope.popUpActive = !$scope.popUpActive;
 	};

 	$scope.goToPlay = function(media) {
		if (LockService.showLock(media)){
			$scope.popUpActive = true;
		}else{
			$state.go('player',{media:media})
		}
    }

});