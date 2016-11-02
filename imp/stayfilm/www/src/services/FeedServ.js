angular.module('fun.services')
	.factory('FeedServ', function (CoolServ, SessionServ, StorageServ) {

		var bag;

		return {
			getFeedFromCache: function () {

				var cachedFeed = StorageServ.get('feed');

				return cachedFeed ? cachedFeed.data : null;
			},
			getFeed: function (offset, newStories) {

				var params = {offset: offset, storyTypes:'movie,movie-share', limit: 6};

				if (newStories) {
					params.new = true;
				}

				return CoolServ.get('user/' + SessionServ.getUser().username + '/feed', params).then(function (resp) {

					var feedCache = StorageServ.get('feed');

					if ( ! feedCache) {
						feedCache = {};
						feedCache.data = resp.data;
						feedCache.offset = offset;
					} else if ( ! offset) {
						feedCache.data = resp.data;
						feedCache.offset = offset;
					}

					if (feedCache) {
						StorageServ.set('feed', feedCache);
					}

					return resp;
				});
			},
			share: function (idmovie, comment) {
				var user = SessionServ.getUser().username,
					params = {
						idmovie: idmovie,
						comment: comment || ""
					};

				return CoolServ.post('user/' + user + '/feed', params);
			},
			feedObjRef: function(bagRef) {
				bag = bagRef;
			},
			getMovieFromFeed: function (idmovie) {
				console.log("FeedServ.getMovieFromFeed()");
				for (var i = 0; i < bag.stories.length; i++) {
					if (bag.stories[i].value.idMovie == idmovie) {
						console.log("got movie: [" + i + "]", bag.stories[i].value);

						return bag.stories[i].value;
					}
				}
			},
			removeMovieFromFeed: function(movie) {
				console.log("FeedServ.removeMovieFromFeed()");
				for (var i = 0; i < bag.stories.length; i++) {
					console.log("bag.stories[i].value.idMovie", bag.stories[i].value.idMovie);
					console.log("movie.idMovie", movie.idMovie);
					console.log("bag.stories[i].value.idMovie == movie.idMovie", bag.stories[i].value.idMovie == movie.idMovie);
					if (bag.stories[i].value.idMovie == movie.idMovie) {
						console.log("to be removed: [" + i + "]", bag.stories[i]);
						
						var removed = bag.stories.splice(i, 1);
						console.log("removed", removed);

						break;
					}
				}
			}
		};
	})
;
