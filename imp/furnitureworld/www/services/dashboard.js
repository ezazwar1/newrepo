angular.module('starter.services')
.factory('dashboardService', function($http) {
  'use strict';

  var service = {
    getBanners: function () {
      return	$http.get("data/dashboard/appbanners.json")
    },
    getAdsSlider: function () {
      return	$http.get("data/dashboard/addSlider.json")
    },
    getMainBanners: function () {
      return	$http.get("data/dashboard/mainBanner.json")
    }
  };
  return service;
});
