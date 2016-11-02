angular.module('fun.controllers')
	.controller('InviteController', function (
		$scope, $stateParams, LogServ, UserServ, SessionServ,
		MiscServ, $timeout, gettextCatalog, ConfigServ
	) {

		var log = LogServ;

		log.info('InviteController()', $stateParams);

		$scope.loading = true;

		$scope.bag = [];

		$scope.networks = SessionServ.getNetworks();

		UserServ
			.getFacebookFriends({username: SessionServ.getUser().username})
			.then(function success (resp) {
				log.info('UserServ.getFacebookFriends ok');
				
				$scope.loading = false;

				$scope.bag = resp.data;

				if ( ! $scope.bag.length) {
					if ($stateParams && $stateParams.fromRegister ) {
						// se tiver vindo do registro
						// e não tiver amigos, manda pro moviemaker direto

						MiscServ.goTo('main.moviemaker.content');
					}
				}

			}, function fail () {
				$scope.loading = false;
				log.error('ERROR: UserServ.getFacebookFriends');
			})
		;

		$scope.addAll = function () {

			if ( ! $scope.bag.length) {
				return;
			}

			MiscServ.showLoading(gettextCatalog.getString('Por favor, aguarde...'));

			var filteredList = _.filter($scope.bag, function (user) {
				return user.friendshipStatus === 'NO_RELATIONSHIP';
			});

			var allUsersIdList = filteredList.map(function (user) {
				return user.idUser;
			});

			log.debug("allUsersIdList", allUsersIdList.length, allUsersIdList);

			UserServ.requestFriendship(SessionServ.getUser().username, allUsersIdList)
				.then(function () {

					MiscServ.hideLoading();

					MiscServ.goTo('main.moviemaker.content');
				})
			;
			
		};

		$scope.appInvite = function () {
			var inviteAppLink = ConfigServ.get('fun_appinvite_applink') || "https://fb.me/540017079542269";
			var inviteImgFB = ConfigServ.get('fun_appinvite_img_fb') || 'http://i.imgur.com/2VGNAyR.jpg';

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

		$scope.closeOrMakeMovie = function () {
			if ($stateParams && $stateParams.fromRegister ) {
				MiscServ.goTo('main.moviemaker.content');
			} else {
				MiscServ.goTo('main.home.feed');
			}
		};
	})
;
