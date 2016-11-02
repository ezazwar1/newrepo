angular.module('fun.services')
	.factory('StorageServ', function (DSCacheFactory) {

		var defaultDuration = 60 * 1000 * 60 * 24 * 7;

		var options = {
			onExpire: function (key) { //(key, value)
				window.lastExpiredItem = key;
				console.log('onexpired ' + key);
			},
			// maxAge: 3600000,
			storageMode: 'localStorage',
			maxAge: defaultDuration,
			deleteOnExpire: 'passive'
		};

		var localStorageCache = DSCacheFactory.get('mainCache');

		if ( ! localStorageCache) {
			localStorageCache = DSCacheFactory('mainCache', options);
		}

		var permanentCache = DSCacheFactory.get('permanentCache');

		if ( ! permanentCache) {
			permanentCache = DSCacheFactory('permanentCache', options);
		}

		options = {
			onExpire: function (key) { //(key, value)
				window.lastExpiredItem = key;
				console.log('onexpired ' + key);
			},
			// maxAge: 3600000,
			storageMode: 'localStorage',
			maxAge: defaultDuration,
			deleteOnExpire: 'passive'
		};

		var configCache = DSCacheFactory.get('configCache');

		if ( ! configCache) {
			configCache = DSCacheFactory('configCache', options);
		}

		options = {
			onExpire: function (key) { // (key, value)
				window.lastExpiredItem = key;
				console.log('onexpired ' + key);
			},
			// maxAge: 3600000,
			storageMode: 'memory',
			maxAge: defaultDuration,
			deleteOnExpire: 'passive'
		};

		var memoryCache = DSCacheFactory.get('memoryCache');

		if ( ! memoryCache) {
			memoryCache = DSCacheFactory('memoryCache', options);
		}

		function getCache(cacheName) {

			var cache;

			if (cacheName === 'config') {
				cache = configCache;
			} else if (cacheName === 'memory' || cacheName === true) {
				cache = memoryCache;
			} else if (cacheName === 'permanent') {
				cache = permanentCache;
			} else {
				cache = localStorageCache;
			}

			return cache;
		}

		return {
			set: function (key, val, cacheName, duration) {

				if ( ! duration) {
					duration = defaultDuration;
				} else {
					duration = duration * 1000;
				}

				var cache = getCache(cacheName);

				cache.setMaxAge(duration);
				cache.put(key, val);
			},
			unset: function (key, cacheName) {
				return this.remove(key, cacheName);
			},
			get: function (key, cacheName) {
				var cache = getCache(cacheName);

				return cache.get(key);
			},
			has: function (key, cacheName) {
				var cache = getCache(cacheName);

				return !! cache.get(key);
			},
			remove: function (key, cacheName) {
				var cache = getCache(cacheName);

				cache.remove(key);
			},
			removeAll: function (cacheName) {
				var cache = getCache(cacheName);

				return cache.removeAll();
			}
		};
	}
);
