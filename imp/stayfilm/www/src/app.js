angular.module('fun', ['ionic', 'ngAnimate', 'fun.services', 'fun.controllers', 'fun.config', 'fun.sandbox', 'angular-data.DSCacheFactory', 'ngIOS9UIWebViewPatch'])
	.constant('REQUIRED_STAYCOOL_WS_VERSION', '1.11')
	.constant('FUN_VERSION', FUN_VERSION)
	.config(function ($stateProvider, $urlRouterProvider, RestangularProvider, $compileProvider, $provide) {

		console.log('Fun:config()');

		if ( ! sfLocal.defaultTimeout) {
			sfLocal.defaultTimeout = 30000;
		}

		RestangularProvider.setDefaultHttpFields({timeout: sfLocal.defaultTimeout});

		$provide.decorator("$exceptionHandler", function(/*$delegate*/) {
			return function(exception, cause) {
				console.error(">EXCEPTION", exception.stack, cause);
				
				if (window.Stayalert) {
					window.Stayalert.reportException(exception);
				}

				// TraceKit.report(exception);
				//$delegate(exception, cause);
			};
		});

		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|content|blob|app):|data:image\//);

		$stateProvider.state('index', {
			url: "/",
			controller: function ($scope, $location, SessionServ, $state) {
				if (sfLocal.appContext === 'fbmessenger') {
					console.log("APP CONTEXT: >>> fbmessenger <<< ");
					$state.go('main.fbmessenger.titlestep');
					
				} else {
					console.log("APP CONTEXT: default");
					$state.go('main.home.feed');
				}
			}
		})
		.state('welcome', {
			abstract: true,
			template: '<div style="position: absolute; top: 0; left: 50%; z-index: 100; opacity: 0; width: 100px; height: 20px;"><button on-hold="showLogPopup()">tools</button></div><ui-view />'
		})
		.state('welcome.start', {
			url: "/start",
			templateUrl: "src/pages/start/start.html",
			controller: 'StartController',
			access: 'public'
		})
		.state('welcome.login', {
			url: "/login",
			templateUrl: "src/pages/login/login.html",
			controller: 'LoginController',
			access: 'public'
		})
		.state('welcome.maintenance', {
			url: "/maintenance",
			templateUrl: "src/pages/maintenance/maintenance.html",
			controller: 'MaintenanceController',
			access: 'public'
		})
		.state('welcome.register', {
			url: "/register",
			templateUrl: "src/pages/register/register.html",
			controller: 'RegisterController',
			access: 'public'
		})
		.state('welcome.resetpassword', {
			url: "/resetpassword",
			templateUrl: "src/pages/resetPassword/resetPassword.html",
			controller: 'ResetPasswordController',
			access: 'public'
		})
		.state('welcome.watch', {
			url: "/watch?idmovie",
			templateUrl: "src/modal/watch/watchModal.html",
			access: 'public'
		})
		.state('main', {
			abstract: true,
			url: "/main",
			templateUrl: "src/pages/main/main.html",
			controller: 'MainController',
			access: 'public'
		})
		.state('main.invite', {
			url: "/invite",
			templateUrl: "src/pages/main/invite.html",
			controller: 'InviteController',
			access: 'private',
			params: {
				fromRegister: false
			}
		})
		.state('main.home', {
			abstract: true,
			url: "/home",
			templateUrl: "src/pages/main/home.html",
			controller: 'HomeController',
			access: 'public'
		})
		.state('main.home.about', {
			url: "/about",
			templateUrl: "src/pages/about/about.html",
			controller: 'AboutController',
			access: 'private'
		})
		.state('main.home.feed', {
			url: "/feed",
			templateUrl: "src/pages/feed/feed.html",
			controller: 'FeedController',
			access: 'private'
		})
		.state('main.home.notification', {
			url: "/notification",
			templateUrl: "src/pages/notification/notification.html",
			controller: 'NotificationController',
			access: 'private'
		})
		.state('admin', {
			abstract: true,
			url: "/admin",
			templateUrl: "src/pages/admin/admin.html",
			access: 'public'
		})
		.state('admin.config', {
			url: "/config",
			templateUrl: "src/pages/admin/config/config.html",
			controller: 'AdminConfigController',
			access: 'public'
		})
		.state('admin.log', {
			url: "/log",
			templateUrl: "src/pages/admin/log/log.html",
			controller: 'AdminLogController',
			access: 'public'
		})
		.state('main.home.settings', {
			abstract: true,
			url: "/settings",
			templateUrl: "src/pages/settings/settings.html",
			controller: 'SettingsController',
			access: 'private'
		})
		.state('main.home.settings.credentials', {
			url: "/credentials",
			templateUrl: "src/pages/settings/credentials.html",
			controller: 'CredentialsSettingsController',
			access: 'private'
		})
		.state('main.home.settings.personal', {
			url: "/personal",
			templateUrl: "src/pages/settings/personal.html",
			controller: 'PersonalSettingsController',
			access: 'private'
		})
		.state('main.home.profile', {
			abstract: true,
			url: "/profile",
			templateUrl: "src/pages/profile/profile.html",
			controller: 'ProfileController',
			access: 'private'
		})
		.state('main.home.profile.main', {
			url: "/main",
			templateUrl: "src/pages/profile/main.html",
			controller: 'MainProfileController',
			access: 'private'
		})
		.state('main.home.profile.movie', {
			url: "/movie",
			templateUrl: "src/pages/profile/movie.html",
			controller: 'MovieProfileController',
			access: 'private'
		})
		.state('main.home.profile.like', {
			url: "/like",
			templateUrl: "src/pages/profile/like.html",
			controller: 'LikeProfileController',
			access: 'private'
		})
		.state('main.home.profile.pending', {
			url: "/pending",
			templateUrl: "src/pages/profile/pending.html",
			controller: 'PendingProfileController',
			access: 'private'
		})
		.state('main.home.friend', {
			abstract: true,
			url: "/friend/:username",
			templateUrl: "src/pages/friend/friend.html",
			controller: 'FriendController',
			resolve: {
				friend: function (UserServ, $stateParams, LogServ, MiscServ, SessionServ) {

					MiscServ.showLoading();

					var params = {include: 'friendship', iduser: SessionServ.getUser().idUser};

					return UserServ.get($stateParams.username, params).then(function (user) {
						MiscServ.hideLoading();
						return user;
					});
				}
			},
			access: 'private'
		})
		.state('main.home.friend.movie', {
			url: "/movie",
			templateUrl: "src/pages/friend/movie.html",
			controller: 'MovieFriendController',
			access: 'private'
		})
		.state('main.home.friend.like', {
			url: "/like",
			templateUrl: "src/pages/friend/like.html",
			controller: 'LikeFriendController',
			access: 'private'
		})
		.state('main.home.friend.mate', {
			url: "/mate",
			templateUrl: "src/pages/friend/mate.html",
			controller: 'MateFriendController',
			access: 'private'
		})
		.state('main.home.friendship', {
			abstract: true,
			url: "/friendship",
			templateUrl: 'src/pages/friendship/friendship.html',
			controller: 'FriendshipController',
			access: 'private'
		})
		.state('main.home.friendship.mate', {
			url: "/mate",
			templateUrl: "src/pages/friendship/mate.html",
			controller: 'MateFriendshipController',
			access: 'private'
		})
		.state('main.home.friendship.request', {
			url: "/request",
			templateUrl: "src/pages/friendship/request.html",
			controller: 'RequestFriendshipController',
			access: 'private'
		})
		.state('main.home.search', {
			url: "/search?term",
			templateUrl: "src/pages/search/search.html",
			controller: 'SearchController',
			access: 'private'
		})
		.state('main.home.search.user', {
			url: "/user",
			templateUrl: "src/pages/search/searchUser.html",
			controller: 'UserSearchController',
			access: 'private'
		})
		.state('main.home.search.movie', {
			url: "/movie",
			templateUrl: "src/pages/search/searchMovie.html",
			controller: 'MovieSearchController',
			access: 'private'
		})
		.state('main.albummanager', {
			abstract: true,
			url: "/albummanager",
			template: '<ui-view class="albummanager main-albummanager"></ui-view>',
			controller: 'AlbummanagerController',
			access: 'private'
		})
		.state('main.albummanager.contentzone', {
			url: "/contentzone?data&idalbum",
			templateUrl: "src/pages/albummanager/contentzone.html",
			controller: 'ContentzoneAlbummanagerController',
			access: 'private'
		})
		.state('main.albummanager.sourcezone', {
			url: "/sourcezone?network",
			templateUrl: "src/pages/albummanager/sourcezone.html",
			controller: 'SourcezoneAlbummanagerController',
			access: 'private'
		})
		.state('main.albummanager.album', {
			url: "/album/:idalbum?network",
			templateUrl: "src/pages/albummanager/album.html",
			controller: 'AlbumAlbummanagerController',
			access: 'private'
		})
		.state('main.moviemaker', {
			abstract: true,
			url: "/moviemaker",
			template: '<ui-view class="moviemaker main-moviemaker"></ui-view>',
			controller: 'MoviemakerController',
			access: 'private'
		})
		.state('main.moviemaker.content', {
			url: "/content",
			templateUrl: "src/pages/moviemaker/content.html",
			controller: 'ContentMoviemakerController',
			access: 'private'
		})

		// FB MESSENGER
		.state('welcome.startfb', {
			url: "/startfb",
			templateUrl: "src/pages/fbMessenger/startFb/startFb.html",
			controller: 'StartFbController',
			resolve: {
				// delay for load language asynchrone initialize in the run() - stupid dirty fixs
				lang: function ($q, $timeout) {
					var deferred = $q.defer();

					$timeout(function() {
						deferred.resolve();
					}, 100);

					return deferred.promise;
				}
			}
		})
		.state('main.fbmessenger', {
			abstract: true,
			template: '<ui-view class="fbmessenger main-fbmessenger"></ui-view>',
			url: "/fbmessenger",
			access: 'private'
		})
		.state('main.fbmessenger.titlestep', {
			url: "/titlestep?reset",
			templateUrl: "src/pages/fbMessenger/titlestep/titleStep.html",
			controller: 'TitleStepController',
			access: 'private'
		})
		.state('main.fbmessenger.mediaalbum', {
			url: "/mediaalbum/:idalbum",
			templateUrl: "src/pages/fbMessenger/mediaAlbum/mediaAlbum.html",
			controller: 'MediaAlbumController',
			access: 'private'
		})
		.state('main.fbmessenger.mediastep', {
			url: "/mediastep",
			templateUrl: "src/pages/fbMessenger/mediaStep/mediaStep.html",
			controller: 'MediaStepController',
			access: 'private'
		})
		.state('main.fbmessenger.myfilms', {
			url: "/myfilms",
			templateUrl: "src/pages/fbMessenger/myFilms/myFilms.html",
			controller: 'MyFilmsController',
			access: 'private'
		})
		.state('main.fbmessenger.sharestep', {
			url: "/sharestep/:idmovie",
			templateUrl: "src/pages/fbMessenger/shareStep/shareStep.html",
			controller: 'ShareStepController',
			resolve: {
				movie: function (MiscServ, $stateParams, LogServ, $timeout, $q) {
					MiscServ.showLoading();

					var log = LogServ;

					var deferred = $q.defer();

					MiscServ.getMovie($stateParams.idmovie).then(function (movie) {
						//polyfill for browser or missing plugin

						log.debug('resolve movie', movie);

						var params = {idmovie: movie.idMovie, url: movie.baseUrl + "/video.mp4", title: movie.title};

						log.debug('Downloading movie to device (sharestep.resolve)...', params);

						window.downloadMovieToDevice(params, function (err, file) {
							log.debug('Download to device (sharestep.resolve) finished', err);

							if (err) {
								log.error('download file error', err);
							}

							//log.debug('local file url', file);

							movie.localFile = file;

							deferred.resolve(movie);
						});
					});

					return deferred.promise;
				}
			},
			access: 'private'
		})
		// -end- FB MESSENGER

		.state('main.moviemaker.upload', {
			url: "/upload?source",
			templateUrl: "src/pages/moviemaker/upload.html",
			controller: 'UploadMoviemakerController',
			access: 'private'
		})
		.state('main.moviemaker.genre', {
			url: "/genre?idalbum",
			templateUrl: "src/pages/moviemaker/genre.html",
			controller: 'GenreMoviemakerController',
			access: 'private'
		})
		.state('main.moviemaker.theme', {
			url: "/theme",
			templateUrl: "src/pages/moviemaker/theme.html",
			controller: 'ThemeMoviemakerController',
			access: 'private'
		})
		.state('main.waiting', {
			url: "/waiting/?source",
			templateUrl: "src/pages/waiting/waiting.html",
			controller: 'WaitingController',
			access: 'private'
		})
		.state('main.publish', {
			url: "/publish/:idmovie?source",
			templateUrl: "src/pages/publish/publish.html",
			controller: 'PublishController',
			resolve: {
				movie: function (MiscServ, $stateParams) {
					MiscServ.showLoading();

					return MiscServ.getMovie($stateParams.idmovie).then(function (movie) {
						MiscServ.hideLoading();
						return movie;
					});
				}
			},
			access: 'private'
		})
		.state('main.home.gallery', {
			abstract: true,
			url: "/gallery",
			template: '<ui-view class="main-home-gallery page-gallery page"></ui-view>',
			access: 'public'
		})
		.state('main.home.gallery.bestof', {
			url: "/bestof",
			templateUrl: "src/pages/gallery/bestof.html",
			controller: 'BestofGalleryController',
			access: 'private'
		})
		.state('main.home.gallery.latest', {
			url: "/latest",
			templateUrl: "src/pages/gallery/latest.html",
			controller: 'LatestGalleryController',
			access: 'private'
		})
		.state('main.home.gallery.genres', {
			url: "/genres",
			templateUrl: "src/pages/gallery/genres.html",
			controller: 'GenresGalleryController',
			access: 'private'
		})
		.state('main.home.gallery.genre', {
			url: "/movies/:type/:slug",
			templateUrl: "src/pages/gallery/genre.html",
			controller: 'GenreGalleryController',
			access: 'private'
		})
		.state('testcache', {
			url: "/testcache",
			template: "blabla",
			controller: function (StorageServ) {
				console.log('testcontroller');

				console.log('set julien');

				StorageServ.set('julien', 'julien', null, 5);

				console.log('set artur');
				StorageServ.set('artur', 'artur', null, 10);

				setInterval(function () {
					console.log(StorageServ.get('julien'));
					console.log(StorageServ.get('artur'));
				}, 1000);
			},
			access: 'public'
		})
		.state('sandbox', {
			abstract: true,
			url: "/sandbox",
			template: "<ui-view></ui-view>",
			access: 'public'
		})
		.state('sandbox.token', {
			url: "/token",
			templateUrl: 'src/sandbox/tokenSandbox.html',
			controller: 'TokenSandboxController',
			access: 'public'
		})
		.state('sandbox.moviemosaic', {
			url: "/moviemosaic/:idmovie",
			templateUrl: 'src/sandbox/testmoviemosaic.html',
			resolve: {
				movie: function (UserServ, $stateParams, MiscServ) {

					return MiscServ.getMovie($stateParams.idmovie);
				}
			},
			controller: function (movie, $stateParams, MiscServ, $scope) {
				$scope.$on('movie-deleted', function () {// (e, movie)
					delete $scope.movie;
				});

				$scope.movie = movie;
			},
			access: 'public'
		})
		.state('sandbox.jwplayer', {
			url: "/jwplayer",
			templateUrl: 'src/sandbox/jwplayer.html',
			controller: function () {

				jwplayer('myElement').setup({
					file: 'http://melies.stayfilm.com/f37530ce-ba0e-43ef-a92b-181e769c8c3c/video.mp4',
					height: 200,
					image: 'http://melies.stayfilm.com/c3e23eeb-a110-498f-9fae-4f3813c9c2d2/266x150_n.jpg',
					width: 400
					//skin: 'bekle'
					//skin: '/vendor/jwplayer-skins/bekle.xml'
				});

			},
			access: 'public'
		})
		.state('sandbox.collectionrepeat', {
			url: "/collectionrepeat",
			templateUrl: 'src/sandbox/collectionrepeat.html',
			controller: 'CollectionRepeatSandboxController',
			access: 'public'
		})
		.state('sandbox.test', {
			url: "/test",
			templateUrl: 'src/sandbox/test.html',
			controller: 'TestSandBoxController',
			access: 'public'
		})
		.state('sandbox.promise', {
			url: "/promise",
			template: '<div>promise sandbox</div>',
			controller: 'PromiseSandBoxController',
			access: 'public'
		})
		.state('sandbox.virtualList', {
			abstract: true,
			url: "/virtualList",
			templateUrl: "src/sandbox/virtualList/virtualList.html",
			controller: function(){},
			access: 'public'
		})
		.state('sandbox.virtualList.master', {
			url: "/master",
			controller: 'MasterCtrl',
			templateUrl: "src/sandbox/virtualList/master.html",
			access: 'public'
		})
		.state('sandbox.virtualList.detail', {
			url: "/detail/:petsId",
			controller: 'DetailCtrl',
			templateUrl: "src/sandbox/virtualList/detail.html",
			access: 'public'
		})
		.state('main.logout', {
			url: "/logout",
			templateUrl: "src/pages/login/login.html",
			controller: function (SessionServ, CoolServ, $state, MiscServ) {
				SessionServ.logout();

				MiscServ.goTo('welcome.login');
			},
			access: 'private'
		});

		$urlRouterProvider.otherwise('/');
	})
;
