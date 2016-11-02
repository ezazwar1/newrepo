angular.module('fun.controllers')
	.controller('AlbumAlbummanagerController', function (
		$scope, LogServ, $stateParams, MediaServ, SessionServ, StorageServ, MiscServ, AlbumServ,
		AlbumManagerServ
	) {
		var log = LogServ;

		log.info('AlbumAlbummanagerController()');

		var network = $stateParams.network;
		var idalbum = $stateParams.idalbum;

		// TODO - bellow is not working yet
		if (StorageServ.has('am.album.' + $stateParams.idalbum, true)) {
			var medias = StorageServ.get('am.album.' + $stateParams.idalbum, true);

			_.map(medias, function (media) {
				media.inAM =  AlbumManagerServ.has(media);
			});

			$scope.mediaList = medias;

		} else {

			MiscServ.showLoading();

			if (StorageServ.has('am.album.' + idalbum, true)) {
				$scope.album = StorageServ.get('am.album.' + idalbum, true);

			} else {
				AlbumServ.getAlbum(SessionServ.getUsername(), $stateParams.idalbum).then(function (resp) {
					$scope.album = resp.data;
				});
			}

			MediaServ.getMedias(SessionServ.getUsername(), {albums: $stateParams.idalbum}).then(function (resp) {
				log.debug("MEDIAS", resp.data);

				var medias = resp.data;

				medias = _.map(medias, function (media) {

					var fileData = AlbumManagerServ.normalizeMediaModel(media);

					fileData.inAM = AlbumManagerServ.has(media);

					return fileData;
				});

				log.info(medias);

				$scope.mediaList = medias;

				StorageServ.set('am.album.' + $stateParams.idalbum, medias, 'memory');

			}).finally(function () {
				MiscServ.hideLoading();
			});
		}

		var viewportWidth = $(window).width();
		var width = Math.floor(viewportWidth / 3);

		$scope.getItemSize = function () {
			return width;
		};

		$scope.selectAction = 'select';

		$scope.toggleAll = function () {

			if ($scope.selectAction === 'select') {
				_.forEach($scope.mediaList, function (fileData) {
					if ( ! AlbumManagerServ.has(fileData)) {

						var clone = _.extend({}, fileData);

						AlbumManagerServ.addMedia(clone);

						fileData.inAM =  true;

						log.info(fileData);
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
		};

		$scope.back = function () {
			$scope.goTo('main.albummanager.sourcezone', 'slide-right', {network: network});
		};

		$scope.use = function () {
			$scope.goTo('main.albummanager.contentzone', null, {idalbum: idalbum});
		};

		$scope.toggleMedia = function (fileData) {

			log.info('toggleMedia()', fileData);

			if (AlbumManagerServ.has(fileData)) {
				AlbumManagerServ.removeMedia(fileData);

				fileData.inAM =  false;
			} else {

				var clone = _.extend({}, fileData);

				AlbumManagerServ.addMedia(clone);

				fileData.inAM =  true;

				log.info(fileData);
			}

		};
	})
;
