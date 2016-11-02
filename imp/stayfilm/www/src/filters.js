angular.module('fun')
	.filter('defaultThumbUser', function (ConfigServ) {
		return function (photo) {

			if ( ! photo) {
				photo = ConfigServ.getUrl('defaultProfileThumb');
			}

			return photo;
		};
	})
	.filter('myanim', function () {
		return function ( currentState, button) {

			if (button === 'feed' && currentState ===  'main.home.feed') {
				return 'bounceIn';
			}

			if (button === 'gallery' && currentState ===  'main.home.gallery.bestof') {
				return 'bounceIn';
			}

			if (button === 'moviemaker' && currentState ===  'main.moviemaker.content') {
				return 'bounceIn';
			}

			if (button === 'notification' && currentState ===  'main.home.notification') {
				return 'bounceIn';
			}

		};
	})
	.filter('movie.getImageUrl', function() {
		return function(movie, size) {
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
	})
;
