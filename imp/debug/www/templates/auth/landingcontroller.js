angular.module('photoshare')
.controller('landingCtrl', ['$scope','$state','$ionicModal','authService',
	'$ionicPopup','sessionService','utilService','$ionicLoading','$q','$ionicHistory','ConnectivityMonitor',
	function ($scope,$state,$ionicModal,authService,$ionicPopup,
		sessionService,utilService,$ionicLoading,$q,$ionicHistory,ConnectivityMonitor) {
		$scope.IsLogin;
		
		$ionicModal.fromTemplateUrl('templates/auth/authmodal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.authModal = modal;
		});

		$scope.closeAuthModal = function() {
			$scope.authModal.hide();
			//$scope.authModal.remove();
		};

		$scope.openAuthModal = function() {

			$scope.authModal.show();
		};

		$scope.gotoSignUp=function(){
			$scope.IsLogin = false;
			$scope.openAuthModal();
		};

		$scope.gotoSignIn =function(){
			$scope.IsLogin = true;
			$scope.openAuthModal();
		};

		$scope.$on('$destroy', function() {
			//$scope.authModal.remove();
		});

		$scope.signIn=function(data){
			if(ConnectivityMonitor.isOffline()){
				$ionicPopup.confirm({
					title: "Internet Info",
					content: "No internet connection detected on your device."
				})
				.then(function(result) {
					if(!result) {
						ionic.Platform.exitApp();
					}
				});
			}
			else
			{
				$ionicLoading.show({
					template:'<ion-spinner class="light"></ion-spinner><p>Signing in..</p>'
				});

				authService.login(data).then(function(res){
					if(res.data.error==false){
						$ionicLoading.hide();
						$scope.closeAuthModal();
						sessionService.setUser(res.data.user);
					//console.log('res.data.user',res.data.user);
					$state.go('app.posts');
				}else{
					$ionicLoading.hide();

					$ionicPopup.alert({
						title: "Registration Error",
						template: res.data.message
					})	
				}
				
				
			},function(err){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: "Registration Error",
					template: "Wrong email or password"
				})
			});
			}
		}

		$scope.signUp=function(data){

			if(ConnectivityMonitor.isOffline()){
				$ionicPopup.confirm({
					title: "Internet Info",
					content: "No internet connection detected on your device."
				})
				.then(function(result) {
					if(!result) {
						ionic.Platform.exitApp();
					}
				});
			}else{


				$ionicLoading.show({
					template:'<ion-spinner class="light"></ion-spinner><p>Signing up..</p>'
				});
				data = {
					profileId:utilService.createGuid(),
					email:data.email,
					password:data.password,			
					username:data.username
				}

				authService.addUser(data).then(function(res){

					if(res.data.error==true){
						$ionicLoading.hide();
						$ionicPopup.alert({
							title: "Registration Error",
							template: res.data.message
						})					
					}else{
						$ionicLoading.hide();
						$scope.closeAuthModal();
						sessionService.setUser(res.data.result);
						$state.go('app.posts');
					}
				},function(err){
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: "Registration Error",
						template: err.statusText
					})
				});

			}

		};


		

		var fbUserSuccess = function(auth_response){

			var authResponse = auth_response;
			getFacebookProfileInfo(authResponse).then(function(profileInfo){
				sessionService.setFacebookUser({
					authResponse:authResponse,
					profileId: profileInfo.id,
					fullname: profileInfo.first_name + ' ' + profileInfo.last_name,
					email: profileInfo.email,
					gender:profileInfo.gender,
					avatar : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
				});

				
				FBLogin();


			},function(fail){

				console.log('profile info fail', fail);
			});

		}; //End fbUserSuccess

		var fbLoginSuccess = function(response)
		{
			if(!response.authResponse){
				fbLoginError("Cannot find the authResponse");
				return;
			}

			var authResponse = response.authResponse;
			fbUserSuccess(authResponse);
		};

		var fbLoginError = function(error){
			console.log('fbLoginError', error);
			$ionicLoading.hide();
		};

		var getFacebookProfileInfo = function(authResponse){
			var info = $q.defer();
			facebookConnectPlugin.api('/me?fields=id,name,email,first_name,last_name,gender&access_token=' + authResponse.accessToken, null,
				function (response) {

					info.resolve(response);
				},
				function (response) {

					info.reject(response);
				});
			return info.promise;
		};



		$scope.signInFacebook = function(){
			if(ConnectivityMonitor.isOffline()){
				$ionicPopup.confirm({
					title: "Internet Info",
					content: "No internet connection detected on your device."
				})
				.then(function(result) {
					if(!result) {
						ionic.Platform.exitApp();
					}
				});
			}else{
				facebookConnectPlugin.getLoginStatus(function(success)
				{
					if(success.status === 'connected')
					{
						var user = sessionService.getFacebookUser();
						if(!user.fbid)
						{
							fbUserSuccess(success.authResponse);
						}
						else
						{
							
							FBLogin();
							
						}

					} 
					else
					{
						$ionicLoading.show({
							template: 'Logging in...'
						});
						facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);

					}

				});	
			}
			
		};


		function FBLogin(){
			var fbUser = sessionService.getFacebookUser();

			var newUser = {
				profileId:fbUser.profileId,
				email:fbUser.email,
				password:'password',			
				username:fbUser.email,
				fullname:fbUser.fullname,
				gender:fbUser.gender,
				avatar:fbUser.avatar
			};

			//alert(JSON.stringify(fbUser));

			authService.fblogin(newUser).then(function(res){
				if(res.data.error==true){
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: "Registration Error",
						template: res.data.message
					})					
				}else{
					$ionicLoading.hide();
					$scope.closeAuthModal();
					sessionService.setUser(res.data.result);
					$state.go('app.feeds');
				}
			})
		}



	}])

.controller('appCtrl', ['$scope','authService','sessionService','$ionicPopup','ConnectivityMonitor',
	function ($scope,authService,sessionService,$ionicPopup,ConnectivityMonitor) {
		$scope.currUser ={};

		$scope.$on('$ionicView.loaded', function(event, view) {			
			if(ConnectivityMonitor.isOffline()){
				$ionicPopup.confirm({
					title: "Internet Info",
					content: "No internet connection detected on your device."
				})
				.then(function(result) {
					if(!result) {
						ionic.Platform.exitApp();
					}
				});
			}

		});

		$scope.$on('$ionicView.beforeEnter', function(event, view){

			//sessionService.logOut();
			var userId = sessionService.getUser()._id;
			//console.log('userId',userId);
			authService.getLoggedInUser(userId).then(function(data){
				$scope.currUser = data.data.result;

			},function(err){
				$ionicPopup.alert({
					title: "Error",
					template:err.statusText
				});
			})
		});

		
		
	}])
