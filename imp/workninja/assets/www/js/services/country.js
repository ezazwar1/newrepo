'use strict';

app.factory('Country', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {

  return $resource(CONFIG.url + '/countries/:countryId', { countryId: '@id' });

}]);
