/**
 * SurfIT Social Sharing Module
 */
(function(angular, undefined) {

angular
	.module('srfSocialSharing', [])

	.factory('srfSocialSharingFactory', [
		'$cordovaSocialSharing',
		function ($cordovaSocialSharing) {

			// Share via native share sheet
			function shareAnywhere(message, subject, file, link) {
				return $cordovaSocialSharing.share(message, subject, file, link);
			}

			// Share via Twitter
			function shareViaTwitter(message, image, link) {
				return $cordovaSocialSharing.shareViaTwitter(message, image, link);
			}

			// Share via Facebook
			function shareViaFacebook(message, image, link) {
				return $cordovaSocialSharing.shareViaFacebook(message, image, link);
			}

			// Share via WhatsApp
			function shareViaWhatsApp(message, image, link) {
				return $cordovaSocialSharing.shareViaWhatsApp(message, image, link);
			}

			// Share via SMS
			function shareViaSMS(message, number) {
				return $cordovaSocialSharing.shareViaSMS(message, number)
			}

			// Share via Email
			function shareViaEmail(message, subject, toArr, bccArr, ccArr, file) {
				return $cordovaSocialSharing.shareViaEmail(message, subject, toArr, bccArr, ccArr, file);
			}

			return {
				shareAnywhere: shareAnywhere,
				shareViaTwitter: shareViaTwitter,
				shareViaFacebook: shareViaFacebook,
				shareViaWhatsApp: shareViaWhatsApp,
				shareViaSMS: shareViaSMS,
				shareViaEmail: shareViaEmail
			}
		}])

	.directive('srfSocialShare', [
		function() {
			return {
				templateUrl: 'modules/social-sharing/social-sharing.html',
				restrict: 'AE',
				replace: true,
				scope: {
					config: '=',
				},
				controller: 'srfShareController',
				controllerAs: 'shareCtrl',
				bindToController: true,
				link: postLink
			};
		}])

	.controller('srfShareController', [
		'$scope',
		'srfSocialSharingFactory',
		'$cordovaSocialSharing',
		function ($scope, Sharing, $cordovaSocialSharing) {
			var vm = this;
			vm.sharing = [];

			function init(data) {
				var sharing = [],
					sharingData = [
					{
						'htmlClass': 'share-facebook',
						'iconClass': 'ion-social-facebook',
						'shareData': {
							'network':	'facebook',
							'message':	data.message,
							'file':		data.file,
							'link':		data.link
						}
					},
					{
						'htmlClass': 'share-twitter',
						'iconClass': 'ion-social-twitter',
						'shareData': {
							'network':	'twitter',
							'message':	data.message,
							'file':		data.file,
							'link':		data.link
						}
					},
					{
						'htmlClass': 'share-whatsapp',
						'iconClass': 'ion-social-whatsapp',
						'shareData': {
							'network':	'whatsapp',
							'message':	data.message,
							'file':		data.file,
							'link':		data.link
						}
					},
					{
						'htmlClass': 'share-anywhere',
						'iconClass': 'ion-share',
						'shareData': {
							'network':	'anywhere',
							'message':	data.message,
							'subject':	data.subject,
							'file':		data.file,
							'link':		data.link
						}
					},
					{
						'htmlClass': 'share-message',
						'iconClass': 'ion-ios-chatbubble',
						'shareData': {
							'network':	'sms',
							'message':	data.message,
							'phone':	data.phone
						}
					},
					{
						'htmlClass': 'share-email',
						'iconClass': 'ion-email',
						'shareData': {
							'network':	'email',
							'message':	data.message,
							'subject':	data.subject,
							'toArr':	data.toArr,
							'bccArr':	data.bccArr,
							'ccArr':	data.ccArr,
							'file':		data.file
						}
					}
				];

				for (var index = 0, sLength = sharingData.length; index < sLength; index++) {
					if (data.networks.indexOf(sharingData[index].shareData.network) > -1) {
						sharing.push(sharingData[index]);
					}
				}

				vm.sharing = sharing;
			};

			vm.share = function(shareData) {
				var network = shareData.network,
					message = shareData.message,
					fileSrc = shareData.file,
					link = shareData.link,
					subject = shareData.subject,
					phone = shareData.phone,
					toArr = shareData.toArr,
					bccArr = shareData.bccArr,
					ccArr = shareData.ccArr;

				switch (network) {
					case 'anywhere':
						Sharing.shareAnywhere(message, subject, fileSrc, link);
						break;
					case 'twitter':
						Sharing.shareViaTwitter(message, fileSrc, link);
						break;
					case 'facebook':
						Sharing.shareViaFacebook(message, fileSrc, link);
						break;
					case 'whatsapp':
						Sharing.shareViaWhatsApp(message, fileSrc, link);
						break;
					case 'sms':
						Sharing.shareViaSMS(message, phone);
						break;
					case 'email':
						Sharing.shareViaEmail(message, subject, toArr, bccArr, ccArr, fileSrc);
						break;
				}
			}

			$scope.$watch(
				function watchQuestions() {
					return vm.config;
				},
				function(config) {
					if (config) {
						init(config);
					}
				}, true);

		}]);


	function postLink() {
		
	};

})(window.angular);
