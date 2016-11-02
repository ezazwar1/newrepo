(function(){
	'use strict';

	angular.module('welzen')

	.controller('fiveDaysCtrl', function($scope, $ionicHistory, $state, LockService, MeditationOfflineService) {


	function init(){
		$scope.meditation = MeditationOfflineService.getMeditation("FiveDays");
		$scope.medias = $scope.meditation.medias;
		angular.forEach($scope.medias, function(media, key){
			media.updateSeries();
		});
	}

	$scope.goBack = function() {
	     $state.go('main');  
	 };

	 $scope.popUpActive = false;
	 $scope.togglePopUpActive = function() {
	    $scope.popUpActive = !$scope.popUpActive;
	 };

	 $scope.goToDay = function(media) {
	  	if (LockService.showLock(media)){
			$scope.popUpActive = true;
		}else if(media.locked){
			$scope.popUpActive = true;
		}else{
			$state.go('player',{media:media});
		}
	 };

	 $scope.showLock = function(media){
	  	return LockService.showLock(media);
	 };

	 init();

	});


}());