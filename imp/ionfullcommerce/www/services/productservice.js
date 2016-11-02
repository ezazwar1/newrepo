'use strict';
(function(){
	angular.module('eCommerce')
	.service('productService', ['$http','$q','API_URL','CAT_URL',function ($http,$q,API_URL,CAT_URL) {
		var productSrv = {

			get:function(){

				return $http.get(API_URL);
			},
			getCategories:function(){
				return $http.get(CAT_URL);
			}

		};

		return productSrv;
	}])
	


})()