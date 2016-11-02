'use strict';

app.factory('CustomerStaff', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {


	var CustomerStaff = $resource(CONFIG.url + '/customers/:customerId/staff/:staffId', { customerId: '@id', staffId: '@id'}, {
		update: {
	      method: 'PUT'
	    },
	    get: {
	      method: 'GET'
	    }

	});



	return CustomerStaff;

  

}]);
