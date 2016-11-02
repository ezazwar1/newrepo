angular.module('ionic.metApp')
	.controller('ForecastCtrl', ['metApi', '$interval', '$ionicHistory', '$route', '$localstorage', '$rootScope',
		function(metApi, $interval, $ionicHistory, $route, $localstorage, $rootScope) {
			var vm = this;
			vm.forecast = $localstorage.getObject('fcast');
			vm.forecast.PiarcoRainfall = vm.forecast.PiarcoRainfall.replace(/mm/g, '');
			vm.forecast.CrownPointRinfall = vm.forecast.CrownPointRinfall.replace(/mm/g, '');
			vm.forecast.cumlativeRain = vm.forecast.cumlativeRain.replace(/mm/g, '');
			var interval = 10 * 60000;
			// $rootScope.$on('f_cast_ready', function(event, data) {
			// 	vm.forecast = $localstorage.getObject('fcast');
			// });
			$interval(function time() {
				$ionicHistory.clearCache().then(function() {
					// console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
					// console.log('cache cleared');
					$route.reload();
					vm.getForecast();
					$route.reload();

				});
				// $ionicHistory.clearHistory();
			}, interval);

			vm.getForecast = function() {
				metApi.get_forecast().then(function(data) {
					vm.forecast = data.data.items[0];
					// console.log('data', vm.forecast);
				}, function(error) {
					$rootScope.doAlert('Error getting forecast');
					// console.log('error getting forecast', error);
				})
			}
		}
	])
