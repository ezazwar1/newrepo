angular.module('fun')
	.directive('sfMovieMosaic', function () {
		return {
			restrict: 'E',
			templateUrl: 'src/widget/movieMosaic/movieMosaic.html',
			scope: {
				movie: "=movie",
				user: "=user"
			},
			link: function (scope, element, attrs) {
				scope.type = attrs.type ? attrs.type : 'classic';
			},
			controller: function (
				$scope, ProfileModal, $rootScope, $timeout, SessionServ, MovieServ, 
				$ionicActionSheet, MiscServ, LogServ, gettextCatalog, 
				UIServ
			) {
				var log = LogServ;

				$scope.watch = $rootScope.watch;
				$scope.ProfileModal = ProfileModal;

				// var privacyMapping = {private: 1, friend: 2, public: 3};

				$scope.like = function (movie) {

					if ($scope.loadingLike) {
						return;
					}

					$scope.loadingLike = true;

					MovieServ.like(movie).then(function (resp) {

						$scope.loadingLike = false;
						$scope.movie.liked = resp === 'CREATED';

						if (resp === 'CREATED') {
							$scope.movie.likeCount++;
						} else {
							$scope.movie.likeCount--;
						}

					}, function () {
						$scope.loadingLike = false;

						MiscServ.showError('Ação indisponivel. Tente novamente mais tarde !');
					});
				};

				$scope.changePermission = function(movie) {
					UIServ.changeMoviePermission(movie);
				};

				$scope.discard = function (movie) {
					UIServ.discardMovie(movie);
				};

				$scope.getImageUrl = function(movie, size) {
					var filename, width,
						ext = '.jpg';

					if ( ! size) {
						width = $(window).width(); //todo: caching

						console.log(width);

						if (width < 300) {
							size = 'small';
						} else if (width > 640) {
							size = 'large';
						} else {
							size = 'medium';
						}
					}

					switch (size)
					{
						case 'small':
							filename = '266x150';
							break;
						case 'medium':
							filename = '572x322';
							break;
						case 'large':
							filename = '640x360';
							break;
						default:
							throw Error('size ' + size + 'not available');
					}

					filename = filename  + '_n' + ext;

					return movie.baseUrl + '/' + filename;
				};
			}
		};
	})
;
