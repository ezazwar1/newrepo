(function() {
	'use strict';

	angular.module('welzen')

	.controller('PlayerController', function($scope, $ionicHistory, $stateParams, stateService, $interval, $ionicAnalytics, $ionicPopup, $state, NaturalSoundService){

		var totalDuration;
		var mediaPlayer;
		var mediaTimer;
		$scope.nature = true;

		function informMedia(cancelled){
			$scope.media.wasCancelled = cancelled;
            $ionicAnalytics.track($scope.media.product, $scope.media);
		}

		function init(){
    		NaturalSoundService.init();

			$scope.loadingSpinning = true;
			$scope.duration = $stateParams.media.realLength;
			$scope.media = $stateParams.media;
			$scope.playing = true;
			
			totalDuration = $scope.duration ;
			if (window.Media === undefined){
				console.warn("Media not defined. Running in a browser?");
				return;
			}
			console.log('navigator.connection.type ' + navigator.connection.type) ;
			if(navigator.connection.type === Connection.NONE && $stateParams.media.url.startsWith('http')){
				var alertPopup = $ionicPopup.alert({
					title: 'Network Error',
					content: "Oops - seems that you don't have internet"
				});
				$scope.playing = false;
				alertPopup.then(function(res) {
					$state.go('main');
				});
			}else{
				mediaPlayer = new Media( $stateParams.media.url, mediaSuccess, mediaError, mediaStatus);
				if($stateParams.media.hasSound){
					console.log('ya viene con audio adentro');
					$scope.nature = false;
				}
				console.log("welzenPlayer. Playing media : " + JSON.stringify($scope.media));
				playMedia(); 				
			}

		}

		$scope.onChangeNature = function(){
			if($scope.nature && $scope.playing){
				NaturalSoundService.playNext();
			}else if(!$scope.nature && $scope.playing){
				NaturalSoundService.stop();
			}
		}

		cordova.plugins.backgroundMode.onactivate = function() {
			console.log('me fui al backgroundMode');
  			var isAndroid = ionic.Platform.isAndroid();
  			if (isAndroid){
				if($scope.nature && $scope.playing){
					NaturalSoundService.play();
				}  				
  			}			
		};

		cordova.plugins.backgroundMode.ondeactivate = function() {
			console.log('volvi del backgroundMode');
		};

		cordova.plugins.backgroundMode.onfailure = function() {
			console.log('se fue el backgroundMode al carajo');
		};
		

		$scope.goBack = function() {
			forceStopped = true;
			if (mediaPlayer !== undefined){
				 if ($scope.playing){
						mediaPlayer.stop();
						informMedia(true);
				 }
				mediaPlayer.release();
			}
			stateService.goBackState();
		};

		$scope.closeView = function() {
			forceStopped = true;
			if (mediaPlayer !== undefined){
				 if ($scope.playing){
						mediaPlayer.stop();
						informMedia(true);
				 }
				mediaPlayer.release();
			}
			$state.go('main');
		};



		$scope.togglePlay = function() {
			$scope.playing = !$scope.playing;
			if (finished){
				init();
				return;
			}
			if (mediaPlayer === undefined){
				return;
			}
			playMedia(); 
		};

		function playMedia(){
			if ($scope.playing){
				$scope.media.startedSeries();
				console.log("welzenPlayer. Playing media .. ");
				cordova.plugins.backgroundMode.enable();
				mediaPlayer.play();
				if($scope.nature){
					console.log("welzenPlayer. Playing nature .. ");
					NaturalSoundService.play();
				}				
				mediaTimer = startCountdown();
			}else{
				console.log("welzenPlayer. Pause media .. ");
				cordova.plugins.backgroundMode.disable();
				mediaPlayer.pause();
				if($scope.nature){
					// naturePlayer.pause();
					NaturalSoundService.stop();
				}
				$interval.cancel(mediaTimer);
			}
		}


		//The callback that executes after a Media object has completed the current play, record, or stop action. (Function)
		function mediaSuccess(){
			console.log("welzenPlayer. Played media successfuly ");
			$scope.playing = false;
			if (mediaTimer !== undefined){
				$interval.cancel(mediaTimer);
			}
			finished = true;
			if(statusMedia === 4 && !forceStopped){

				if($scope.nature){
					// naturePlayer.stop();
					NaturalSoundService.stop();
					//seteo el volumen bien porque sino cuando vuelvo está en 0
					window.plugins.NativeAudio.setVolumeForComplexAsset(NaturalSoundService.currentSong(), NaturalSoundService.getVolume());
				}

				cordova.plugins.backgroundMode.disable();
				$scope.media.finishSeries().then(function(){
					informMedia(false);
					stateService.goBackState();	
				});
			}
		}
	

		//The callback that executes if an error occurs. (Function)
		function mediaError(error){
			console.log("welzenPlayer. Error playing media " + JSON.stringify(error));
			$scope.playing = false;
			if (mediaTimer !== undefined){
				$interval.cancel(mediaTimer);
			}
			cordova.plugins.backgroundMode.disable();
			mediaPlayer.release();
			finished = true;
			$state.go('main');
		}	

		function startCountdown(){
			return $interval(function () {
					mediaPlayer.getCurrentPosition(
						function (position) {
							if(position > 0 && $scope.loadingSpinning){
								$scope.loadingSpinning = false;
							}
							if (position > 0) {
								var complete = Math.floor(position);
								$scope.duration = totalDuration - complete;
								if($scope.duration < NaturalSoundService.getVolume() * 30){
									if ($scope.nature){
										window.plugins.NativeAudio.setVolumeForComplexAsset(NaturalSoundService.currentSong(), $scope.duration/60);
									}
								}
							}
						},
					function (e) {
						console.log("welzenPlayer. Error getting pos=" + e);
					}
				);
			},1000);
		}


		//The callback that executes to indicate status changes. (Function)
		function mediaStatus(status){
			console.log("welzenPlayer. Status media " + JSON.stringify(status));
			statusMedia = status;

			// this is when I receive a call, and then I hang out
			if(status === 3 && $scope.playing){
				console.log('Ive received a call');
				$scope.playing = false;
				$interval.cancel(mediaTimer);
			}else if(status === 2 && !$scope.playing){
				console.log('the call was finished...continue');
				$scope.playing = true;
				mediaTimer = startCountdown();
			}

			if(status === 4){
				NaturalSoundService.stop();
			}
		} 
		function natureStatus(status){
			statusNature = status;
		}

		var finished = false;
		var statusMedia = 0;
		var statusNature = 0;
		var forceStopped = false;
		init();

		//por las dudas
		$scope.$on('$destroy', function iVeBeenDismissed() {
			NaturalSoundService.unload();
			forceStopped = true;
  			cordova.plugins.backgroundMode.disable();
			if (mediaPlayer !== undefined){
				if ($scope.playing){
					mediaPlayer.stop();
				} 
				mediaPlayer.release();  
			}
  		});
	});
}());
