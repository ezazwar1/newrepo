angular.module('fun.controllers')
	.controller('WatchModalController', function (
		$scope, $stateParams, $log, SessionServ, $location, $state, MovieServ,
		MiscServ, LogServ, $ionicScrollDelegate, FeedServ, $timeout,
		$ionicActionSheet, gettextCatalog, RoutingServ, $ionicPlatform, ModalServ,
		Utils, $rootScope, UIServ, StorageServ, CoolServ
	) {
		var log = LogServ;

		log.debug('WatchModalController');
		log.debug("stateParams", $stateParams);

		log.debug("$scope.data", $scope.data);

		if ( ! $scope.data && $stateParams.idmovie) {
			var cachedMovie = MovieServ.getCached($stateParams.idmovie);

			if ( ! cachedMovie) {
				log.debug("Getting movie obj...");
				$rootScope.watchNow($stateParams.idmovie);
				return;
			}

			$scope.data = {
				movie: cachedMovie
			};
		}
		
		log.debug(" >>>> $scope.data", $scope.data);

		$scope.data.movie.title = $scope.data.movie.title || "";

		var movie = $scope.data.movie;
		$scope.movie = $scope.data.movie;

		$scope.isLogged = SessionServ.isLogged();

		if ($scope.isLogged) {
			$scope.userPhoto = SessionServ.getUser().photo;
		}

		log.debug("movie", movie);

		$scope.likingMovie = false;

		$scope.goToFriend = function (user) {
			$scope.modal.hide();

			$timeout(function () {
				MiscServ.goTo('main.home.friend.movie', null, {username: user.username});
			}, 500);
		};


		if (isModal()) {
			log.debug('registerCB');

			// for android back button
			var deregisterFunc = $ionicPlatform.registerBackButtonAction(function () {

				log.debug('WatchModalController - back button callback');

				$scope.modal.hide();
				deregisterFunc();
			}, 310);

			RoutingServ.registerCb(function (toState) {

				log.debug('callback', toState);

				$scope.modal.hide();

				return false;
			});

			$scope.$on('$destroy', function () {
				log.debug('deregister');
				RoutingServ.deregisterCb();
			});
		}

		$scope.denounce = function () {
			log.debug("denounce()");
			var modal = ModalServ.get('denounce');
			modal.show({movie: movie});
		};

		$scope.likeMovie = function () {
			log.debug("likeMovie()");

			$scope.likingMovie = true;

			log.info("should " + ($scope.movie.liked ? "DELETE" : "CREATE") + " like");

			MovieServ.like( $scope.movie ).then(function success () {
				log.debug("likeMovie SUCCESS");

				log.debug("movie liked is " + $scope.movie.liked);

				if ( $scope.movie.liked ) {
					$scope.movie.likeCount += 1;
					log.debug("++likeCount", $scope.movie.likeCount);
				} else {
					$scope.movie.likeCount -= 1;
					log.debug("--likeCount", $scope.movie.likeCount);
				}

				$scope.likingMovie = false;

			}, function fail ( error ) {
				log.debug("likeMovie FAIL", error);
				$scope.likingMovie = false;
			});
		};

		$scope.share = function () {
			if (movie.permission !== 3) {
				MiscServ.alert(gettextCatalog.getString('Desculpe, esse filme não pode ser compartilhado pois não é público.'));
				return;
			}

			// open share modal
			var modal = ModalServ.get('share');
			modal.show({movie: movie});
		};

		// comment system
		$scope.commentList = (function treatMobileComments(untreatedComments) {
			angular.forEach(untreatedComments, function (regularComment) {
				var clean = regularComment.comment.replace(/<[^>]+>/gm, '');
				regularComment.comment = clean;
			});

			var treatedComments = untreatedComments;

			return treatedComments;
		})(movie.comments);

		log.debug("commentList", $scope.commentList);

		$scope.showCommentInput = false;

		$scope.toggleCommentInput = function () {
			log.debug("toggleCommentInput");

			$scope.showCommentInput = true;

			$timeout(function () {
				var commentInput = $('.modal-watch .comment-input');
				commentInput.focus();
			}, 100);
		};

		$scope.comment = {};

		$scope.postComment = function (comment) {
			log.debug("send comment: " + comment);

			$scope.showCommentInput = false;

			if (!comment) {
				return;
			}

			$ionicScrollDelegate.$getByHandle('commentScroll').scrollBottom();

			$scope.comment.input = "";

			var user = SessionServ.getUser();

			var commentObj = {
				user: {fullName: user.fullName, photo: user.photo},
				comment: comment,
				idMovieCommentCore: null,
				status: "PENDING"
			};

			// include in visual list
			$scope.commentList.push(commentObj);

			MovieServ.postComment(movie.idMovie, comment).then(function success (data) {
				log.debug("postComment SUCCESS");

				commentObj.status = "OK";
				commentObj.idMovieCommentCore = data.idMovieCommentCore;
				$scope.movie.commentCount += 1;

			}, function fail ( error ) {
				log.error("postComment FAIL", error);

				commentObj.status = "FAIL";
			});
		};
		
		$scope.deleteComment = function(index, idcomment) {
			log.debug("Deleting comment " + idcomment + " in movie " + movie.idMovie);
			MovieServ.deleteComment(movie.idMovie, idcomment).then(function success () {
				log.debug("deleteComment SUCCESS");

				// delete from visual list
				$scope.commentList.splice(index, 1);

				$scope.movie.commentCount -= 1;

			}, function fail ( error ) {
				log.error("deleteComment FAIL", error);
			});
		};

		function isModal () {
			log.info("@)))> IS MODAL", !!$scope.modal.hide);
			return !!$scope.modal.hide;
		}

		$scope.closeModalOrBack = function () {
			log.debug("closeModalOrBack");
			if (isModal()) {
				log.debug("CLOSE MODAL!");
				$scope.modal.hide();
			} else {
				log.debug("GO TO FEED");
				$state.go('index');
			}
		};

		function slugify (str) {
			var slug;

			if (str) {
				slug = str.replace(/ /g,'-').replace(/[^a-zA-Z0-9\-]/g,'');
			} else {
				slug = "";
			}

			return slug
		}

		if (Utils.isCordovaApp()) {
			if (movie.idMovie) {
				var movieInfo = [slugify(movie.title),
								movie.idTemplate,
								movie.idGenre,
								movie.idTheme,
								movie.idMovie].join("_");

				console.log("Gaq tag watch!", movieInfo);

				window.analytics && window.analytics.trackView('MobileWatch_' + movieInfo);
			} else {
				console.log("Could not gaq tag watch");
			}
		}
		
		var user = SessionServ.getUser();
		
		$scope.canSaveToDevice = user && ((typeof window.downloadMovieToDevice === "function") && (movie.idUser === user.idUser));

		$scope.saveToDevice = function () {
			MovieServ.saveToDevice(movie);
		};

		function reportFailingWatch() {
			// $.get(Config.getUrl('ajax/reportFailingWatch'), {idmovie: idmovie, source: "report-fail-button"});
			CoolServ.customGET("ajax/reportFailingWatch", {idmovie: movie.idMovie, source: Utils.getPlatform() + "-report-fail-button"});
		}

		function editSynopsis() {
			log.debug("editSynopsis()");
			var modal = ModalServ.get('editSynopsis');
			modal.show({movie: movie});
		}

		function showConfig(isOwner) {
			if (isOwner) {
				var buttons = [
					{ text: gettextCatalog.getString('Apagar Filme') },
					{ text: gettextCatalog.getString('Editar Privacidade') },
					{ text: gettextCatalog.getString('Editar Descrição') },
					{ text: gettextCatalog.getString('Não consegue assistir?') }
				];

				// Show the action sheet
				$ionicActionSheet.show({
					buttons: buttons,
					cancelText: gettextCatalog.getString('Cancelar'),
					buttonClicked: function(index) {
						if (index === 0) { // Apagar
							// $timeout to fix actionsheet button click problem
							$timeout(function() {
								UIServ.discardMovie(movie).then(function(){
									$scope.modal.hide();
									FeedServ.removeMovieFromFeed(movie);
								});
							}, 500);
						}

						if (index === 1) { // Privacidade
							// $timeout to fix actionsheet button click problem
							$timeout(function() {
								UIServ.changeMoviePermission(movie);
							}, 500);
						}

						if (index === 2) { // Editar Descrição
							editSynopsis();
						}

						if (index === 3) { // Não consegue assistir?
							reportFailingWatch();
						}

						return true;
					}
				});

			} else {
				var buttons = [
					{ text: gettextCatalog.getString('Denunciar') },
					{ text: gettextCatalog.getString('Não consegue assistir?') }
				];

				// Show the action sheet
				$ionicActionSheet.show({
					buttons: buttons,
					cancelText: gettextCatalog.getString('Cancelar'),
					buttonClicked: function(index) {

						if (index === 0) { // Denunciar
							$scope.denounce();
						}

						if (index === 1) { // Não consegue assistir?
							reportFailingWatch();
						}

						return true;
					}
				});
			}
		}

		$scope.configMovie = function () {
			var isOwner = user && (movie.idUser === user.idUser);
			showConfig(isOwner)
		};
	})
;
