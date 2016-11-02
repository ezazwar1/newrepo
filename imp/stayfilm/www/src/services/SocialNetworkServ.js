angular.module('fun.services')
	.factory('SocialNetworkServ', function (CoolServ, LogServ) {

		var log = LogServ;

		return {
			/**
			 * Start a job for grabbing user content
			 *
			 * @param network {string}
			 */
			startSocialJob: function (network) {
				log.info("SocialNetworkServ :: startSocialJob()", network);
				
				CoolServ.post("job", {
					jobtype: "socialnetwork",
					socialnetwork: network
				}).then(function success ( response ){
					log.info("SocialNetworkServ :: startSocialJob() > SUCCESS");
					log.debug("SocialNetworkServ :: response", response);
				}, function fail () {
					log.error("SocialNetworkServ :: startSocialJob() > FAIL");
				});
			}
		};
	})
;
