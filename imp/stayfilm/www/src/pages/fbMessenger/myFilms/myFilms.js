angular.module('fun.controllers')
	.controller('MyFilmsController', function (
		$scope, LogServ, UserServ, SessionServ, StorageServ, $ionicScrollDelegate, GaServ, 
		$timeout, MiscServ, UIServ, Utils, ModalServ, gettextCatalog, $interval, CoolServ
	) {
		var log = LogServ;

		log.info('MyFilmsController');

		$scope.user = SessionServ.getUser();

		var bag;

		if ( ! bag) {
			bag = {movies: [], finished: false, offset: null};
		}

		$scope.bag = bag;
		
		function removeFromBag (movie) {
			for (var i = 0; i < bag.movies.length; i++) {
				if (bag.movies[i].idMovie === movie.idMovie) {
					bag.movies.splice(i, 1);
					break;
				}
			}
		}

		$scope.discard = function (movie) {
			UIServ.discardMovie(movie)
				.then(function () {
					removeFromBag(movie);
				})
			;
		};

		$scope.share = function (movie) {
			console.log("SHARE", movie);

			publishAndShareInMessenger(movie);
		};

		$scope.download = function (movie) {
			console.log("myfilm download", movie);

			var params = {idmovie: movie.idMovie, url: movie.baseUrl + "/video.mp4", title: movie.title};

			params.saveToCameraRoll = true;

			// register download count
			// POST rest/{idmovie}/download
			console.log("Registering download...");
			CoolServ.post('movie/' + movie.idMovie + '/download', {}).then(function () {
				console.log("Download registered");
			}, function error() {
				console.log("ERROR registering download");
			});

			MiscServ.showLoading(gettextCatalog.getString('Baixando...'));

			$timeout(function () {

				var interval;

				log.debug('Downloading movie to device (myFilms)...', params);

				window.downloadMovieToDevice(params, function (err, file) {
					log.debug('(myFilms) Download complete !!');
					log.debug('(myFilms) Downloaded file: ', file);
					log.debug('(myFilms) err? ', err);

					if (err) {
						log.error(err); // lets continue, the download will be done in the next page
					}

					log.debug('Cancel ping progress');

					MiscServ.hideLoading();

					if (interval) {
						$interval.cancel(interval);
					}
				});


				var progressCheck = 0;

				interval = $interval(function () {
					// stayfunny checkDownloadProgress method signature 
					// is different from stayfun and
					// here there is no (obj, callback)
					// just (callback)
					window.checkDownloadProgress(function (err, progress) {
						log.debug('download progress', progress);

						progress = parseInt(progress, 10);

						if (err) {
							log.error('Error in progress callback', err);
							return;
						}

						if (progress > progressCheck && progress <= 100) {
							progressCheck = progress;
							MiscServ.showLoading(gettextCatalog.getString('Baixando...') + ' (' + progress + '%)');
						}
					});
				}, 1000);
			}, 500);
		};

		$scope.loadMore = function () {
			log.debug('loadMore()');

			$scope.requestDone = false;

			MiscServ.showLoading();

			UserServ.getFbMessengerMovies(SessionServ.getUser().username, bag.offset)
				.then(function (resp) {
					log.debug('getFbMessengerMovies()', resp.data);

					MiscServ.hideLoading();

					$scope.requestDone = true;
					bag.finished = resp.data.length === 0;
					bag.offset = resp.offset;

					angular.forEach(resp.data, function (movie) {
						bag.movies.push(movie);
					});
				})
			;
		};

		function publishAndShareInMessenger (movie) {
			log.debug("publishAndShareInMessenger()", movie);

			if (Utils.isCordovaApp()) {

				var params = {idmovie: movie.idMovie, url: movie.baseUrl + "/video.mp4", title: movie.title};

				params.saveToCameraRoll = true;

				MiscServ.showLoading(gettextCatalog.getString('Baixando filme...'));

				window.downloadMovieToDevice(params, function (err, file) {
					if (err) {
						log.err('error while downloading the video', err);
						MiscServ.hideLoading();
						MiscServ.alert('Something is wrong with this video... Please try again later.');
						return;
					}

					params.url = file;

					window.sendToFbMessenger(params, function (err) {
						if (err) {
							MiscServ.hideLoading();
							MiscServ.alert('Failed to share to messenger');
							return;
						}

						MiscServ.hideLoading();
						$scope.goTo("main.fbmessenger.titlestep");
					});
				});
			} else {
				alert('Share not implemented no browser');
			}
		}

		$scope.watch = function (movie) {
			log.debug('watch()', movie);

			// if (Utils.isAndroid()) {
			// 	log.debug('view unavailable on android');
			// 	return;
			// }

			var fileData = {
				uri: movie.baseUrl + '/video.mp4',
				image: movie.baseUrl + "/572x322_n.jpg",
				type: 'video'
			};

			log.debug(fileData);

			var zoomModal = ModalServ.get('zoom');

			zoomModal.show({
				fileData: fileData
			});

			GaServ.trackViewMap("meus-filmes_ver-filme");
		};

		$scope.getImageUrl = function(movie, size) {
			var filename, width,
				ext = '.jpg';

			if ( ! size) {
				width = $(window).width(); //todo: caching

				console.log(width);

				if (width < 300) {
					size = 'small';
				} else if (width > 640) {
					size = 'large';
				} else {
					size = 'medium';
				}
			}

			switch (size)
			{
				case 'small':
					filename = '266x150';
					break;
				case 'medium':
					filename = '572x322';
					break;
				case 'large':
					filename = '640x360';
					break;
				default:
					throw Error('size ' + size + 'not available');
			}

			filename = filename  + '_n' + ext;

			return movie.baseUrl + '/' + filename;
		};

		$scope.loadMore();

		GaServ.trackViewMap("meus-filmes");
	})
;
