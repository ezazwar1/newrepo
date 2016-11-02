angular.module('photoshare')

.controller('feedsCtrl', ['$scope','$ionicLoading','postService','$ionicBackdrop', '$ionicModal', '$ionicSlideBoxDelegate', 
	'$ionicScrollDelegate','$state','$ionicPopup','sessionService','ConnectivityMonitor',
	function ($scope,$ionicLoading,postService,$ionicBackdrop, $ionicModal, 
		$ionicSlideBoxDelegate, $ionicScrollDelegate,$state,$ionicPopup,
		sessionService,ConnectivityMonitor) {
		$scope.posts = [];
		$scope.isLoaded = 99;
		$scope.zoomMin = 1;
		$scope.imageToZoom;
		$scope.comments= [];
		$scope.hasComment=99;
		$scope.chat={};

		$scope.theCirlce =JSON.parse(window.localStorage.getItem('currCircle'));
		//console.log("$scope.theCirlce",$scope.theCirlce);
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
				loadPhotos();
			}
			
		});

		function loadPhotos(){
			
			postService.getPostByCircleId($scope.theCirlce.id).then(function(res){
				$scope.posts =res.data.results;
				$ionicLoading.hide();
				
				if($scope.posts.length>0){
					$scope.isLoaded =1;
				}else{
					$scope.isLoaded =0;
				}				
				
			},function(err){
				$ionicLoading.hide();
				$scope.isLoaded =0;
			})

			
		}//End LoadPhotos

		$scope.zoomImage = function(image){
			$scope.imageToZoom =image;
			
			$scope.showModal('templates/modals/imge-zoom-modal.html');
			setTimeout(function(){
				$ionicScrollDelegate.$getByHandle('setInitialZoom').zoomBy($scope.zoomMin);
			},1000);
		};


		$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.modal.remove()
		};


		

		$scope.addNewPost =function(){
			$state.go('app.newfeeds');
		}

		function getcomments(post_id){
			postService.getCommentByPostId(post_id).then(function(res){
				$scope.comments=res.data.results;
				//console.log('Comment',res);
				if(res.data.results.length>0){
					$scope.hasComment=1;
					$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
				}else{
					$scope.hasComment=0;
				}				
				$ionicLoading.hide();
			},function(err){
				$scope.hasComment=0;
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: "Error",
					template: "Unable to get comment please try again." + JSON.stringify(err)
				})
			});
		}

		$ionicModal.fromTemplateUrl('templates/modals/comment-modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.commentModal = modal;
		});

		$scope.showCommentModal=function(id){
			getcomments(id);
			$scope.commentModal.show();

			// $ionicLoading.show({
			// 	template:'<ion-spinner class="light"></ion-spinner><p>Please wait..</p>'
			// });				//
			$scope.chat.postId=id;
		}

		$scope.closeCommentModal=function(){
			$scope.commentModal.hide();
		}

		$scope.sendComment=function(chat){
			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner><p>Loading..</p>'
			});	
			var postId=$scope.chat.postId
			var message ={
				post_id:postId,
				user_id:sessionService.getUser()._id,
				comment:chat.data
			};

			postService.postComment(message).then(function(res){
				if($scope.comments.length==0){
					$scope.hasComment=1;
				}
				$scope.comments.push(res.data.results[0]);
				$ionicLoading.hide();
				chat.data = '';
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
			},function(err){
				console.log('error=',error);
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: "Error",
					template: "Unable to post comment please try again."
				})
			});
		}

		$scope.likePost=function(id){
			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner><p>Loading..</p>'
			});	

			postService.likePost(id).then(function(res){
				if(res.data.error==false){
					$ionicLoading.hide();
					$ionicLoading.show({ template: "You liked this photo", noBackdrop: true, duration: 2000 })
				}else{
					$ionicLoading.hide();
				}
				
			},function(){
				$ionicLoading.hide();
			})
		}
		
		
	}])
