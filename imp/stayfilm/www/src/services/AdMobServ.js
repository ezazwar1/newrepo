angular.module('fun.services')
	.factory('AdMobServ', function (Utils, LogServ) {
		var log = LogServ;

		return {
			show: function () {
				log.info("AdMobServ.show()");

				if (window.AdMob) {
					window.AdMob.createBanner({
						adId: "/16542456/Mobile_Messenger_Tela-Trailer_Sem-video_2",
						adSize: "MEDIUM_RECTANGLE",
						// width: 300,
						// height: 250,
						offsetTopBar: true,
						position: 8 // BOTTOM CENTER
					});
				} else {
					log.error("AdMob NOT FOUND");
				}
			},
			hide: function () {
				log.info("AdMobServ.hide()");
				
				if (window.AdMob) {
					window.AdMob.removeBanner();
				} else {
					log.error("AdMob NOT FOUND");
				}
			}
		};
	});
	
