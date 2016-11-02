angular.module('fun.controllers')
	.controller('AlbummanagerController', function (
		$scope, LogServ, ModalServ, AlbumManagerServ, UploadMediaServ
	) {
		var log = LogServ;

		log.info('AlbummanagerController');

		$scope.zoomImg = function (fileData) {
			log.info("zoomImg: ", fileData);

			if ( ! fileData.uri) return;

			var options = {};

			options.fileData = fileData;

			var zoomModal = ModalServ.get('zoom');

			if (AlbumManagerServ.has(fileData)) {
				options.remove =  function () {
					AlbumManagerServ.removeMedia(fileData);
					fileData.inAM = false;
					zoomModal.hide();
				};

				options.uploadAgain = function () {
					UploadMediaServ.uploadFailed();
					zoomModal.hide();
				};
			} else {
				options.add =  function () {
					AlbumManagerServ.addMedia(fileData);
					fileData.inAM = true;
					zoomModal.hide();
				};
			}

			zoomModal.show(options);
		};
	})
;
