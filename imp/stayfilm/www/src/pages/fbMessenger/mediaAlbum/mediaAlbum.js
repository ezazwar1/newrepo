angular.module('fun.controllers')
	.controller('MediaAlbumController', function (
		$scope, LogServ, $stateParams, MediaServ, SessionServ, 
		StorageServ, MiscServ, AlbumServ, ModalServ, UIServ,
		AlbumManagerServ, Utils, $timeout, gettextCatalog, FbClientServ
	) {
		var log = LogServ;

		log.info('MediaAlbumController()');

		var idalbum = $stateParams.idalbum;

		if (StorageServ.has('mediastep.album.' + idalbum, true)) {
			$scope.album = StorageServ.get('mediastep.album.' + idalbum, true);

		} else {
			var request = "/" + idalbum;

			FbClientServ.add(request, function (err, album) {

				if (err) {
					log.error('error while fetching album in facebook', err);
					return;
				}

				$timeout(function () {

					var normalizedAlbum = {
						idAlbum: album.id,
						name: album.name,
						mediaCount: album.count,
						cover: ''
					};

					$scope.album = normalizedAlbum;
				});

			}, true);
		}

		if (StorageServ.has('am.album.medias.' + idalbum, true)) {
			var medias = StorageServ.get('am.album.medias.' + idalbum, true);

			_.map(medias, function (media) {
				media.inAM =  AlbumManagerServ.has(media);
			});

			$scope.mediaList = medias;

		} else {

			MiscServ.showLoading('', 10000)	;

			$scope.mediaList = [];

			(function getMedias(nextOffset) {

				var params = {limit: 40};

				if (nextOffset) {
					params.after = nextOffset;
				}

				var queryParams = '?';

				_.each(params, function (value, key) {
					queryParams += (key + '=' + value + '&');
				});

				var request = idalbum + "/photos" + queryParams;

				FbClientServ.add(request, function (err, json) {

					if (err) {

						UIServ.tryAgainPopup(err, function () {
							MiscServ.showLoading('', 10000);
							getMedias(nextOffset);
						});

						return;
					}

					log.debug("medias", json.data);

					var medias = json.data;

					medias = _.map(medias, function (fbmedia) {

						var media = AlbumManagerServ.normalizeFbPhoto(fbmedia, idalbum);
						media.inAM = AlbumManagerServ.has(media);

						return media;
					});

					_.each(medias, function (media) {
						$scope.mediaList.push(media);
					});

					MiscServ.hideLoading();

					if (json.paging && json.paging.next && json.paging.cursors.after) {
						getMedias(json.paging.cursors.after);
					} else {
						StorageServ.set('am.album.medias.' + idalbum, $scope.mediaList, 'memory');
					}

				}, true);
			})();

			log.debug('album photo count', $scope.mediaList.length);
		}

		var viewportWidth = $(window).width();
		var width = Math.floor(viewportWidth / 3);

		$scope.getItemSize = function () {
			return width;
		};

		$scope.selectAction = 'select';

		$scope.refresh = function () {
			StorageServ.remove('am.album.' + idalbum, true);
			StorageServ.remove('am.album.medias.' + idalbum, true);
			$scope.goTo('main.fbmessenger.mediaalbum', null, null, {reload: true});
			return;
		};

		$scope.toggleAll = function () {
			if ($scope.disableToggleButton) {
				return;
			}

			$scope.disableToggleButton = true;

			if ($scope.selectAction === 'select') {
				_.forEach($scope.mediaList, function (fileData) {
					if ( ! AlbumManagerServ.has(fileData)) {

						var clone = _.clone(fileData);

						AlbumManagerServ.addMedia(clone);

						fileData.inAM = true;
					}
				});

				$scope.selectAction = 'unselect';
			} else {
				_.forEach($scope.mediaList, function (fileData) {

					AlbumManagerServ.removeMedia(fileData);

					fileData.inAM =  false;
				});

				$scope.selectAction = 'select';
			}

			$timeout(function () {
				$scope.disableToggleButton = false;
			}, 500);

		};

		$scope.back = function () {
			$scope.goTo('main.fbmessenger.mediastep');
		};

		$scope.toggleMedia = function (fileData) {

			log.debug('toggleMedia()', fileData);

			if (AlbumManagerServ.has(fileData)) {
				AlbumManagerServ.removeMedia(fileData);

				fileData.inAM =  false;
			} else {

				var clone = _.extend({}, fileData);

				AlbumManagerServ.addMedia(clone);

				fileData.inAM =  true;
			}

		};

		$scope.zoomImg = function (fileData) {
			log.info("zoomImg: ", fileData);

			if (fileData.type === 'video' && Utils.isAndroid()) {
				// Android currently can't access local videos
				MiscServ.showQuickMessage(gettextCatalog.getString('Visualização indisponível'), 1500);
				console.log("no zoom for android");

				return;
			}

			if ( ! fileData.uri) return;

			var options = {};

			options.fileData = fileData;

			var zoomModal = ModalServ.get('zoom');

			zoomModal.show(options);
		};
	})
;
