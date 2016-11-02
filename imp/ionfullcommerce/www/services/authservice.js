'use strict';
(function(){
	angular.module('eCommerce')
	.service('Auth', ['$q','$http','APP_API_URL',function ($q,$http,APP_API_URL) {
		console.log();

		var authAPI ={
			get:function(){
				return $http.get(APP_API_URL + 'users');
			},
			login:function(user){
				return $http.post(APP_API_URL + 'user/login',user);
			},
			add:function(userObj){
				return $http.post(APP_API_URL + 'user',userObj);
			}
		};

		return authAPI;
	}])
	.service('AuthSession', ['$q',function ($q) {
		var sessionSrv ={

			setUserId:function(userId){
				localStorage.setItem('loggedInUserId',userId);
			},
			getLoggedInUserId:function(){
				return localStorage.getItem('loggedInUserId');
			},
			isLoggedIn:function(){
				return this.getLoggedInUserId() !='undefined';
			}

		};

		return sessionSrv;
	}])
	


})()