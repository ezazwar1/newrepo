(function() {
	'use strict';
	angular.module('welzen').factory('NaturalSoundService', naturalSoundService);

	function naturalSoundService(){

		var songs = ["music01", "music02"];
		var _currentSong = "music01";
		var _pos = 0;
		var _volume = 0.3;
		var _load = false;
		var _firePlay = false;

		var naturalSoundService = {
			nextSound : nextSound,
			init: init,
			getVolume: getVolume,
			currentSong: currentSong,
			stop: stop,
			play: play,
			playNext: playNext,
			unload: unload
		};

		return naturalSoundService;

		function init(){
			_firePlay = false;
			_load = false;

			// Preload audio resources
			if(window.plugins && window.plugins.NativeAudio){
				window.plugins.NativeAudio.preloadComplex( 'music01', 'preloadedmedias/music-01.mp3', _volume, 1, 0.3, function(msg){
					console.log('cargo bien: ',JSON.stringify(msg));
					_load = true;
					if(_firePlay){
						play();
					}
				}, function(msg){
					console.log( 'error preloadComplex: ' + msg );
				});      
				window.plugins.NativeAudio.preloadComplex( 'music02', 'preloadedmedias/music-02.mp3', _volume, 1, 0.3, function(msg){
					console.log('cargo bien: ',JSON.stringify(msg));
				}, function(msg){
					console.log( 'error preloadComplex: ' + msg );
				});								
			}

		}

		function unload(){
			if(window.plugins && window.plugins.NativeAudio){
				window.plugins.NativeAudio.stop('music01');
				window.plugins.NativeAudio.unload('music01');
				window.plugins.NativeAudio.stop('music02');
				window.plugins.NativeAudio.unload('music02');
				_firePlay = false;
				_load = false;				
			}
		}

		function getVolume(){
			return _volume;
		}

		function nextSound(){
			if(_pos === songs.length){
				_pos = 0;
			}
			var _nextSong = songs[_pos];
			_currentSong = _nextSong;
			_pos ++;
			return _nextSong;
		}

		function currentSong(){
			return _currentSong;
		}

		function stop(){
			window.plugins.NativeAudio.stop(_currentSong);
		}

		function play(){
			console.log('mando play');
			if(!_load){
				_firePlay = true;
			}
			window.plugins.NativeAudio.setVolumeForComplexAsset(_currentSong, _volume);
			window.plugins.NativeAudio.loop(_currentSong);
		}

		function playNext(){
			console.log('mando next sound');
			window.plugins.NativeAudio.loop(nextSound());
		}

	}

}());	