'use strict';

MyApp.service('CommentsService', function ($http, UserService, $rootScope) {

  var commentsServiceFactory;

  var _addComment = function(commentObj){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.post($rootScope.urlBackend + '/v3/comments', commentObj);
  };

  var _deleteComment = function(commentId){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.delete($rootScope.urlBackend + '/v2/comments/' + commentId);
  };

  var _getComments = function(postId, params){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/v2/comments/post/' + postId, {'params':params});
  };

  var _setCommentAsRead = function(commentId){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.patch($rootScope.urlBackend + '/v2/comments/' + commentId).then(function (result) {
      if(result.data.status === 'success') {
        //$rootScope.$apply(function(){
          $rootScope.unreadGroupsNotifications = result.data.notifications;
        //});
      }

    }, function (err) {
      console.log('error during setting comment as read: ', err);
    });
  };

  var _getCommentDislikedUsers = function  _getPostDislikedPeople(commentId) {
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/v2/comments/' + commentId + '/dislikes');
  };

  var _getCommentHeartedUsers = function _getPostHeartedPeople(commentId) {
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/v2/comments/' + commentId + '/hearts');
  };

  commentsServiceFactory = {
    addComment: _addComment,
    deleteComment: _deleteComment,
    getComments: _getComments,
    setCommentAsRead: _setCommentAsRead,
    getCommentDislikedUsers: _getCommentDislikedUsers,
    getCommentHeartedUsers: _getCommentHeartedUsers
  };

  return commentsServiceFactory;

});
