angular.module('starter.services')
.factory('categoryService', function($http) {
  'use strict';

  var service = {
    getCategories: function () {		 
		 return $http.get("data/dashboard/multicategory.json");
		 
    }
  };

  return service;
});
