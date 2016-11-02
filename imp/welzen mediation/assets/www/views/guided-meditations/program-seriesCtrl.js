'use strict';

angular.module('welzen')

.controller('programSeriesCtrl', function($scope, $state, $stateParams, MeditationOfflineService, LockService) {

	function init(){
		var category = $stateParams.category;
		$scope.category = category;
		$scope.medias = MeditationOfflineService.getAllMediasByProductAndCategory("Series", category);	
		//actualizo sus estados
		angular.forEach($scope.medias, function(media, key){
				media.updateSeries();
		});
	}

  	$scope.goBack = function() {
		$state.go("single-meditation",{category:JSON.stringify($scope.category)});
  	};

  	$scope.goToPlay = function(media) {
  		if (LockService.showLock(media)){
			$scope.popUpActive = true;
		}else if(media.locked){
			$scope.popUpStepByStepActive = true;
		}else{
			$state.go('player',{media:media})
		}
    }

    $scope.popUpActive = false;
	$scope.togglePopUpActive = function() {
    	$scope.popUpActive = !$scope.popUpActive;
 	};


    $scope.popUpStepByStepActive = false;
	$scope.togglePopUpStepByStepActive = function() {
    	$scope.popUpStepByStepActive = !$scope.popUpStepByStepActive;
 	};


    $scope.showLock = function(media){
    	return LockService.showLock(media);
    }

  	init();
  
});
