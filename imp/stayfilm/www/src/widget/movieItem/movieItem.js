angular.module('fun')
	.directive('sfMovieItem', function () {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'src/widget/movieItem/movieItem.html',
			scope: {
				movie: "=movie"
			},
			controller: function ($scope) {
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
