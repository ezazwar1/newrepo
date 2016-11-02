'use strict';

app.factory('User', [
  '$resource',
  '$q',
  'CONFIG',
function($resource, $q, CONFIG) {

  var User = $resource(CONFIG.url + '/users/:userId', { userId: '@id' }, {
    create: {
      method: "POST",
      url: CONFIG.url + "/users"
    },
    update: {
      method: 'PUT'
    }
  });

  return User;

}]);
