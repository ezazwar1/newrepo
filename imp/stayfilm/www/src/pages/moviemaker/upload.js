angular.module('fun.controllers')
	.controller('UploadMoviemakerController', function (
		$scope, LogServ, UploadMediaServ, ModalServ, $timeout,
		Utils, MiscServ, gettextCatalog, $rootScope, $stateParams,
		$ionicActionSheet
	) {

		var log = LogServ;

		var source = $stateParams.source;

		log.info('UploadMoviemakerController');

		var viewportWidth = $(window).width();

		var width = Math.floor(viewportWidth / 3);

		$scope.mediaList = UploadMediaServ.getQueueReference();

		function showAndroidOptionsForVideo(data) {
			// <button ng-if="data.remove" ng-click="data.remove()" class="button button-clear button-light icon-left ion-trash-a"><span translate>Descartar</span></button>
			// <button ng-if="data.fileData.status === 'FAIL'" ng-click="data.uploadAgain()" class="button button-clear button-light icon-left ion-upload"><span translate>Tentar novamente</span></button>
			
			var buttons = [];

			buttons.push({ text: gettextCatalog.getString('Descartar') });

			if (data.status === 'FAIL') { // show try again
				buttons.push({ text: gettextCatalog.getString('Tentar novamente') });
			}

			// Show the action sheet
			$ionicActionSheet.show({
				buttons: buttons,
				cancelText: gettextCatalog.getString('Cancelar'),
				buttonClicked: function(index) {
					if (index === 0) { // Descartar
						// $timeout to fix actionsheet button click problem
						UploadMediaServ.remove(data.uri);
					}

					if (index === 1) { // Tentar novamente
						// $timeout to fix actionsheet button click problem
						UploadMediaServ.uploadFailed();
					}

					return true;
				}
			});
		}

		$scope.getItemSize = function () {
			return width;
		};

		$scope.zoomImg = function (fileData) {
			log.info("zoomImg: ", fileData);

			if (fileData.type === 'video' && Utils.isAndroid()) {
				// Android currently can't access local videos
				// MiscServ.showQuickMessage(gettextCatalog.getString('Visualização indisponível'), 1500);
				console.log("no zoom for android, only options");
				showAndroidOptionsForVideo(fileData);

				return;
			}

			var zoomModal = ModalServ.get('zoom');
			zoomModal.show({
				fileData: fileData,
				remove: function () {
					UploadMediaServ.remove(fileData.uri);
					zoomModal.hide();
				},
				uploadAgain: function () {
					UploadMediaServ.uploadFailed();
					zoomModal.hide();
				}
			});
		};

		$scope.closeUploadState = function () {
			if (source === 'fbmessenger') {
				$rootScope.goTo('main.fbmessenger.mediastep');
			} else {
				$rootScope.goTo('main.moviemaker.content');
			}
		};
	})
;
