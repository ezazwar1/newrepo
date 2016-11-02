'use strict';

app.factory('Pin', [
  '$resource',
  'CONFIG',
function($resource, CONFIG) {

  var Pin = $resource(CONFIG.url + '/pin_payments/customer', {});

  angular.extend(Pin.prototype, {
    card_icon_class: function() {
      if (this.card) {
        switch (this.card.scheme) {
          case 'visa':
            return 'fa fa-cc-visa';
          case 'master':
            return 'fa fa-cc-mastercard';
          default:
            return 'fa fa-credit-card';
        }
      }
    },

    card_last4: function() {
      if (this.card) {
        var groups = this.card.display_number.split('-');
        if (groups.length > 0) {
          return groups[groups.length - 1];
        }
      }
    }
  });

  return Pin;

}]);
