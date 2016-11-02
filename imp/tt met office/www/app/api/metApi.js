angular.module('ionic.metApp')
// .constant('apiUrl', '/api')
.factory('metApi', ['$http', '$rootScope', 'resources', '$q',
	function($http, $rootScope, resources, $q) {
		var url = resources.apiUrl;
		return {
			subscribe_token: function(token) {
				// http://190.58.130.230/api/subscribe?device_token=[TOKEN].
				var q = $q.defer();
				$http.post(url + '/subscribe?device_token=' + token).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_tokens: function(callback) {
				var q = $q.defer();
				$http.get(url + '/subscribe/list').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			unsubscribe: function(token) {
				var link = (token != undefined) ? '?device_token=' + token : '';
				var q = $q.defer();
				$http.post(url + '/unsubscribe' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_forecast: function() {
				var q = $q.defer();
				$http.get(url + '/forecast').then(function(data) {
					q.resolve(data)
				}, function(error) {
					q.reject(error)
				})

				return q.promise;
			},


			get_b_info: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';
				// $ionicLoading.show({
				// 	template: ' <ion-spinner></ion-spinner>'
				// });
				$http.get(url + "/bulletininfo" + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);
				});

				return q.promise;
			},

			get_b_serv: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';
				$http.get(url + "/bulletinsev" + link).then(function(data) {
					q.resolve(data.data)
				}, function(error) {
					q.reject(error);
				});

				return q.promise;
			},

			get_b_flood: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';
				$http.get(url + '/bulletinflood' + link).then(function(data) {
					q.resolve(data.data)
				}, function(error) {
					q.reject(error);
				});

				return q.promise;
			},

			get_b_sea: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';
				$http.get(url + '/bulletinsea' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);
				});

				return q.promise;
			},

			// check for winds
			get_o_air: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';

				$http.get(url + '/outlookair' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);
				});

				return q.promise;
			},

			get_o_aviation: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';

				$http.get(url + '/outlookaviation' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},

			get_o_period: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';

				$http.get(url + '/outlookperiod' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},

			get_o_tv: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';

				$http.get(url + '/outlooktv' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},

			get_sigmet: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';

				$http.get(url + '/sigmet' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},

			get_ttcp: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';

				$http.get(url + '/ttcp' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},

			get_ttpp: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';

				$http.get(url + '/ttpp' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},

			get_warn: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';

				$http.get(url + '/warn' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},


			get_watch: function(id) {
				var q = $q.defer();
				var link = (id != undefined) ? '/' + id : '';

				$http.get(url + '/watch' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},


			get_uv_index: function() {
				var q = $q.defer();
				var headers = {
					'Cache-Control': 'max-age="600"'
				};
				$http.get(url + '/uv', headers).then(function(data) {
					// console.warn(data)
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);
				});

				return q.promise;
			},

			// new set of keys
			// was there before just modified to take an id
			get_radar: function(id) {
				var link = "";
				if (id && id != 0) {
					link = id;
				}
				// var link = (id != undefined) ? '/' + id : '';

				// console.log('link', link)
				var q = $q.defer();
				$http.get(url + '/radar/search?item=' + link).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_tourism: function() {
				var q = $q.defer();
				$http.get(url + '/tourism').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_tides: function() {
				var q = $q.defer();
				$http.get(url + '/tidal').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_drywet: function(callback) {
				var q = $q.defer();
				$http.get(url + '/drywet').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_issue: function(callback) {
				var q = $q.defer();
				$http.get(url + '/issue').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_agrotrini: function() {
				var q = $q.defer();
				$http.get(url + '/argotrini').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_agroData: function(type) {
				var q = $q.defer();
				var agrourl = 'http://190.58.130.230/api/argotrini/search?item=';

				$http.get(agrourl + type).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);
				});

				return q.promise;
			},

			get_agrotbg: function() {
				var q = $q.defer();
				$http.get(url + '/argotbg').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_agroDataTbg: function(type) {
				var q = $q.defer();
				var agrourl = 'http://190.58.130.230/api/argotbg/search?item=';

				$http.get(agrourl + type).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},

			get_trend: function(callback) {
				var q = $q.defer();
				$http.get(url + '/trend').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_elnino: function(callback) {
				var q = $q.defer();
				$http.get(url + '/elnino').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_elninos: function() {
				var q = $q.defer();
				$http.get(url + '/elninos').then(function(data) {
					// console.log(data.data);

					var count = data.data._meta.totalCount;

					// console.log('count', count);
					var info = new Array(count);

					for (var i = 0; i < count; i++) {
						info[i] = data.data.items[i];
					};

					//console.log(info[0]);
					data = info;

					q.resolve(data);
				}, function(error) {
					q.reject(error)
				});

				return q.promise;
			},

			get_option_files: function(s) {
				var q = $q.defer();
				$http.get(url + s).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);
				});

				return q.promise;
			},


			get_rainandtemp: function(callback) {
				var q = $q.defer();
				$http.get(url + '/rainandtemp').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_project: function(callback) {
				var q = $q.defer();
				$http.get(url + '/project').then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},

			get_metar: function() {
				var q = $q.defer();
				$http.get(url + '/metar').then(function(data) {
					q.resolve(data)
				}, function(error) {
					q.reject(error);
				});

				return q.promise;
			},

			get_aws: function(station) {
				var q = $q.defer();
				$http.get(url + '/aws/search?name=' + station).then(function(data) {
					q.resolve(data.data);
				}, function(error) {
					q.reject(error);

				});

				return q.promise;
			},
		}
	}
])
