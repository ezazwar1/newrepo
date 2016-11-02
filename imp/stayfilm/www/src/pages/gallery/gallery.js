angular.module('fun.controllers')
	.controller('BestofGalleryController', function ($scope, LogServ, SessionServ, $location, GalleryServ, StorageServ,
													 $ionicScrollDelegate, $timeout, MiscServ) {
		var log = LogServ;

		log.info('BestofGalleryController()');

		var bag = StorageServ.get('gallery.bestof', true);

		if ( ! bag) {
			bag = {movies: [], finished: false, weekAgo: 1};
		}

		$scope.bag = bag;

		$scope.loadMore = function () {

			log.debug('loadMore()' + bag);

			$scope.animationName = 'loadMoreAnim';

			GalleryServ.getBestof(bag.weekAgo).then(function (resp) {

				bag.finished = resp.data.length === 0;
				bag.weekAgo++;

				angular.forEach(resp.data, function (movie) {
					bag.movies.push(movie);
				});

				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.refresh = function () {
			log.debug('refresh()');

			$scope.animationName = 'pullToRefreshAnim';

			GalleryServ.getBestof(1).then(function (resp) {
				log.debug('getMovies()', resp.data);

				var filteredList = MiscServ.filterMovieList(bag.movies, resp.data);

				angular.forEach(filteredList, function (o) {
					bag.movies.unshift(o);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		$scope.$on("$destroy", function() {
			StorageServ.set('gallery.bestof', bag, 'memory');
		});
	})
	.controller('LatestGalleryController', function ($scope, LogServ, SessionServ, $location, GalleryServ, StorageServ,
													 $ionicScrollDelegate, $timeout, MiscServ) {
		var log = LogServ;

		log.info('LatestGalleryController()');

		$scope.currentLanguage = SessionServ.getLang();

		var bag = StorageServ.get('gallery.latest', true);

		if ( ! bag) {
			bag = {movies: [], finished: false, offset: null};
		}

		$scope.bag = bag;

		$scope.loadMore = function () {

			log.debug('loadMore()' + bag);

			$scope.animationName = 'loadMoreAnim';

			GalleryServ.getMovies(bag.offset).then(function (resp) {

				bag.finished = resp.data.length === 0;
				bag.offset = resp.nextOffset;

				angular.forEach(resp.data, function (movie) {
					bag.movies.push(movie);
				});

				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.refresh = function () {
			log.debug('refresh()');

			$scope.animationName = 'pullToRefreshAnim';

			GalleryServ.getMovies().then(function (resp) {
				log.debug('getMovies()', resp.data);

				var filteredList = MiscServ.filterMovieList(bag.movies, resp.data);

				angular.forEach(filteredList, function (o) {
					bag.movies.unshift(o);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		$scope.$on("$destroy", function() {
			StorageServ.set('gallery.latest', bag, 'memory');
		});
	})
	.controller('GenreGalleryController', function ($scope, $stateParams, ConfigServ, LogServ, SessionServ, $location, GalleryServ, StorageServ,
													$ionicScrollDelegate, $timeout, MiscServ) {

		var log = LogServ;

		log.info('LatestGalleryController()');

		$scope.currentLanguage = SessionServ.getLang();

		var slug = $stateParams.slug;
		var type = $stateParams.type;
		var galleryList = ConfigServ.get('fun_gallery_list');

		var gallery = _.find(galleryList, function (item) {
			return item.slug === slug && item.type === type;
		});

		if ( ! gallery) {
			throw new Error('unknow gallery - slug: ' + slug + ' - type: ' + type);
		}

		$scope.gallery = gallery;

		var bag = StorageServ.get('gallery.' + gallery.type + '.' + gallery.slug, true);

		if ( ! bag) {
			bag = {movies: [], finished: false, offset: null};
		}

		$scope.bag = bag;

		$scope.loadMore = function () {

			log.debug('loadMore()' + bag);

			$scope.animationName = 'loadMoreAnim';

			GalleryServ.getMovies(bag.offset, gallery.slug, gallery.type).then(function (resp) {

				bag.finished = resp.data.length === 0;
				bag.offset = resp.nextOffset;

				angular.forEach(resp.data, function (movie) {
					bag.movies.push(movie);
				});

				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.refresh = function () {
			log.debug('refresh()');

			$scope.animationName = 'pullToRefreshAnim';

			GalleryServ.getMovies(null, gallery.slug, gallery.type).then(function (resp) {
				log.debug('getMovies()', resp.data);

				var filteredList = MiscServ.filterMovieList(bag.movies, resp.data);

				angular.forEach(filteredList, function (o) {
					bag.movies.unshift(o);
				});

				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		$scope.$on("$destroy", function() {
			StorageServ.set('gallery.' + gallery.type + '.' + gallery.slug, bag, 'memory');
		});

	})
	.controller('GenresGalleryController', function ($scope, SessionServ, $location, GalleryServ, ConfigServ, LogServ, MiscServ) {

		$scope.galleryList = ConfigServ.get('fun_gallery_list');
		
		$scope.currentLanguage = SessionServ.getLang();

		$scope.goToGallery = function (slug, type) {
			MiscServ.goTo('main.home.gallery.genre', 'slide-left', {slug: slug, type: type});
		};
	})
;
