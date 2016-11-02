angular.module('stream.services', ['ionic'])
.service('StreamService', function($q, $http, $helper, $localstorage, $state, API_INFO, AUTH_EVENTS) {

  var getStream = function(maxid, limit){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/items/all");
    if(token != null && token != undefined){
      apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/items/all");
    }

    var datapost = {};
    if(maxid != "" && limit != ""){
      datapost = {"max_id": maxid, "limit": limit};
    }
    return $http({
      method: 'GET',
      url: apiUrl,
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
    loadStream: getStream
  };
});