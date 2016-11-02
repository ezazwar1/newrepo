'use strict';

app.factory('CustomerWorkplace', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {
	var CustomerWorkplace = $resource(CONFIG.url + '/customers/:customerId/workplaces/:workplaceId', { customerId: '@id', workplaceId: '@id'}, {
		update: {
	      method: 'PUT'
	    },
	    get: {
	      method: 'GET'
	    }

	});
	return CustomerWorkplace; 
}]);