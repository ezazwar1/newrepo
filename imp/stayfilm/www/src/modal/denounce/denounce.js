angular.module('fun.controllers')
	.controller('DenounceController', function (
		$scope, LogServ, MiscServ, MovieServ, gettextCatalog, $ionicPlatform
	) {
		var log = LogServ;

		log.info('DenounceController');

		log.info('movie: ', $scope.data.movie);

		var idmovie = $scope.data.movie.idMovie;

		// for android back button
		var deregisterFunc = $ionicPlatform.registerBackButtonAction(function () {

			log.debug('DenounceController - back button callback');

			$scope.modal.hide();
			deregisterFunc();
		}, 311);
		
		$scope.denounceTitle = gettextCatalog.getString('Filme: {{movieTitle}} de {{username}}')
			.replace('{{movieTitle}}', '<strong>' + $scope.data.movie.title + '</strong>')
			.replace('{{username}}', '<strong>' + $scope.data.movie.user.fullName + '</strong>')
		;

		$scope.denounceData = {
			reason: null,
			description: null
		};

		$scope.close = function () {
			log.debug("CLOSE MODAL!");
			$scope.modal.hide();
		};
		
		$scope.denounceMovie = function () {
			log.debug("denounceMovie()", $scope.denounceData);

			MiscServ.showLoading();

			var data = $scope.denounceData,
				reason = data.reason,
				description = data.description,
				validDenounce = reason && description
			;

			if ( ! validDenounce) {
				MiscServ.hideLoading();
				MiscServ.showQuickMessage(gettextCatalog.getString("Por favor, indique os detalhes da sua denúncia."));
				return;
			}

			MovieServ.denounceMovie(idmovie, reason, description)
				.then(function success (data) {
					log.debug("denounceMovie SUCCESS", data);

					MiscServ.hideLoading();
					$scope.modal.hide();

					MiscServ.showQuickMessage(gettextCatalog.getString("Filme denunciado."));

				}, function fail ( error ) {
					log.error("denounceMovie FAIL", error);

					MiscServ.hideLoading();
					$scope.modal.hide();

					MiscServ.showQuickMessage(gettextCatalog.getString("Não foi possível denunciar o filme. Tente novamente mais tarde."));

				})
			;
		};
	})
;
