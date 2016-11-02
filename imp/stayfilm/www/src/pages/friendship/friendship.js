angular.module('fun.controllers')
	.controller('FriendshipController', function ($scope, LogServ, UserServ, SessionServ, StorageServ, $q, $ionicGesture) {
		var log = LogServ;

		log.info('FriendshipController()');

		$scope.me = SessionServ.getUser();

		$ionicGesture.on('swiperight', function () {
			$scope.goTo('main.home.feed', 'slide-right');
		}, $('.page-friendship'));

	})
	.controller('MateFriendshipController', function ($rootScope, $scope, LogServ, $ionicGesture, StorageServ, $q, SessionServ, UserServ) {
		var log = LogServ;

		log.info('MateFriendshipController()');

		var me = SessionServ.getUser();
		var promise;

		$scope.friendLoading = false;

		$scope.bag = {finished: false};

		if ( ! StorageServ.has('friends', true)) {

			$scope.friendLoading = true;
			promise = UserServ.getFriends(SessionServ.getUser().username);
		} else {
			promise = $q.when(StorageServ.get('friends', true));
		}

		promise.then(function (list) {
			$scope.friendLoading = false;
			updateList(list);
		});

		$scope.friendCount = SessionServ.getUser().friendCount;

		function updateList(list) {
			log.debug('updateList()', list);

			me.friends = list.length;
			$scope.bag.friendCount = list.length;
			$scope.bag.friends = list;
			$scope.bag.finished = true;
			StorageServ.set('friends', list, 'memory');
		}

		$scope.refreshFriends = function () {

			log.debug('refreshFriends()');

			UserServ.getFriends(SessionServ.getUser().username).then(function (friends) {
				updateList(friends);
			}).finally(function () {
				log.debug('scroll.refreshComplete');
				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		//$ionicGesture.on('swiperight', function () {
		//	$scope.goTo('main.home.feed', 'slide-right');
		//}, $('.page-friendship'));
	})
	.controller('RequestFriendshipController', function ($scope, $rootScope, LogServ, UserServ, SessionServ, $ionicGesture, StorageServ, $q) {
		var log = LogServ;

		log.info('RequestFriendshipController()');

		var promise;

		$scope.bag = {finished: false};

		var me = SessionServ.getUser();

		$scope.requestLoading = false;

		if ( ! StorageServ.has('friendshipRequests', true)) {

			$scope.requestLoading = true;
			promise = UserServ.getFriendshipRequests(SessionServ.getUser().username);
		} else {
			promise = $q.when(StorageServ.get('friendshipRequests', true));
		}

		promise.then(function (requesters) {
			$scope.requestLoading = false;
			updateRequestList(requesters);
		});

		function updateRequestList(requesters) {
			$scope.bag.requestCount = requesters.length;
			$scope.bag.requesters = requesters;
			StorageServ.set('friendshipRequests', requesters, 'memory');
		}

		$scope.refreshRequests = function () {
			UserServ.getFriendshipRequests(SessionServ.getUser().username).then(function (requesters) {
				$scope.$broadcast('scroll.refreshComplete');

				me.countFriendshipRequests = requesters.length;

				updateRequestList(requesters);
			});
		};

		$scope.$on('friendship-request-removed', function (e, requester) {
			console.log(requester);
			/* global _ */
			$scope.bag.requesters = _.filter($scope.bag.requesters, function (req) {
				return req.idUser !== requester.idUser;
			});

		});

//		$ionicGesture.on('swiperight', function () {
//			$rootScope.goTo('main.home.feed', 'slide-right');
//		}, $('.scroll-content'));
	})
	.directive('sfFriendshipRequest', function () {
		return {
			restrict: 'E',
			templateUrl: 'src/pages/friendship/friendshipRequest.html',
			scope: {
				requester: "=requester"
			},
			controller: function ($scope, UserServ, SessionServ) {

//				var log = LogServ;

				$scope.flip = false;

				var me = SessionServ.getUser();

				$scope.accept = function (requester) {

					$scope.flip = true;

					UserServ.acceptFriendship(me.username, requester.idUser)
						.then(function () {

							if (angular.isNumber(me.countFriendshipRequests)) {
								me.countFriendshipRequests--;
								me.friends++;
							}

							$scope.$emit('friendship-request-removed', requester);
						});
				};

				$scope.reject = function (requester) {

					$scope.flip = true;

					UserServ.rejectFriendship(SessionServ.getUser().username, requester.idUser)
						.then(function () {
							if (angular.isNumber(me.countFriendshipRequests)) {
								me.countFriendshipRequests--;
							}
							
							$scope.$emit('friendship-request-removed', requester);
						});
				};
			}
		};
	})
;