.controller('newFeedsCtrl', ['$scope','$ionicPopup','$ionicActionSheet',
	'$cordovaCamera','$cordovaFile','$ionicLoading','$cordovaFileTransfer',
	'postService','$state','sessionService','$ionicModal','ConnectivityMonitor',
	function ($scope,$ionicPopup,$ionicActionSheet,$cordovaCamera,$cordovaFile,
		$ionicLoading,$cordovaFileTransfer,postService,$state,sessionService,
		$ionicModal,ConnectivityMonitor) {
		$scope.thereIsImage=false;
		$scope.theCirlce;
		$scope.isPageLoaded =false;
		$scope.imageUrl;

		$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}

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
				loadCircles();
			}
			
		});


		function loadCircles(){
			postService.getCircles().then(function(data){
				$scope.cirlces =data.data.results;
				$scope.showModal('templates/modals/circles-modal.html');
				$ionicLoading.hide();
				$scope.isPageLoaded =true;
			},function(err){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: "Error",
					template:"ERROR: " + err.statusText
				});
			});
		}

		$scope.chooseCircle = function(circle){
			$scope.theCirlce = JSON.parse(circle);			
			$scope.modal.hide();
		}

		

		$scope.choosePhoto= function(){

			var editProfile = $ionicActionSheet.show({
				titleText: '<font color="black">Choose Picture Source</font>',
				buttons: [
				{
					text: '<button class="button button-positive"><i class="icon ion-camera">                               </i>Camera</button>',
					type: 'button'
				},
				{
					text: '<i class="icon ion-images"></i>Photo Gallery',
					type: 'button button-positive'
				}
				],
				cancelText: 'Cancel',
				buttonClicked: function (index) {
					if (index === 0) {
						var options = {
							quality: 75,
							destinationType: Camera.DestinationType.FILE_URI,
							sourceType: Camera.PictureSourceType.CAMERA,
							allowEdit: true,
							encodingType: Camera.EncodingType.JPEG,
							targetWidth: 500,
							targetHeight: 500,
							popoverOptions: CameraPopoverOptions,
							saveToPhotoAlbum: false
						} 


					}  if (index === 1) {

						var options = {
							quality: 75,
							destinationType: Camera.DestinationType.FILE_URI,
							sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
							allowEdit: true,
							encodingType: Camera.EncodingType.JPEG,
							targetWidth: 500,
							targetHeight: 500,
							popoverOptions: CameraPopoverOptions,
							saveToPhotoAlbum: false
						};

					}
					$cordovaCamera.getPicture(options).then(function (imageUrl) {

						
						onImageSuccess(imageUrl);

						function onImageSuccess(fileURI) {
							createFileEntry(fileURI);
						}

						function createFileEntry(fileURI) {
							window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
						}


						function copyFile(fileEntry) {
							// var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
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
								//Upload to amazon						
								$scope.imageUrl = entry.nativeURL;								
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

					});
					return true;
				}
			});

		}
		


		$scope.postPhoto =function(data){
			
			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner><p>Please wait..</p>'
			});	
			var url = "https://ionphotoshare.herokuapp.com/api/v1/upload";

			var targetPath = $scope.imageUrl;

			var filename = targetPath.split("/").pop();
			var options = {
				fileKey: "file",
				fileName: filename,
				chunkedMode: false,
				mimeType: "image/jpg"
			};

			$cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
				var post = {
					id:sessionService.getUser()._id,
					description:data.desc,
					image_url:filename,
					circle_id:$scope.theCirlce._id
				};
				
				postService.savePost(post).then(function(res){
					if(res.data.error==false){					
						$scope.imageUrl=''
						$scope.thereIsImage=false;
						$ionicLoading.hide();
						$state.go('app.posts');
					}else{
						$ionicLoading.hide();
						$ionicPopup.alert({
							title: "Registration Error",
							template:"ERROR: " + res.data.message
						});
					}
				});

			}, function (err) {
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: "Registration Error",
					template:"ERROR: " + err
				});	
				
			}, function (progress) {

			});			
			
		}

		
		
	}])

