angular.module('fun.controllers')
	.controller('SourcezoneAlbummanagerController', function (
			$scope, LogServ, SessionServ, AlbumManagerServ, MediaServ, $rootScope, $stateParams,
			StorageServ, MiscServ, ConfigServ, SocialNetworkServ, $state
	) {
		var log = LogServ;

		log.info('SourcezoneAlbummanagerController');

		var availableNetworks = $scope.availableNetworks = ConfigServ.get('albummanager_networks');

		log.debug(availableNetworks);
		
		var integratedNetworks = SessionServ.getNetworks();
		$scope.integratedNetworks = integratedNetworks;

		//log.debug("integratedNetworks", integratedNetworks);

		if  ($stateParams.network && integratedNetworks[$stateParams.network]) {
			$scope.networkSelected = $stateParams.network;
		}

		$scope.selectNetwork = function (network) {

			if (integratedNetworks[network]) {
				$scope.goTo('main.albummanager.sourcezone', null, {network: network}, {reload: true});
				return;
			}

			// network not integrated
			MiscServ.toggleNetwork(network)
				.then(
					function () {
						console.log('success');

						SessionServ.addSn(network);

						_.forEach($scope.networkList, function (obj) {
							if (obj.id === network) {
								obj.integrated = true;
							}
						});

						SocialNetworkServ.startSocialJob(network);

						$state.go('main.albummanager.sourcezone', {network: network}, {reload: true});
					},
					function () {
						console.log('failure');
					}
				)
			;
		};

		$scope.refresh = function (network) {
			StorageServ.remove('sourcezone.albums.' + network, true);
			$scope.goTo('main.albummanager.sourcezone', null, {network: network}, {reload: true});
			return;
		};

		$scope.albumList = [];

		if ($scope.networkSelected) {

			if (StorageServ.has('sourcezone.albums.' + $scope.networkSelected, true)) {
				$scope.albumList = StorageServ.get('sourcezone.albums.' + $scope.networkSelected, true);

				updateCount();
				$scope.albumLoaded = true;
			} else {

				MiscServ.showLoading();

				AlbumManagerServ.getNetworkAlbums($scope.networkSelected).then(function (resp) {
					log.debug("getNetworkAlbums()", resp.data);

					var albums = resp.data;

					angular.forEach(albums, function (album) {

						if (album.mediaCount === 0) {
							return;
						}

						$scope.albumList.push({
							idAlbum: album.idAlbum,
							name: album.name,
							mediaCount: album.mediaCount,
							cover: album.cover || "images/placeholder-album.png"
						});
					});

					$scope.albumList.push({iAmTheRefreshButton: true});

					updateCount();

					StorageServ.set('sourcezone.albums.' + $scope.networkSelected, $scope.albumList, 'memory');

					$scope.albumLoaded = true;

				}).finally(function () {
					MiscServ.hideLoading();
				});
			}
		} // else do not load album

		$scope.showAlbum = function (idalbum) {
			log.debug("showAlbum(" + idalbum + ")");

			$rootScope.goTo('main.albummanager.album', 'slide-left', {idalbum: idalbum, network: $scope.networkSelected});
		};

		function updateCount() {

			_.find($scope.albumList, function (album) {
				album.selectedMediaCount = 0;
			});

			_.forEach(AlbumManagerServ.getListReference(), function (fileData) {

				_.find($scope.albumList, function (album) {
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

	})
;
