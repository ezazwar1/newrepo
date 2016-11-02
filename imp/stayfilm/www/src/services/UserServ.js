angular.module('fun.services')
	.factory('UserServ', function (CoolServ, LogServ, Utils, ConfigServ, StorageServ) {

		var log = LogServ;

		log.debug("UserServ()");

		return {
			getNetworks: function (username) {
				return CoolServ.get('user/' + username + '/network').then(function (resp) {
					return resp.data;
				});
			},
			getMovies: function (username, offset) {
				return CoolServ.get('user/' + username + '/movie', {offset: offset});
			},
			getFbMessengerMovies: function (username, offset) {
				return CoolServ.get('user/' + username + '/movie', {slug:'fbmessenger', offset: offset, limit: 200});
			},
			get: function (username, params) {
				return CoolServ.get('user/' + username, params);
			},
			getPending: function (username, offset, limit) {
				return CoolServ.get('user/' + username + '/movie', {offset: offset, pending: 1, limit: limit});
			},
			getLikes: function (username, offset) {
				return CoolServ.get('user/' + username + '/like', {offset: offset});
			},
			getConfig: function (username, params) {
				return CoolServ.get('user/' + username + '/config', params);
			},
			putConfig: function (username, params) {
				return CoolServ.put('user/' + username + '/config', params);
			},
			putUserInfo: function (username, params) {
				return CoolServ.put('user/' + username, params);
			},
			getFriends: function (username, offset) {

				return CoolServ.get('user/' + username + '/friend', {offset: offset, limit: 5000})
					.then(function (resp) {
						return resp.data;
					});
			},
			resetPassword: function (email) {
				return CoolServ.post('password', {email: email});
			},
			getFacebookFriends: function (data) {
				var username = data.username,
					params = {
						facebookFriends: 1
					}
				;

				if (data.offset) {
					params.offset = data.offset;
				}

				if (data.limit) {
					params.limit = data.limit;
				}

				return CoolServ.get('user/' + username + '/network', params);
			},
			getFriendshipRequests: function (username) { // (username, offset)
				return CoolServ.get('user/' + username + '/friend', {pending: true})
					.then(function (resp) {
						return resp.data;
					});
			},
			register: function (params) {

				params.iddevice = StorageServ.get('deviceToken', 'permanent');
				params.appid = Utils.isCordovaApp() ? sfLocal.facebookAppId : ConfigServ.get('fb_app_id');

				return CoolServ.post('user', params);
			},
			acceptFriendship: function (username, idrequester) {
				return CoolServ.post('user/' + username + '/friend', {action: 'accept', idfriend: idrequester});
			},
			requestFriendship: function (username, idUserList) {
				return CoolServ.post('user/' + username + '/friend', {action: 'ask', idfriend: idUserList});
			},
			rejectFriendship: function (username, idrequester) {
				return CoolServ.post('user/' + username + '/friend', {action: 'refuse', idfriend: idrequester});
			},
			discardFriendship: function (username, idrequester) {
				return CoolServ.post('user/' + username + '/friend', {action: 'remove', idfriend: idrequester});
			},
			saveToken: function (username, token, sn) {
				log.debug('UserService.saveToken()');

				 var appId = Utils.isCordovaApp() ? sfLocal.facebookAppId : ConfigServ.get('fb_app_id');

				return CoolServ.post('user/' + username + '/token/' + sn, {token: token, appid: appId });
			},
			createToken: function (username, sn, frob) {
				return CoolServ.post('user/' + username + '/token/' + sn, {frob: frob});
			}
		};
	})
;
