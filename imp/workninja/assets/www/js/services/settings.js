'use strict';

app.factory('Settings', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {

  var Settings = $resource(CONFIG.url + '/settings');

  return Settings;

}]);
