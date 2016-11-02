angular.module('item.services', ['ionic'])
.service('ItemService', function($q, $http, $helper, $localstorage, $state, API_INFO, AUTH_EVENTS) {

  var getArticleItems = function(articleid){
    //check whethere is loggedin?
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/v2/items");
    if(token != null && token != undefined){
      apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/items");
    }

    return $http({
      method: 'GET',
      url: apiUrl,
      params: {"articleid":articleid, "limit":50},
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      if(response.data.meta.code == "200"){
        return response.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  var getItem = function(itemid){
    //check whethere is loggedin?
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/v2/item/detail");
    if(token != null && token != undefined){
      apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/item/detail");
    }

    return $http({
      method: 'GET',
      url: apiUrl,
      params: {"itemid":itemid},
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      if(response.data.meta.code == "200"){
        return response.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  var doReportInappropiate = function(report, itemid){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/item/report");

    //prepare object:
    var dataToPost = {"itemid":itemid, "report":report};

    return $http({
      method: 'PUT',
      url: apiUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      if(response.data.meta.code == "200"){
        return true;
      }else{
        return false;
      }
    }, function errorCallback(response) {
      return false;
    });
  };

  return {
    loadArticleItems: getArticleItems,
    reportInappropiate: doReportInappropiate,
    loadItem: getItem
  };
})
.service('ItemProductService', function($q, $http, $helper, $localstorage, $state, API_INFO, AUTH_EVENTS) {

  var getItemProducts = function(itemid, maxid, limit){
    //check whethere is loggedin?
    var paramsRaw = {"itemid":itemid};
    if(maxid != null){
      paramsRaw = {"itemid": itemid, "max_id":maxid, "limit":limit};
    }

    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/v2/product/item");
    if(token != null && token != undefined){
      apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/product/item");
    }

    return $http({
      method: 'GET',
      url: apiUrl,
      params: paramsRaw,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      if(response.data.meta.code == "200"){
        return response.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  return {
    loadItemProduct: getItemProducts
  };
});
