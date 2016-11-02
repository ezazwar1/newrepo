angular.module('starter.controllers')

.controller('Products_bannerCtrl', function($scope,$rootScope,$ionicModal,$ionicSideMenuDelegate,$timeout,$location,categoryService,$stateParams,productsService) {

 	$scope.cat_id = $stateParams.catid;
  $rootScope.cat_Name = $stateParams.catName;

  $scope.toggleLeftSideMenu = function() { $ionicSideMenuDelegate.toggleLeft();  };

	productsService.getBannersSpecific()
	.then(function(response) {
    		  //alert("Success : "+response);
		 $scope.results = response.data.data;
     $rootScope.bannerData = $scope.results[$scope.cat_id-1];
       //console.log(" from product banner controller");
		 //$scope.banner_current = findCategory(results,url_id);//findCategory function is been called from util.js
	}, function(error) {
		// alert("Error proudcts : "+error);
	});
  //---------------------------------------------
  $scope.showProductSpecific = function(category_id,category_name){
    // console.log(category_id);
    // console.log(" again from product banner controller");
    $location.path('app/products/'+category_id+'/'+category_name.replace("&amp;","and"));
   
  }
  $scope.direction=function()
  {
     $location.path('app/dashboard');
  }

});
