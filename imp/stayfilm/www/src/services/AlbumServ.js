angular.module('fun.services')
	.factory('AlbumServ', function (CoolServ, LogServ) {

		var log = LogServ;

		log.debug("AlbumServ()");

		return {

			getAlbum: function (username, idalbum) {
				return CoolServ.get('user/' + username + '/album/' + idalbum);
			}

		};
	})
;
