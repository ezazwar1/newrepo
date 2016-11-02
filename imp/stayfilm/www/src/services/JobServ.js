angular.module('fun.services')
	.factory('JobServ', function (LogServ, CoolServ, SessionServ) {
		var log = LogServ;

		return {
			hasPendingJob: function () {
				log.info("hasPendingJob()");
				var resource = 'user/' + SessionServ.getUsername() + '/job';

				return CoolServ.get(resource, {pending:1, type:'socialnetwork'})
					.then(function (resp) {
						log.info("hasPendingJob response", resp);

						if (resp && resp.data) {
							return !!resp.data.length;
						} else {
							log.info('JobServ.hasPendingJob() - Strange behavior from server, no "resp.data"');
						}
					})
				;
			}
		};
	})
;
