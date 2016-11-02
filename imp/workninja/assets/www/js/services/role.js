'use strict';

app.factory('Role', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {

  var Role = $resource(CONFIG.url + '/roles/:roleId', { roleId: '@id' }, {
    eta: {
      method: 'GET',
      url: CONFIG.url + '/roles/eta',
      isArray: true
    }
  });

  angular.extend(Role.prototype, {
    hasEta: function() {
      return this.eta !== null;
    },
    etaInMinutes: function() {
      if (this.eta === null || this.eta < 60) {
        return 1; // min 1min
      }
      else {
        return Math.round(this.eta / 60);
      }
    }
  });

  return Role;

}]);
