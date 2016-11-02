angular.module('fun.services')
	.factory('LogServ', function (Utils, ConfigServ) {

		var list = [];

		var logLevels = {error: 0, warn: 1, info: 2, log: 3, debug: 4};

		var currentLogLevel = ConfigServ.getLogLevel();

		console.log("CURRENT LOG LEVEL", currentLogLevel);

		function log(level, args) {

			switch (level) {
				case 'error':
				case 'warn':
				case 'info':
				case 'debug':
					break;
				default:
					level = 'log';
			}

			var levelNum = logLevels[level];

			if (levelNum > currentLogLevel) {
				return;
			}

			var strParams = [level];
			var params = [];

			angular.forEach(args, function (val) {

				params.push(val);

				if (angular.isArray(val) || angular.isObject(val)) {
					try {
						strParams.push(JSON.stringify(val));
					} catch (e) {
						strParams.push('[complex object OR array]');
					}
				} else {
					strParams.push(val+"");
				}
			});

			if (Utils.isCordovaApp() && ( ! Utils.isAndroid())) {
				console.log(strParams.join(' | '));
			} else {
				console[level].apply(console, params);
			}

			list.unshift({level: level, args: params});
		}

		return {
			error: function () {
				log('error', arguments);
			},
			warn: function () {
				log('warn', arguments);
			},
			info: function () {
				log('info', arguments);
			},
			debug: function () {
				log('debug', arguments);
			},
			getRef: function () {
				return list;
			}
		};
	})
;
