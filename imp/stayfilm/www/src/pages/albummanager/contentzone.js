angular.module('fun.controllers')
	.controller('ContentzoneAlbummanagerController', function (
		$scope, LogServ, $stateParams, MediaServ, SessionServ,
		$ionicScrollDelegate, $ionicModal, AlbumManagerServ,
		UploadMediaServ, MiscServ, $timeout, $ionicActionSheet,
		AlbumServ, ConfigServ, gettextCatalog, MoviemakerServ, StorageServ
	) {
		var log = LogServ;

		log.info('ContentzoneAlbummanagerController');

		var data = {};

		var mediaList = $scope.mediaList = [];

		$scope.minUploadPhoto = ConfigServ.get('min_mini_template_photo');

		AlbumManagerServ.addSubscriber('media-added.contentzone', function (media) {
			log.info('media-uploaded callback', media);

			media.inAM = true;

			if (media.status !== 'SN') {
				mediaList.unshift(media);
			} else {
				mediaList.splice(mediaList.length - 1, 0, media);
			}

		});

		UploadMediaServ.addSubscriber('media-uploaded.contentzone', function () {
			log.info('media-uploaded callback');

			$scope.totalProgress = UploadMediaServ.getProgress();
		});

		UploadMediaServ.addSubscriber('media-added.contentzone', function () {
			log.info('media-added callback');

			$scope.totalProgress = UploadMediaServ.getProgress();
		});

		AlbumManagerServ.addSubscriber('media-removed.contentzone', function (media) {
			log.info('media-uploaded callback');

			media.inAM = false;

			_.remove(mediaList, function (obj) {
				return obj.id === media.id;
			});
		});

		$scope.$on('$destroy', function () {
			AlbumManagerServ.removeSubscriber('.contentzone');
			UploadMediaServ.removeSubscriber('.contentzone');
		});

		AlbumManagerServ.listenToUploadMediaServ();

		// load album
		if ($stateParams.idalbum) {

			log.info('am.contentzone - use album ', $stateParams.idalbum);

			AlbumServ.getAlbum(SessionServ.getUsername(), $stateParams.idalbum).then(function (resp) {

				AlbumManagerServ.reset();
				UploadMediaServ.reset();

				AlbumManagerServ.setAlbum(resp.data);

				load();

			}, function () {
				// silently fail
				log.error('Unbale to load the album');
			});

		} else if ($stateParams.data) {

			log.info('am.contentzone - use data ', $stateParams.data);

			AlbumManagerServ.reset();

			data = JSON.parse($stateParams.data);

			log.info('data', data);

			AlbumManagerServ.setIdTheme(data.theme);
			AlbumManagerServ.setIdSubtheme(data.subtheme);
			AlbumManagerServ.setIdGenre(data.genre);
			AlbumManagerServ.setTitle(data.title);
			AlbumManagerServ.setTags(data.tags);
			AlbumManagerServ.setNetworks(data.networks);

			log.info('Load media from UploadMediaServ in AlbumManagerServ');
			log.info('Media upload count', UploadMediaServ.getQueueReference().length);

			_.forEach(UploadMediaServ.getQueueReference(), function (media) {
				AlbumManagerServ.addMedia(media);
			});

			load();

		} else {
			log.info('am.contentzone - use AlbummanagerServ as it is', $stateParams.data);

			_.forEach(AlbumManagerServ.getListReference(), function (media) {
				mediaList.push(media);
			});

		}

		mediaList.push({'IamTheFooter': true});

		function load() {
			AlbumManagerServ.load()
				.then(function () {
					log.info('load successful');
				},
				function () {
					log.info('load failed');
				},
				function () {
					MiscServ.showLoading();
				})
				.finally(function () {
					MiscServ.hideLoading();
				});
		}

		var viewportWidth = $(window).width();

		var width = Math.floor(viewportWidth / 3);

		$scope.getItemWidth = function (media) {

			if ( ! media.uri) {
				return viewportWidth;
			}

			return width;
		};

		$scope.getItemHeight = function (media) {

			if ( ! media.uri) {
				return 140;
			}

			return width;
		};

		$scope.clearAll = function () {
			// Show the action sheet
			$ionicActionSheet.show({
				buttons: [
					{ text: gettextCatalog.getString('Remover todas as mídias') },
				],
				cancelText: gettextCatalog.getString('Cancelar'),
				cancel: function() {

				},
				buttonClicked: function() {
					AlbumManagerServ.clearAll();
					return true;
				}
			});
		};

		$scope.goToContentZone = function () {

			var network = getRandomIntegratedNetwork();

			$scope.goTo('main.albummanager.sourcezone', 'slide-left', {network: network});
		};

		var timer;

		$scope.scrolling = function () {

			if (timer) {
				return;
			}

			timer = $timeout(function () {
				timer = null;
			}, 100);

			var top = $ionicScrollDelegate.getScrollPosition().top;

			if (top > 100) {
				$scope.retract = true;
			} else {
				$scope.retract = false;
			}

		};

		$scope.save = function () {
			MiscServ.showLoading(gettextCatalog.getString('Salvando album...'));

			AlbumManagerServ.save().then(null, function () {
				$ionicModal.alert(gettextCatalog.getString('an error occured while saving'));
			}).finally(function () {
				MiscServ.hideLoading();
			});
		};

		$scope.removeMedia = function (media) {
			log.info(media);

			if ( ! media.id) {
				return;
			}

			AlbumManagerServ.removeMedia(media);
		};

		$scope.mediaListProcess =  function (fileDataList) {

			var invalid = false;

			_.forEach(fileDataList, function (fileData) {
				if (fileData.status === 'INVALID') {
					invalid = true;
				}
			});

			if (invalid) {
				MiscServ.alert('Algumas mídias são maiores que o permitido ou de tipo inválido, e não serão adicionadas.');
			}

		};

		$scope.chooseMedias = function () {
			UploadMediaServ.chooseMedias().then(function (fileDataList) {
				$scope.mediaListProcess(fileDataList);
			});
		};

		$scope.handleFiles = function (files) {
			UploadMediaServ.addMedias(files).then(function (fileDataList) {
				$scope.mediaListProcess(fileDataList);
			});
		};

		$scope.makeIt = function() {
			log.info("makeIt()");

			if (AlbumManagerServ.hasGenre()) {

				// flag to tell the waiting step to go ahead.
				StorageServ.set('do_video_allowed', true, 'memory');

				$scope.goTo('main.waiting', null, {source: 'albummanager'});
			} else {

				// scenario when the user get in the AM directly without going through the moviemaker

				if (UploadMediaServ.isWorking()) {
					MiscServ.alert('Please wait the upload to finish to proceed');
					return;
				}

				var title = window.prompt('Please choose a title.');

				if ( ! title.trim()) {
					return;
				}

				MoviemakerServ.setTitle(title);

				MiscServ.showLoading();

				AlbumManagerServ.save()
					.then(
						function () {
							$scope.goTo('main.moviemaker.genre', null, {idalbum: AlbumManagerServ.getIdAlbum()});
						},
						function () {
							alert('error while saving');
						}
					).finally(
						function () {
							MiscServ.hideLoading();
						}
					);
			}
		};

		function getRandomIntegratedNetwork() {

			log.debug(SessionServ.getNetworks());

			var list = [];

			 _.forEach(SessionServ.getNetworks(), function (integrated, network) {
				if (integrated) {
					list.push(network);
				}
			});

			log.debug(list);

			var arr = _.map(list, function (v) {
				return v;
			});

			log.debug(arr);

			return arr.shift();
		}

	})
;
