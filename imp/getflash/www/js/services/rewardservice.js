angular.module('reward.services', ['ionic'])
.service('RewardService', function($q, $http, $helper, $localstorage, $state, API_INFO, AUTH_EVENTS) {

  var getGifts = function(maxid, limit){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/users/gifts");
    var datapost = {};
    if(maxid != "" && limit != ""){
      datapost = {"max_id": maxid, "limit": limit};
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
    loadGifts: getGifts
  };
});