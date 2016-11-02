angular.module('itemgroup.services', ['ionic'])
.service('ItemGroupService', function($q, $http, $helper, $localstorage, $state, API_INFO, AUTH_EVENTS) {

  var getItemGroup = function(userid){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/itemgroup");

    var datas = {};
    if(userid != ""){
      datas = {"userid":userid};
    }

    return $http({
      method: 'GET',
      url: dataUrl,
      params: datas,
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
      console.log("item group " + JSON.stringify(response));
      return null;
    });
  };

  var getMyGroupItems = function(groupid, maxid, limit, userid){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/users/group/items");

    var datas = {"itemgroupid": groupid};
    if(userid != undefined && userid != null){
      datas = {"itemgroupid": groupid, "userid":userid};
    }

    if(maxid != null && maxid != undefined){
      if(userid != undefined && userid != null){
        datas = {"itemgroupid": groupid, "max_id":maxid, "limit":limit, "userid":userid};
      }else{
        datas = {"itemgroupid": groupid, "max_id":maxid, "limit":limit};
      }
    }

    return $http({
      method: 'GET',
      url: dataUrl,
      params: datas,
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

  var doCreateItemGroup = function(groupname, itemid){
    var dataToPost = {"groupname":groupname, "itemid":itemid};

    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/itemgroup/new");
    return $http({
      method: 'POST',
      url: dataUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      if(response.data.meta.code == "200"){
        return response.data.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  var doCreateItemGroupName = function(groupname){
    var dataToPost = dataToPost = {"groupname":groupname};
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/itemgroup/new");
    return $http({
      method: 'POST',
      url: dataUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      if(response.data.meta.code == "200"){
        return response.data.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  var doUpdateItemGroupName = function(itemgroupid, groupname){
    var dataToPost = dataToPost = {"groupname":groupname, "itemgroupid":itemgroupid};
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/itemgroup/new");
    return $http({
      method: 'POST',
      url: dataUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      if(response.data.meta.code == "200"){
        return response.data.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  var doUpdateCoverPhoto = function(itemgroupid, itemid){
    var dataToPost = dataToPost = {"itemid":itemid, "itemgroupid":itemgroupid};
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/itemgroup/cover");
    return $http({
      method: 'PUT',
      url: dataUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      if(response.data.meta.code == "200"){
        return response.data.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  var doUpdateItemGroup = function(itemgroupid, groupname, itemid){
    var dataToPost = {"itemgroupid": itemgroupid, "groupname":groupname, "itemid":itemid};
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/itemgroup/new");
    return $http({
      method: 'POST',
      url: dataUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      if(response.data.meta.code == "200" || response.data.meta.code == "212"){
        return response.data;
      }else{
        return null;
      }
    }, function errorCallback(response) {
      return null;
    });
  };

  var doRemoveItemGroupItem = function(itemgroupid, itemid){
    var dataToPost = {"itemgroupid":itemgroupid, "setname":"", "itemid":itemid};
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/itemgroup/remove");
    return $http({
      method: 'PUT',
      url: dataUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      if(response.data.meta.code == "200"){
        return true;
      }else{
        return false;
      }
    }, function errorCallback(response) {
      return false;
    });
  };

  var doRemoveItemGroup = function(itemgroupid){
    var dataToPost = {"itemgroupid":itemgroupid};

    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var dataUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/v2/itemgroup/remove/all");
    return $http({
      method: 'PUT',
      url: dataUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
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
    loadItemGroup: getItemGroup,
    createItemGroup: doCreateItemGroup,
    createItemGroupName: doCreateItemGroupName,
    updateItemGroup: doUpdateItemGroup,
    loadMyGroupItems: getMyGroupItems,
    updateItemGroupName: doUpdateItemGroupName,
    removeItemGroupItem: doRemoveItemGroupItem,
    removeItemGroup: doRemoveItemGroup,
    updateCoverPhoto: doUpdateCoverPhoto
  };
});