.controller('allPostsCtrl', ['$scope','$ionicLoading','postService',
	'ConnectivityMonitor','$ionicScrollDelegate','$ionicBackdrop','$ionicPopup','$ionicSlideBoxDelegate',
	'$ionicModal','sessionService',
	function ($scope,$ionicLoading,postService,ConnectivityMonitor,
		$ionicScrollDelegate,$ionicBackdrop,$ionicPopup,$ionicSlideBoxDelegate,
		$ionicModal,sessionService) {

		$scope.isLoaded = 99;
		$scope.zoomMin = 1;
		$scope.imageToZoom;
		$scope.comments= [];
		$scope.hasComment=99;
		$scope.posts =[];
		$scope.chat={};
		//$scope.post.likes;

		loadPhotos();

		$scope.$on('$ionicView.loaded', function(event, view) {			


			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner><p>Loading..</p>'
			});	
			//}		
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
				loadPhotos();
			}

		});

		function loadPhotos(){
			
			postService.getAllPosts().then(function(res){
				$scope.posts =res.data.results;
				$ionicLoading.hide();
				if($scope.posts.length>0){
					$scope.isLoaded =1;
				}else{
					$scope.isLoaded =0;
				}
				
				
			},function(err){
				$ionicLoading.hide();
				$scope.isLoaded =0;
			})

			
		}//End LoadPhotos

		$scope.zoomImage = function(image){
			$scope.imageToZoom =image;
			//console.log('$scope.imageToZoom',$scope.imageToZoom);
			$scope.showModal('templates/modals/imge-zoom-modal.html');
			setTimeout(function(){
				$ionicScrollDelegate.$getByHandle('setInitialZoom').zoomBy($scope.zoomMin);
			},1000);
			
		};


		$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.modal.remove()
		};


		function getcomments(post_id){
			postService.getCommentByPostId(post_id).then(function(res){
				$scope.comments=res.data.results;
				if(res.data.results.length>0){
					$scope.hasComment=1;
					$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
				}else{
					$scope.hasComment=0;
				}				
				$ionicLoading.hide();
			},function(err){
				$scope.hasComment=0;
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: "Error",
					template: "Unable to get comment please try again." + JSON.stringify(err)
				})
			});
		}

		$ionicModal.fromTemplateUrl('templates/modals/comment-modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.commentModal = modal;
		});

		$scope.showCommentModal=function(id){
			$scope.chat.postId=id;
			getcomments(id);
			$scope.commentModal.show();

						//

					}

					$scope.closeCommentModal=function(){
						$scope.commentModal.hide();
					}

					$scope.sendComment=function(chat){
						$ionicLoading.show({
							template:'<ion-spinner class="light"></ion-spinner><p>Loading..</p>'
						});	
						var postId=$scope.chat.postId
						var message ={
							post_id:postId,
							user_id:sessionService.getUser()._id,
							comment:chat.data
						};

						postService.postComment(message).then(function(res){
							chat.data = '';
							if($scope.comments.length==0){
								$scope.hasComment=1;
							}
							$scope.comments.push(res.data.results[0]);
							
							$ionicLoading.hide();
							$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
						},function(err){
							console.log('error=',error);
							$ionicLoading.hide();
							$ionicPopup.alert({
								title: "Error",
								template: "Unable to post comment please try again."
							})
						});
					}

					$scope.likePost=function(post){
						$ionicLoading.show({
							template:'<ion-spinner class="light"></ion-spinner><p>Loading..</p>'
						});	

						var currPost = JSON.parse(post);

						console.log('currPost',currPost);

						postService.likePost(currPost._id).then(function(res){
							if(res.data.error==false){
								currPost.likes +=1; 
								$ionicLoading.hide();
					//$scope.post.likes +=1;
					$ionicLoading.show({ template: "You liked this photo", noBackdrop: true, duration: 2000 })
				}else{
					$ionicLoading.hide();
				}
				
			},function(){
				$ionicLoading.hide();
			})
					}
				}])