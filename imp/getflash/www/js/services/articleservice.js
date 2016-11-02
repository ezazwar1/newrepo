angular.module('article.services', ['ionic'])
.service('ArticleService', function($q, $http, $helper, $localstorage, $state, API_INFO, AUTH_EVENTS) {

  var getArticleData = function(maxid, limit){
    //check whethere is loggedin?
    var dataUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/v2/articles");

    var paramsraw = {"limit": limit}
    if(maxid != undefined && maxid != "" && maxid != null){
      paramsraw = {"max_id": maxid, "limit": limit};
    }

    return $http({
      method: 'GET',
      url: dataUrl,
      params: paramsraw,
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

  var getArticleDetail = function(articleid){
    //check whethere is loggedin?
    var dataUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/v2/article/detail");
    return $http({
      method: 'GET',
      url: dataUrl,
      params: {"articleid":articleid},
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

  var doSearchArticle = function(term, maxid, limit){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/v2/articles/search");

    var paramsraw = {"limit": limit, "term":term}
    if(maxid != undefined && maxid != "" && maxid != null){
      paramsraw = {"max_id": maxid, "limit": limit, "term":term};
    }

    return $http({
      method: 'GET',
      url: apiUrl,
      params: paramsraw,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      if(response.data.meta.code == "200"){
        return response.data.data;
      }else{
        return null;
      }
    }, function errorCallback(response){
      return null;
    });
  };

  var getArticleByCategory = function(cat, maxid, limit){
    //check whethere is loggedin?
    var dataUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/v2/article/categories/feed");

    var paramsraw = {"limit": limit, "category": cat}
    if(maxid != undefined && maxid != "" && maxid != null){
      paramsraw = {"max_id": maxid, "limit": limit, "category": cat};
    }

    return $http({
      method: 'GET',
      url: dataUrl,
      params: paramsraw,
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

  var doUploadImageContest = function(articleid, data){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/upload/image/article");
    var options = {
        fileKey: "file",
        fileName: "temp.jpg",
        mimeType: "image/jpg",
        params: { "articleid":articleid }
    };

    return $cordovaFileTransfer.upload(apiUrl, data, options, true).then(function(result) {
      var obj = JSON.parse(result.response);
      if(obj.meta.code == "200"){
        return obj.data;
      }else{
        return null;
      }

    }, function(err) {
        console.log("ERROR: " + JSON.stringify(err));
        return null;
    }, function (progress) {});
  };

  var doUploadImageContestIOS = function(articleid, data){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/upload/image/article");

    var byteString = atob(data.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: 'image/png' });

    var fd = new FormData();
    fd.append('file', blob);
    fd.append('articleid', articleid);

    return $http.post(apiUrl, fd, {
        headers: {'Content-Type': undefined}
    })
    .then(function successCallback(response) {
      if(response.data.meta.code == "200"){
        return response.data.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  var doJoinContest = function(articleid, description, filekey, folderpath){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/item/submit");

    //prepare object:
    var dataToPost = {"articleid":articleid, "title":"", "description":description, "picture":{"filekey":filekey, "folderpath":folderpath}};
    console.log("JOIN + " + JSON.stringify(dataToPost));
    return $http({
      method: 'POST',
      url: apiUrl,
      data: dataToPost,
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

  return {
    loadArticle: getArticleData,
    loadArticleDetail: getArticleDetail,
    loadArticleCategory: getArticleByCategory,
    uploadImageContest: doUploadImageContest,
    uploadImageContestIOS: doUploadImageContestIOS,
    joinContest: doJoinContest,
    searchArticle: doSearchArticle
  };
});