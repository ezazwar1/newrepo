angular.module('fun.services')
.factory('MaintenanceServ', function (CoolServ, $http, LogServ, $state, SessionServ, ConfigServ) {

	var log = LogServ;

	var messages;

	return {
		init: function () {

			var self = this;

			document.addEventListener('resume', function () {
				self.checkMaintenance();
			}, false);

			this.checkMaintenance();
		},
		checkMaintenance: function () {

			$http.get(ConfigServ.getMaintenanceUrl())
				.success(function(data) {
					log.debug(data);

					if (data && data.maintenance === 1) {
						CoolServ.setMaintenance(true);

						messages = data.messages;
						$state.go('welcome.maintenance', {});
					} else {
						CoolServ.setMaintenance(false);

						if ($state.current.name === 'welcome.maintenance') {
							$state.go('main.home.feed');
						}
					}
				})
				.error(function() {
					CoolServ.setMaintenance(false);

					if ($state.current.name === 'welcome.maintenance') {
						$state.go('main.home.feed');
					}
				})
			;
		},
		getMessage: function () {
			return messages[SessionServ.getLang()];
		}
	};
});
