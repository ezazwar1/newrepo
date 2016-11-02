angular.module('fun.services')
	.factory('MoviemakerServ', function (CoolServ, LogServ, Utils, ConfigServ, SessionServ, UploadMediaServ) {

		var log = LogServ;

		log.debug("AlbumManagerServ()");

		var data, miniTemplateActive = false;

		function initData() {

			log.debug('AlbumManager.initData()');

			data = {
				selectedNetworks: {},
				integratedNetworks: SessionServ.getNetworks(),
				title: '',
				subtheme: null,
				theme: null,
				genre: null,
				idalbum: null
			};
		}

		initData();

		return {
			getDataReference: function () {
				return data;
			},
			getGenre: function () {
				return data.genre;
			},
			setTitle: function (title) {
				data.title = title;
			},
			hasAlbum: function () {
				return !! data.idalbum;
			},
			getIdAlbum: function () {
				return data.idalbum;
			},
			reset: function () {
				log.info('AlbumManagerServ.reset()');

				initData();
			},
			hasSnSelected: function () {

				var hasSnEnabled = false;

				angular.forEach(data.selectedNetworks, function (sn) {
					if (sn) {
						hasSnEnabled = true;
					}
				});

				return hasSnEnabled;
			},
			addSelectedNetwork: function (network) {

				if ( ! data.integratedNetworks[network]) {
					throw new Error('Can not add a selected network that is not integrated');
				}

				data.selectedNetworks[network] = true;
			},
			removeSelectedNetwork: function (network) {
				data.selectedNetworks[network] = false;
			},
			addIntegratedNetwork: function (network) {
				data.integratedNetworks[network] = true;
			},
			getPreparedParams: function () {
				var params = {};

				params.genre    = data.genre ? data.genre.idgenre : 1;
				params.theme    = data.theme ? data.theme.idtheme : 7;
				params.subtheme = data.subtheme ? data.subtheme.idsubtheme : 40;
				params.title      = data.title;
				params.tags       = data.tags;
				params.networks   = [];
				params.albums    = [];

				if (data.idalbum) {
					params.albums.push(data.idalbum);
				}

				angular.forEach(data.selectedNetworks, function (val, sn) {
					if (val) {
						params.networks.push(sn);
					}
				});

				if (UploadMediaServ.getCount('UPLOADED') > 0 ) {
					params.albums.push(UploadMediaServ.getIdAlbum());
					params.networks.push('sf_upload');
				}

				if (sfLocal.debug) {
					params.duration = 10;
				}

				return params;
			},
			isMiniTemplateActive: function () {
				return miniTemplateActive;
			},
			setMiniTemplateActive: function (active) {
				log.info("setMiniTemplateActive", active);
				miniTemplateActive = active;
			}
		};
	})
;
