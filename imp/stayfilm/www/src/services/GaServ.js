angular.module('fun.services')
	.factory('GaServ', function (Utils, ConfigServ, LogServ) {

		var log = LogServ;

		var platform;
		if (Utils.isIos()) {
			platform = "Iphone";

		} else if (Utils.isAndroid()) {
			platform = "Android";

		} else {
			platform = "UNKNOWN-PLATFORM";
		}

		return  {
			init: function () {
				log.debug('GaServ.init()');

				var trackingId;

				if (Utils.isCordovaApp()) {

					trackingId = sfLocal.gaTrackingIds.cordova;

					log.debug('Cordova Ga tracking Id', trackingId);

					if (window.analytics) {
						window.analytics.startTrackerWithId(trackingId);
					} else {
						log.error('ERROR window.analytics NOT AVAILABLE');
					}

				} else {

					trackingId = sfLocal.gaTrackingIds.web;

					//trackingId = ConfigServ.get('fun_web_ga_tracking_id');

					log.debug('Web Ga tracking Id', trackingId.substr(0, 7));

					/* jshint ignore:start */
					(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
						(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
					m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
					})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

					ga('create', trackingId, 'auto');
					ga('send', 'pageview');
					/* jshint ignore:end */
				}
			},
			transformTags: function (toState, transition, params, options) {
				var transformed;

				var isGalleryGenre = (toState == 'main.home.gallery.genre');
				var haveSlug = params && params.slug;

				if (isGalleryGenre && haveSlug) {
					transformed = toState + "-" + params.slug;
				}

				var isAlbumManagerSource = (toState == 'main.albummanager.sourcezone');
				var haveNetwork = params && params.network;

				if (isAlbumManagerSource && haveNetwork) {
					transformed = toState + "-" + params.network;
				}

				return transformed;
			},
			stateView: function (stateName) {

				log.debug('GaServ.stateView()', stateName);

				if (window.analytics || window.ga) {
					if (Utils.isCordovaApp()) {
							window.analytics.trackView(stateName);
					} else {
						ga('send', 'pageview', {
							'page': stateName
						});
					}
				} else {
					log.error('window.analytics NOT AVAILABLE');
				}
			},
			trackViewMap: function (tag) {
				var notTag = !tag;
				var notCordova = !Utils.isCordovaApp();
				var notStayfunny = (sfLocal.appContext !== 'fbmessenger');

				if ( notTag || notCordova || notStayfunny ) {
					return;
				}

				var tagMap = [
					null,
					"inicio",
					"Passo_1-_Titulo-e-Estilo",
					"Passo_2_escolher-fotos",
					"Passo_2_escolher-fotos_facebook-album",
					"Passo_2_adicionar-fotos-do-celular",
					"Passo_3_produzindo-filme_tela-trailler",
					"Passo_4_filme-produzido",
					"Passo_4_filme-produzido_Botao_Send",
					"meus-filmes",
					"meus-filmes_ver-filme",
					"Erro-do-usuario_1_faltou-titulo",
					"Erro-do-usuario_1_faltou-estilo",
					"Erro-do-usuario_1_faltou-fotos"
				];

				var indexTela = tagMap.indexOf(tag);

				if (indexTela <= 0) {
					return;
				}

				var trackTag = platform + "_Tela_" + indexTela + "_SFMobile_" + tag;

				log.info("GaServ.trackViewMap() ", trackTag);

				if (window.analytics) {
					window.analytics.trackView(trackTag);
				} else {
					log.error('window.analytics NOT AVAILABLE');
				}
			}
		};
	})
;
