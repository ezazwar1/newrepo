angular.module('fun.controllers')
	.controller('LogModalController', function ($scope, LogServ, ModalServ, MiscServ) {
		$scope.logList = LogServ.getRef();

		$scope.getItemHeight = function(item, index) {
			//Make evenly indexed items be 10px taller, for the sake of example
			return (index % 2) === 0 ? 50 : 60;
		};

		$scope.showDetails = function (item) {
			var modal = ModalServ.get('info');
			modal.show(item);
		};

		$scope.showConfig = function () {
			$scope.modal.hide();
			MiscServ.goTo('admin.config');
		};

		$scope.showFun = function () {
			$scope.modal.hide();
			MiscServ.goTo('welcome.login');
		};

		$scope.showFbMessenger = function () {
			$scope.modal.hide();
			MiscServ.goTo('main.fbmessenger.titlestep');
		};
	})
	.factory('ProfileModal', function (CoolServ, $ionicModal, $rootScope, UserServ) {

		var scope;
		var isOpened = false;

		return {

			open: function (username) {

				if (isOpened) {
					return;
				}

				isOpened = true;

				this.scope = scope = $rootScope.$new();

				scope.ProfileModal = this;

				UserServ.get(username).then(function (resp) {

					scope.user = resp;

					$ionicModal.fromTemplateUrl('src/pages/profile/profileModal.html', {
						scope: scope,
						animation: 'slide-in-up'
					}).then(function(modal) {

						console.log('modal loaded');
						modal.show();

						scope.modal = modal;
					});
				});
			},
			close: function () {

				if (this.scope && this.scope.modal) {
					this.scope.modal.remove();
				}

				isOpened = false;
			}
		};
	})
;
