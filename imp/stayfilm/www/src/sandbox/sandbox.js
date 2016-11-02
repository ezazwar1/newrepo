angular.module('fun.sandbox')
	.controller('CollectionRepeatSandboxController', function (
		$scope, $log, AuthServ, SessionServ, $state, CoolServ, UserServ, $ionicPopup,
		FacebookServ, MiscServ, LogServ, $rootScope, $timeout, MediaServ
		) {
		var log = LogServ;

		log.info('CollectionRepeatSandboxController');

		$scope.items = [];

		$scope.getItemHeight = function(item, index) {
			//Make evenly indexed items be 10px taller, for the sake of example
			return (index % 2) === 0 ? 50 : 60;
		};


		$scope.mediaList = [];

		$scope.loadMore = function() {

			MediaServ.getMedias(SessionServ.getUsername(), {albums: '907d7527-dbc7-446b-b3ab-5c597edb2c14'}).then(function (resp) {
				log.debug("MEDIAS", resp.data);

				var medias = resp.data;

				log.info(medias);

				$scope.mediaList = $scope.mediaList.concat(medias);

				$scope.$broadcast('scroll.infiniteScrollComplete');

			});
		};

	})
	.controller('TestSandBoxController', function ($scope) {

		var params = {idmovie:'12345', url: 'http://melies.stayfilm.com/5960e39b-96f4-458c-8153-219ada515bf7/video.mp4', title: 'SANDboxed'};

		$scope.download = function () {
			console.log('download', params);

			window.downloadMovieToDevice(params, function (err, file) {
				if (err) {
					alert(err);
					return;
				}

				alert(file);

				jwplayer('jwplayer').setup({
					file: file
				});

				$scope.publish = function () {
					console.log('publish', params);

					params.url =  file;

					window.sendToFbMessenger(params, function () {
						console.log('send to messenger done');
					});
				};
			});
		};


	})
	.controller('PromiseSandBoxController', function ($scope, $q, $timeout) {

		console.log('PromiseSandBoxController');

		function asyncFunc() {
			var deferred = $q.defer();

			$timeout(function () {

				var d = new Date();


				deferred.resolve(d.getTime());
			}, 1000);

			return deferred.promise;
		}

		asyncFunc().then(function (result) {

			if (result % 2 === 0) {

				console.log('pair');

				return true;
			} else {
				throw new Error('an error');

			}

		}).then(function (resp) {
			console.log(resp);
		}, function (err) {
			console.log(err);
		});

	})
;
