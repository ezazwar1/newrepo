angular.module('fun.services')
	.factory('SnServ', function (
		SessionServ, FacebookServ, $q, LogServ, UserServ, $timeout, CoolServ
	) {
		var log = LogServ;

		return {
			hasPermissions: function hasPermissions (network, permissions) {
				log.info("SnServ.hasPermission()");

				var params = {action: 'checkPermissions', permissions: permissions, network: network};

				return CoolServ.get('user/' + SessionServ.getUsername() + '/token/', params);
			}
		};
	});
	
