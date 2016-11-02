angular.module('user.services', ['ionic'])
.service('AuthService', function($q, $http, $helper, $cordovaFileTransfer, $localstorage, API_INFO, AUTH_EVENTS, GENERAL_CONS) {

  function isValidEmail(email){
    var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
    return pattern.test(emailAddress);
  }

  function isValidPassword(password){
    var pattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
    return pattern.test(password);
  }

  var doLoginEmail = function(email, password, gender, styles, sizing){
    $helper.showLoader();
    var loginUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/users/login");
    var hasedPw = $helper.hashedPassword(password);

    var dataToPost = {"email": email, "hashedpassword": hasedPw};
    if(gender != "" && styles != "" && sizing != ""){
      dataToPost = {"email": email, "hashedpassword": hasedPw, "gender":gender, "styles":styles, "sizing": sizing};
    }

    return $http({
      method: 'POST',
      url: loginUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      $helper.hideLoader();
      if(response.data.meta.code == "200"){
        //set current token here to local storage
        $localstorage.set(AUTH_EVENTS.AUTHENTICATED, true);
        $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADSAVED, 1);
        $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADMORE, 1);
        $localstorage.set(AUTH_EVENTS.CURRTOKEN, response.data.data.access_token);
        $localstorage.set(AUTH_EVENTS.CURRFASHID, response.data.data.userid);
        $localstorage.set(AUTH_EVENTS.CURRFASHNAME, response.data.data.fullname);
        $localstorage.set(AUTH_EVENTS.CURRDEVICESETTING, response.data.data.device);
        $localstorage.set(AUTH_EVENTS.CURRFASHEMAIL, response.data.data.email);
        $localstorage.set(AUTH_EVENTS.CURRFASHUSERNAME, response.data.data.username);
        $localstorage.set(AUTH_EVENTS.CURRFASHGENDER, response.data.data.gender);
        $localstorage.set(AUTH_EVENTS.ISNEW, response.data.data.newlyregistered);
        if(response.data.data.profilepic != undefined){
          $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, response.data.data.profilepic.fullurl);
        }else{
          $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, GENERAL_CONS.PROFILEPHPATH);
        }

        mixpanel.identify($localstorage.get(AUTH_EVENTS.CURRFASHID));
        mixpanel.people.set({
            "$email": $localstorage.get(AUTH_EVENTS.CURRFASHEMAIL),
            "$last_login": new Date(),
            "username": $localstorage.get(AUTH_EVENTS.CURRFASHUSERNAME),
            "$first_name": $localstorage.get(AUTH_EVENTS.CURRFASHNAME),
            "gender": $localstorage.get(AUTH_EVENTS.CURRFASHGENDER)
        });

        mixpanel.track("login", {
          "login_from": "Email",
          "login_device": "Mobile"
        });

        return true;
      }else{
        return false;
      }
    }, function errorCallback(response) {
      console.log(JSON.stringify(response));
      $helper.hideLoader();
      return false;
    });
  };

  var resetPassword = function(email){
    $helper.showLoader();
    var loginUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/password/reset");
    return $http({
      method: 'POST',
      url: loginUrl,
      data: {"email": email},
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      $helper.hideLoader();
      if(response.data.meta.code == "200"){
        return true;
      }else{
        return false;
      }
    }, function errorCallback(response) {
      console.log(JSON.stringify(response));
      $helper.hideLoader();
      return false;
    });
  };

  var doSignUpEmail = function(email, password, fullname, gender, styles, sizing){
    $helper.showLoader();
    var loginUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/users");
    var hasedPw = $helper.hashedPassword(password);

    var dataToPost = {"email": email, "hashedpassword": hasedPw, "fullname": fullname};
    if(gender != "" && styles != "" & sizing != ""){
      dataToPost = {"email": email, "hashedpassword": hasedPw, "fullname": fullname, "gender":gender, "styles":styles, "sizing":sizing};
    }

    return $http({
      method: 'POST',
      url: loginUrl,
      data: dataToPost,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      $helper.hideLoader();
      if(response.data.meta.code == "200"){
        //set current token here to local storage
        $localstorage.set(AUTH_EVENTS.AUTHENTICATED, true);
        $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADSAVED, 1);
        $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADMORE, 1);
        $localstorage.set(AUTH_EVENTS.CURRTOKEN, response.data.data.access_token);
        $localstorage.set(AUTH_EVENTS.CURRFASHID, response.data.data.userid);
        $localstorage.set(AUTH_EVENTS.CURRFASHNAME, response.data.data.fullname);
        $localstorage.set(AUTH_EVENTS.CURRDEVICESETTING, response.data.data.device);
        $localstorage.set(AUTH_EVENTS.CURRFASHEMAIL, response.data.data.email);
        $localstorage.set(AUTH_EVENTS.CURRFASHUSERNAME, response.data.data.username);
        $localstorage.set(AUTH_EVENTS.CURRFASHGENDER, response.data.data.gender);
        $localstorage.set(AUTH_EVENTS.ISNEW, response.data.data.newlyregistered);

        mixpanel.identify($localstorage.get(AUTH_EVENTS.CURRFASHID));
        mixpanel.people.set({
            "$email": $localstorage.get(AUTH_EVENTS.CURRFASHEMAIL),
            "$last_login": new Date(),
            "username": $localstorage.get(AUTH_EVENTS.CURRFASHUSERNAME),
            "$first_name": $localstorage.get(AUTH_EVENTS.CURRFASHNAME),
            "gender": $localstorage.get(AUTH_EVENTS.CURRFASHGENDER)
        });

        //track signup:
        if($localstorage.get(AUTH_EVENTS.ISNEW) == true){
          mixpanel.track("signup", {
              "signup_source": "Email",
              "signup_device": "Mobile"
          });
        }

        if(response.data.data.profilepic != undefined){
          $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, response.data.data.profilepic.fullurl);
        }else{
          $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, GENERAL_CONS.PROFILEPHPATH);
        }

        return "";
      }else{
        return response.data.meta.message;
      }
    }, function errorCallback(response) {
      console.log(JSON.stringify(response));
      $helper.hideLoader();
      return "Failed to register a new user, please try again";
    });
  };
  
  var doLoginTwitter = function(email, userid, picture, name, username, twittertoken, shopfor, styles, sizing) {
    var loginUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/users/twitter");
    
    var dataToPost = {"email": email,"userid": userid,"profilepicurl": picture,"fullname": name,"username": username,"access_token":twittertoken};
    if(shopfor != "" && styles != "" && sizing != ""){
      dataToPost = {"email": email,"userid": userid,"profilepicurl": picture,"fullname": name,"username": username,"access_token":twittertoken, "gender":shopfor, "styles":styles, "sizing":sizing};
    }

    return $http({
      method: 'POST',
      url: loginUrl,
      data: dataToPost,
      headers:{
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      if(response.data.meta.code == "200"){
        //set current token here to local storage
        $localstorage.set(AUTH_EVENTS.AUTHENTICATED, true);
        $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADSAVED, 1);
        $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADMORE, 1);
        $localstorage.set(AUTH_EVENTS.CURRTOKEN, response.data.data.access_token);
        $localstorage.set(AUTH_EVENTS.CURRFASHID, response.data.data.userid);
        $localstorage.set(AUTH_EVENTS.CURRFASHNAME, response.data.data.fullname);
        $localstorage.set(AUTH_EVENTS.CURRDEVICESETTING, response.data.data.device);
        $localstorage.set(AUTH_EVENTS.CURRFASHEMAIL, response.data.data.email);
        $localstorage.set(AUTH_EVENTS.CURRFASHUSERNAME, response.data.data.username);
        $localstorage.set(AUTH_EVENTS.CURRFASHGENDER, response.data.data.gender);
        $localstorage.set(AUTH_EVENTS.ISNEW, response.data.data.newlyregistered);

        mixpanel.identify($localstorage.get(AUTH_EVENTS.CURRFASHID));
        mixpanel.people.set({
            "$email": $localstorage.get(AUTH_EVENTS.CURRFASHEMAIL),
            "$last_login": new Date(),
            "username": $localstorage.get(AUTH_EVENTS.CURRFASHUSERNAME),
            "$first_name": $localstorage.get(AUTH_EVENTS.CURRFASHNAME),
            "gender": $localstorage.get(AUTH_EVENTS.CURRFASHGENDER)
        });

        //track signup:
        if($localstorage.get(AUTH_EVENTS.ISNEW) == true){
          mixpanel.track("signup", {
              "signup_source": "Twitter",
              "signup_device": "Mobile"
          });
        }else{
          mixpanel.track("login", {
            "login_from": "Twitter",
            "login_device": "Mobile"
          });
        }

        if(response.data.data.profilepic != undefined){
          $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, response.data.data.profilepic.fullurl);
        }else{
          $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, GENERAL_CONS.PROFILEPHPATH);
        }

        return "OK";
      }else{
        return response.data.meta.code;
      }
    }, function errorCallback(response) {
      console.log(JSON.stringify(response));
      return "ERR";
    });
  };

  var doChangePassword = function(currpassword, newpassword) {
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/users/changepassword");
    var hashedPw = $helper.hashedPassword(newpassword);
    var hashedCurrPw = $helper.hashedPassword(currpassword);
    return $http({
      method: 'PUT',
      url: apiUrl,
      data: {"currpassword": hashedCurrPw,
              "hashedpassword": hashedPw},
      headers:{
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      console.log(JSON.stringify(response.data));
      return response.data;
    }, function errorCallback(response) {
      return null;
    });
  };

  var doLoginFacebook = function(email, userid, picture, name, gender, verified, fbtoken, shopfor, styles, sizes, sizing) {
    var loginUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/users/fb");

    var dataToPost = {"email": email, "userid": userid, "profilepicurl": picture, "fullname": name, "gender": gender, "verified": verified, "access_token":fbtoken};
    if(shopfor != "" && styles != "" && sizing != ""){
      dataToPost = {"email": email, "userid": userid, "profilepicurl": picture, "fullname": name, "gender": shopfor, "verified": verified, "access_token":fbtoken, "styles":styles, "sizing":sizing};
    }

    return $http({
      method: 'POST',
      url: loginUrl,
      data: dataToPost,
      headers:{
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      if(response.data.meta.code == "200"){
        //set current token here to local storage
        $localstorage.set(AUTH_EVENTS.AUTHENTICATED, true);
        $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADSAVED, 1);
        $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADMORE, 1);
        $localstorage.set(AUTH_EVENTS.CURRTOKEN, response.data.data.access_token);
        $localstorage.set(AUTH_EVENTS.CURRFASHID, response.data.data.userid);
        $localstorage.set(AUTH_EVENTS.CURRFASHNAME, response.data.data.fullname);
        $localstorage.set(AUTH_EVENTS.CURRDEVICESETTING, response.data.data.device);
        $localstorage.set(AUTH_EVENTS.CURRFASHEMAIL, response.data.data.email);
        $localstorage.set(AUTH_EVENTS.CURRFASHUSERNAME, response.data.data.username);
        $localstorage.set(AUTH_EVENTS.CURRFASHGENDER, response.data.data.gender);
        $localstorage.set(AUTH_EVENTS.ISNEW, response.data.data.newlyregistered);

        mixpanel.identify($localstorage.get(AUTH_EVENTS.CURRFASHID));
        mixpanel.people.set({
            "$email": $localstorage.get(AUTH_EVENTS.CURRFASHEMAIL),
            "$last_login": new Date(),
            "username": $localstorage.get(AUTH_EVENTS.CURRFASHUSERNAME),
            "$first_name": $localstorage.get(AUTH_EVENTS.CURRFASHNAME),
            "gender": $localstorage.get(AUTH_EVENTS.CURRFASHGENDER)
        });
        //mixpanel.getPeople().set(new JSONObject());

        //track signup:
        if($localstorage.get(AUTH_EVENTS.ISNEW) == true){
          mixpanel.track("signup", {
              "signup_source": "Facebook",
              "signup_device": "Mobile"
          });
        }else{
          mixpanel.track("login", {
            "login_from": "Facebook",
            "login_device": "Mobile"
          });
        }

        if(response.data.data.profilepic != undefined){
          $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, response.data.data.profilepic.fullurl);
        }else{
          $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, GENERAL_CONS.PROFILEPHPATH);
        }
        
        return true;
      }else{
        return false;
      }
    }, function errorCallback(response) {
      console.log(JSON.stringify(response));
      return false;
    });
  };

  var getMyProfileData = function(){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/users/editprofile");

    return $http({
      method: 'GET',
      url: apiUrl,
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

  var editProfile = function(fullname, gender, username, country, sizing) {
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/users/editprofile");

    var datas = {"fullname":fullname, "username":username,"sizing":sizing};
    if(gender != "" && country != ""){
      datas = {"fullname":fullname, "username":username, "gender":gender, "country":country, "sizing":sizing};
    }else if(gender != ""){
      datas = {"fullname":fullname, "username":username, "gender":gender, "sizing":sizing};
    }else if(country != ""){
      datas = {"fullname":fullname, "username":username, "country":country, "sizing": sizing};
    }

    return $http({
      method: 'PUT',
      url: apiUrl,
      data: datas,
      headers:{
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      //set to localstorage:
      if(response.data.meta.code == "200"){
        $localstorage.set(AUTH_EVENTS.CURRFASHNAME, username);
      }

      return response.data.meta;
    }, function errorCallback(response) {
      console.log(JSON.stringify(response));
      return "ERR";
    });
  };

  var uploadImageProfile = function(data){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/upload/image/profile");
    var options = {
        fileKey: "file",
        fileName: "temp.jpg",
        chunkedMode: false,
        mimeType: "image/jpg"
    };
    return $cordovaFileTransfer.upload(apiUrl, data, options).then(function(result) {
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

  var uploadImageProfileIOS = function(data){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/upload/image/profile");

    var byteString = atob(data.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: 'image/png' });

    var fd = new FormData();
    fd.append('file', blob);

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

  var updatePhone = function(mobile) {
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/prizes/updatemobile");

    var datas = {"mobile":mobile};

    return $http({
      method: 'PUT',
      url: apiUrl,
      data: datas,
      headers:{
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      //set to localstorage:
      if(response.data.meta.code == "200"){
        //update localstorage PHONE

        return true;
      }

      return false;
    }, function errorCallback(response) {
      console.log(JSON.stringify(response));
      return false;
    });
  };

  var searchUsers = function(term){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/users/search");

    return $http({
      method: 'GET',
      url: apiUrl,
      params: {"term":term},
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

  var myNotifcationSetting = function(term){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/device/mysetting");

    return $http({
      method: 'GET',
      url: apiUrl,
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      console.log(JSON.stringify(response.data));
      if(response.data.meta.code == "200"){
        return response.data.data;
      }else{
        return null;
      }
    }, function errorCallback(response){
      return null;
    });
  };

  var updateNotificationSetting = function(name, value) {
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/device/notifsetting");

    var datas = {"isactive":value, "name":name};

    return $http({
      method: 'PUT',
      url: apiUrl,
      data: datas,
      headers:{
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      //set to localstorage:
      if(response.data.meta.code == "200"){
        return true;
      }

      return false;
    }, function errorCallback(response) {
      console.log(JSON.stringify(response));
      return false;
    });
  };

  var registerToken = function(token){
    var apiUrl = "";
    if(ionic.Platform.isIOS()){
      apiUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/users/device/register/ios");
    }else{
      apiUrl = $helper.setClientKeyToUrl(API_INFO.BASEURL + "/users/device/register");
    }

    return $http({
      method: 'POST',
      url: apiUrl,
      data: {"token": token},
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response){
      if(response.data.meta.code == "200"){
        return true;
      }else{
        return false;
      }
    }, function errorCallback(response){
      return false;
    });
  };

  var claimToken = function(deviceid){
    var token = $localstorage.get(AUTH_EVENTS.CURRTOKEN);
    var apiUrl = "";
    if(ionic.Platform.isIOS()){
      apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/users/device/register/ios");
    }else{
      apiUrl = $helper.setTokenToUrl(token, API_INFO.BASEURL + "/users/device/register");
    }

    return $http({
      method: 'POST',
      url: apiUrl,
      data: {"token": deviceid},
      headers: {
       'Content-Type': "application/json"
      },
    }).then(function successCallback(response) {
      console.log("register response " + JSON.stringify(response));
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
    loginEmail: doLoginEmail,
    loginFB: doLoginFacebook,
    loginTwitter: doLoginTwitter,
    signupEmail: doSignUpEmail,
    loadProfileData: getMyProfileData,
    doEditProfile: editProfile,
    doUploadImageProfile: uploadImageProfile,
    doUploadImageProfileIOS: uploadImageProfileIOS,
    doUpdatePhone: updatePhone,
    doResetPassword: resetPassword,
    changePassword: doChangePassword,
    doSearchUsers: searchUsers,
    loadMyNotificationSetting: myNotifcationSetting,
    doUpdateNotificationSetting: updateNotificationSetting,
    doRegisterToken: registerToken,
    doClaimToken: claimToken
  };
});