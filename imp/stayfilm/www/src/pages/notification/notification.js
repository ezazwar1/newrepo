angular.module('fun.controllers')
	.controller('NotificationController', function (
		$rootScope, $scope, NotificationServ, LogServ, StorageServ, $timeout
	) {
		var log = LogServ;

		log.info("NotificationController()");


		var bag = StorageServ.get('notification', true);

		if ( ! bag) {
			bag = {notifications: [], finished: false, offset: null, previousOffset: null};
		}

		$scope.bag = bag;

		$scope.loadMore = function loadMore () {
			log.debug('loadmore()', 'bag :', bag);

			$scope.animationName = 'bounceInUp';

			NotificationServ.getNotification(bag.offset).then(function (resp) {
				log.debug("getNotification", resp);

				if (bag.previousOffset === null) {
					bag.previousOffset = resp.previousOffset;
				}

				bag.offset = resp.offset;
				bag.finished = resp.offset === null || resp.offset === 0;

				angular.forEach(resp.data, function (notif) {
					bag.notifications.push(notif);
				});

				markAsRead(resp.data);

				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};


		$scope.refresh = function refresh() {

			$scope.animationName = 'fadeIn';

			NotificationServ.getNotification().then(function (resp) {
				log.debug("getNotification", resp);

				var ids = {};

				angular.forEach(bag.notifications, function (val) {
					ids[val.idNotification] = true;
				});

				angular.forEach(resp.data, function (notif) {

					if (ids[notif.idNotification]) {
						return;
					}

					bag.notifications.unshift(notif);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

//		$scope.$on("$destroy", function() {
//			StorageServ.set('notification', bag, null, true);
//		});

		function markAsRead() {

			NotificationServ.markAsRead().then(function () {
				$rootScope.updateNotifCount();
			});

		}

		markAsRead();
	})
;
