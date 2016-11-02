'use strict';

app.factory('Manager', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {

  var Manager = $resource(CONFIG.url + '/managers/:managerId', { managerId: '@id' }, {
   
    update: {
      method: 'PUT'
    }
  });


  return Manager;

}]);