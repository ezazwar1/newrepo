(function() {
	'use strict';

	angular.module('welzen').factory('userService', userService);

	function userService($q, $http, WelzenAPI, $state){

		var KEY_USER = "user";
		var userStored = null;

		var userModel = {
			create: create,
			update: update,
			login: login,
			logout: logout,
			isLogged: isLogged,
			isPaid: isPaid,
			upgradeMembrecy: upgradeMembrecy,
			getCurrentUser: getCurrentUser,
			init: init,
			sendForgotMail: sendForgotMail
		};
		
		var self = userModel;
		return userModel;

		function getCurrentUser(){
			return userStored;
		}

		function sendForgotMail(user){
			var deferred = $q.defer();		
			user.userMail = user.email;
			

			var req = {
				method: "PUT",
				url: WelzenAPI.URL_NEW_TOKEN,
				//url: 'http://requestb.in/1ki8brn1',
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				},
				data: user
			};

			$http(req)
				.then(function(res){
					if (res.status === 201){
						console.log('token generated and mail was sent');
						deferred.resolve(res);
					}else{
						console.log('token generated and mail had a problem');
						deferred.reject(res);
					}	
				}, function(res){
					deferred.reject(res);
				});
		
			return deferred.promise;	
		}

		function init(){
			localforage.getItem(KEY_USER).then(function(previousLoginInfo) {
				if( previousLoginInfo) {
					userStored = previousLoginInfo;
					//no se si esto esta muy bien
					$state.go('main');
					checkSubscription();
				}
			});
		}

		function create(user){
			var deferred = $q.defer();		

			var req = {
				method: "POST",
				url: WelzenAPI.URL_USER_CREATE,
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				},
				data: user
			};

			$http(req)
				.then(function(res){
					if (res.status === 200 || res.status === 201){
						localforage.setItem(KEY_USER,res.data).then(function(value) {
						console.log('user saved');
						userStored = value;
						}, function(error) {
							console.error('user saved error: ' + JSON.stringify(error));
						});
						deferred.resolve(res);
					}else{
						deferred.reject(res);
					}	
				}, function(res){
					deferred.reject(res);
				});
		
			return deferred.promise;	
		}

		function login(user){
			var deferred = $q.defer();		

			var req = {
				method: "GET",
				url: WelzenAPI.URL_USER.replace('XXX', user.email).replace('YYY', user.password),
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				}
			};

			$http(req)
				.then(function(res){
					if (res.status === 200){
						localforage.setItem(KEY_USER,res.data).then(function(value) {
							console.log('user saved');
							userStored = value;
						}, function(error) {
							console.error('user saved error: ' + JSON.stringify(error));
						});
						deferred.resolve(res);
					}else{
						deferred.reject(res);
					}
					
				}, function(res){
					deferred.reject(res);
				});
		
			return deferred.promise;			
		}

		function logout(){
			localforage.removeItem(KEY_USER, function(err) {
				console.log('the user is logout');
				userStored = null;
			});			
		}

		function isLogged(){
			return (userStored!==null);
		}

		function isPaid () {
			if (userStored === null){
				return false;
			}
			return userStored.paid === undefined ? false : userStored.paid;
		}

		function update(user){
			localforage.setItem(KEY_USER,user).then(function(value) {
				console.log('user update');
				userStored = value;
			}, function(error) {
				console.error('user update error: ' + JSON.stringify(error));
			});
		}

		function upgradeMembrecy(alias){
			if (userStored === null){
				return;
			}
			var paidDate = new Date();
			userStored.paid = true;
			userStored.paidDate = paidDate;
			update(userStored);
			
			var data = {
				paid:true,
				paidDate:paidDate,
				suscriptionType:alias
			}
			var req = {
				method: "PUT",
				url: WelzenAPI.URL_USER_UPDATE.replace('id', userStored._id),
				data : data,
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				}
			};

			$http(req)
				.then(function(res){
					console.log("user paid success " + JSON.stringify(res));				
				}, function(res){
					console.log("user paid fail: " + JSON.stringify(res));
				});
		}

		function checkSubscription(){
			console.log("Check subscription ... ");
			if (userStored === null || !userStored.paid){
				console.log("subscription user is null or not paid")
				return;
			}
			//habria que chequear que sea subscripción renovable
			console.log("Check subscription Request ... ");

			var req = {
				method: "GET",
				url: WelzenAPI.URL_USER_GET.replace('id', userStored._id),
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				}
			};

			$http(req)
				.then(function(res){
					console.log("volvio el chequeo de subscription");
					if (res.status === 200){
						if (res.data.paid){
							return;
						}
						console.log("cambio el estado de pago de subscription " + JSON.stringify(res.data));
						update(res.data);
					}
				}, function(res){
					console.log("user paid fail: " + JSON.stringify(res));
				});
		}
	}

}());