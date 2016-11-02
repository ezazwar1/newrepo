angular.module('fun.services')
.factory('FbClientServ', function (LogServ, $http, StorageServ, Restangular) {

	var log = LogServ;

	var restangular = Restangular.withConfig(function(RestangularConfigurer) {
		RestangularConfigurer.setBaseUrl('https://graph.facebook.com/v2.2/');
	});

	restangular.setErrorInterceptor(function(response) {
		if (response.status === 0) {
			return true; // error not handled
		}
	});

	return {
		hasPermission: function (done) {

			this.api('me/permissions?limit=5000')
				.then(function (res) {

					if ( ! res || ! res.data) {
						done('error while checking permissions');
						return;
					}

					var found = _.find(res.data, function (el) {
						return (el.permission === 'user_photos' && el.status === 'granted') || (res.data && res.data.length > 0 && res.data[0].user_photos);
					});

					if (found) {
						done(null, true);
					} else {
						done(null, false);
					}
				}, function (err) {
					done(err);
				})
			;
		},
		removePermissions: function (done) {

			var token = StorageServ.get('fb_access_token');

			var params = { access_token: token, format: 'json', pretty: 0 };

			return restangular.one('me/permissions').delete(params).then(done);
		},
		add: function (path, callback) {

			this.api(path)
				.then(function (data) {
					callback(null, data);
				}, function (err) {
					log.error("FbClientServ.add ERROR", "("+ (typeof err) + ")", err);
					callback(err);
				})
			;
		},
		setToken: function (token) {
			StorageServ.set('fb_access_token', token);
		},
		api: function (path) {
		
			var token = StorageServ.get('fb_access_token');

			var params = { access_token: token, format: 'json', pretty: 0 };

			return restangular.one(path).get(params);
		}
	};
});
