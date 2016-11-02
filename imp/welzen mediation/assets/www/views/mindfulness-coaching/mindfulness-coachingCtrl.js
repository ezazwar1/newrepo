'use strict';

angular.module('welzen')

.controller('mindfulnessCoachingCtrl', function($scope, $state,$stateParams, MeditationOfflineService, LockService) {

	function init(){
		var category = $stateParams.category; 
		$scope.category = category;
		if (category == null || category === undefined){
			$scope.medias = MeditationOfflineService.getAllMediasByProduct("MindfulnessCoaching")
		}else{
			$scope.medias = MeditationOfflineService.getAllMediasByProductAndCategory("MindfulnessCoaching", category);
		}	
	}
	
	$scope.goBack = function(){
		if ($scope.category == null || $scope.category === undefined){
			$state.go("main");
		}else{
			$state.go("single-meditation",{category:JSON.stringify($scope.category)});	
		}
		
	}

	$scope.goToPlay = function(media) {
		if (LockService.showLock(media)){
			$scope.popUpActive = true;
		}else{
			$state.go('player',{media:media})
		}
    }

     $scope.popUpActive = false;
	 $scope.togglePopUpActive = function() {
    	$scope.popUpActive = !$scope.popUpActive;
 	};



    $scope.showLock = function(media){
    	return LockService.showLock(media);
    }

    init();

});
