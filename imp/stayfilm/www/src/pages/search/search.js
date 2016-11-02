angular.module('fun.controllers')
	.controller('SearchController', function ($rootScope, $scope, LogServ, MiscServ, $stateParams, $state, StorageServ) {

		var log = LogServ;

		log.info('SearchController');

		if ( ! $scope.fromState) {
			$scope.backButtonState = 'main.home.feed';
		} else {
			if ($scope.fromState.name.match(/main\.home\.search/)) {
				$scope.backButtonState = StorageServ.get('searchBackState', true) || 'main.home.feed';
				$scope.backButtonParams = StorageServ.get('searchBackParams', true) || {};
			} else {
				$scope.backButtonState = $scope.fromState.name;
				$scope.backButtonParams = $scope.fromStateParams;
				StorageServ.set('searchBackState', $scope.backButtonState, 'memory');
				StorageServ.set('searchBackParams', $scope.backButtonParams, 'memory');
			}
		}

		log.debug('backButtonState', $scope.backButtonState, $scope.backButtonParams);

		$rootScope.hideLogButton = true;

		$scope.search = function (term) {

			log.debug('search', term);

			StorageServ.remove('search', true);

			$scope.goTo($state.current.name, null, {term: term}, {reload: true});
		};

		$scope.$on('$destroy', function () {
			$rootScope.hideLogButton = false;
		});

		$scope.loadMore = function loadMore (type) {
			log.debug('loadmore()', 'bag :', bag);

			if ( ! term) {
				return;
			}

			$scope.loading = true;

			var params;

			if (type === 'user') {
				params = {user: {limit: userLimit, offset: bag.user.offset}};
			} else if (type === 'movie') {
				params = {movie: {limit: movieLimit, offset: bag.movie.offset}};
			} else {
				params = {user: {limit: userLimit, offset: bag.user.offset}, movie: {limit: movieLimit, offset: bag.movie.offset}};
			}

			MiscServ.search(term, params).then(function (resp) {

				log.debug('search result', resp);

				if (resp.data.movie) {
					bag.movie.count = resp.data.movie.count;
					bag.movie.list = bag.movie.list.concat(resp.data.movie.list);
					bag.movie.offset = resp.data.movie.nextOffset;

					bag.movie.finished =  ! resp.data.movie.nextOffset; // if null, finished true
				}

				if (resp.data.user) {
					bag.user.count = resp.data.user.count;
					bag.user.list = bag.user.list.concat(resp.data.user.list);
					bag.user.offset = resp.data.user.nextOffset;

					bag.user.finished =  ! resp.data.user.nextOffset; // if null, finished true
				}

				log.debug(bag);

				$scope.infiniteScrollActive = true;

				bag.term = term;

				StorageServ.set('search', bag, 'memory');

				if (firstSearch) {

					if (bag.user.count > bag.movie.count) {
						$scope.goTo('main.home.search.user', null, $stateParams);
					} else {
						$scope.goTo('main.home.search.movie', null, $stateParams);
					}
				}

				firstSearch = false;

			}).finally(function () {
				$scope.loading = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.cancel = function () {
			// StorageServ.remove('search', true);
			// $scope.goTo($scope.backButtonState, null, $scope.backButtonParams);
			$scope.goTo('main.home.feed');
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

		$scope.form = {};

		var bag = StorageServ.get('search', true),
			movieLimit = 10,
			userLimit = 30,
			firstSearch = true,
			term = $scope.form.term = $stateParams.term;

		$scope.infiniteScrollActive = false;

		if ( ! bag) {
			bag = {term: null, user: {list:[], count: 0, offset: null, finished: false}, movie: {list:[], count: 0, offset: null, finished: false}};
			$state.go('main.home.search.movie', $stateParams);
			$scope.loadMore();

		} else {
			$scope.form.term = term = bag.term;
			$scope.infiniteScrollActive = true;

			firstSearch = false;

			if (bag.user.count > bag.movie.count) {
				$scope.goTo('main.home.search.user', null, $stateParams);
			} else {
				$scope.goTo('main.home.search.movie', null, $stateParams);
			}
		}

		$scope.bag = bag;
	})
	.controller('UserSearchController', function () {

	})
	.controller('MovieSearchController', function () {

	})
;
