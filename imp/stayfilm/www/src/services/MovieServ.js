angular.module('fun.services')
	.factory('MovieServ', function (
		CoolServ, $q, LogServ, SessionServ, ConfigServ, StorageServ, 
		GaServ, MiscServ, gettextCatalog, $timeout, $interval
	) {
		var log = LogServ,
			produceAgain = {},
			movieCache = {};

		return {
			get: function (idmovie) {
				return CoolServ.get('movie/' + idmovie, {include: ['user', 'comment']});
			},
			getCached: function (idmovie) {
				return movieCache[idmovie];
			},
			setCache: function (movie) {
				movieCache[movie.idMovie] = movie;
			},
			doVideo: function (params) {

				var defaultParams = {
					jobtype: 'timeline',
					title: 'untitled',
					genre: 1,
					theme: 1,
					subtheme: 1
				};

				if (ConfigServ.get('movie_duration') > 0) {
					params.duration = ConfigServ.get('movie_duration');
				}

				params = angular.extend({}, defaultParams, params);

				// store reference for produce again
				produceAgain = angular.extend({}, params);

				return CoolServ.post('job', params);
			},
			produceAgain: function () {
				log.debug("movieSERV produceAgain()", produceAgain);

				return this.doVideo( produceAgain );
			},
			poll: function (idjob) {
				return CoolServ.get('job/' + idjob);
			},
			discard: function (idmovie) {
				return CoolServ.delete('movie/' + idmovie);
			},
			share: function (data) {
				var idmovie = data.idMovie,
					network = data.network,
					facebookToken = data.facebookToken, // optional
					message = data.message || '';

				switch (network) {
					case 'facebook':
						return CoolServ.put('movie/' + idmovie, {socialNetwork: 'facebook', message: message, facebookToken: facebookToken});
					case 'twitter':
						return CoolServ.post('user/' + SessionServ.getUsername() + '/network/' , {idmovie: idmovie, networks: 'twitter' , message: message});
					case 'stayfilm':
						return CoolServ.post('user/' + SessionServ.getUsername() + '/feed/' , {idmovie: idmovie, comment: message});
					default:
						// ignore
				}
			},
			postComment: function (idmovie, comment) {
				log.debug("movieSERV POST", idmovie);

				return CoolServ.post('movie/' + idmovie + '/comment', {comment: comment});
			},
			deleteComment: function (idmovie, idcomment) {
				log.debug("movieSERV DELETE", idmovie);

				return CoolServ.delete('movie/' + idmovie + '/comment/' + idcomment);
			},
			publish: function (movie) {
				movie.publish = 1;

				return CoolServ.put('movie/' + movie.idMovie, movie).then(function () {

					StorageServ.remove('profile.pending', true);

					SessionServ.getUser().countPendingMovies--;
					SessionServ.getUser().movieCount++;
					StorageServ.remove('profile.movie', true);
				});
			},
			denounceMovie: function (idmovie, reason, description) {
				log.debug("movieSERV - denounceMovie POST", idmovie, reason, description);
				return CoolServ.post('movie/' + idmovie + '/denounce', {reason: reason, description: description});
			},
			editSynopsis: function (idmovie, synopsis) {
				return CoolServ.put('movie/' + idmovie, {synopsis: synopsis});
			},
			updatePermission: function (idmovie, permission) {
				return CoolServ.put('movie/' + idmovie, {permission: permission});
			},
			publishInNetworks: function (idmovie, networks) {
				return CoolServ.put('movie/' + idmovie, {socialNetwork: networks});
			},
			like: function (movie) {
				// treat LIKE and UNLIKE

				if ( movie.liked ) { // DELETE LIKE
					log.debug("DELETING LIKE");

					return CoolServ.delete('movie/' + movie.idMovie + '/like').then(function () {
						movie.liked = false;
						var user = SessionServ.getUser();
						user.likeCount--;
						return 'DELETED';
					});
				} else { // MAKE LIKE
					log.debug("CREATING LIKE");

					return CoolServ.post('movie/' + movie.idMovie + '/like').then(function () {
						movie.liked = true;

						var user = SessionServ.getUser();
						user.likeCount++;

						return 'CREATED';
					});
				}
			},
			tagShare: function (network, idmovie) {
				console.log("Tagging share of " + idmovie + " ...");

				GaServ.stateView("main.publish-share-" + network);

				CoolServ.put('movie/' + idmovie, {sharedon: network}).then(function () {
					console.log("Share tagged for " + network);
				}, function error() {
					console.log("ERROR while tagging share on" + network);
				});
			},
			saveToDevice: function (movie, callback) {
				var idmovie = movie.idMovie;
				var movieUrl = movie.baseUrl + '/video.mp4';
				var params = {
					idmovie: idmovie,
					url: movieUrl,
					title: movie.title
				};

				callback = callback || function noop(){};

				log.debug('Downloading movie to device (MovieServ.saveToDevice)...', params);

				function saveEnd(err) {
					$timeout(function() {
						callback(err);
					}, 2000);
				}

				// register download count
				// POST rest/{idmovie}/download
				console.log("Registering download...");
				CoolServ.post('movie/' + idmovie + '/download', {}).then(function () {
					console.log("Download registered");
				}, function error() {
					console.log("ERROR registering download");
				});

				MiscServ.showQuickMessage(gettextCatalog.getString("Salvando filme no dispositivo..."), 2000, function(){
					$timeout(function () {

						var interval, finishedDownload = false;

						function isDownloadFinished(progress) {
							log.debug(">>isDownloadFinished()", finishedDownload, progress);
							return finishedDownload;
						}

						window.downloadMovieToDevice(params, function (err, params) {
							finishedDownload = true;

							log.debug('Download complete !! (MovieServ.saveToDevice)', err);

							if (interval) {
								$interval.cancel(interval);
							}

							if (err) {
								log.error(err);
								MiscServ.showQuickMessage(gettextCatalog.getString("Erro ao salvar seu filme. Tente novamente."));
								saveEnd(err);
								return;
							} else {
								if (params === 9) {
									MiscServ.showQuickMessage(gettextCatalog.getString("O filme já existe no dispositivo."));
									saveEnd("FILM_ALREADY_ON_DEVICE");
									return;
								}

								MiscServ.showQuickMessage(gettextCatalog.getString("Filme salvo com sucesso no dispositivo."));
								saveEnd(null); // null = no error
								return;
							}
						});

						if (window.checkDownloadProgress) {
							var progressCheck = 0;

							interval = $interval(function () {
								if (isDownloadFinished(interval)) {
									$interval.cancel(interval);
									return;
								}

								window.checkDownloadProgress({idmovie: movie.idMovie}, function (err, progress) {
									log.debug("checkDownloadProgress()", err, progress);
									log.debug("finishedDownload", finishedDownload);
									log.debug("interval", interval);

									if (isDownloadFinished(progress)) {
										// if download ends before a check returns, avoid concurrency
										$interval.cancel(interval);
										return;
									}

									log.debug('download progress', progress);

									progress = parseInt(progress, 10);

									if (err) {
										log.error('Error in progress callback', err);

										$interval.cancel(interval);

										return;
									}

									if (progress > progressCheck && progress <= 100) {
										progressCheck = progress;
										MiscServ.showLoading(gettextCatalog.getString('Baixando...') + ' (' + progress + '%)', false);
									}
								});
							}, 1000);
						}
					}, 100);
				});
			}
		};
	})
;
