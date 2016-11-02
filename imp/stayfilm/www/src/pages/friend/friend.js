angular.module('fun.controllers')
	.controller('FriendController', function ($timeout, friend, $scope, LogServ, UserServ, SessionServ, $state, $stateParams, StorageServ) {
		var log = LogServ;

		log.info('FriendController()');

		$scope.backButtonState = $scope.prevState ? $scope.prevState : 'main.home.feed';
		$scope.stateParams = $stateParams;

		StorageServ.remove('friend.movie', true);
		StorageServ.remove('friend.mate', true);
		StorageServ.remove('friend.like', true);

		$scope.user = friend;

		$scope.discardFriendship = function (user) {

			if ($scope.working) {
				return;
			}

			$scope.working = 'discarding';

			$timeout(function () {
				$scope.working = false;
				friend.friendshipStatus = 'NO_RELATIONSHIP';
			}, 2000);

			UserServ.discardFriendship(SessionServ.getUser().username, user.idUser)
				.then(function () {
					user.friendshipStatus = 'NO_RELATIONSHIP';
				}).finally(function () {
					$scope.working = false;
				});
		};

		$scope.acceptFriendship = function (user) {

			if ($scope.working) {
				return;
			}

			$scope.working = 'accepting';

			UserServ.acceptFriendship(SessionServ.getUser().username, user.idUser)
				.then(function () {
					user.friendshipStatus = 'FRIENDS';
				}).finally(function () {
					$scope.working = false;
				});
		};

		$scope.requestFriendship = function (user) {

			if ($scope.working) {
				return;
			}

			$scope.working = 'requesting';

//			$timeout(function () {
//				$scope.working = false;
//				friend.friendshipStatus = 'FRIENDS';
//			}, 2000);

			UserServ.requestFriendship(SessionServ.getUser().username, user.idUser)
				.then(function () {
					$scope.working = false;
					// WATCH OUT! 
					// The inverted statuses are CORRECT, because the session user is the reference.
					// DO NOT INVERT until is really needed
					user.friendshipStatus = 'REQUEST_RECEIVED';
				}).finally(function () {
					$scope.working = false;
				});
		};

		$scope.rejectFriendship = function (user) {

			if ($scope.working) {
				return;
			}

			$scope.working = 'rejecting';

			UserServ.rejectFriendship(SessionServ.getUser().username, user.idUser)
				.then(function () {
					user.friendshipStatus = 'NO_RELATIONSHIP';
				})
				.finally(function () {
					$scope.working = false;
				})
			;
		};

	})
	.controller('MovieFriendController', function ($scope, LogServ, UserServ, StorageServ, $timeout, MiscServ) {
		var log = LogServ;

		log.info('MovieFriendController()');

		var bag = StorageServ.get('friend.movie', true);

		if ( ! bag) {
			bag = {movies: [], finished: false, offset: null};
		}

		$scope.bag = bag;

		var user = $scope.user;

		$scope.loadMore = function () {

			log.debug('loadMore()', bag);

			$scope.animationName = 'loadMoreAnim';

			UserServ.getMovies(user.username, bag.offset).then(function (resp) {

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

			UserServ.getMovies(user.username).then(function (resp) {
				log.debug('getMovies()', resp.data);

				var filteredList = MiscServ.filterMovieList(bag.movies, resp.data);

				angular.forEach(filteredList, function (o) {
					bag.movies.unshift(o);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		$scope.$on("$destroy", function() {
			StorageServ.set('friend.movie', bag, 'memory');
		});

	})
	.controller('LikeFriendController', function ($scope, LogServ, UserServ, StorageServ, $timeout, MiscServ) {
		var log = LogServ;

		log.info('LikeFriendController()');

		var bag = StorageServ.get('friend.like', true);

		if ( ! bag) {
			bag = {movies: [], finished: false, offset: null};
		}

		$scope.bag = bag;

		var user = $scope.user;

		$scope.loadMore = function () {

			log.debug('loadMore()');

			UserServ.getLikes(user.username, bag.offset).then(function (resp) {
				log.debug('>>>>', resp.data);

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

			UserServ.getLikes(user.username).then(function (resp) {
				log.debug('getLikes()', resp.data);

				var filteredList = MiscServ.filterMovieList(bag.movies, resp.data);

				angular.forEach(filteredList, function (o) {
					bag.movies.unshift(o);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		$scope.$on("$destroy", function() {
			StorageServ.set('friend.like', bag, 'memory');
		});

	})
	.controller('MateFriendController', function ($scope, LogServ, UserServ, StorageServ) {

		var log = LogServ;

		log.debug('MateFriendController()');

		var bag = StorageServ.get('friend.mate', true);
		var user = $scope.user;

		if ( ! bag) {

			$scope.loading = true;

			bag = {friends: [], finished: false};

			UserServ.getFriends(user.username).then(function (list) {
				log.info('getFriends');
				$scope.loading = false;
				bag.friends = list;
				bag.finished = true;
			});
		}

		$scope.bag = bag;

		$scope.refresh = function () {
			log.debug('refresh()');

			UserServ.getFriends(user.username).then(function (list) {
				log.info('getFriends');
				bag.friends = list;
				bag.finished = true;
			});
		};

		$scope.$on("$destroy", function() {
			StorageServ.set('friend.mate', bag, 'memory');
		});

	})
;
