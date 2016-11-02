'use strict';

MyApp.factory('FeedService', function($q, $rootScope, $http, $cordovaCamera, UserService, $cordovaFile, _) {

  var feedServiceFactory = {},
      _tribyData = {},
      _lastSeenPost,
      _setNewTriby,
      _getNewTriby,
      _saveTriby,
      _updateTriby,
      _getTribes,
      _getTriby,
      _getTribyInfo,
      _savePost,
      _deletePost,
      _getTribyPosts,
      _getPost,
      _exitTriby,
      _addLike,
      _removeLike,
      _addHeart,
      _removeHeart,
      _addDislike,
      _removeDislike,
      _updateMembers,
      _deleteMember,
      _makeAdminMember,
      _deleteTribeNotifications,
     _getPostDislikedUsers,
     _getPostHeartedUsers;

  _setNewTriby = function(tribyData){
    _tribyData = tribyData;
  }
  _getNewTriby = function(){
    return _tribyData;
  }
  _saveTriby = function(tribyData){
    var deferred = $q.defer();
    var authData = UserService.getAuthData();

    $http.defaults.headers.common['Authorization'] = authData.token;
    tribyData.mobilenumber = authData.mobilenumber;
    tribyData.members.push(authData.mobilenumber);
    tribyData.members = _.uniq(tribyData.members);

    $http.post($rootScope.urlBackend + '/v2/tribes', tribyData).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
        deferred.reject(err);
    });

    return deferred.promise;
  }

  _updateTriby = function(tribyData){
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;
    tribyData.mobilenumber = authData.mobilenumber;

    $http.put($rootScope.urlBackend + '/tribes/' + tribyData._id, tribyData).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
          deferred.reject(err);
    });

    return deferred.promise;
  }

  _getTribes = function(){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;
    return $http.get($rootScope.urlBackend + '/v2/tribes/user/' + authData.mobilenumber, {params: {t: new Date().getTime()}});
  }

  _getTriby = function(aTribyId, params){
    var authData = UserService.getAuthData();
    var queryParams = {
      t: new Date().getTime()
    };
    $http.defaults.headers.common['Authorization'] = authData.token;

    if(params && params.image_only) {
      queryParams.image_only = true;
    }

    if(params && params.postId) {
      queryParams.post_id = params.postId;
    }

    return $http.get($rootScope.urlBackend + '/v2/tribes/' + aTribyId, { params: queryParams });
  }

  _getTribyInfo = function(aTribyId){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/v3/tribes/info/' + aTribyId, {params: {t: new Date().getTime()}});
  }

  _savePost = function(postData){
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    postData.parentid = postData.triby;
    postData.parenttype = "tribe";
    postData.content = postData.message;
    postData.pic = postData.image;
    //postData.user = authData.username;

    $http.post($rootScope.urlBackend + '/v2/posts', postData).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
          deferred.reject(err);
    });

    return deferred.promise;
  }

  _deletePost = function(postId){
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    var postData = { 'isDeleted': true};

    $http.put($rootScope.urlBackend + '/v2/posts/' + postId, postData).success(function (response) {
      deferred.resolve(response);
    }).error(function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  _getTribyPosts = function(tribyID, params){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;
    params = params || {};
    params.t = new Date().getTime();

    return $http.get($rootScope.urlBackend + '/v2/posts/triby/' + tribyID, {'params':params});
  };

  _getPost = function(postId){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/posts/' + postId);
  };

  _exitTriby = function(tribyId, isDeleteRequiredAlso){
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common.Authorization = authData.token;

    $http.put($rootScope.urlBackend + '/v3/tribes/' + tribyId + '/members/exit', {}).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
        deferred.reject(err);
    });

    return deferred.promise;
  }

  //////// Like icon services start from here ////////
  _addLike = function(like){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.post($rootScope.urlBackend + '/like', like);
  };

  _removeLike = function(like){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.put($rootScope.urlBackend + '/like', like);
  };
  //////// Like icon services Finish here ////////

  //////// heart icon services start from here ////////
  _addHeart = function(heartData){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.post($rootScope.urlBackend + '/v3/heart', heartData);
  };

  _removeHeart = function(heartData){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.put($rootScope.urlBackend + '/v3/heart', heartData);
  };
  //////// heart icon services Finish here ////////

  //////// DisLike icon services start from here ////////
  _addDislike = function(disLike){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.post($rootScope.urlBackend + '/v3/dislike', disLike);
  };

  _removeDislike = function(disLike){
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.put($rootScope.urlBackend + '/v3/dislike', disLike);
  };
  //////// DisLike icon services Finish here ////////
  _updateMembers = function(tribeId, members) {
    var deferred = $q.defer();
    var authData = UserService.getAuthData();

    $http.defaults.headers.common['Authorization'] = authData.token;

    members.users.push(authData.mobilenumber);
    members.users = _.uniq(members.users);
    members.memberContacts = _.uniq(members.memberContacts);

    $http.put($rootScope.urlBackend + '/v2/tribes/' + tribeId + '/members', members).success(function(response){
        deferred.resolve(response);
    }).error(function(err, status){
        deferred.reject(err);
    });

    return deferred.promise;
  };

  _deleteMember = function(tribeId, userData) {
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.patch($rootScope.urlBackend + '/v2/tribes/' + tribeId + '/deletemember/', userData).success(function(response){
      deferred.resolve(response);
    }).error(function(err, status){
      deferred.reject(err);
    });

    return deferred.promise;
  };

  _deleteTribeNotifications = function(tribeId) {
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.delete($rootScope.urlBackend + '/v2/tribes/' + tribeId + '/deleteNotifications').success(function(response){
      deferred.resolve(response);
    }).error(function(err, status){
      deferred.reject(err);
    });

    return deferred.promise;
  };

  _makeAdminMember = function(tribeId, userId) {
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.put($rootScope.urlBackend + '/tribes/' + tribeId + '/addadmin/' + userId).success(function(response){
      deferred.resolve(response);
    }).error(function(err, status){
      deferred.reject(err);
    });

    return deferred.promise;
  };

  _getPostDislikedUsers = function  _getPostDislikedPeople(tribeId) {
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/v2/posts/' + tribeId + '/dislikes');
  };

  _getPostHeartedUsers = function _getPostHeartedPeople(tribeId) {
    var authData = UserService.getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/v2/posts/' + tribeId + '/hearts');
  };

  function _setLastSeenPost(data) {
    _lastSeenPost = data;
  }
  function _getLastSeenPost() {
    if(_lastSeenPost && typeof _lastSeenPost === 'object') {
      return JSON.parse(JSON.stringify(_lastSeenPost));
    }
    return _lastSeenPost;

  }

  function _incrementLastSeenPostCommentsCount() {
    _lastSeenPost.commentsCount = _lastSeenPost.commentsCount + 1;
  }

  function _decrementLastSeenPostCommentsCount() {
    _lastSeenPost.commentsCount = _lastSeenPost.commentsCount - 1 || 0;
  }

  function _dropLastSeenPost() {
    _lastSeenPost = null;
  }

  _.extend(feedServiceFactory, {
    setNewTriby: _setNewTriby,
    getNewTriby: _getNewTriby,
    saveTriby: _saveTriby,
    updateTriby: _updateTriby,
    getTribes: _getTribes,
    getTriby: _getTriby,
    getTribyInfo: _getTribyInfo,
    savePost: _savePost,
    deletePost: _deletePost,
    getTribyPosts: _getTribyPosts,
    deleteTribeNotifications: _deleteTribeNotifications,
    getPost: _getPost,
    exitTriby: _exitTriby,
    addHeart:_addHeart,
    removeHeart: _removeHeart,
    addLike: _addLike,
    removeLike: _removeLike,
    addDislike: _addDislike,
    removeDislike: _removeDislike,
    updateMembers: _updateMembers,
    deleteMember: _deleteMember,
    makeAdminMember: _makeAdminMember,
    getPostDislikedUsers: _getPostDislikedUsers,
    getPostHeartedUsers: _getPostHeartedUsers,
    setLastSeenPost: _setLastSeenPost,
    getLastSeenPost: _getLastSeenPost,
    incrementLastSeenPostCommentsCount: _incrementLastSeenPostCommentsCount,
    decrementLastSeenPostCommentsCount: _decrementLastSeenPostCommentsCount,
    dropLastSeenPost: _dropLastSeenPost

  });

  return feedServiceFactory;
});
