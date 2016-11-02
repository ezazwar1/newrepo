(function() {
	'use strict';

	angular.module('welzen').factory('stateService', stateService);

	function stateService($state, $rootScope){

		var previousState;
		var previousParam;
		var currentState;
		var currentParam;

		var stateService = {
			init: init,
			goBackState: goBackState,
			getPreviousState: getPreviousState
		};
		
		return stateService;

		function goBackState(){
			$state.go(previousState,previousParam);
		}

		function getPreviousState(){
			return previousState;
		}

		function init(){
			$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
				previousState = from.name;
				previousParam = fromParams;

				currentState = to.name;
				currentParam = toParams;
			});			
		}
	}

}());