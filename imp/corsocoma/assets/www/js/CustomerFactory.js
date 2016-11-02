angular.module('customer.factories', [])

.factory('adressesService', function($http, $localstorage) {
  return {
    getadresses: function(customer_id) {
      return $http.get('https://corsocomo.com/', {
        params: {
          route: 'feed/web_api/getAdresses',
          key: '12Server34',
          customer_id: customer_id
        }
      })
    },
    getadress: function(adress_id) {
      return $http.get('https://corsocomo.com/', {
        params: {
          route: 'feed/web_api/getAdress',
          key: '12Server34',
          adress_id: adress_id
        }
      })
    },
    register: function(data) {
      return $http.post('https://corsocomo.com/?route=feed/web_api/addNewAdress&key=12Server34', {
        data: data
      })
    },
    deleteAdress: function(address_id) {
      return $http.get('https://corsocomo.com/', {
        params: {
          route: 'feed/web_api/deleteAdress',
          key: '12Server34',
          address_id: address_id,
          customer_id: $localstorage.getObject('account').customer_id
        }
      })
    }
  };
})
