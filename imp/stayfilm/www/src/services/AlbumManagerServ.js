angular.module('fun.services')
	.factory('AlbumManagerServ', function (CoolServ, LogServ, Utils, ConfigServ, UploadMediaServ, SessionServ,
										MiscServ, $timeout, MediaServ, $q, FacebookServ) {

		var log = LogServ;

		log.debug("AlbumManagerServ()");

		var
			medias = [],
			mediaMaps = {},
			title,
			tags,
			idtheme,
			idgenre,
			networks,
			album,
			idsubtheme,
			eventRef,
			subscribers =  {},
			pristine = true,
			lastId = 0,
			data = {}// container for genre, theme, title
		;

		function getMediaIds () {
			log.info('AlbumManagerServ.getMediaIds()');

			var mediaIds =  _.map(medias, function (media) {
				return media.idMidia;
			});

			log.info('mediaIds', mediaIds);

			return mediaIds;
		}

		function save() {
			log.info('AlbumManagerServ.save()');

			var mediaIds = getMediaIds();

			log.debug(mediaIds);

			var deferred = $q.defer();

			if (mediaIds.length === 0) {

				$timeout(function () {
					deferred.reject();
				}, 0);
			} else {

				var params = {
					idmedias:   getMediaIds(),
					title:      title,
					hints:      tags,
					idtheme:    idtheme,
					idsubtheme: idsubtheme
				};

				if ( ! album) {
					CoolServ.post('user/' + SessionServ.getUsername() + '/album', params)
						.then(function (resp) {
							album = resp.data.album;
							deferred.resolve(album);

						}, function () {
							deferred.reject();
						});
				} else {
					return CoolServ.put('user/' + SessionServ.getUsername() + '/album/' + album.idAlbum, params)
						.then(function (resp) {
							log.info('album saved');
							album = resp.data.album;

							deferred.resolve(album);
						}, function () {
							deferred.reject();
						});
				}
			}

			return deferred.promise;
		}

		return {
			fire: function (eventNameFired, params) {
				log.debug('AlbumManagerServ.fire() : ' + eventNameFired);

				if (subscribers[eventNameFired]) {

					angular.forEach(subscribers[eventNameFired], function (o) {
						o.callback.call(o.context, params);
					});
				}
			},
			getSubscribers: function () {
				return subscribers;
			},
			addSubscriber: function (eventName , callback, context) {
				log.debug('AlbumManagerServ.addSubscriber', eventName);

				var parts =  eventName.split('.');

				var eventType = parts[0];

				var ns = parts.length > 1 ? parts[1] : null;

				if ( ! subscribers[eventType]) {
					subscribers[eventType] = [];
				}

				var handler = {context: context, callback: callback, ns: ns};

				subscribers[eventType].push(handler);

				return handler;
			},
			removeSubscriber: function (eventName, handler) {
				log.debug('AlbumManagerServ.removeSubscriber', eventName,  handler);

				var parts =  eventName.split('.');

				var eventTypeSearch = parts[0];
				var nsSearch = parts.length > 1 ? parts[1] : null;

				var  finalRemovedHandlers = [];

				_.forEach(subscribers, function (handlers, eventType) {

					var removedHandlers;

					if ( ! eventTypeSearch || eventTypeSearch === eventType)

						removedHandlers = _.remove(handlers, function(curHandler) {

							if (nsSearch) {
								return curHandler.ns === nsSearch;
							} else if (handler) {
								return curHandler === handler;
							} else {
								return true;
							}

						});

						finalRemovedHandlers.concat(removedHandlers);
					}
				);

				return finalRemovedHandlers;
			},
			getDataReference: function () {
				return data;
			},
			getListReference: function () {
				return medias;
			},
			setIdTheme: function (id) {
				idtheme	 = id;
			},
			setIdSubtheme: function (id) {
				idsubtheme	 = id;
			},
			setIdGenre: function (id) {
				idgenre	 = id;
			},
			setGenre: function (genre) {
				data.genre = genre;
			},
			setTags: function (t) {
				tags = t;
			},
			setTitle: function (str) {
				title = str;
			},
			setNetworks: function (list) {
				networks = list;
			},
			getIdAlbum: function () {
				return album && album.idAlbum;
			},
			hasGenre: function () {
				return !! idgenre;
			},
			getGenre: function () {
				return data.genre;
			},
			getNetworkAlbums: function (network, nextoffset) {
				var limit = 20;

				var params = {network: network,
							limit: limit};

				if (nextoffset) {
					params.offset = nextoffset;
				}

				//console.log(nextoffset);

				return CoolServ.get('user/' + SessionServ.getUsername() + '/album', params);
			},
			mediaCount: function () {
				return medias.length;
			},
			has: function (needle) {

				if (needle.id) {
					return !! _.find(medias, function (media) {
						return media.id === needle.id;
					});
				} else {
					return !! _.find(medias, function (media) {
						return media.idMidia === needle.idMidia;
					});
				}
			},
			addMedia: function (fileData, atTheBeginning) {
				log.debug('AlbumManagerServ.addMedia()', fileData);

				if (fileData.idMidia && this.has(fileData)) {
					return;
				}

				fileData.id = ++lastId;

				if (atTheBeginning) {
					medias.unshift(fileData);
				} else {
					medias.push(fileData);
				}

				mediaMaps[medias.idMidia] = fileData;

				this.fire('media-added', fileData);
			},
			getPreparedParams: function () {
				log.debug('AlbumManagerServ.getPreparedParams()');

				var params = {};

				params.genre    = idgenre? idgenre : 1;
				params.theme    = idtheme ? idtheme : 7;
				params.subtheme = idsubtheme ? idsubtheme : 40;
				params.title      = title;
				params.tags       = tags;
				params.networks   = networks;
				params.albums    = album && album.idAlbum;

				return params;
			},
			getPreparedParamsForMovie: function () {
				log.debug('AlbumManagerServ.getPreparedParamsForMovie()');

				var params = {};

				params.genre    = (data.genre && data.genre.idgenre) || idgenre || 1;
				params.theme    = idtheme || 7;
				params.subtheme = idsubtheme || 40;
				params.title    = data.title || title || 'no title';
				params.albums   = album && album.idAlbum;

				return params;
			},
			getPreparedParamsFB: function () {
				log.debug('AlbumManagerServ.getPreparedParamsFB()');

				var params = {};

				params.genre    = (data.genre && data.genre.idgenre) || idgenre || 1;
				params.theme    = idtheme || 7;
				params.subtheme = idsubtheme || 40;
				params.title    = data.title || title || 'no title';
				params.medias   = _.clone(medias);
				params.slug     = 'fbmessenger';
				return params;
			},
			removeMedia: function (fileData) {
				log.debug('AlbumManagerServ.removeMedia()', fileData);

				var removedMedias;

				if (fileData.id) {

					removedMedias = _.remove(medias, function (el) {
						return el.id === fileData.id;
					});

				} else {

					removedMedias = _.remove(medias, function (el) {
						return el.idMidia === fileData.idMidia;
					});

				}

				delete mediaMaps[fileData.idMidia];

				var removedMedia;

				if (removedMedias.length) {
					this.fire('media-removed', removedMedias[0]);

					removedMedia =  removedMedias[0];

					if (removedMedia.status !== 'SN') {
						UploadMediaServ.remove(removedMedia.uri);
					}
				}
			},
			normalizeMediaModel: function (media) {

				var fileData = {
					idMidia: media.idMidia,
					model: media,
					idAlbum: media.idAlbum,
					type: media.type,
					uri: media.source,
					thumbnail: media.thumbnail ? media.thumbnail : (media.type === 'video' ? 'images/placeholder-video.svg' : media.source),
					status: 'SN'
				};

				return fileData;
			},
			normalizeFbPhoto: function (fbPhoto, idalbum) {

				var fileData = {
					idMidia:  'tmp_fb_' + fbPhoto.id,
					fbphoto: fbPhoto,
					width: fbPhoto.width,
					height: fbPhoto.height,
					idAlbum: idalbum,
					type: 'photo',
					uri: fbPhoto.source,
					thumbnail: FacebookServ.getThumbnail(fbPhoto.images),
					status: 'SN'
				};

				return fileData;
			},
			setAlbum: function (alb) {
				album = alb;
			},
			clearAll: function () {
				log.debug('AlbumManagerServ.clearAll()');
				var self = this;

				var mediaListClone = [];

				_.forEach(medias, function (fileData) {
					mediaListClone.push(fileData);
				});

				_.forEach(mediaListClone, function (fileData) {
					self.removeMedia(fileData);
				});
			},
			load: function () {
				log.info('AlbumManagerServ.load()');

				var self = this;

				var deferred = $q.defer();

				if (album || (networks && networks.length)) {

					log.debug('album or networks, call to MediaResource');

					$timeout(function () {
						deferred.notify();
					}, 0);

					var params = this.getPreparedParams();

					MediaServ.getMedias(SessionServ.getUsername(), params)
						.then(function (resp) {
							console.log(resp);

							_.forEach(resp.data, function (media) {

								var fileData = self.normalizeMediaModel(media);

								self.addMedia(fileData);
							});

							deferred.resolve();

						}, function (err) {
							deferred.reject(err);
						});
				} else {

					log.debug('No album or networks, do not call webservices');

					$timeout(function () {
						deferred.resolve();
					}, 0);
				}

				return deferred.promise;
			},
			listenToUploadMediaServ: function () {

				if (eventRef) {
					return;
				}

				log.info('AlbumManagerServ.listenToUploadMediaServ()');

				var self = this;

				eventRef = UploadMediaServ.addSubscriber('media-added', function (fileData) {
					self.addMedia(fileData, true);
				});
			},
			removeListeners: function () {
				UploadMediaServ.removeSubscriber(eventRef);
				eventRef = null;
			},
			reset: function () {
				log.info('AlbumManagerServ.reset()');
				data = {};
				pristine = true;
				medias = [];
				mediaMaps = {};
				title = '';
				tags = [];
				idtheme = null;
				album = null;
				idsubtheme = null;
			},
			uploadDone: angular.noop,
			save: function () {
				return save();
			}
		};
	})
;
