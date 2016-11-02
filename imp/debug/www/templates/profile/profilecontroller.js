angular.module('photoshare')

.controller('profileCtrl', ['$scope','$ionicLoading','$state','$ionicPopup',
	'$ionicActionSheet','$cordovaCamera','$cordovaFile',
	'$stateParams','sessionService','profileService','$cordovaFileTransfer',
	'ConnectivityMonitor','authService','profileService','$ionicPopup',
	function ($scope,$ionicLoading,$state,$ionicPopup,$ionicActionSheet,
		$cordovaCamera,$cordovaFile,$stateParams,sessionService,
		profileService,$cordovaFileTransfer,ConnectivityMonitor,authService,profileService,$ionicPopup) {
		
		$scope.thereIsImage=false;
		$scope.imageUrl;
		$scope.allDataLoaded = 999;
		var postPopup ={};
		$scope.currUser ={};
		$scope.isSelfProfile;
		var userId = $stateParams.id;
		// console.log('userId',userId);
		$scope.recentPosts =[];
		
		
		$scope.$on('$ionicView.loaded', function(event, view) {			
			
			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner><p>Loading..</p>'
			});	


		});

		$scope.$on('$ionicView.afterEnter', function(event, view){
			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
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
				loadProfileData();
			}
			
		});
		
		function loadProfileData(){

			authService.getLoggedInUser(userId).then(function(data){
				$scope.currUser = data.data.result;
				//console.log('$scope.currUser',data);
				profileService.getTwoRecentUserPost(userId).then(function(datas){
					$scope.recentPosts =datas.data.results;
					//console.log('$scope.recentPosts',$scope.recentPosts);
					$scope.allDataLoaded = 1;
					$scope.isSelfProfile = sessionService.getUser()._id===userId
					$ionicLoading.hide();
				},function(){
					$ionicLoading.hide();
				})

				//console.log('$scope.isSelfProfile ',$scope.isSelfProfile );
				
			},function(err){
				$ionicLoading.hide();
				//alert(err);
				$ionicPopup.alert({
					title: "Error",
					content: "An unknown error has occured"
				})
			})	

			
		}

		$scope.addNewPost =function(){
			$state.go('app.newfeeds');
		}

		$scope.logOut =function(){
			sessionService.logOut();
			$state.go('welcome');
		}

		$scope.follow =function(id){
			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner><p>Wait..</p>'
			});	
			var follower_id =sessionService.getUser()._id;
			var following_id = id;

			var newRecord = {
				follower_id:follower_id,
				following_id:following_id
			};

			profileService.followUser(newRecord).then(function(res){
				if(res.data.error==false){
					$ionicLoading.hide();
					$ionicLoading.show({ template: res.data.message, noBackdrop: true, duration: 1000 })
				}else{
					$ionicLoading.hide();
					$ionicLoading.show({ template: res.data.message, noBackdrop: true, duration: 1000 })
				}
				
			},function(err){
				$ionicLoading.hide();
				$ionicLoading.show({ template: err.statusText, noBackdrop: true, duration: 1000 })
			})
		}


		//Profile Avatar

		$scope.changeAvatar=function(){

			var options = {
				quality: 75,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 150,
				targetHeight: 150,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false
			};

			$cordovaCamera.getPicture(options).then(function (avatarUrl) {

				onImageSuccess(avatarUrl);

				function onImageSuccess(fileURI) {
					createFileEntry(fileURI);
				}

				function createFileEntry(fileURI) {
					window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
				}


				function copyFile(fileEntry) {
					
					var name = fileEntry.fullPath.split('/').pop();
					var newName = makeid() + name;

					window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
						fileEntry.copyTo(
							fileSystem2,
							newName,
							onCopySuccess,
							fail
							);
					},
					fail);
				}

				function onCopySuccess(entry) {
					$scope.$apply(function () {
						$scope.thereIsImage=true;		
						$scope.avatarUrl = entry.nativeURL;
						uploadAvatar($scope.avatarUrl);						
					});
				}

				function fail(error) {
					console.log("fail: " + error.code);
				}

				function makeid() {
					var text = "";
					var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

					for (var i=0; i < 5; i++) {
						text += possible.charAt(Math.floor(Math.random() * possible.length));
					}
					return text;
				}

			}, function (err) {
				alert('An error occurred. Try again');
			});	
		}



		function uploadAvatar(avatarUrlPath){
			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner><p>Please wait..</p>'
			});

			var url = "https://ionphotoshare.herokuapp.com/api/v1/upload";

			var targetPath = avatarUrlPath;

			var avatarfilename = targetPath.split("/").pop();

			var options = {
				fileKey: "file",
				fileName: avatarfilename,
				chunkedMode: false,
				mimeType: "image/jpg"
			};

			$cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {

				var id=sessionService.getUser()._id;

				var avatarFile = {
					avatar:avatarfilename,
				};

				profileService.updateAvatar(id,avatarFile).then(function(res){

					if(res.data.error==false){	
						//var avatarImg = document.getElementById('profile-avatar');	
						//avatarImg.src = targetPath;
						$scope.currUser.avatar = targetPath;		
						$ionicLoading.hide();
					}else{
						$ionicLoading.hide();
						$ionicPopup.alert({
							title: "Error",
							template:"Unable to update avatar"
						});
					}
				},function (err){
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: "Error",
						template:"Unable to update avatar"
					});
				});

			}, function (err) {
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: "Error",
					template:"Unable to upload avatar"
				});	

			});
		}

		
		
	}])

.controller('profileEditCtrl', ['$scope','$ionicLoading','$stateParams',
	'authService','ConnectivityMonitor','profileService',
	function ($scope,$ionicLoading,$stateParams,authService,
		ConnectivityMonitor,profileService) {

		$scope.userId = $stateParams.id;
		$scope.data = {};

		//


		$scope.$on('$ionicView.loaded', function(event, view) {			
			
			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner><p>Loading..</p>'
			});	


		});



		$scope.$on('$ionicView.afterEnter', function(event, view){
			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
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
				loadProfileData();
			}
			
		});

		function loadProfileData(){
			authService.getLoggedInUser($scope.userId).then(function(res){
				var user_data=res.data.result;
				//console.log('user_data',user_data);
				$scope.data.fullname=user_data.fullname;
				$scope.data.username=user_data.username;
				$scope.data.email=user_data.email;
				$scope.data.fbUrl=user_data.facebook;
				$scope.data.twitterUrl=user_data.twitter;
				$scope.data.choice=user_data.gender;

				$ionicLoading.hide();
			},function(err){
				$ionicLoading.hide();
			});
		}

		$scope.updateProfile =function(){

			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner><p>Updating profile..</p>'
			});	
			var editedProfile = {
				fullname:$scope.data.fullname,
				username:$scope.data.username,
				gender:$scope.data.choice,
				email:$scope.data.email,
				facebook:$scope.data.fbUrl,
				twitter:$scope.data.twitterUrl
			}
			
			profileService.updateProfile($scope.userId,editedProfile)
			.then(function(res){
				if(res.data.error==false){
					$ionicLoading.hide();
					$ionicLoading.show({ template: "Profile has been updated successfully", noBackdrop: true, duration: 2000 })
				}else{
					$ionicLoading.hide();
					$ionicLoading.show({ template: res.data.message, noBackdrop: true, duration: 2000 })
				}
			},function(err){
				$ionicLoading.hide();
				$ionicLoading.show({ template: "Error updating profile", noBackdrop: true, duration: 2000 })
			});

		}

		
		
		
		
	}])