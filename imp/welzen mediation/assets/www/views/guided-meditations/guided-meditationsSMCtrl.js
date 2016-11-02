(function() {
	'use strict';

	angular.module('welzen')

	.controller('guidedMeditationsSMCtrl', function($scope, $stateParams, MeditationOfflineService, $state, userService) {

		$scope.category = JSON.parse($stateParams.category);
		$scope.meditations = MeditationOfflineService.getMeditations("SimpleMeditation", JSON.parse($stateParams.category));

		//me traigo las meditaciones de esta categoría, porque si está vacío no dibujo el botón
		$scope.seriesMedias = MeditationOfflineService.getAllMediasByProductAndCategory("Series", $scope.category);
		$scope.mindMedias = MeditationOfflineService.getAllMediasByProductAndCategory("MindfulnessCoaching", $scope.category);

		$scope.goBack = function(){
			$state.go("main");
		};

		$scope.coaching = function(){
			$state.go('mindfulness-coaching',{category:$scope.category});
		};

		$scope.series = function(){
			$state.go('program-series',{category:$scope.category});
		};

	    $scope.popUpActive = false;
		$scope.togglePopUpActive = function() {
    		$scope.popUpActive = !$scope.popUpActive;
 		};

 		$scope.isPremium = function() {
	  		return userService.isPaid();
	  	};

	});

}());
