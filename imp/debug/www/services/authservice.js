angular.module('photoshare')
.service('authService', ['$http','$q','API_URL', function ($http,$q,API_URL) {

	return{
		addUser:function(userObj){			
			return $http.post(API_URL + 'user',userObj);
		},
		login:function(userObj){
			return $http.post(API_URL + 'user/login',userObj);
		},

		fblogin:function(userObj){
			return $http.post(API_URL + 'user/fblogin',userObj);
		},
		getLoggedInUser:function(id){
			return $http.get(API_URL + 'user/' + id);
		}
	}
	
}])
.service('sessionService', ['USER_ID','localStorageService','USER_OBJ','FB_USER',
	function (USER_ID,localStorageService,USER_OBJ,FB_USER){

		return{
			setUserId:function(userId){
				localStorageService.set(USER_ID,userId);
			},
			getUserId:function(){
				return localStorageService.get(USER_ID);
			},
			setUser:function(user){
				localStorageService.set(USER_OBJ,undefined);
				localStorageService.set(USER_OBJ,JSON.stringify(user));
			},
			getUser:function(){
				return JSON.parse(localStorageService.get(USER_OBJ));
			},
			setFacebookUser:function(user){
				localStorageService.set(FB_USER,JSON.stringify(user));
			},
			getFacebookUser:function(){
				return JSON.parse(localStorageService.get(FB_USER));
			},
			isLoggedIn:function(){
				return JSON.parse(localStorageService.get(USER_OBJ)) !=undefined;
			},
			logOut:function(){
				localStorageService.set(USER_OBJ,undefined);
			}
		}

	}])
.service('profileService', ['$http','API_URL',function ($http,API_URL) {

	var profileAPI ={
		getProfile:function(id){
			return $http.get(API_URL + 'posts/' + id + '/user');
		},
		followUser:function(followingId){
			return $http.post(API_URL + 'user/follow',followingId);
		},
		getTwoRecentUserPost:function(id){
			return $http.get(API_URL + 'post/recent/two/user/' + id );
		},
		updateProfile:function(id,profile){
			return $http.put(API_URL + 'user/update/' + id,profile);
		},
		updateAvatar:function(id, avatar){
			return $http.put(API_URL + 'user/avatar/' + id,avatar);
		}

	}

	return profileAPI;
	
}])