angular.module('fun.controllers')
	.controller('TokenSandboxController', function (
		$scope, LogServ, $timeout, MiscServ, gettextCatalog, MovieServ,
		AuthServ, SessionServ
	) {

		var log = LogServ;
		
		log.debug('TokenSandboxController');

		function show(str) {
			$timeout(function () {
				$scope.display = str;
			}, 0);
		}

		show('. TOKEN SANDBOX .');

		$scope.login = function () {
			show('login');

			log.debug("facebookConnectPlugin.login...");
			facebookConnectPlugin.logout();
			facebookConnectPlugin.login(['user_photos,user_videos'], function (response) {

				log.debug("facebookConnectPlugin.login: ", response);

				if (response.authResponse) {
					log.debug("authResponse found");

					show('ACCESS TOKEN: ' + response.authResponse.accessToken);

				} else {
					log.debug("authResponse NOT found");
					show('PROBLEM: User cancelled login or did not fully authorize.');
				}

			}, function (err) {
				log.debug("ERROR facebookConnectPlugin.login: ", err);
				show('not_authorized');
			});
		};

		$scope.escalate = function () {
			show('escalate');

			log.debug("escalate >>> facebookConnectPlugin.login...");
			facebookConnectPlugin.login(['publish_actions'], function (response) {

				log.debug("escalate >>> facebookConnectPlugin.login: ", response);

				if (response.authResponse) {
					log.debug("escalate >>> authResponse found");

					show('ACCESS TOKEN: ' + response.authResponse.accessToken);

				} else {
					log.debug("escalate >>> authResponse NOT found");
					show('PROBLEM: User cancelled login or did not fully authorize.');
				}

			}, function (err) {
				log.debug("escalate >>> ERROR facebookConnectPlugin.login: ", err);
				show('not_authorized');
			});
		};

		$scope.publish = function () {
			show('publish');

			var putData = {
				idMovie: 'e9f5354c-9bac-4571-a7af-9af45f1f976d',
				permission: 3,
				synopsis: 'It looks like a synopsis...',
				socialNetwork: 'facebook'
			};

			log.debug("putData", putData);

			MiscServ.showLoading(gettextCatalog.getString('Publicando filme...'));

			var resultMessage;

			MovieServ.publish(putData)
				.then(
					function () {
						MiscServ.hideLoading();

						resultMessage = 'DEVERIA TER PUBLICADO NO FACEBOOK';

						show(resultMessage);
					},
					function (err) {
						MiscServ.hideLoading();

						resultMessage = (err && err.data && err.data.friendlyMessage) ||
								gettextCatalog.getString('Não foi possível publicar seu filme em todas as redes. Por favor, tente novamente mais tarde');
						show(resultMessage);
					}
				)
			;
		
		};

		$scope.smartPublish = function () {
			show('smartPublish');

			MiscServ.showLoading(gettextCatalog.getString('Publicando filme...'));

			var putData = {
				idMovie: 'e9f5354c-9bac-4571-a7af-9af45f1f976d',
				permission: 3,
				synopsis: 'It looks like a synopsis...',
				socialNetwork: 'facebook'
			};

			log.debug("smartPublish >>> (READ) facebookConnectPlugin.login...");
			facebookConnectPlugin.logout();
			facebookConnectPlugin.login(['public_profile'], function (response) {

				log.debug("smartPublish >>> (WRITE) facebookConnectPlugin.login: ", response);

				if (response.authResponse) {
					log.debug("smartPublish >>> (READ) authResponse found");

					show('ACCESS TOKEN: (READ) ' + response.authResponse.accessToken);

					facebookConnectPlugin.login(['publish_actions'], function (response) {

						log.debug("smartPublish >>> (WRITE) facebookConnectPlugin.login: ", response);

						if (response.authResponse) {
							log.debug("smartPublish >>> (WRITE) authResponse found");

							show('smartPublish >>> (WRITE) ACCESS TOKEN: ' + response.authResponse.accessToken);

							var resultMessage;

							MovieServ.publish(putData)
								.then(
									function () {
										MiscServ.hideLoading();

										resultMessage = 'smartPublish >>> (WRITE) DEVERIA TER PUBLICADO NO FACEBOOK';

										show(resultMessage);
									},
									function (err) {
										MiscServ.hideLoading();

										resultMessage = (err && err.data && err.data.friendlyMessage) ||
												('smartPublish >>> (WRITE) Não foi possível publicar seu filme em todas as redes. Por favor, tente novamente mais tarde');
										show(resultMessage);
									}
								)
							;

						} else {
							log.debug("smartPublish >>> (WRITE) authResponse NOT found");
							show('smartPublish >>> (WRITE) PROBLEM: User cancelled login or did not fully authorize.');
						}

					}, function (err) {
						log.debug("smartPublish >>> (WRITE) ERROR facebookConnectPlugin.login: ", err);
						show('smartPublish >>> (WRITE) not_authorized');
					});

				} else {
					log.debug("smartPublish >>> (READ) authResponse NOT found");
					show('smartPublish >>> (READ) PROBLEM: User cancelled login or did not fully authorize.');
				}

			}, function (err) {
				log.debug("smartPublish >>> (READ) ERROR facebookConnectPlugin.login: ", err);
				show('smartPublish >>> (READ) not_authorized');
			});
		};

		getIdSession();

		function getIdSession () {
			MiscServ.showLoading('Pegando ID SESSION');

			var promise = AuthServ.login('selenium', '12345', {lang: SessionServ.getLang()});

			promise.then(function (resp) {
				log.debug("LOGADO com sucesso ", resp);
				
				$scope.idsession = 'id session OK';
				
				$timeout(function () {
					MiscServ.hideLoading();
				}, 0);

			}, function (err) {
				$scope.idsession = 'idsession PROBLEM :(';

				log.debug("LOGIN ERROR: ", err);

				MiscServ.hideLoading();


			});
		}

	})
;
