angular.module('shop.factory', [])


.factory('ShopListService', function($http, $localstorage) {
  return {

      shopList: function () {
          var shopList = [];
        var latitude =null;
        var longitude = null;
        if($localstorage.getObject('position') !=null) {
          if($localstorage.getObject('position').latitude != null &&  $localstorage.getObject('position').longitude) {
            latitude =$localstorage.getObject('position').latitude;
            longitude =$localstorage.getObject('position').longitude;
          }
        }
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/shoplist',key:'12Server34', latitude:latitude, longitude: longitude } }).then(function(response){

  				shopList = response.data;
                                 // console.log(menu);
  				return shopList;
  			});
      }
  };
});
