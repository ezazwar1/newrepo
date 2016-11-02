angular.module('starter.services')
.factory('orderService', function($http) {
  'use strict';

  var service = {
    getorderlist: function () {		 
		 return $http.get("data/order/orderlist.json");
		 
    }
  };

  return service;
});
