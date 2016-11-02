angular.module('fun')
	.directive('errSrc', function() {
		return {
			link: function(scope, element, attrs) {
				element.bind('error', function() {
					element.attr('src', attrs.errSrc);
				});
			}
		};
	})
	.directive('jwplayerZoom', [ function () {

		return {
			restrict: 'EC',
			template: '<div id="movie-player"></div><div class="manual-control" ng-click="pausePlayOrFullscreen()"></div>',
			scope: {
				movieUrl: '=movieurl',
				movieCover: '=moviecover',
				autostart: '=autostart',
			},
			controller: function ($scope, LogServ, $timeout) {

				var log = LogServ,
					movieUrl = $scope.movieUrl,
					movieCover = $scope.movieCover,
					autostart = $scope.autostart || false;
				
				log.debug("movieUrl", movieUrl);
				log.debug("movieCover", movieCover);
				
				var options = {
					file: movieUrl,
					image: movieCover,
					//file: 'http://cdn.stayfilm.com/timeline/8ea83735-66cc-48df-bf7d-2eaee708e615/c3d3dfa0-eb3e-4f9d-b3ae-f87e6e2e6b0e/video.mp4',
					width: "100%",
					aspectratio: "16:9",
					autostart: autostart
				};

				log.debug('jwplayerZoom options', options);

				$timeout(function () {
					jwplayer('movie-player').setup(options);
				}, 0);

				var lastClick = 0;
				$scope.pausePlayOrFullscreen = function () {
					var diff = (new Date()) - lastClick;
					
					if (diff > 300) {
						jwplayer().pause();
					} else {
						// toggle fullscreen
						jwplayer().setFullscreen(!jwplayer().getFullscreen());
					}

					lastClick = new Date();
				};
			}
		};
	}])
	.directive('jwplayer', [ function () {

		return {
			restrict: 'EC',
			template: '<div id="movie-player"></div><div class="manual-control" ng-click="pausePlayOrFullscreen()"></div>',
			scope: {
				movie: '=movie',
				autostart: '=autostart',
			},
			controller: function ($scope, LogServ, CoolServ) {

				var log = LogServ,
					movie = $scope.movie,
					autostart = $scope.autostart || false;

				var playerStats = {
					fireRanges: [0, 0.10, 0.25, 0.50, 0.75, 1],
					callbackRanges: {},
					greatestPosition: 0
				};

				var fireStats = function (percent) {
					log.debug( "watching " + percent * 100 + "%" );
					
					CoolServ
						.put("movie/" + movie.idMovie, {percent: percent * 100})
						.then(function success () {
							log.debug('watched.');
						}, function fail () {
							log.debug('not watched.');
						})
					;
				};

				var moviePoster;

				if (movie.poster_url) {
					moviePoster = movie.poster_url;
				} else {
					moviePoster = movie.baseUrl + "/572x322_n.jpg";
				}

				var options = {
					file: movie.localFile || movie.baseUrl + "/video.mp4",
					image: moviePoster,
					width: "100%",
					aspectratio: "16:9",
					autostart: autostart,
					events: {
						onPlay: function () {
							if (playerStats.fireRanges[0] === 0) {
								var lastFire = playerStats.fireRanges.shift();

								fireStats( lastFire );
							}
						},
						onTime: function (currentStats) {
							var duration = currentStats.duration;
							var currentPosition = currentStats.position;

							var firePosition = playerStats.fireRanges[0] * duration;
							playerStats.firePosition = firePosition;

							if (currentPosition > playerStats.greatestPosition) {
								playerStats.greatestPosition = currentPosition;
							}

							if (currentPosition > firePosition) {
								var lastFire = playerStats.fireRanges.shift();

								fireStats( lastFire );
							}
						},
						onSeek: function (stats) {
							var newPosition = stats.offset;

							if (newPosition > playerStats.greatestPosition) {
								log.debug("seeked - freeze viewcount");
								playerStats.fireRanges = [];
							}
						},
						onComplete: function () {
							log.debug("completed()");

							if (playerStats.fireRanges[0] === 1) {
								var lastFire = playerStats.fireRanges.shift();

								fireStats( lastFire );
							}
						}
					}
				};

				log.debug('jwplayer options', options);

				setTimeout(function () {
					jwplayer('movie-player').setup(options);
				}, 0);

				var lastClick = 0;
				$scope.pausePlayOrFullscreen = function () {
					var diff = (new Date()) - lastClick;
					
					if (diff > 300) {
						jwplayer().pause();
					} else {
						// toggle fullscreen
						jwplayer().setFullscreen(!jwplayer().getFullscreen());
					}

					lastClick = new Date();
				};
			}
		};
	}])
;
