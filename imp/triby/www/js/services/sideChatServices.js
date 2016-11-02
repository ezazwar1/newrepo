'use strict';

MyApp.service('SideChatService', function ($http, UserService, $rootScope) {

  var sideChatServiceFactory = {};

  var _sideChat = function(userID){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.post($rootScope.urlBackend + '/sidechat', userID);
  };
  sideChatServiceFactory.sideChat = _sideChat;

  return sideChatServiceFactory;

});
