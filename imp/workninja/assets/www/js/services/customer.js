'use strict';

app.factory('Customer', [
  '$resource',
  '$q',
  'CONFIG',
function($resource, $q, CONFIG) {

  var Customer = $resource(CONFIG.url + '/customers/:customerId', { customerId: '@id' }, {
    create: {
      method: "POST",
      url: CONFIG.url + "/customers"
    },
    update: {
      method: 'PUT'
    },
    addCard: {
      method: 'PUT',
      url: CONFIG.url + '/customers/:customerId/add_card'
    },
    getWorkplaces: {
      method: 'GET',
      isArray: true,
      url: CONFIG.url + '/customers/:customerId/workplaces'
    },
    getPaymentDetails: {
      method: 'GET',
      url: CONFIG.url + '/customers/:customerId/payment_details'
    },
    addWorkplace: {
      method: 'POST',
      url: CONFIG.url + '/customers/:customerId/workplaces'
    },
    getStaff: {
      method: 'GET',
      isArray: true,
      url: CONFIG.url + '/customers/:customerId/staff'
    },
    inviteStaff: {
      method: "POST",
      url: CONFIG.url + "/customers/:customerId/staff"
    },
    inviteManager: {
      method: "POST",
      url: CONFIG.url + "/customers/:customerId/managers",
    },
    getManagers: {
      method: 'GET',
      isArray: true,
      url: CONFIG.url + '/customers/:customerId/managers'
    },
    signup: {
      method: "POST",
      url: CONFIG.url + "/customers/signup",
    }
  });

    angular.extend(Customer.prototype, {

    fullName: function() {
      return _.join(' ', this.contact_first_name, this.contact_last_name);
    },

    isSetupComplete: function() {
      try {
          return !_.isBlank(this.first_name);
      } catch (e) {
           return true;
      }
      
    },

    setCreditCardToken: function(pin_public_key, pin_mode, card) {
      var pinApi = new Pin.Api(pin_public_key, pin_mode);
      var deferred = $q.defer();
      var customer = this;

      function handleCreditCardTokenSuccess(card) {
        customer.cc_token = card.token;
        deferred.resolve();
      }

      function handleCreditCardTokenError(error) {
        deferred.reject(error);
      }

      var pin = pinApi.createCardToken(card);
      pin.then(handleCreditCardTokenSuccess, handleCreditCardTokenError).done();
      return deferred.promise;
    }
  });

  return Customer;

}]);
