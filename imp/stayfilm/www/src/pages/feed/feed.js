angular.module('fun.controllers')
	.controller('FeedController', function (
		$rootScope, $scope, FeedServ, LogServ, StorageServ, $timeout,
		$ionicScrollDelegate, $ionicGesture, MiscServ, $ionicPlatform,
		MoviemakerServ, UploadMediaServ, Utils, SessionServ, ModalServ
	) {
		var log = LogServ;

		log.info('FeedController()');

		$scope.loadMore = function loadMore () {
			log.debug('loadmore()', 'bag :', bag);

			$scope.animationName = 'bounceInUp';

			FeedServ.getFeed(bag.offset).then(function (resp) {
				log.debug("getFeed", resp);

				if (bag.previousOffset === null) {
					bag.previousOffset = resp.previousOffset;
				}

				bag.offset = resp.nextOffset;
				bag.finished = resp.nextOffset === 0;

				angular.forEach(resp.data, function (story) {
					bag.stories.push(story);
				});

				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.startMoviemaker = function () {

			log.debug('startMoviemaker()');

			MoviemakerServ.reset();
			UploadMediaServ.reset();

			MiscServ.goTo('main.moviemaker.content');
		};

		// for android back button
		var deregisterFunc = $ionicPlatform.registerBackButtonAction(function () {
			log.info('registerBackButtonAction feed.js EXIT APP');
			navigator.app.exitApp();
		}, 101);

		$ionicGesture.on('swipeleft', function () {
			$scope.goTo('main.home.friendship.mate', 'slide-left');
		}, $('.scroll-content'));

		$ionicGesture.on('swiperight', function () {
			$scope.goTo('main.home.profile.movie', 'slide-right');
		}, $('.scroll-content'));

		$scope.refresh = function refresh() {

			$scope.animationName = 'fadeIn';

			var mostRecentStory = bag.stories.length > 0 ? bag.stories[0] : null;

			var newStory = !! mostRecentStory;

			FeedServ.getFeed(bag.previousOffset, newStory).then(function (resp) {
				log.debug("getFeed", resp);

				if (resp.previousOffset !== 0) {
					bag.previousOffset = resp.previousOffset;
				}

				angular.forEach(resp.data.reverse(), function (story) {
					bag.stories.unshift(story);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		var bag = StorageServ.get('feed', true);

		if ( ! bag) {
			bag = {stories: [], finished: false, offset: null, previousOffset: null};
		} else {
			$scope.refresh();
		}

		$scope.bag = bag;

		FeedServ.feedObjRef(bag);

		$scope.$on("$destroy", function() {
			StorageServ.set('feed', bag, 'memory');
			deregisterFunc();
		});

		MiscServ.hideLoading();

		log.info("thisUser", SessionServ.getUser());

		function facebookAppInvite() {
			log.info("facebookAppInvite()");

			var thisUser = SessionServ.getUser();

			var appInviteConditions;

			// isDevice
			appInviteConditions = Utils.isDevice();
			log.info("invite() device", appInviteConditions);

			// facebookConnectPlugin available
			appInviteConditions = appInviteConditions && !!window.facebookConnectPlugin;
			log.info("invite() plugin", appInviteConditions);

			// .appInvite available
			appInviteConditions = appInviteConditions && !!window.facebookConnectPlugin.appInvite;
			log.info("invite() .appInvite", appInviteConditions);

			// se o usuário tiver feito pelo menos 1 filme
			appInviteConditions = appInviteConditions && (thisUser.movieCount > 0 || thisUser.countPendingMovies > 0);
			log.info("invite() 1 movie", appInviteConditions);

			// se o usuário ainda não tiver visto ainda o modal
			// (flag no banco)
			appInviteConditions = appInviteConditions && thisUser.inviteappstatus === null;
			log.info("invite() db flag", appInviteConditions);

			// (flag na memoria)
			appInviteConditions = appInviteConditions && MiscServ.appInviteStatus() !== true;
			log.info("invite() local flag", appInviteConditions);

			// override conditions
			// appInviteConditions = true;

			log.info("appInviteConditions", appInviteConditions);

			if (appInviteConditions) {
				var appinviteModal = ModalServ.get('appInvite');
				appinviteModal.show();
			}
		}

		setTimeout(function () {
			MiscServ.whenFacebookReady(facebookAppInvite);
		}, 1500);
	})
;
