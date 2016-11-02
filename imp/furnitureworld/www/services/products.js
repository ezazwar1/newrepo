angular.module('starter.services')
.factory('productsService', function($rootScope,$http) {
  'use strict';

  var service = {
    getBannersSpecific: function () {
      // console.log('from services product.js');
		  return $http.get("data/product/bannerSpecific.json");
      // console.log(' again from services');
    },
    getProducts: function (catid,category_name,paged) {
		//return $http.get("data/product/products1.json");
      //console.log('from services');
     //console.log(catid);
    //  console.log(category_name);
       var productFile = 'products_'+catid+'_'+category_name+'.json';
       return $http.get("data/product/productSpecific/"+productFile);
    },
    getProductDetail: function (pro_id) {

		 return $http.get("data/product/detail.json");
    },
    getFilterOptions: function (cat_id) {

		return $http.get("data/product/filter.json");
    },
    setFilterData: function (cat_id,ftype,arrayval) {

		if(typeof($rootScope.brandsFobj)=='undefined')$rootScope.brandsFobj = [];
		if(typeof($rootScope.priceFobj)=='undefined')$rootScope.priceFobj = [];
		if(typeof($rootScope.discFobj)=='undefined')$rootScope.discFobj = [];

		if(arrayval!='' && typeof(arrayval)!='undefined'){
			 if(ftype=='brands')$rootScope.brandsFobj[cat_id]= toObject(arrayval);
			 if(ftype=='price')$rootScope.priceFobj[cat_id]= toObject(arrayval);
			 if(ftype=='discount')$rootScope.discFobj[cat_id]= toObject(arrayval);
		}else{
			  if(ftype=='brands') $rootScope.brandsFobj[cat_id]= {};
			  if(ftype=='price') $rootScope.priceFobj[cat_id]= {};
			  if(ftype=='discount') $rootScope.discFobj[cat_id]= {};
		}

    },
	getFilterData: function (cat_id,ftype) {
		if(typeof($rootScope.brandsFobj)=='undefined')$rootScope.brandsFobj = [];
		if(typeof($rootScope.priceFobj)=='undefined')$rootScope.priceFobj = [];
		if(typeof($rootScope.discFobj)=='undefined')$rootScope.discFobj = [];

		var tval = '';
		if(ftype=='brands')tval = $rootScope.brandsFobj[cat_id];
		if(ftype=='price')tval = $rootScope.priceFobj[cat_id];
		if(ftype=='discount')tval = $rootScope.discFobj[cat_id];

		if(typeof(tval)=='undefined')
			return '';
		else
			return Object.keys(tval).map(function (key) {return tval[key]});
	}

  };


  return service;
});


//waze
