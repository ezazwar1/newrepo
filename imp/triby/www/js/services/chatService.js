'use strict';

MyApp.service('ChatService', function ($http, UserService, $rootScope) {

  var chatsServiceFactory = {},
    currentChatData = {
      _id: null
    };

  var _addMessage = function(messageObj){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.post($rootScope.urlBackend + '/v3/messages', messageObj);
  };

  var _deleteMessage = function(messageId, partnerId){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.delete($rootScope.urlBackend + '/v3/messages/' + messageId + '?' + 'partnerId=' + partnerId);
  };

  var _getMessages = function(chatId, params){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/v2/chats/' + chatId + '/messages', {'params':params});
  };

  var _setMessageAsRead = function(messageId, chatId, tempLocalId, createdAt, partnerId){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.patch($rootScope.urlBackend + '/v3/messages/' + messageId, {"chatId": chatId, tempLocalId: tempLocalId, createdAt: createdAt, recipientId: partnerId});
  };

  var _clearChatHistory = function(chatId){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.patch($rootScope.urlBackend + '/v2/chats/' + chatId + '/clear_history');
  };

  var _getChat = function(partnerNumber, partnerId, unreadMessages){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.post($rootScope.urlBackend + '/v3/chats', {targetUserNumber: partnerNumber, targetUserId: partnerId, unreadMessages: unreadMessages});
  };

  var _getChatForChatsList = function(chatId){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/v2/chats/my/' + chatId, {params: {timestamp: new Date().getTime()}});
  };

  var _getMyChats = function(){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/v2/chats/my', {params: {timestamp: new Date().getTime()}});
  };

  var _setCurrentChat = function(chatData){
    currentChatData = chatData;
  };

  var _getCurrentChat = function(){
    return currentChatData;
  };

  chatsServiceFactory.getMyChats = _getMyChats;
  chatsServiceFactory.getChat = _getChat;
  chatsServiceFactory.getChatForChatsList = _getChatForChatsList;
  chatsServiceFactory.getMessages = _getMessages;
  chatsServiceFactory.addMessage = _addMessage;
  chatsServiceFactory.deleteMessage = _deleteMessage;
  chatsServiceFactory.setMessageAsRead = _setMessageAsRead;

  chatsServiceFactory.setCurrentChat = _setCurrentChat;
  chatsServiceFactory.getCurrentChat = _getCurrentChat;
  chatsServiceFactory.clearChatHistory = _clearChatHistory;

  return chatsServiceFactory;

});
