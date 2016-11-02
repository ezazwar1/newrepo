angular.module('fun.controllers')
	.controller('AppInviteController', function (
		$scope, CoolServ, MiscServ, ConfigServ, SessionServ,
		LogServ, GaServ, Utils
	) {
		var log = LogServ;

		var inviteImg = ConfigServ.get('fun_appinvite_img_app') || 'http://i.imgur.com/j7phQFB.jpg';
		var inviteAppLink = ConfigServ.get('fun_appinvite_applink') || "https://fb.me/540017079542269";
		var inviteImgFB = ConfigServ.get('fun_appinvite_img_fb') || 'http://i.imgur.com/2VGNAyR.jpg';
		var lang = SessionServ.getLang();

		$scope.lang = lang;

		$scope.appInviteImg = 'url(' + inviteImg + ')';

		var platform;
		if (Utils.isIos()) {
			platform = "Iphone";

		} else if (Utils.isAndroid()) {
			platform = "Android";

		} else {
			platform = "UNKNOWN-PLATFORM";
		}

		GaServ.stateView(platform + "_Tela_50_Full_Convite-facebook");

		$scope.closeModal = function () {
			GaServ.stateView(platform + "_Tela_52_Full_Convite-facebook_botao_nao-convidar");

			storeAppInviteStatus(false);
			$scope.modal.hide();
		}

		function storeAppInviteStatus(status) {
			CoolServ
				.put("user", {inviteappstatus: status})
				.then(function success () {
					log.debug('invite registered.');
				}, function fail () {
					log.debug('invite not registered.');
				})
			;

			// must register in memory
			MiscServ.appInviteStatus(true);
		}

		$scope.appInvite = function () {
			GaServ.stateView(platform + "_Tela_51_Full_Convite-facebook_botao_convidar");

			// https://developers.facebook.com/quickstarts/129339127276735/?platform=app-links-host
			facebookConnectPlugin.appInvite(
				{
					url: inviteAppLink,
					picture: inviteImgFB
				},
				function(obj){
					if(obj) {
						if(obj.completionGesture == "cancel") {
							// user canceled, bad guy 
							log.debug('USER CANCELED', obj);
							storeAppInviteStatus(false);

						} else {
							// user really invited someone :) 
							log.debug('USER INVITED', obj);
							storeAppInviteStatus(true);
						}
					} else {
						// user just pressed done, bad guy 
						log.debug('NO USER INVITED', obj);
						storeAppInviteStatus(false);
					}
				},
				function(obj){
					// error 
					console.log(obj);
				}
			);
		};
		
	})
;
