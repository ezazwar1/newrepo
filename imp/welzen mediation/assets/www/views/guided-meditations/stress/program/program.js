'use strict';

angular.module('welzen')

.controller('ProgramController', function($scope, $stateParams, MeditationOfflineService) {

	function init(){
		var category = $stateParams.category;
		$scope.category = category;
		$scope.medias = MeditationOfflineService.getAllMediasByProductAndCategory("Series", category);	
		console.log("Series : " + JSON.stringify($scope.medias));
	}

  	$scope.goBack = function(count) {
   		$ionicHistory.goBack(count);
  	};

  	init();
  
});
