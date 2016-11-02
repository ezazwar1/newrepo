angular.module('search.services', ['ionic'])
.service('SearchService', function($q, $http, $helper, $localstorage, $state, API_INFO, AUTH_EVENTS) {

  var doSearchArticle = function(term, maxid, limit){
    var dataUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/v2/articles/search");
    var datapost = {};
    if(maxid != "" && limit != ""){
      datapost = {"term":term, "max_id": maxid, "limit": limit};
    }else{
      datapost = {"term":term};
    }
    return $http({
      method: 'GET',
      url: dataUrl,
      params: datapost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
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
    searchArticle: doSearchArticle
  };
});