'use strict';

app.factory('Workplace', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {

  var Workplace = $resource(CONFIG.url + '/workplaces/:workplaceId', { workplaceId: '@id' }, {
    nearbyAgencyStaff: {
      method: 'GET',
      url: CONFIG.url + '/workplaces/:workplaceId/staff/nearby?agency_staff=true',
      isArray: true
    },
    nearbyCustomerStaff: {
      method: 'GET',
      url: CONFIG.url + '/workplaces/:workplaceId/staff/nearby?agency_staff=false',
      isArray: true
    },
    nearbyCustomerRoles: {
      method: 'GET',
      url: CONFIG.url + '/workplaces/:workplaceId/roles/nearby?agency_staff=false',
      isArray: true
    },
    nearbyAgencyRoles: {
      method: 'GET',
      url: CONFIG.url + '/workplaces/:workplaceId/roles/nearby?agency_staff=true',
      isArray: true
    },
    createJobOffer: {
      method: 'POST',
      url: CONFIG.url + '/workplaces/:workplaceId/offer',
    },
    update: {
      method: 'PUT',
      url: CONFIG.url + '/workplaces/:workplaceId'
    }
  });

  angular.extend(Workplace.prototype, {
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

  return Workplace;

}]);