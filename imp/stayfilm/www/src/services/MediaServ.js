angular.module('fun.services')
	.factory('MediaServ', function (CoolServ, LogServ) {

		var log = LogServ;

		log.debug("MediaServ()");

		return {

			getMedias: function (username, params, nextOffset) {

				// params.limit = 20;

				// if (nextOffset) {
				// 	params.offset = nextOffset;
				// }

				return CoolServ.get('user/' + username + '/media', params);
			},
			upload: function () {

			}

		};
	})
;
