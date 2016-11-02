angular.module('fun.services')
	.factory('UploadMediaServ', function (
		$log, $http, $q, Utils, CoolServ, $timeout, 
		MiscServ, SessionServ, LogServ, ConfigServ, 
		$ionicActionSheet, gettextCatalog, GaServ
	) {

		// should be using $log
		var log = LogServ;

		var
			queue = [],
			subscribers =  {},
			currentUploadCount = 0,
			maxParallelUploadCount = 4, // late config fix ConfigServ.get('fun_parallel_upload_count'),
			prevQueue = [],
			idAlbum =  Utils.getUUID(),
			wsUpload = ConfigServ.getResourceUrl(SessionServ.getUsername() + '/media')
		;

		function computeFileSize ( imageURL, callback ) {
			log.info("computeFileSize()");

			if ( Utils.isCordovaApp() ) { // in device
				window.resolveLocalFileSystemURL(imageURL, function( fileEntry ) {
					fileEntry.file(function( fileObj ) {
						log.info(imageURL + " (" + fileObj.size + " bytes)");

						callback( fileObj.size );
					});
				});
			} else { // not in device
				callback( 10 );
			}
		}

		function allMediasUploaded () {
			log.info("allMediasUploaded () - Start imageanalyzer job");

			CoolServ
				.post("job", {
					jobtype: "imageanalyzer",
					idalbum: idAlbum
				})
				.then(function success (){
					log.info("Imageanalyzer > SUCCESS");
					
				}, function fail () {
					log.error("Imageanalyzer > FAIL");
				});
		}

		var globalDeferred = $q.defer();

		return {
			getQueueReference: function () {
				return queue;
			},
			getUploadInfo: function () {
				var info = {};

				info.uploadedCount = this.getCount("UPLOADED");
				info.failedCount   = this.getCount("FAIL");
				info.totalCount    = this.getCount();

				return info;
			},
			fire: function (eventNameFired, params) {
				log.info('UploadMediaServ.fire()', eventNameFired);

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
				log.info('UploadMediaServ.addSubscriber()', eventName);

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
				log.info('UploadMediaServ.removeSubscriber()', eventName,  handler);

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
			add: function (file, type) {
				log.info('add()', file);

				var self = this;
				var video;

				if (type === 'video') {
					video = true;
				} else if (type === 'image') {
					video = false;
				} else {
					// lets try to guess
					video = MiscServ.isVideo(file);
				}

				var fileData;

				var deferred = $q.defer();

				if (angular.isString(file)) {

					var uri = file;

					fileData = {
						idMidia: null,
						uri: uri,
						thumbnail: video ? 'images/placeholder-video.svg' : uri,
						status: 'PENDING',
						fileSize: 0,
						progressSize: 0,
						type: video ? 'video' : 'image',
						model: {}
					};


					var maxSize = video ? 
						ConfigServ.get('upload_video_max_size') || 10 * 1024 * 1024 :
						ConfigServ.get('upload_image_max_size') || 5 * 1024 * 1024;


					computeFileSize(uri, function (fileSize) {
						fileData.fileSize = fileSize;

						log.debug('fileSize', fileSize);

						if (fileData.fileSize > maxSize) {

							log.debug('file not valid', file);

							fileData.thumbnail = 'images/invalid.png';
							fileData.uri = 'images/invalid.png';
							fileData.status = 'INVALID';
						}

						if (fileData.status !== 'INVALID') {
							queue.push(fileData);

							self.fire("media-added", fileData);

							self.uploadQueue();
						}

						deferred.resolve(fileData);
					});

				} else {

					fileData = {
						idMidia: null,
						uri: window.URL.createObjectURL(file),
						thumbnail: window.URL.createObjectURL(file),
						status: 'PENDING',
						fileSize: file.size,
						progressSize: 0,
						file: file,
						type: null,
						model: {}
					};

					if ( ! MiscServ.isFileValidForUpload(file)) {

						log.debug('file not valid', file);

						fileData.thumbnail = 'images/invalid.png';
						fileData.uri = 'images/invalid.png';
						fileData.status = 'INVALID';
					}

					if (video) {
						log.debug('file is a video', file);

						fileData.thumbnail = 'images/placeholder-video.svg';
						fileData.type = 'video';

					} else {
						fileData.type = 'image';
					}

					if (fileData.status !== 'INVALID') {
						queue.push(fileData);

						this.fire("media-added", fileData);

						self.uploadQueue();
					}

					$timeout(function () {
						deferred.resolve(fileData);
					}, 100);

				}

				return deferred.promise;
			},
			getProgress: function () {
				var info = this.getUploadInfo();

				return Math.round((info.uploadedCount * 100 / info.totalCount)) || 0;
			},
			uploadFailed: function () {
				log.info('uploadFailed()', queue);
				
				angular.forEach(queue, function (fileData) {

					if (fileData.status === 'FAIL') {
						fileData.status = 'PENDING';
					}
				});

				this.uploadParallelQueue();
			},
			getCount: function (status) {

				var total = 0;

				angular.forEach(queue, function (fileData) {
					if (status) {
						if (fileData.status === status) {
							total++;
						} // else do not count
					} else {
						total++;
					}
				});

				return total;
			},
			getUploadedSize: function () {

				var total = 0;

				angular.forEach(queue, function (fileData) {

					if (fileData.status === 'UPLOADED') {
						total += fileData.fileSize;
					}
				});

				return total;
			},
			getNextPending: function () {

				for (var i = 0; i < queue.length; i++) {

					if (queue[i].status === 'PENDING') {
						return queue[i];
					}
				}

				return null;
			},
			hasPending: function () {
				return !! this.getNextPending();
			},
			hasUploading: function () {
				return !! this.getCount('UPLOADING');
			},
			isWorking: function () {
				return this.hasPending() || this.hasUploading();
			},
			reset: function () {

				log.info('UploadMediaServ.reset()');

				prevQueue = queue;
				queue = [];
				idAlbum = Utils.getUUID();
				globalDeferred = $q.defer();
			},
			clearTempFiles: function () {
				if (Utils.isIos() && window.imagePicker && window.imagePicker.clearTempFiles) {
					window.imagePicker.clearTempFiles();
				}
			},
			remove: function (uri) {

				log.debug('UploadMediaServ.remove()', uri);

				var deferred  = $q.defer();

				var removedMedias = _.remove(queue, function (el) {
					return el.uri === uri;
				});

				if (removedMedias.length) {

					var fileData = removedMedias[0];

					log.debug('image to remove found', fileData);

					if (fileData.status === 'UPLOADING') {
						log.debug('image is uploading, aborting upload');
						$timeout(function () {
							fileData.ft.abort();
							deferred.resolve();
						}, 0);

					} else if (fileData.status === 'UPLOADED') {
						log.debug('image is upoaded, deleting media on server');

						CoolServ.delete('media/' + fileData.idMidia)
							.then(function () {
								log.info('Media ' +  fileData.idMidia + " deleted");

								deferred.resolve();

							}, function error() {
								log.info("error deleteing media " +  fileData.idMidia);

								deferred.reject();
							});

					} else {

						log.debug('no image to remove found');

						$timeout(function () {
							deferred.resolve();
						}, 0);
					}

				} else {
					$timeout(function () {
						deferred.resolve();
					}, 0);
				}

				return deferred.promise;
			},
			uploadParallelQueue: function() {
				while (currentUploadCount < maxParallelUploadCount && this.hasPending()) {
					this.uploadQueue();
				}
			},
			addMedias: function (list, type) {
				var self = this;

				var deferred = $q.defer();

				var promises = [];

				for (var i = 0; i < list.length; i++) {
					log.info('Image URI: ', list[i]);

					(function (mix) {

						var promise = self.add(mix, type);

						promises.push(promise);

					})(list[i]);

				}

				$q.all(promises).then(function (arr) {
					deferred.resolve(arr);
				});

				log.info("ImagePicker: "+list.length+" MEDIAS CHOSEN");

				return deferred.promise;
			},
			chooseMedias: function () {
				log.info("chooseMedias()");

				var self = this;

				var deferred = $q.defer();

				if (Utils.isCordovaApp()) { // in device

					// Show the action sheet
					$ionicActionSheet.show({
						buttons: [
							{ text: gettextCatalog.getString("Fotos desse dispositivo") },
							{ text: gettextCatalog.getString("Vídeo desse dispositivo") },
							{ text: gettextCatalog.getString("Tirar uma foto") }
						],
						cancelText: gettextCatalog.getString('Cancelar'),
						buttonClicked: function(index) {

							var options;

							if (index === 0) { // Fotos desse dispositivo

								window.imagePicker.getPictures(
									function(list) {
									
										self.addMedias(list, 'image').then(function (medias) {
											deferred.resolve(medias);
										});

									}, function (error) {
										log.info('Error: ' + error);
										log.info('get picture failed');
										log.info("phoneGallery OPEN");

										deferred.reject();

										// $scope.$apply(); // apply changes for mobile
										//$timeout(function(){$scope.$apply();}, 500); // apply changes for mobile

									}, {
										maximumImagesCount: 30,
										width: 1280,
										height: 720,
										enableVideo: false
									}
								);

							} else {


								if (index === 1) { // Video desse dispositivo
									options = {
										destinationType: Camera.DestinationType.FILE_URI,
										mediaType: Camera.MediaType.VIDEO,
										sourceType: Camera.PictureSourceType.PHOTOLIBRARY
									};
								} else if (index === 2) { // Tirar uma foto
									options = {
										destinationType: Camera.DestinationType.FILE_URI,
										mediaType: Camera.MediaType.PICTURE,
										sourceType: Camera.PictureSourceType.CAMERA
									};
								} else {
									throw new Error("index invalid");
								}

								navigator.camera.getPicture(function (uri) {

									log.debug(uri);

									var fileType = (index == 1) ? 'video' : 'image';

									self.add(uri, fileType).then(function (fileData) {
										deferred.resolve([fileData]);
									});

								}, function (err) {
									log.debug(err);

									deferred.reject();
								}, options);
							}

							return true;
						}
					});

				} else { // not in device
					var fileElem = $("#btn-upload");
					fileElem.click();

					setTimeout(function () {
						deferred.resolve();
					}, 0);
				}

				GaServ.trackViewMap("Passo_2_adicionar-fotos-do-celular");

				return deferred.promise;
			},
			uploadQueue: function () {
				log.info('uploadQueue');

				log.info('currentUploadCount', currentUploadCount);

				var self = this;

				if (currentUploadCount >= maxParallelUploadCount) {
					return;
				}

				if ( ! this.hasPending()) {
					log.info('no pending');
					return;
				}

				currentUploadCount++;

				var fileData = this.getNextPending();

				this.uploadMedia(fileData)
					.then(function success() {

						currentUploadCount--;

						self.uploadQueue();

						self.fire("media-uploaded", fileData);

						if ( ! self.isWorking() && (self.getCount('SUCCESS') > 0)) {
							allMediasUploaded();
						}

						globalDeferred.notify(fileData);

					}, function error(e) {
						currentUploadCount--;
						log.info('error uploading', e);
						self.uploadQueue();

						self.fire("media-uploaded", fileData);

						if ( ! self.isWorking() && (self.getCount('SUCCESS') > 0)) {
							allMediasUploaded();
						}

						globalDeferred.notify(fileData);
					}
				);
			},
			getIdAlbum: function () {
				return idAlbum;
			},
			uploadMedia: function (fileData) {
				log.info("UploadMediaServ.uploadMedia()");

				log.info('Media Upload Url', wsUpload);

				fileData.status = "UPLOADING";

				var deferred = $q.defer();

				if ( ! Utils.isCordovaApp()) { // in browser

					var xhr = new XMLHttpRequest();
					var fd = new FormData();

					log.info("idAlbum: " + idAlbum);

					if ( ! idAlbum ) {
						throw new Error('missing idalbum');
					}

//					MediaServ.upload(SessionServ.getUsername(), fileData.file, idAlbum)
//						.then(
//							function (resp) {
//
//								console.log(resp);
//
//								fileData.status = "UPLOADED";
//								fileData.idMidia = resp.data.idMidia;
//								fileData.model = resp.data;
//
//								deferred.resolve();
//							}
//					);

					fd.append('idalbum', idAlbum);

					xhr.open("POST", wsUpload, true);

					// todo : use CoolServ
					if (Utils.useHeader()) {
						xhr.setRequestHeader('idsession', SessionServ.getIdSession());
						xhr.setRequestHeader('useheader', 1);
					}

					xhr.onreadystatechange = function() {

						log.info("xhr.readyState: ", xhr.readyState);
						log.info("xhr.status: ", xhr.status);

						if (xhr.readyState === 4) {
							if (xhr.status === 201) {

								var response = JSON.parse(xhr.responseText);

								fileData.status = "UPLOADED";
								fileData.idMidia = response.data.idMidia;
								fileData.model = response.data;

								if (fileData.type === 'video') {

									if (response.data.thumbnail) {
										fileData.thumbnail = response.data.thumbnail;
									}

									fileData.uri = response.data.source;
								}

								deferred.resolve();
							} else {
								fileData.status = "FAIL";

								deferred.reject();
							}
						} // continue receiving chunks until completion
					};

					xhr.upload.addEventListener('progress', function(e){
						fileData.progressSize = e.loaded;
					}, false);

					fd.append('myFile', fileData.file);
					// Initiate a multipart/form-data upload
					xhr.send(fd);

				} else { // in device
					var options = new FileUploadOptions();
					options.fileKey = "Filedata.jpg";
					options.fileName = "Filedata.jpg";
					options.mimeType = "image/jpeg";
					options.chunkedMode = false;

					options.headers = {
						idsession: SessionServ.getIdSession(),
						useheader: 1
					};

					log.info("idAlbum: " + idAlbum);

					if ( ! idAlbum ) {
						throw new Error('missing idalbum');
					}

					options.params = {
						idalbum: idAlbum
					};

					var ft = new FileTransfer();

					ft.onprogress = function( progressEvent ) {
						//log.info('progressEvent', progressEvent);
						fileData.progressSize = progressEvent.loaded;

					};

					fileData.ft = ft.upload(fileData.uri, encodeURI(wsUpload), function success( resp ) {
						log.info("UploadMediaServ :: RESP", resp);
						log.info("typeof", typeof resp.response);
						log.info("response", resp.response);

						try { // prevent breaking on bad json response

							if (resp.response[0] !== "{") {
								resp.response = resp.response.substr(1);
							}

							var response = JSON.parse(resp.response);

							fileData.status = "UPLOADED";
							fileData.idMidia = response.data.idMidia;
							fileData.model = response.data;

							if (fileData.type === 'video') {

								if (response.data.thumbnail) {
									fileData.thumbnail = response.data.thumbnail;
								}
							}

							deferred.resolve();

						} catch ( error ) {
							log.info("UploadMediaServ :: Error in the Success Callback: ", error);

							fileData.status = "FAIL";

							var dump = {
								response: resp,
								error: error
							};

							deferred.reject( dump );
						}

					}, function fail(error) {
						log.info("UploadMediaServ :: Error: ", error);

						if ( error.code === FileTransferError.ABORT_ERR) {
							log.info('upload aborted ', error);
							fileData.status = "ABORTED";
							deferred.reject( error );
						} else {
							fileData.status = "FAIL";
							deferred.reject( error );
						}

					}, options, true);
				}

				return deferred.promise;
			}
		};
	})
;
