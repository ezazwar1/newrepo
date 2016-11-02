angular.module('fun.controllers')
	.controller('AdminConfigController', function (
		$scope, ConfigServ, $ionicPopup, SessionServ, LogServ, UserServ, MiscServ, 
		Utils, GaServ, $timeout, $interval, gettextCatalog
	) {
		var log = LogServ;

		$scope.serverConfig = ConfigServ.getServerConfig();

		$scope.localConfig = ConfigServ.getLocalConfig();

		$scope.serverList = ConfigServ.getServerList();

		$scope.isLogged = SessionServ.isLogged();

		$scope.result = {env: ConfigServ.getEnv()};

		var platform;
		if (Utils.isIos()) {
			platform = "Iphone";

		} else if (Utils.isAndroid()) {
			platform = "Android";

		} else {
			platform = "UNKNOWN-PLATFORM";
		}

		$scope.saveEnv = function (env) {

			log.debug('saveEnv()', env);

			ConfigServ.updateEnv(env);

			var localConfig = ConfigServ.getLocalConfig();

			SessionServ.reset();

			ConfigServ.setLocalConfig(localConfig);

			ConfigServ.reset();

			location.reload();
		};

		$scope.sendGaqTag = function () {
			var tagSandbox = platform + "_Tela_30_AppFull_Teste";

			log.debug('SANDBOX sendGaqTag()', tagSandbox);

			GaServ.stateView(tagSandbox);
		};

		$scope.saveConfig = function () {
			ConfigServ.setLocalConfig($scope.localConfig);

			$ionicPopup.alert({
				template: 'Yes, Config saved.',
				title: 'Success'
			});
		};

		$scope.appInvite = function () {
			// https://developers.facebook.com/quickstarts/129339127276735/?platform=app-links-host
			facebookConnectPlugin.appInvite(
				{
					url: "https://fb.me/540017079542269",
					// picture: "http://www.stayfilm.com/assets/img/stayfilm-logo.png"
					picture: "http://i.imgur.com/cLTrhdr.png" // stayfilm-green
				},
				function(obj){
					if(obj) {
						if(obj.completionGesture == "cancel") {
							// user canceled, bad guy 
							log.debug('USER CANCELED', obj);

						} else {
							// user really invited someone :) 
							log.debug('USER INVITED', obj);
						}
					} else {
						// user just pressed done, bad guy 
						log.debug('NO USER INVITED', obj);
					}
				},
				function(obj){
					// error 
					console.log(obj);
				}
			);
		};

		$scope.sandboxPublish = function () {
			// http://artur.office.stayfilm.com.br/fun/www/#/main/publish/98176503-7e2c-465d-a675-869b1ed3cbb7?source=moviemaker

			var sandboxPublish_idmovie;

			MiscServ.showLoading();

			UserServ.getPending(SessionServ.getUser().username, 0, 1).then(function (resp) {
				var idmovie = resp.data[0].idMovie;

				log.debug('sandboxPublish idmovie', idmovie);

				sandboxPublish_idmovie = idmovie;

				if (sandboxPublish_idmovie) {
					$scope.goTo("main.publish", null, {idmovie: sandboxPublish_idmovie, source: "moviemaker"});

				} else {
					alert("Você tem algum filme pendente? :)");
				}

				MiscServ.hideLoading();
			});
		};

		console.log('__config__', $scope.config);

	})
;
