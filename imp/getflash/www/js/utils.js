angular.module('utils', [])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    destroy:function(key){
      return $window.localStorage.removeItem(key);
    }
  }
}])

.factory('$helper', function(API_INFO, $window, $ionicLoading) {
  return {
    setClientKeyToUrl: function(url) {
      return url + "?client_id=" + API_INFO.CLIENT_ID + "&client_secret=" + API_INFO.CLIENT_SECRET;
    },
    setTokenToUrl: function(token, url) {
      return url + "?access_token=" + token;
    },
    hashedPassword: function(password) {
      return $window.btoa(password);
    },
    showLoader: function(){
      if(ionic.Platform.isIOS()){
        $ionicLoading.show({
          template: '<ion-spinner class="ios-overlay" icon="ios"></ion-spinner>'
        });
      }else{
        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner>'
        });
      }
    },
    hideLoader: function(){
      $ionicLoading.hide();
    },
    convertToBackendGender: function(gdr){
      if(gdr == "male") return "M";
      if(gdr == "female") return "F";
    },
    isValidEmailAddress: function(emailAddress) {
      var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
      return pattern.test(emailAddress);
    }, 
    isValidPassword: function(password) {
        var pattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
        return pattern.test(password);
    },
    getNormalTwitterPic: function(pic) {
        var newpic = pic.replace("_normal", "_400x400");
        return newpic;
    },
    getLifeTime: function($strdate){
      var dt = new Date($strdate);
      var now = new Date();
      var diff = Math.round((now.getTime() - dt.getTime())/1000);
      if(diff < 0){
        return 0 + "s";
      }
      
      if(diff < 60){
        return diff + "s";
      }else if(diff < 3600){
        var final = Math.round(diff/60);
        return final + "m";
      }else if(diff < 86400){
        var final = Math.round(diff/3600);
        return final + "h";
      }else if(diff < 604800){
        var final = Math.round(diff/86400);
        return final + "d";
      }else if(diff < 2419200){
        var final = Math.round(diff/604800);
        return final + "w";
      }else if(diff < 29030400){
        var final = Math.round(diff/2419200);
        return final + "mt";
      }else{
        var final = Math.round(diff/29030400);
        return final + "yr";
      }
    },
    getLifeTimeContest: function($strdate){
      var dt = new Date($strdate);
      var now = new Date();
      var diff = Math.round((dt.getTime() - now.getTime())/1000);
      if(diff < 0){
        return "<span>" + 0 + "</span> hour";
      }
      
      if(diff < 60){
        if(diff > 1) return "<span>" + diff + "</span> seconds";
        else return "<span>" + diff + " second";
      }else if(diff < 3600){
        var final = Math.round(diff/60);
        if(final > 1) return "<span>" + final + "</span> minutes";
        else return "<span>" + final + "</span> minute";
      }else if(diff < 86400){
        var final = Math.round(diff/3600);
        if(final > 1) return "<span>" + final + "</span> hours";
        else return "<span>" + final + "</span> hour";
      }else if(diff < 604800){
        var final = Math.round(diff/86400);
        if(final > 1) return "<span>" + final + "</span> days";
        else return "<span>" + final + "</span> day";
      }else if(diff < 2419200){
        var final = Math.round(diff/604800);
        if(final > 1) return "<span>" + final + "</span> weeks";
        else return "<span>" + final + "</span> week";
      }else if(diff < 29030400){
        var final = Math.round(diff/2419200);
        if(final > 1) return "<span>" + final + "</span> months";
        else return "<span>" + final + "</span> month";
      }else{
        var final = Math.round(diff/29030400);
        if(final > 1) return "<span>" + final + "</span> years";
        else return "<span>" + final + "</span> year";
      }
    }
  };
});