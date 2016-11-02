angular.module('notification.services', ['ionic'])
.service('NotificationService', function($q, $http, $helper, $localstorage, $state, API_INFO, AUTH_EVENTS) {

  var getMyNotifications = function(){
    //check whethere is loggedin?
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/users/notifications");
    return $http({
      method: 'GET',
      url: apiUrl,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      if(response.data.meta.code == "200"){
        return response.data.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  var ackNotification = function(notifid){
    //check whethere is loggedin?
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/users/notifications");
    return $http({
      method: 'PUT',
      url: apiUrl,
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
    loadMyNotifications: getMyNotifications,
    doAckNotification: ackNotification
  };
});