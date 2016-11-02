(function () {

angular.module('fun.controllers')
	.controller('ProfileController', function ($scope, LogServ, UserServ, SessionServ, $state, $timeout, $ionicScrollDelegate,
											$ionicGesture) {
		var log = LogServ;

		log.info('ProfileController()');

		$scope.user = SessionServ.getUser();

		$scope.profile = function profile() {
			$state.go('main.home.profile.movie', {username: SessionServ.getUser().username});
		};

		$ionicGesture.on('swipeleft', function () {
			$scope.goTo('main.home.feed', 'slide-left');
		}, $('.page-profile'));

		$scope.editProfile = function () {
			$scope.goTo('main.home.settings.personal', 'slide-right');
		};
	})
	.controller('MovieProfileController', function ($scope, LogServ, UserServ, SessionServ, StorageServ,
													$ionicScrollDelegate, $timeout, MiscServ) {
		var log = LogServ;

		log.info('MovieProfileController');

		var bag = StorageServ.get('profile.movie', true);

		if ( ! bag) {
			bag = {movies: [], finished: false, offset: null};
		}

		$scope.bag = bag;

		$scope.loadMore = function () {
			log.debug('loadMore()');

			$scope.animationName = 'loadMoreAnim';

			UserServ.getMovies(SessionServ.getUser().username, bag.offset)
				.then(function (resp) {
					log.debug('getMovies()', resp.data);

					bag.finished = resp.data.length === 0;
					bag.offset = resp.offset;

					angular.forEach(resp.data, function (movie) {
						bag.movies.push(movie);
					});

					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
		};

		$scope.refresh = function () {
			log.debug('refresh()');

			$scope.animationName = 'pullToRefreshAnim';

			UserServ.getMovies(SessionServ.getUser().username).then(function (resp) {
				log.debug('getMovies()', resp.data);

				var filteredList = MiscServ.filterMovieList(bag.movies, resp.data);

				angular.forEach(filteredList, function (o) {
					bag.movies.unshift(o);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		$scope.$on("$destroy", function() {
			StorageServ.set('profile.movie', bag, 'memory');
		});

		$scope.$on('movie-deleted', function (e, movie) {

			for (var i = 0; i < bag.movies.length; i++) {
				if (bag.movies[i].idMovie === movie.idMovie) {
					bag.movies.splice(i, 1);
					break;
				}
			}
		});
	})
	.controller('LikeProfileController', function ($scope, LogServ, UserServ, SessionServ, StorageServ,
												$ionicScrollDelegate, $timeout, MiscServ) {
		var log = LogServ;

		log.info('LikeProfileController');

		var bag = StorageServ.get('profile.like', true);

		if ( ! bag) {
			bag = {movies: [], finished: false, offset: null};
		}

		$scope.bag = bag;

		$scope.loadMore = function () {
			log.debug('loadMore()');

			if (bag.finished) {
				return;
			}

			$scope.animationName = 'loadMoreAnim';

			UserServ.getLikes(SessionServ.getUser().username, bag.offset).then(function (resp) {
				log.debug('getMovies()', resp.data);

				bag.finished = resp.nextOffset === 0;
				bag.offset = resp.nextOffset;

				angular.forEach(resp.data, function (movie) {
					bag.movies.push(movie);
				});

				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.refresh = function () {
			log.debug('refresh()');

			$scope.animationName = 'pullToRefreshAnim';

			UserServ.getLikes(SessionServ.getUser().username).then(function (resp) {
				log.debug('getMovies()', resp.data);

				var filteredList = MiscServ.filterMovieList(bag.movies, resp.data);

				angular.forEach(filteredList, function (o) {
					bag.movies.unshift(o);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		$scope.$on("$destroy", function() {
			StorageServ.set('profile.like', bag, 'memory');
		});

		$scope.$on('movie-deleted', function (e, movie) {

			for (var i = 0; i < bag.movies.length; i++) {
				if (bag.movies[i].idMovie === movie.idMovie) {
					bag.movies.splice(i, 1);
					break;
				}
			}
		});

	})
	.controller('PendingProfileController', function ($scope, LogServ, UserServ, SessionServ, StorageServ,
													  $ionicScrollDelegate, $timeout, MiscServ) {
		var log = LogServ;

		log.info('PendingProfileController');

		var bag = StorageServ.get('profile.pending', true);

		if ( ! bag) {
			bag = {movies: [], finished: false, offset: null};
		}

		$scope.bag = bag;

		$scope.loadMore = function () {
			log.debug('loadMore()');

			$scope.animationName = 'loadMoreAnim';

			UserServ.getPending(SessionServ.getUser().username, bag.offset, 20).then(function (resp) {
				log.debug('getMovies()', resp.data);

				bag.finished = resp.offset === 0;
				bag.offset = resp.offset;

				angular.forEach(resp.data, function (movie) {
					bag.movies.push(movie);
				});

				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.refresh = function () {
			log.debug('refresh()');

			$scope.animationName = 'pullToRefreshAnim';

			UserServ.getPending(SessionServ.getUser().username).then(function (resp) {
				log.debug('getMovies()', resp.data);

				var filteredList = MiscServ.filterMovieList(bag.movies, resp.data);

				angular.forEach(filteredList, function (o) {
					bag.movies.unshift(o);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		$scope.$on("$destroy", function() {
			StorageServ.set('profile.pending', bag, 'memory');
		});

		$scope.$on('movie-deleted', function (e, movie) {

			for (var i = 0; i < bag.movies.length; i++) {
				if (bag.movies[i].idMovie === movie.idMovie) {
					bag.movies.splice(i, 1);
					break;
				}
			}
		});

	})
;

})();
