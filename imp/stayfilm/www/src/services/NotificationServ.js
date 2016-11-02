angular.module('fun.services')
	.factory('NotificationServ', function (CoolServ, SessionServ, LogServ) {

		var log = LogServ;

		return {
			getNotification: function (offset) {

				var params = {limit: 10};

				if (offset) {
					params.offset = offset;
				}

				return CoolServ.get('user/' + SessionServ.getUser().username + '/notification', params);
			},
			getNewCount: function () {
				console.log('getNewCount()');
				return CoolServ.get('user/' + SessionServ.getUser().username, {include: 'bare'}).then(function (resp) {

					log.debug('Notif Count', resp);

					return resp.notifications;
				});
			},
			markAsRead: function () {
				log.debug('markAsRead');

				return CoolServ.put('user/' + SessionServ.getUser().username + '/notification');
			}
		};
	})
;
