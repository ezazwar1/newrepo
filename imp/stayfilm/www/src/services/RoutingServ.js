angular.module('fun.services')
	.factory('RoutingServ', function (LogServ, $state) {

		var callback;

		return {
			registerCb: function (func) {
				callback = func;
			},
			executeCb: function (toState) {

				if (callback) {
					return callback(toState);
				}

				return true;
			},
			deregisterCb: function () {
				callback = null;
			},
			route: function(fromState, toState) {

				var name;

				if (fromState.name === 'main.waiting' && toState.name !== 'main.publish') {

					if (window.confirm('are sure to want to leave ?')) {
						name = 'main.home.feed';
					} else {
						return false;
					}
				}

				if (toState.name === 'main.waiting' &&  ! _.contains(['main.moviemaker.theme', 'main.albummanager.contentzone'], fromState.name)) {
					name = 'main.moviemaker.content';
				}

				if (name) {
					toState = $state.get(name);

					if ( ! toState) {
						throw new Error('invalid state: ' + toState.name);
					}
				}

				return toState;
			}
		};
	})
;
