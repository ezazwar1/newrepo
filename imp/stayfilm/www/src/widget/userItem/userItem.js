angular.module('fun')
	.directive('sfUserItem', function () {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'src/widget/userItem/userItem.html',
			scope: {
				user: "=user"
			},
			controller: function ($scope, UserServ, SessionServ) {

				$scope.discardFriendship = function (user) {

					if ($scope.working) {
						return;
					}

					$scope.working = true;

					UserServ.discardFriendship(SessionServ.getUser().username, user.idUser)
						.then(function () {

							user.friendshipStatus = 'NO_RELATIONSHIP';
						})
						.finally(function () {
							$scope.working = false;
						})
					;
				};

				$scope.rejectFriendship = function (user) {

					if ($scope.working) {
						return;
					}

					$scope.working = true;

					UserServ.rejectFriendship(SessionServ.getUser().username, user.idUser)
						.then(function () {

							user.friendshipStatus = 'NO_RELATIONSHIP';
						})
						.finally(function () {
							$scope.working = false;
						})
					;
				};

				$scope.acceptFriendship = function (user) {

					if ($scope.working) {
						return;
					}

					$scope.working = true;

					UserServ.acceptFriendship(SessionServ.getUser().username, user.idUser)
						.then(function () {
							user.friendshipStatus = 'FRIENDS';
						})
						.finally(function () {
							$scope.working = false;
						})
					;
				};

				$scope.requestFriendship = function (user) {

					if ($scope.working) {
						return;
					}

					$scope.working = true;

					UserServ.requestFriendship(SessionServ.getUser().username, user.idUser)
						.then(function () {
							// WATCH OUT! 
							// The inverted statuses are CORRECT, because the session user is the reference.
							// DO NOT INVERT until is really needed
							user.friendshipStatus = 'REQUEST_RECEIVED';
						})
						.finally(function () {
							$scope.working = false;
						})
					;
				};

			}
		};
	})
;
