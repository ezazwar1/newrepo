angular.module('fun.controllers')
	.controller('MediaStepController', function (
			$scope, LogServ, SessionServ, AlbumManagerServ, MediaServ, 
			$rootScope, $stateParams, ConfigServ, StorageServ, MiscServ, 
			UploadMediaServ, $ionicActionSheet, UIServ,
			gettextCatalog, $ionicPopup, $timeout, FacebookServ, 
			FbClientServ, GaServ
	) {
		var log = LogServ;

		log.info('MediaStepController');

		$scope.albumList = [];
		$scope.uploadPercentage = 0;
		$scope.minSelected = ConfigServ.get('funny_min_photo');
		$scope.uploadInfo = UploadMediaServ.getUploadInfo();
		$scope.totalSelected = UploadMediaServ.getUploadInfo().totalCount + AlbumManagerServ.mediaCount();
		$scope.uploadCount = UploadMediaServ.getUploadInfo().totalCount;
		$scope.amCount = AlbumManagerServ.mediaCount();
		$scope.mediaList = UploadMediaServ.getQueueReference();

		$scope.albumList.push({iAmTheUploadButton: true});

		UploadMediaServ.addSubscriber('media-uploaded.mediaStep' , function () {
			log.info("FIRE ! UploadMediaServ subscriber media-uploaded.mediaStep");

			$scope.uploadInfo = UploadMediaServ.getUploadInfo();

			$scope.uploadPercentage = UploadMediaServ.getProgress();

			$scope.totalSelected = UploadMediaServ.getUploadInfo().totalCount + AlbumManagerServ.mediaCount();

			if ( ! UploadMediaServ.isWorking()) {
				if (UploadMediaServ.getCount('FAIL')) {
					showOptionsForFail();
				}
			}

			log.debug('uploadPercentage', $scope.uploadPercentage);
		});

		function mediaListProcess(fileDataList) {
			var invalid = _.find(fileDataList, function (fileData) {
				return fileData.status === 'INVALID';
			});

			if (invalid) {
				log.error("Invalid medias found");
				//MiscServ.alert(gettextCatalog.getString('Algumas mídias são maiores que o permitido ou de tipo inválido, e não serão adicionadas.'));
			}
		}

		$scope.openMediasOrUpload = function () {
			if ($scope.mediaList.length === 0) {
				UploadMediaServ.chooseMedias().then(function (fileDataList) {

					// the fileDataList will be falsy on the browser

					if (fileDataList) {
						$scope.totalSelected = UploadMediaServ.getUploadInfo().totalCount + AlbumManagerServ.mediaCount();
						$scope.uploadCount = UploadMediaServ.getUploadInfo().totalCount;
						$scope.amCount = AlbumManagerServ.mediaCount();

						$scope.uploadInfo = UploadMediaServ.getUploadInfo();
						mediaListProcess(fileDataList); // only executed in cordova app
					}

					// else Browser just ignore, handleFiles function will do the job

				});
			} else {
				$rootScope.goTo('main.moviemaker.upload', null, {source: 'fbmessenger'});
			}
		};

		// browser
		$scope.handleFiles = function (files) {
			UploadMediaServ.addMedias(files).then(function (fileDataList) {
				$timeout(function () {
					$scope.totalSelected = UploadMediaServ.getUploadInfo().totalCount + AlbumManagerServ.mediaCount();
					$scope.uploadInfo = UploadMediaServ.getUploadInfo();
					$scope.uploadCount = UploadMediaServ.getUploadInfo().totalCount;
					$scope.amCount = AlbumManagerServ.mediaCount();
					mediaListProcess(fileDataList);
				}, 0);
			});
		};

		if (StorageServ.has('mediastep.albums', 'memory')) {
			$scope.albumList = StorageServ.get('mediastep.albums', true);

			updateSelectedMediaCountByAlbum();

		} else {

			MiscServ.showLoading('', 10000);

			(function getNetworkAlbums(nextOffset) {

				log.debug('getNetworkAlbums()', nextOffset);

				var params = {limit: 20};

				if (nextOffset) {
					params.after = nextOffset;
				}

				var queryParams = '?';

				_.each(params, function (value, key) {
					queryParams += (key + '=' + value + '&');
				});

				var request = "me/albums" + queryParams;

				FbClientServ.add(request, function (err, resp) {
					log.debug('resp', resp);

					if (err || !resp) {

						UIServ.tryAgainPopup(err, function () {
							MiscServ.showLoading('', 10000);
							getNetworkAlbums(nextOffset);
						});

						return;
					}

					var albums = resp.data;

					MiscServ.hideLoading();

					_.each(
						albums,
						function (album) {

							if ( ! album.count || ! album.cover_photo) {
								return;
							}

							var normalizedAlbum = {
								idAlbum: album.id,
								name: album.name,
								mediaCount: album.count,
								cover: ''
							};

							StorageServ.set('mediastep.album.' + normalizedAlbum.idAlbum, normalizedAlbum, true);

							$scope.albumList.push(normalizedAlbum);

							var request = "/" + album.cover_photo;

							FbClientServ.add(request, function (err, photo) {

								$timeout(function () {
									normalizedAlbum.cover = FacebookServ.getThumbnail(photo.images);
								});
							});
						}
					);

					$timeout(function () {
						updateSelectedMediaCountByAlbum();

						if (resp.paging && resp.paging.cursors && resp.paging.cursors.after) {
							getNetworkAlbums(resp.paging.cursors.after);
						} else {
							StorageServ.set('mediastep.albums', $scope.albumList, 'memory');
						}

					}, 0);

				}, true);
			})();
		}

		$scope.showAlbum = function (idalbum) {
			log.debug("showAlbum(" + idalbum + ")");

			GaServ.trackViewMap("Passo_2_escolher-fotos_facebook-album");

			$rootScope.goTo('main.fbmessenger.mediaalbum', 'slide-left', {idalbum: idalbum});
		};

		function updateSelectedMediaCountByAlbum() {
			log.debug('updateSelectedMediaCountByAlbum');

			_.each($scope.albumList, function (album) {
				album.selectedMediaCount = 0;
			});

			_.each(AlbumManagerServ.getListReference(), function (fileData) {

				_.each($scope.albumList, function (album) {

					if (album.idAlbum === fileData.idAlbum) {
						album.selectedMediaCount = album.selectedMediaCount ? album.selectedMediaCount + 1 : 1;
					}
				});
			});
		}

		var $win = $(window),
			minItemSize = 160;

		$scope.getItemSize = function () {
			var vw = $win.width();

			return ~~(vw / ~~(vw / minItemSize));
		};

		function showOptionsForFail () {

			var options = [];

			// some uploads failed ?
			if (UploadMediaServ.getCount("FAIL") > 0) {

				options.push({label: gettextCatalog.getString('Tentar novamente'), callback: function () {
					UploadMediaServ.uploadFailed();
				}});

				options.push({label: gettextCatalog.getString('Ver fotos'), callback: function () {
					$timeout(function () {
						$scope.goTo('main.moviemaker.upload', null, {source: 'fbmessenger'});
					}, 250);
				}});
			}

			// log.info(new Error("STACKTRACE").stack, options);

			$ionicActionSheet.show({
				titleText: gettextCatalog.getString('Não foi possível carregar todas as fotos.'),
				buttons: _.map(options, function (option) {
					return {text: option.label};
				}),
				cancelText: gettextCatalog.getString('Cancelar'),
				buttonClicked: function(index) {

					options[index].callback();

					return true;
				}
			});
		}

		$scope.makeIt = function() {
			log.info("makeIt()");

			if ($scope.totalSelected < $scope.minSelected) {
				$ionicPopup.alert({template: gettextCatalog.getString('Por favor, selecione pelo menos {{num}} fotos.').replace('{{num}}', $scope.minSelected) + ' <br><img src="images/dialog_photos.svg" width="100" height="100">', title: gettextCatalog.getString("Ops...")});

				GaServ.trackViewMap("Erro-do-usuario_1_faltou-fotos");
				return;
			}

			// flag to tell the waiting step to go ahead.
			StorageServ.set('do_video_allowed', true, 'memory');

			$scope.goTo('main.waiting', null, {source: 'fbmessenger'});
		};

		$scope.refresh = function () {
			StorageServ.remove('mediastep.albums', 'memory');
			$scope.albumList = [];
			MiscServ.goTo('main.fbmessenger.mediastep', null, {}, {reload: true});
		};

		GaServ.trackViewMap("Passo_2_escolher-fotos");

	})
;
