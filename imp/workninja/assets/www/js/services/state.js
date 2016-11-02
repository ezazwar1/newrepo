'use strict';

app.factory('State', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {

  var State = $resource(CONFIG.url + '/states');

  return State;

}]);
