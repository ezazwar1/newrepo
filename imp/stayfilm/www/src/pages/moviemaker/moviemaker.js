angular.module('fun.controllers')
	.controller('MoviemakerController', function($scope, UploadMediaServ, MiscServ, gettextCatalog) {

		$scope.mediaListProcess =  function (fileDataList) {

			var invalid = false;

			_.forEach(fileDataList, function (fileData) {
				if (fileData.status === 'INVALID') {
					invalid = true;
				}
			});

			if (invalid) {
				MiscServ.alert(gettextCatalog.getString('Algumas mídias são maiores que o permitido ou de tipo inválido, e não serão adicionadas.'));
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

	})
;
