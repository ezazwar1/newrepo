angular.module('starter.services')
.factory('usersService', function($http) {
  'use strict';

  var service = {
	userDetails: function () {
		 		 return $http.get("data/user/account.json");
    },
	userLogout: function () {
		 return $http.get("/data/user/logout.json");
    },
	getCountries: function () {
		 return $http.get("/data/user/countries.json");
    },

  };

  return service;
});
