angular.module('fun.controllers')
	.controller('EditSynopsisController', function (
		$scope, LogServ, MiscServ, MovieServ, gettextCatalog, $ionicPlatform, FeedServ
	) {
		var log = LogServ;

		log.info('EditSynopsisController');

		var movie = $scope.data.movie;

		log.info('movie: ', movie);

		var idmovie = movie.idMovie;

		// for android back button
		var deregisterFunc = $ionicPlatform.registerBackButtonAction(function () {

			log.debug('EditSynopsisController - back button callback');

			$scope.modal.hide();
			deregisterFunc();
		}, 311);
		
		$scope.editSynopsisData = {
			synopsis: movie.synopsis
		};

		$scope.close = function () {
			log.debug("CLOSE MODAL!");
			$scope.modal.hide();
		};
		
		$scope.editSynopsis = function () {
			log.debug("editSynopsis()", $scope.editSynopsisData);

			MiscServ.showLoading();

			var newSynopsis = $scope.editSynopsisData.synopsis;

			MovieServ.editSynopsis(idmovie, newSynopsis)
				.then(function success (data) {
					log.debug("editSynopsis SUCCESS", data);

					MiscServ.hideLoading();
					$scope.modal.hide();

					var feedMovie = FeedServ.getMovieFromFeed(movie.idMovie);

					MiscServ.showQuickMessage(gettextCatalog.getString("Descrição alterada"));

					movie.synopsis = newSynopsis;
					feedMovie.synopsis = newSynopsis;

				}, function fail ( error ) {
					log.error("editSynopsis FAIL", error);

					MiscServ.hideLoading();
					$scope.modal.hide();

					MiscServ.showQuickMessage(gettextCatalog.getString("Não foi possível salvar a descrição. Tente novamente mais tarde."));

				})
			;
		};
	})
;
