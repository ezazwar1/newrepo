angular.module('starter.controllers')
.controller('DashboardCtrl', function($scope,$rootScope,$state,categoryService,dashboardService) {
	'use strict';
	
	//--------Slider Top Banners------------------------
	dashboardService.getBanners()
	.then(function(response) {
		$scope.bannerData=response.data.appbanners.slider;
	}, function(error) {
		$rootScope.tostMsg(error);
	});
	//--------Main banners------------------------
	dashboardService.getMainBanners()
	.then(function(response) {
		$scope.bannerMainData=response.data.appbanners.slider;
	}, function(error) {
		$rootScope.tostMsg(error);
	});
	//--------category slider banners------------------------
	dashboardService.getAdsSlider()
	.then(function(response) {
		$scope.bannerAdsData=response.data.appbanners.slider;
	}, function(error) {
		$rootScope.tostMsg(error);
	});

});
