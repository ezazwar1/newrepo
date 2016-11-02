angular.module('fun.services')
	.factory('ModalServ', function ($ionicModal, $rootScope) {

		return {
			get: function (name) {

				var template;

				var backButton = true;

				if (name === 'info') {
					template = 'src/modal/infoModal.html';

				} else if (name === 'log') {
					template = 'src/modal/logModal.html';

				} else if (name === 'watch') {
					template = 'src/modal/watch/watchModal.html';
					backButton = false;

				} else if (name === 'publish.publishFB') {
					template = 'src/pages/publish/publishFbModal.html';

				} else if (name === 'legal-terms') {
					template = 'src/pages/institutional/legal-terms.html';

				} else if (name === 'privacy-terms') {
					template = 'src/pages/institutional/privacy-terms.html';

				} else if (name === 'zoom') {
					template = 'src/pages/moviemaker/imgZoom.html';

				} else if (name === 'share') {
					template = 'src/modal/share/shareModal.html';

				} else if (name === 'dynamicTerms') {
					template = 'src/modal/dynamicTerms/dynamicTerms.html';

				} else if (name === 'acceptTerms') {
					template = 'src/modal/acceptTerms/acceptTerms.html';

				} else if (name === 'denounce') {
					template = 'src/modal/denounce/denounce.html';

				} else if (name === 'editSynopsis') {
					template = 'src/modal/editSynopsis/editSynopsis.html';

				} else if (name === 'appInvite') {
					template = 'src/modal/appinvite/appinvite.html';

				} else {
					throw new Error('Modal ' + name + ' does not exist');
				}

				var modalWrapper = {
					modal: null,
					show: function (data) {

						var self = this;

						var scope = $rootScope.$new(false);

						scope.data = data;
						scope.modal = this;

						$ionicModal.fromTemplateUrl(template, {
							scope: scope,
							animation: 'slide-in-up',
							hardwareBackButtonClose: backButton
						}).then(function(ionicModal) {
							self.ionicModal = ionicModal;
							self.ionicModal.show();
						});
					},
					hide: function () {
						this.ionicModal.remove();
					}
				};

				return modalWrapper;
			}
		};
	})
;
