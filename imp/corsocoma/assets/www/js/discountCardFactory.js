angular.module('discountCard.factory', [])

.factory('discountCardService', function($http, $localstorage) {
  return {

    getCard: function() {
      var cardData = [];
      var card = 0;

      if ($localstorage.get('discountCard') != null) {
          card = $localstorage.get('discountCard');
      }
      return $http.get('https://corsocomo.com/', {
        params: {
          route: 'feed/web_api/discountcard',
          key: '12Server34',
          card: card
        }
      }).then(function(response) {
        cardData = response.data;
        return cardData;
      });
    },
    sendCard: function (card, customer_id) {
        return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/sedncard',key:'12Server34', card: card, customer_id:customer_id } })
    }
  };
});
