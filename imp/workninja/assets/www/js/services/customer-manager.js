'use strict';

app.factory('CustomerManager', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {
	var CustomerManager = $resource(CONFIG.url + '/customers/:customerId/managers/:managerId', { customerId: '@id', managerId: '@id'}, {
		update: {
	      method: 'PUT'
	    },
	    get: {
	      method: 'GET'
	    }

	});
	return CustomerManager; 
}]);