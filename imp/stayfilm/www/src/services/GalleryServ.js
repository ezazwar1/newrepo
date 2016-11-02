angular.module('fun.services')
	.factory('GalleryServ', function (CoolServ) {
		return {
			getMovies: function (offset, slug, type) {
				return CoolServ.get('gallery', {include: 'bare', slug: slug, offset: offset, type: type});
			},
			getBestof: function (weekAgo) {
				return CoolServ.get('bestof/', {include: 'bare', weekAgo: weekAgo});
			}
		};
	})
;
